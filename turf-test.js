const turf = require('turf');
const turf-circle = require('turf-circle');

var Factual = require('factual-api');
var factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');


var routes = [ { lat: 41.81173, lng: -87.666227 },
  { lat: 42.03725, lng: -88.28119 } ];

routes.forEach((route, index, array) => {
  var pt = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [route.lat, route.lng]
    }
  };

  var buffered = turf.buffer(pt, 500, 'meters');

  var center = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [route.lat, route.lng]
    }
  };

var steps = 10;
var units = 'kilometers';

var circle = turf.circle(center, 2000, steps, units);

// console.log(circle);

  //prepare each route for bounding box

  var bbox = turf.bbox(buffered);
  console.log(bbox);

  //get counts of
  // factual.get('/t/places/facets', {"include_count":"true",
  //   filters:{"$and":[{"country":{"$eq":"US"}},
  // {"category_ids":{"$includes_any":[24,26,25,23,27]}}]},
  // geo:{"$circle":{"$center":[,],"$meters": 2000}}},
  // (error, response) => {
  //   console.log(response);
  // });

  factual.get('/t/places-us', {"include_count":"true",
    filters:{"$and":[{"country":{"$eq":"US"}},
  {"category_ids":{"$includes_any":[24,26,25,23,27]}}]},
  geo:{"$within":{"$rect":[[bbox[2] , bbox[3]],[bbox[0], bbox[1]]]}}, limit:50},
  (error, response) => {
    console.log(response.total_row_count);
  });
});
