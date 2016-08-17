/* imports */
const turf = require('turf');

const Factual = require('factual-api'),
      auth = require('./auth.js')
      factual = new Factual(auth.key, auth.secret);

/* functions */
const mapTasks = {
  makeBox: function(route) { //makes bbox
    let pt = {"type": "Feature", "properties": {},
              "geometry": {
                "type": "Point","coordinates": [route.lng, route.lat]}
              }
    return turf.bbox(turf.buffer(pt, 10000, 'meters'));
  },
  runInitial: function(route, userParams) {//make buffer, bbox, getcount
    let bbox = this.makeBox(route);
    return this.getCount(bbox, userParams);
  },
  isWithin: function(count) { //checks if within range
    //@TODO add null handling
    return (count <= 50 && count > 0 ? true : false);
  },
  splitBox: function(bbox) { //splits bbox to 4
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
  },
  count: 0, //gets incremented by setCount
  getCount: function(bbox, userParams) { //makes factual call. returns promise
    var xmin = (bbox[0] || bbox.xmin),
        ymin = (bbox[1] || bbox.ymin),
        xmax = (bbox[2] || bbox.xmax),
        ymax = (bbox[3] || bbox.ymax);

    return new Promise((resolve, reject) => {
      factual.get('/t/places-us', {"include_count":"true",
        filters:{"category_ids":{"$includes_any":[2]}},
        geo:{"$within":{"$rect":[[ymax , xmin],[ymin, xmax]]}}, limit:50},
          (error, response) => {
            if (error || response === null) {
              console.log(error);
            } else {
              let resp = {
                  bbox: bbox,
                  response: response,
                }
              resolve(resp);
            }
          });
    });
  },
  setCount: function(count) {
    this.count = count;
  },
  features: function(rData) {
    let features = [];
    rData.map((data) => {
      var resp = {
        "type": "Feature",
        "properties": {"response": JSON.stringify(data)},
        "geometry": {
          "type": "Point",
          "coordinates": [data.longitude, data.latitude]
        }
      };
      features.push(resp);
    });
    return features;
  },
  featureCollection: function(features) {
    return turf.featureCollection(features);
  }
}

module.exports = mapTasks;
