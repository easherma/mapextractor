const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');
const fs = require('file-system');

var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];
var features = [];

var ran = 0,
    resArr = [];

routes.forEach((route, index, array) => {
  var pt = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [route.lng, route.lat]
    }
  };

  var buffered = turf.buffer(pt, 10000, 'meters');
  var tempBox = turf.bbox(buffered);
  var tempbboxPoly = turf.bboxPolygon(tempBox);

  factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[26]}}]},
    geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":10000}}, limit:50},
    (error, response) => {
      recParseCount(response.total_row_count);
    });

  function recParseCount(count) {
    console.log("COUNT "+count);
    if (count > 50) {
      splitCount();
    } else {
      //use response data

      var bbox = turf.bbox(buffered);
      bboxCall(bbox, 0);
    }
  }

  function splitCount() {
    var bbox = turf.bbox(buffered);
    var bboxPoly = turf.bboxPolygon(bbox);
    var area = turf.area(bboxPoly);
    var units = 'kilometers'; //(yes turf  only takes degrees, radians, miles, or kilometers for this unit)
    var cellWidth = (Math.sqrt(area)/2) / 1000;
    var squareGrid = turf.squareGrid([bbox[0],bbox[1],bbox[2],bbox[3]], cellWidth, units);
    parseGrid(squareGrid);
    return squareGrid;
  }

  function parseGrid(squareGrid) {
    writeToFile("Grid",squareGrid);
    for (i in squareGrid.features) {
      var newBox = turf.bbox(squareGrid.features[i].geometry);
      bboxCall(newBox, squareGrid.features.length);
    }
  }

  function bboxCall(bbox, length) {
    factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[26]}}]},
    geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
    (error, response) => {
      ran++;
      if (!error && response.total_row_count > 0){
        console.log(response.total_row_count);
        resArr.push(response.data);
        if (ran === length) {
          console.log(resArr.length);
        }
      }
    });
  }

  function writeToFile(fileName, res) {
    fs.writeFile((fileName+".csv"), JSON.stringify(res, null, ""), (err) => {
      if (err) { throw err;}
      console.log("File written!");
    });
  }


});
