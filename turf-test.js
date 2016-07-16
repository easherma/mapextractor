const turf = require('turf');
//const turf/circle = require('turf/circle');

var Factual = require('factual-api');
var factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');


var routes = [ { lat: -87.666227, lng: 41.81173 },
  { lat: -88.28119, lng: 42.03725 } ];
var features = [];
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
  features.push(buffered)

  //console.log(JSON.stringify(buffered));

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

//var circle = turf.circle(center, 2000, steps, units);

// console.log(circle);

  //prepare each route for bounding box

  var bbox = turf.bbox(buffered);

  var bboxPoly = turf.bboxPolygon(bbox);
  features.push(bboxPoly);
  //console.log(JSON.stringify(bboxPoly));



  //get counts of
  // factual.get('/t/places/facets', {"include_count":"true",
  //   filters:{"$and":[{"country":{"$eq":"US"}},
  // {"category_ids":{"$includes_any":[24,26,25,23,27]}}]},
  // geo:{"$circle":{"$center":[,],"$meters": 2000}}},
  // (error, response) => {
  //   console.log(response);
  // });
//turf returns bbox as (west, south, east, north)
// from factual rect docs Find places within a rectangular bounding box (points are [top,left],[bottom,right]):
  factual.get('/t/places-us', {"include_count":"true",
    filters:{"$and":[{"country":{"$eq":"US"}},
  {"category_ids":{"$includes_any":[24,26,25,23,27]}}]},
  geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
  (error, response) => {
    console.log(response.total_row_count);
    var results = response.data;
    points = []
    for (var i = 0; i < results.length; i++) {

    var point = turf.point([results[i]['longitude'], results[i]['latitude']]);
    points.push(point);
    //console.log(turf.feature(point))
    //pointFeatures = turf.feature(point);
    //features.push(point);
  }
console.log(JSON.stringify(turf.featureCollection(points)));


//console.log(features)

//console.log(JSON.stringify(pointFeatures))

});



  });
  var featCollect = turf.featureCollection(features);
  console.log(JSON.stringify(featCollect));
