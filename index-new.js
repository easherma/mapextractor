var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {main: 23};
const write = require('./writeToFile.js');
const mT = require('./MapTasks.js');
const _ = require('underscore');
const now = require('performance-now');

let masterList = [];
let masterCount = 0;
let start = now();

/*ALMOST*/

//splits the bbox into 4
let splitBox = (bbox) => {
  return mT.splitBox(bbox);
}

//returns promise
let getCount = (box) => {
  return mT.getCount(box);
}

//decides if it should add to the masterList or call run() again.
let decide = (data) => {
  if (mT.isWithin(data.response.total_row_count)) {
    masterList.push.apply(masterList, createFeatures(data.response.data));
    masterCount += data.response.total_row_count;
    console.log("EXPECT "+masterCount);
    if (masterList.length === 2623) { //temporary end
      write("results", mT.featureCollection(masterList));
      console.log("it took "+((now() - start)/1000)+" to run.");
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
  run(mT.makeBox(route));
});
