
// 'use strict';

const express = require('express');
const router = express.Router();

const got = require('got');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const async = require('async');
const fs = require('file-system');

const turf = require('turf');

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

//bbox alt
router.post('/call', (req, res, next) => {
  // var routes = req.body.routepoints;
  var userParams = req.body.userParams;

  var routes = [
    { lat: 42.03725, lng: -88.28119 } ];

  routes.forEach((route, index, array) => {
    var ran = 0;
    var pt = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [route.lng, route.lat]
      }
    };

    factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[23]}}]},
    geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":25000}}, limit:50},
    (error, response) => {
      recParseCount(response.total_row_count, bbox);
    });

    var bbox = turf.bbox(turf.buffer(pt, 25000, 'meters'));

    function recParseCount(count, bbox) {
      console.log(bbox);
      console.log("COUNT "+count);
      if (count > 50) {
        parseGrid(splitBbox(bbox));
      } else {

        var bbox = turf.bbox(buffered);
        bboxCall(bbox, 0);
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

    function parseGrid(boxes) {
      console.log(boxes);
      res.json(boxes);
    }
  });

});

//make factual api call
// router.post('/call', (req, res, next) => {
//   const radius = 25000,
//       limit = 50,
//       offset = 10;
//   var routes = req.body.routepoints;
//   var userParams = req.body.userParams;
//
//   var incr = 1;
//
//   if (routes.length > 0) { //check if empty
//
//     var ran = 0,
//         resArr = [];
//
//     routes.forEach((route, index, array) => {
//       for (var i=0; i < 2; i++) {
//         factual.get('/t/places-us', {"include_count":"true",
//           filters:{"$and":[{"country":{"$eq":"US"}},
//         {"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}}]},
//         geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":radius}}, offset: 50*i, limit:limit},
//         (error, response) => {
//           if (!error){
//             ran++;
//             resArr.push(response.data);
//             if (ran === array.length) {
//               var flatRes = flattenArray(resArr);
//               writeToFile('results', flatRes);
//               res.json(flatRes);
//             }
//           } else {
//             console.log(error);
//           }
//         });
//       }
//     });
//
//     function flattenArray(arr) {
//       return arr.reduce((a, b) => {
//         return a.concat(b);
//       });
//     };
//
//     function writeToFile(fileName, arr) {
//       fs.stat((fileName+".csv"), (err, stat) => {
//         if (err) {
//           fs.writeFile((fileName+".csv"), JSON.stringify(arr, null, ""), (err) => {
//             if (err) { throw err;}
//             console.log("File written!");
//           });
//         } else {
//           writeToFile(('results_'+incr++), arr);
//         }
//       });
//     }
//   }
// });

//alternate
// router.post('/call', (req, res, next) => {
  // const radius = 25000,
  //     limit = 50,
  //     offset = 10;
  // var routes = req.body.boxPoints;
  // var userParams = req.body.userParams;
  // var points = req.body.routepoints;
  //
  // console.log(points);
  //
  // var incr = 1;
  //
  // if (points.length > 0) { //check if empty
  //
  //   var ran = 0,
  //       resArr = [];
  //
  //   points.forEach((point, index, array) => {
  //     var pt = {
  //       "type": "Feature",
  //       "properties": {},
  //       "geometry": {
  //         "type": "Point",
  //         "coordinates": [point.lng, point.lat]
  //       }
  //     };
  //
  //     var buffered = turf.buffer(pt, 25000, 'meters');
  //     var bbox = turf.bbox(buffered);
  //
  //
  //     console.log(userParams.main+" "+userParams.sub);
  //
  //     factual.get('/t/places-us', {"include_count":"true",
  //       filters:{"$and":[{"country":{"$eq":"US"}},
  //     {"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}}]},
  //     geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
  //     (error, response) => {
  //       console.log(response.total_row_count);
  //       if (!error){
  //         ran++;
  //         resArr.push(response.data);
  //         if (ran === array.length) {
  //           var flatRes = flattenArray(resArr);
  //           writeToFile('results', flatRes);
  //           res.json(flatRes);
  //         }
  //       } else {
  //         console.log(error);
  //       }
  //     });
  //   });
  //
  //   function flattenArray(arr) {
  //     return arr.reduce((a, b) => {
  //       return a.concat(b);
  //     });
  //   };
  //
  //   function writeToFile(fileName, arr) {
  //     fs.stat((fileName+".csv"), (err, stat) => {
  //       if (err) {
  //         fs.writeFile((fileName+".csv"), JSON.stringify(arr, null, ""), (err) => {
  //           if (err) { throw err;}
  //           console.log("File written!");
  //         });
  //       } else {
  //         writeToFile(('results_'+incr++), arr);
  //       }
  //     });
  //   }
  // }
// });

module.exports = router;
