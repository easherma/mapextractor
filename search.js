  // read api doc:
  // http://developer.factual.com/display/docs/Core+API+-+Read

  // var auth = require('./auth.js'); //or however you wanna auth
  var Factual = require('factual-api');
  var factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');
  //factual.startDebug();
  var async = require('async');
  // var not = require('./test.js').not;

  let radius = 25000,
  limit = 50,
  offset = 10;

  var route = [{lat: 42.03831, lng: -88.290742},{lat: 41.81173, lng: -87.666227}];

  // Geo filter doc:

  var callFactual = function callFactual(route, callback) {
    factual.get('/t/places-us', {"include_count": "true",
      filters:{"$and":[{"country":{"$eq":"US"}},{"name":{"$nin":not}},
    {"category_ids":{"$includes":"2, 3"}}]},
    geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":radius}},limit: 50},
    (error, res) => {
      console.log(error);
      if (!error){
        console.log(route);
        console.log(res.included_rows+" "+res.total_row_count);
        // for (i in res.data) {
          // console.log(res.data[i].name);
          callback(res.data);
        // }
      }
    });
  }

  var arr = [];
  for (x in route) {
    var loc = route[x];

    callFactual(loc, function(res){
      arr.push(res);
      if (x === (route.length -1)) {
        console.log(arr.length);
      }
    });
  }

  route.forEach

// console.log(tasks.results());

  // function sandwich() {
  //   for (let i = 0; i < 1; i++) {
      // factual.get('/t/places-us', {
      //   filters:{"$and":[{"country":{"$eq":"US"}},
      // {"category_ids":{"$includes":"2, 3"}}]},
      // geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":radius}}, offset:50*(i), limit:limit},
      // (error, res) => {
      //   if (!error){
      //     console.log(res.data[i]);
      //     return array.push(res.data[i]);
      //   }
      // });
  //   }
  // }
