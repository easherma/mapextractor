var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var userParams = {
  sub: false,
  main: 2
}

let RouteParser = require('../libs/RouteParser.js');

let proceed = (bbox) => {

}

routes.map((route) => {
  let parsed = new RouteParser(route, userParams); //create object
  parsed.getFirstCount().then((data) => { //returns promise
    if (parsed.decide(data.response.total_row_count)) { //decide if to return or continue
      //@TODO add to main thingy
    } else {
      proceed(parsed.split(data.bbox));
    }
  });

});
