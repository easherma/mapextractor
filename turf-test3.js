const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');

var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];
var features = [];

routes.forEach((route, index, array) => {

  factual.get('/t/places-us', {"include_count":"true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[24]}}]},
    geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":25000}}, limit:50},
    (error, response) => {
      console.log(response);
      makeDots(response.total_row_count);
    });

  function normish(mean, range) {
    var num_out = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 4) / 4) * range + mean;
    return num_out;
  }

  function makeDots(amount) {
    var dots = {
       type: "FeatureCollection",
       features: []
   };

   for(var i=0;i<amount;++i) {

     //set up random variables
     x = normish(0, 4);
     y = normish(0, 4);

     //create points randomly distributed about center coordinates
     var g = {
         "type": "Point",
             "coordinates": [((x * 0.11) + route.lng), ((y * 0.1) + route.lat)]
     };

     //create feature properties, roughly proportional to distance from center coordinates
     var p = {
         "id": i,
             "popup": "Dot_" + i,
             "year": parseInt(Math.sqrt(x * x + y * y) * 60 * (1 - Math.random() / 1.5) + 1900),
             "size": Math.round((parseFloat(Math.abs((normish(y*y, 2) + normish(x*x, 2)) * 50) + 10)) * 100) / 100
     };

         //create features with proper geojson structure
         dots.features.push({
             "geometry" : g,
             "type": "Feature",
             "properties": []
         });

      var buffered = turf.buffer(dots, 5000, 'meters');
      var bbox = turf.bbox(buffered);

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
   return dots;
  }

});
