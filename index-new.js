var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {main: 23};

const split = require('./splitBbox.js');
const write = require('./writeToFile.js');
const mapTasks = require('./MapTasks.js');

routes.map((route) => {
  // mapTasks.runInitial(route, userParams).then((data) => { //returns promise
  //   console.log(data.total_row_count); //WOO! RETURNS data
  //   console.log("Is it in range? "+mapTasks.isWithin(data.total_row_count));
  // });
  let bbox = mapTasks.makeBox(route);
  mapTasks.getCount(bbox).then((data) => {
    console.log(data.total_row_count);
  });
});
