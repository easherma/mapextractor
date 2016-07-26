
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

  var buffered = turf.buffer(pt, 25000, 'meters');
  var bboxPoly = turf.bboxPolygon(bbox);
  var area = turf.area(bboxPoly);

  factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[24]}}]},
    geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":25000}}, limit:50},
    (error, response) => {
      parseCount(response.total_row_count);
    });

  function recParseCount(count) {
    if (count > 50) {
      splitCount();
      //pass in new count
      recParseCount(newCount);
    } else {
      //use response data
      bboxCall();
    }
  }

  function splitCount() {
    var bbox = turf.bbox(buffered);
    var units = 'kilometers'; //(yes turf  only takes degrees, radians, miles, or kilometers for this unit)
    var cellWidth = (Math.sqrt(area)/2) / 1000;
    var squareGrid = turf.squareGrid([bbox[0],bbox[1],bbox[2],bbox[3]], 10, units);

    return squareGrid;
  }

  function bboxCall(bbox) {
    factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[24]}}]},
    geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
    (error, response) => {
      if (!error){
        console.log(amount);
        console.log("buff "+response.total_row_count);
      }
    });
  }


});
