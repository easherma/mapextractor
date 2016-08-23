var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {main: [2]};
const write = require('./writeToFile.js');
const mT = require('./MapTasks.js');
const _ = require('underscore');
const now = require('performance-now');

let masterList = [];
let masterCount = 0;
let countDev = [];
let start = now();

let getCount = (bbox) => {
  return mT.getCount(bbox);
}

let makeBox = (route) => {
  return mT.makeBox(route);
}

let parseRoutes = (routes) => { //makes a bbox for each route
  return routes.map((route) => {
    return getCount(makeBox(route));
  });
}

let decide = (response) => {
  
}

let run = (routes) => { //controls the flow
  parseRoutes(routes).map((promise) => {
    promise.then((data) => {

    });
  });
}

//Run the application
run(routes);
