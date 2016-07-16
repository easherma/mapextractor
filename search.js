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

  // var route = [{lat:   , lng: },{lat: 41.812671180732124, lng: }];



  // Geo filter doc:

  var callFactual = function callFactual() {
    factual.get('/t/places-us', {"include_count": "true",
      filters:{"$and":[{"country":{"$eq":"US"}},
    {"category_ids":{"$includes_any":[24,26]}}]},
    geo:{"$within":{"$rect":[[41.81981483749364 , -87.65537981264032],[41.803645162506356, -87.6770741873597]]}}, limit:20},
    (error, res) => {
      console.log(error);
      if (!error){
        console.log(res.included_rows+" "+res.total_row_count);
        // for (i in res.data) {
          // console.log(res.data[i].name);
          // callback(res.data);
        // }
      }
    });
  }

  callFactual();

  var arr = [];
  // for (x in route) {
  //   var loc = route[x];
  //
  //   callFactual(loc, function(res){
  //     arr.push(res);
  //     if (x === (route.length -1)) {
  //       console.log(arr.length);
  //     }
  //   });
  // }

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
