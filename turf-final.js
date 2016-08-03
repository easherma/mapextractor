const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');

var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];
var routeArr = [];

routes.forEach((route, index, array) => {
  var pt = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [route.lng, route.lat]
    }
  };

  var bbox = turf.bbox(turf.buffer(pt, 10000, 'meters'));

  getCount(bbox);

});

function getCount(bbox) {
  factual.get('/t/places-us', {"include_count":"true",
    filters:{"$and":[{"country":{"$eq":"US"}},
  {"category_ids":{"$includes_any":[2]}}]},
  geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
  (error, response) => {
    if (!error && response.total_row_count > 0){
      console.log("ORIGINAL "+response.total_row_count);
      parseCount(response.total_row_count, bbox);
    }
  });
}

function getNewCount(boxes) {
  boxes.forEach((box, index, array) => {
    factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[2]}}]},
    geo:{"$within":{"$rect":[[box.ymax , box.xmin],[box.ymin, box.xmax]]}}, limit:1},
    (error, response) => {
      if (!error && response.total_row_count > 0){
        // getNewCount
      }
    });
  });
}

function parseCount(count, bbox) {
  if(count > 50) {
    getNewCount(splitBbox(bbox));
  } else {
    //add to array
    console.log("Adding "+ count +" to Array");
    routeArr.push(bbox);
  }
}

function splitBbox(bbox) {
  var xmin = bbox[0],
      ymin = bbox[1],
      xmax = bbox[2],
      ymax = bbox[3];

  var halfWidth = (xmax - xmin) / 2.0,
      halfHeight = (ymax - ymin) / 2.0;
  return [
      {xmin: xmin, ymin: ymin, xmax: xmin + halfWidth, ymax: ymin + halfHeight},
      {xmin: xmin + halfWidth, ymin: ymin, xmax: xmax, ymax: ymin + halfHeight},
      {xmin: xmin, ymin: ymin + halfHeight, xmax: xmin + halfWidth, ymax: ymax},
      {xmin: xmin + halfWidth, ymin: ymin + halfHeight, xmax: xmax, ymax: ymax}
  ];
}
