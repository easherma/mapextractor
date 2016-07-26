const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');

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
  features.push(buffered);
  var bbox = turf.bbox(buffered);
  var bboxPoly = turf.bboxPolygon(bbox);
  features.push(bboxPoly);

  console.log(bboxPoly);

  factual.get('/t/places-us', {"include_count":"true",
    filters:{"$and":[{"country":{"$eq":"US"}},
  {"category_ids":{"$includes_any":[24,26,22.23,21]}}]},
  geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
    (error, response) => {
      console.log(response.total_row_count);
      var results = response.data;
      points = [];
      // console.log(results);
      for (var i = 0; i < results.length; i++) {

      var point = turf.point([results[i]['longitude'], results[i]['latitude']]);
      console.log(point);
      points.push(point);
    }
  });
});
