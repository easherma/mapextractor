const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');

var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

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
  //Promise all
    //get original count
    //process count
      //if > 50
        //split box
        //recount
        //process count
      //else
        //add to array

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

function getNewCount(newBoxes) {
  return new Promise((resolve, reject) => {
    newBoxes.forEach((newBox, index, array) => {
      factual.get('/t/places-us', {"include_count":"true",
        filters:{"$and":[{"country":{"$eq":"US"}},
      {"category_ids":{"$includes_any":[2]}}]},
      geo:{"$within":{"$rect":[[box.ymax , box.xmin],[box.ymin, box.xmax]]}}, limit:1},
      (error, response) => {
        if (!error && response.total_row_count > 0) {
          passed.push(response.total_row_count);
          ran++;
          if (ran === boxes.length) {
            resolve(passed);
          }
        } else {
          reject(error);
        }
      });
    });
  }).then((data) => {

  });
}

let parseCount = (count, bbox) => {
  if (count > 50) {
    getNewCount(splitBbox(bbox));
  } else {

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
