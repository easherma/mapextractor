const express = require('express');
const router = express.Router();
const json2csv = require('json2csv');
const got = require('got');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const write = require('../libs/writeToFile.js');
const writeJSONtoCSV = require('../libs/writeJSONToCSV.js');
const mT = require('../libs/MapTasks.js');
const now = require('performance-now');
const _ = require('underscore');

const RateLimiter = require('limiter').RateLimiter;
let limiter = new RateLimiter(400, 'minute');


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
    indexCount = 0;
    countDev = [], //count deviations
    ran = 0;

let start = now();
//probably should be GET



router.post('/call', (req, res, next) => {
  var userParams = req.body.userParams;
  var routes = req.body.routepoints;
  console.log(routes);
  var routesLength = req.body.routepoints.length;

  let pushToFront = (completeList) => {
    properties = [];
    for (var i = 0; i < completeList.features.length; i++) {
      properties.push(completeList.features[i].properties);
      //console.log(json2csv({data : completeList.features[i].properties.response}));

      //writeJSONtoCSV("properties", completeList.features[i].properties.response);

    }
    writeJSONtoCSV("properties", properties);
    /*for (var i = 0; i < completeList.length; i++) {
      console.log(completeList);
    }*/

    console.log(typeof(completeList));
    write("results", completeList);
    console.log("returning to front");
    console.log("it took "+((now() - start)/1000)+" to run.");
    res.write(JSON.stringify(completeList), encoding='utf8');
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
    console.log("Deciding");
    //console.log("data.response " , data.response);
    if (mT.isWithin(data.response.total_row_count)) {

      addToMaster(data);

      masterCount += data.response.total_row_count;

      if ( masterCount == initialCount) { //temporary end
        console.log("Met total of "+initialCount);
        pushToFront(mT.featureCollection(masterList));
        indexCount++;
        console.log("INDEX COUNT: ", indexCount);

        console.log("ROUTE LENGTH: "+routesLength);

      }
      if ((indexCount + 1) == routesLength && masterList.length != 0){
        console.log("DONE! ", routesLength);
        //masterList.length = 0;
        //res.end();
      }

    } else if (data.response.total_row_count != 0) {

      console.log("IS TOTAL ROW NOT 0: ", data.response.total_row_count != 0);

      // mT.splitBox(data.bbox).map((box) => {

      //   limiter.removeTokens(1, function(err, remainingRequests) {

      //     if (remainingRequests <= 0) {
            // response.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
            // response.end('429 Too Many Requests - your IP is being rate limited');
      //     } else {
      //       mT.getCount(box, userParams).then((data) => {
      //         console.log("RAN "+(ran++));
      //         console.log(data.bbox);
      //         console.log("Remaining Requests: ", remainingRequests);
      //         decide(data);
      //         //console.log(data);
      //       });
      //     }
      //   });
      // });

      let promises = [];
      let prevPromise = Promise.resolve();

      mT.splitBox(data.bbox).map((box) => {


        //get the counts
        limiter.removeTokens(4, (err, remainingRequests) => {
          if (remainingRequests <= 0) {
            response.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
                  response.end('429 Too Many Requests - your IP is being rate limited');
          } else {
            console.log("RAN "+(ran++));
            prevPromise = prevPromise.then(function() {
              return mT.getCount(box, userParams);
            }
          ).catch((error, data) => {
            console.log(error);
            console.log(data);
          }).then((data) => {
            decide(data);
          }
        ).catch((error) => {
              console.log(error);
            });
          }
        });
      });

    } else if (data.response.total_row_count == 0) {
      console.log("IS TOTAL ROW NOT 0?: ", data.response.total_row_count != 0);
    }
  }

  //parse through the routes and run the described functions
  routes.map((route, index) => {
    //get first count
    mT.getCount(mT.makeBox(route), userParams).then((data) => {

      //increment count to set limit

      initialCount += data.response.total_row_count;


      countDev = [initialCount, initialCount+1, initialCount+2,
                  initialCount-1];

      console.log("TOTAL: "+countDev);
      console.log("Inital Count: "+initialCount);
      console.log("ROUTEPOINT INDEX: "+index);



      if (typeof data !== 'undefined' && data.response.total_row_count > 0) {

          decide(data);

      }

    }).catch((error) => {
      console.log(error);
    });
  });

});


module.exports = router;
