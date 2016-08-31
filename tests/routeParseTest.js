var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

let RouteParser = require('../libs/RouteParser.js');

routes.map((route) => {
  let parsed = new RouteParser(route, 2);
  console.log(parsed);
  console.log(parsed.getFirstCount());
});
