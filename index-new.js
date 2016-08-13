var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {main: 23};
const write = require('./writeToFile.js');
const mT = require('./MapTasks.js');
const under = require('underscore');

let run = (route) => {
  let bbox = mT.makeBox(route);
  return mT.getCount(bbox);
}

let runAgain = (bbox) => {
  let splits = mT.splitBox(bbox);
  return splits.map((box) => {
    return mT.getCount(box);
  });
}

//returns promises
let dataProm = routes.map((route) => {
  let bbox = mT.makeBox(route);
  return runAgain(bbox);
});

//runs promises in order
Promise.all(dataProm).then((data) => {
  data[0].map((data) => {
    data.then((data) => {
      console.log(data.response.total_row_count);
    });
  });
});
