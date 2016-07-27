const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');

var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];
var features = [];

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

  factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[23]}}]},
    geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":10000}}, limit:50},
    (error, response) => {
      console.log("COUNT "+response.total_row_count);
      // recParseCount(response.total_row_count);
    });

  factual.get('/t/places-us', {"include_count":"true",
    filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[23]}}]},
  geo:{"$within":{"$rect":[[tempBox[3] , tempBox[0]],[tempBox[1], tempBox[2]]]}}, limit:50},
  (error, response) => {
    if (!error && response.total_row_count > 0){
      console.log(response.total_row_count);
    }
  });

  // factual.get('/t/places/facets', {geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":25000}}}, function (error, res) {
  //   console.log(res.data);
  // });

  function recParseCount(count) {
    console.log("COUNT "+count);
    if (count > 50) {
      splitCount();
      //pass in new count
      // recParseCount(newCount);
    } else {
      //use response data

      var bbox = turf.bbox(buffered);
      // console.log(bbox);
      bboxCall(bbox);
    }
  }

  function splitCount() {
    var bbox = turf.bbox(buffered);
    var bboxPoly = turf.bboxPolygon(bbox);
    var area = turf.area(bboxPoly);
    var units = 'kilometers'; //(yes turf  only takes degrees, radians, miles, or kilometers for this unit)
    var cellWidth = (Math.sqrt(area)/2) / 1000;
    var squareGrid = turf.squareGrid([bbox[0],bbox[1],bbox[2],bbox[3]], 10, units);
    parseGrid(squareGrid);
    return squareGrid;
  }

  function parseGrid(squareGrid) {
    for (i in squareGrid.features) {
      var newBox = turf.bbox(squareGrid.features[i].geometry);
      bboxCall(newBox);
    }
  }

  function bboxCall(bbox) {
    factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[24]}}]},
    geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
    (error, response) => {
      if (!error && response.total_row_count > 0){
        console.log(response.total_row_count);
      }
    });
  }


});
