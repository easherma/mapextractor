const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');

var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

var master = [];
var routeCount = 0;

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

      if (isExceeds(response.total_row_count)) {
        getNewCount(splitBbox(bbox));
      } else {
        master.push(bbox);
        routeCount++;
        if (routeCount === routes.length) {
          pushToFront(master);
        }
      }
    }
  });
}

function getNewCount(newBoxes) {
  let ran = 0,
      results = [];

  let over = [],
      within = [];

  return new Promise((resolve, reject) => {
    newBoxes.forEach((box, index, array) => {
      factual.get('/t/places-us', {"include_count":"true",
        filters:{"$and":[{"country":{"$eq":"US"}},
      {"category_ids":{"$includes_any":[2]}}]},
      geo:{"$within":{"$rect":[[box.ymax , box.xmin],[box.ymin, box.xmax]]}}, limit:1},
      (error, response) => {
        if (!error && response.total_row_count > 0) {
          if (isExceeds(response.total_row_count)) {
            // console.log("over");
            over.push(box);
          } else {
            // console.log("within");
            within.push(box);
          }

          ran++;
          if (ran === newBoxes.length) {
            results['within'] = within;
            results['over'] = over;
            resolve(results);
          }

        } else {
          reject(error);
        }
      });
    });
  }).then((data) => {
    if (data.within.length > 0) {//if there are results that within, add to master list
      master.push(data.within);
      routeCount++;
      if (routeCount === routes.length && data.over.length === 0) {
        console.log("All Passed");
        pushToFront(master);
      }
    }
    if (data.over.length > 0) {
      routeCount--;
      data.over.map((box) => {
        getNewCount(splitBbox(box));
      });
    }
  });
}

let isExceeds = (count) => {
  if (count > 50) {
    return true;
  } else {
    return false;
  }
}

function splitBbox(bbox) {
  var xmin = (bbox[0] || bbox.xmin),
      ymin = (bbox[1] || bbox.ymin),
      xmax = (bbox[2] || bbox.xmax),
      ymax = (bbox[3] || bbox.ymax);

  var halfWidth = (xmax - xmin) / 2.0,
      halfHeight = (ymax - ymin) / 2.0;
  return [
      {xmin: xmin, ymin: ymin, xmax: xmin + halfWidth, ymax: ymin + halfHeight},
      {xmin: xmin + halfWidth, ymin: ymin, xmax: xmax, ymax: ymin + halfHeight},
      {xmin: xmin, ymin: ymin + halfHeight, xmax: xmin + halfWidth, ymax: ymax},
      {xmin: xmin + halfWidth, ymin: ymin + halfHeight, xmax: xmax, ymax: ymax}
  ];
}

function pushToFront(bboxes) {
  console.log(bboxes);
  console.log("returning to front");
}
