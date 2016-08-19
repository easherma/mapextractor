const express = require('express');
const router = express.Router();

const got = require('got');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const write = require('../writeToFile.js');
const mT = require('../MapTasks.js');
const now = require('performance-now');
var _ = require('underscore');

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
    countDev = []; //count deviations

let start = now();
//probably should be GET
router.post('/call', (req, res, next) => {
  var userParams = req.body.userParams;
  var routes = req.body.routepoints;

  let pushToFront = (completeList) => {
    console.log("wrote to file");
    write("results", completeList);
    console.log("returning to front");
    console.log("it took "+((now() - start)/1000)+" to run.");
    res.json(completeList);
  }

  let splitBox = (bbox) => {
    return mT.splitBox(bbox);
  }

  //returns promise
  let getCount = (box) => {
    return mT.getCount(box, userParams);
  }

  //decides if it should add to the masterList or call run() again.
  let decide = (data) => {
    if (mT.isWithin(data.response.total_row_count)) {
      masterList.push.apply(masterList, createFeatures(data.response.data));
      masterCount += data.response.total_row_count;
      console.log("EXPECT "+masterCount);
      if (countDev.includes(masterList.length)) { //temporary end
        pushToFront(mT.featureCollection(masterList));
      }
    } else {
      run(data.bbox);
    }
  }

  //splits the box and checks the count
  let parseSplit = (split) => {
    split.map((box) => {
      getCount(box).then((data) => {
        decide(data);
      });
    });
  }

  //returns array of features
  let createFeatures = (masterList) => {
    return mT.features(masterList);
  }

  //controls the recursion
  let run = (bbox) => {
    parseSplit(splitBox(bbox));
  }

  //runs through each route point
  routes.map((route) => {
    getCount(mT.makeBox(route)).then((data) => {
      initialCount += data.response.total_row_count;

      countDev = [initialCount, initialCount+1, initialCount+2,
                  initialCount-1, initialCount-2];
    });
      run(mT.makeBox(route));
  });
});



module.exports = router;
