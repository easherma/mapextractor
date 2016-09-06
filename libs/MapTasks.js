/* imports */
const turf = require('turf');

const Factual = require('factual-api'),
      auth = require('../auth.js'),
      factual = new Factual(auth.key, auth.secret);
      factual.startDebug();
      factual.setRequestTimeout(1000);

const _ = require('underscore');

var myLogs = [];
(function () {
  var log = console.warn;
  console.log = function () {
    var args = Array.prototype.slice.call(arguments)
    log.apply(this, args );
    myLogs.push(args);
  };
}());

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
        filters:{"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}},
        geo:{"$within":{"$rect":[[ymax , xmin],[ymin, xmax]]}}, limit:50},
          (error, response, raw) => {
            if (error || response === null) {
              console.log(error);
              //console.log(data);
            } else {
              // console.log("Response Headers:" ,Object.keys(raw));
              var burst = JSON.parse(raw.headers["x-factual-throttle-allocation"])["burst"];
              var daily = parseFloat(JSON.parse(raw.headers["x-factual-throttle-allocation"])["daily"])/100.0;

               console.log("BURST:", parseFloat(burst)/100.0);
              // console.log("DAILY LIMIT:", daily);
              // if (daily > 0.50) {
              //   console.log("Half remaining");
              //
              // }
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
  features: function(rData, bbox) { //@TODO pass in bbox
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

    let polyFeature = this.featurePolygon(rData, bbox);

    return _.union(features, polyFeature);
  },
  featurePolygon: function(data, bbox) {
    let xmin = (bbox[0] || bbox.xmin), //e
        ymin = (bbox[1] || bbox.ymin), //s
        xmax = (bbox[2] || bbox.xmax), //w
        ymax = (bbox[3] || bbox.ymax); //n

        console.log(bbox);
    var resp = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
        [
          [
            xmin,
            ymin
          ],
          [
            xmax,
            ymin
          ],
          [
            xmax,
            ymax
          ],
          [
            xmin,
            ymax
          ],
          [
            xmin,
            ymin
          ]
        ]
      ]
      }
    };

    return resp;
  },
  featureCollection: function(features) {
    return turf.featureCollection(features);
  }
}

module.exports = mapTasks;
