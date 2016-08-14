var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {main: 23};
const write = require('./writeToFile.js');
const mT = require('./MapTasks.js');
const under = require('underscore');

let masterList = [];
let masterCount = 0;

let run = (bbox) => {
  let split = mT.splitBox(bbox);
  Promise.all(split.map((box) => {
    return mT.getCount(box);
  })).then((rData) => {
    rData.map((data) => {
      if (mT.isWithin(data.response.total_row_count)) {
        console.log("WITHIN");
        masterCount+=data.response.total_row_count;
        console.log("Expect this amount: "+masterCount);
        masterList.push(data.response.data);
      } else {
        console.log("OUTSIDE");
        run(data.bbox);
      }
    });
  });
}

routes.map((route) => {
  run(mT.makeBox(route));
});
