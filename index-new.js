var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {main: 23};
const write = require('./writeToFile.js');
const mT = require('./MapTasks.js');

let run = (route) => {
  let bbox = mT.makeBox(route);
  return mT.getCount(bbox);
}

//returns promises of
let dataProm = routes.map((route) => {
  let resp = run(route);
  return resp;
});

Promise.all(dataProm).then((data) => {
  console.log(data);
});
