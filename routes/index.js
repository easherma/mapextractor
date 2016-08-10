const express = require('express');
const router = express.Router();

const got = require('got');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const writeToFile = require('../writeToFile.js');
const splitBbox = require('../splitBbox.js');
fs = require('fs');

const turf = require('turf');
var converter = require('json-2-csv');

var json2csvCallback = function (err, csv) {
    if (err) throw err;
    console.log(csv);
};



/* GET home page. */
router.get('/', (req, res, next) => {
  got('https://api.factual.com/categories?options={"lang":"en","format":"tree"}&KEY=SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu')
    .then((response)=>{
      var resp = JSON.parse(response.body);
      res.render('index', {categories: JSON.stringify(resp.response.data[0])});
    })
    .catch((error) => {
      console.log(error);
    });
});

//probably should be GET
router.post('/call', (req, res, next) => {
  var userParams = req.body.userParams;
  var routes = req.body.routepoints;

  var master = [];
  var routeCount = 0;

  //cycle through routes
  routes.map((route) => {
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

  let isExceeds = (count) => {
    if (count > 50) {
      return true;
    } else {
      return false;
    }
  }

  function flattenArray(arr) {
    return arr.reduce((a, b) => {
      return a.concat(b);
    });
  };

  JSON.flatten = function(data) {
      var result = {};
      function recurse (cur, prop) {
          if (Object(cur) !== cur) {
              result[prop] = cur;
          } else if (Array.isArray(cur)) {
               for(var i=0, l=cur.length; i<l; i++)
                   recurse(cur[i], prop + "[" + i + "]");
              if (l == 0)
                  result[prop] = [];
          } else {
              var isEmpty = true;
              for (var p in cur) {
                  isEmpty = false;
                  recurse(cur[p], prop ? prop+"{"+p : p);
              }
              if (isEmpty && prop)
                  result[prop] = {};
          }
      }
      recurse(data, "");
      return result;
  }

  function pushToFront(data) {
    console.log("returning to front");
    writeToFile("results",JSON.flatten(data));
    res.json(data);
  }

  function getCount(bbox) {
    factual.get('/t/places-us', {"include_count":"true",
      filters:{"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}},
      geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
        (error, response) => {
          if (error || response === null) {console.log(error);};

          if (isExceeds(response.total_row_count)) {
              getSplitCount(splitBbox(bbox));
          } else if (response.total_row_count > 0) {
            routeCount++;
            master.push(createFeature(flattenArray(response.data)));
            if (routeCount === routes.length) {
              pushToFront(master);
            }
          }
        });
    }

  function getSplitCount(bbox) {
    let ran = 0,
        results = [],
        over = [],
        within = [];

    new Promise((resolve, reject) => {
      bbox.map((box) => {
        factual.get('/t/places-us', {"include_count":"true",
          filters:{"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}},
          geo:{"$within":{"$rect":[[box.ymax , box.xmin],[box.ymin, box.xmax]]}}, limit:50},
        (error, response) => {
          if (error || response === null) {console.log(error);};

          if (isExceeds(response.total_row_count)) {
            over.push(box);
          } else if (response.total_row_count > 0) {
            within.push(response.data);
            // within.push(box);
          }

          ran++;
          if (ran === bbox.length) {
            results['within'] = within;
            results['over'] = over;
            resolve(results);
          }
        });
      });
    }).then((data) => {
      if (data.within.length > 0) {//if there are results that within, add to master list
          master.push(createFeature(flattenArray(data.within)));
          routeCount++;
          if (routeCount === routes.length && data.over.length === 0) {
            console.log("All Passed");
            pushToFront(master);
          }
      }

      if (data.over.length > 0) {
          routeCount--;
          data.over.map((box) => {
            getSplitCount(splitBbox(box));
          });
      }
    });
  }

  let createFeature = (rData) => {
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
      //console.log(resp);
      features.push(resp);
    });
    return features;
  }
});

module.exports = router;
