const express = require('express');
const router = express.Router();

const got = require('got');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const write = require('../libs/writeToFile.js');
const mT = require('../libs/MapTasks.js');
const now = require('performance-now');
const _ = require('underscore');

const RateLimiter = require('limiter').RateLimiter;
let limiter = new RateLimiter(300, 'minute');


/* GET home page. */
router.get('/', (req, res, next) => {
  got('https://api.factual.com/categories?options={"lang":"en","format":"tree"}&KEY=SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu')
    .then((response)=>{
      var resp = JSON.parse(response.body);
      res.render('index', {categories: JSON.stringify(resp.response.data[0])});
    })
    .catch((error) => {
      console.log(error);
    });
});

let masterList = [],
    masterCount = 0,
    initialCount = 0;
    countDev = [], //count deviations
    ran = 0;

let start = now();
//probably should be GET



router.post('/call', (req, res, next) => {
  var userParams = req.body.userParams;
  var routes = req.body.routepoints;

  let pushToFront = (completeList) => {
    write("results", completeList);
    console.log("returning to front");
    console.log("it took "+((now() - start)/1000)+" to run.");
    res.json(completeList);
  }

  //returns array of features
  let createFeatures = (masterList, bbox) => {
    return mT.features(masterList, bbox);
  }

  //add to master list
  let addToMaster = (data) => {
    masterList.push.apply(masterList, createFeatures(data.response.data, data.bbox));
  }

  //figure out what to do with data
  let decide = (data) => {
    console.log("Deciding")
    if (mT.isWithin(data.response.total_row_count)) {

      addToMaster(data);

      masterCount += data.response.total_row_count;

      if (countDev.includes(masterCount)) { //temporary end
        console.log("Met total of "+initialCount);
        pushToFront(mT.featureCollection(masterList));
      }

    } else { 
        
      mT.splitBox(data.bbox).map((box) => {

        limiter.removeTokens(1, function(err, remainingRequests) {

          if (remainingRequests <= 0) {
            response.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
            response.end('429 Too Many Requests - your IP is being rate limited');
          } else {
            mT.getCount(box, userParams).then((data) => {
              console.log("RAN "+(ran++));
              decide(data);
            });
          }
        });
      });
    }
  }

  //parse through the routes
  routes.map((route) => {
    //get first count
    mT.getCount(mT.makeBox(route), userParams).then((data) => {

      //increment count to set limit
      initialCount += data.response.total_row_count;

      countDev = [initialCount, initialCount+1, initialCount+2,
                  initialCount-1]; 

      console.log("TOTAL: "+countDev);

      if (typeof data !== 'undefined' && data.response.total_row_count > 0) {

          decide(data);
      }

    });
  });
});



module.exports = router;