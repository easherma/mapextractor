  // read api doc:
  // http://developer.factual.com/display/docs/Core+API+-+Read

  // var auth = require('./auth.js'); //or however you wanna auth
  var Factual = require('factual-api');
  var factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');
  //factual.startDebug();

  let radius = 25000,
  limit = 50,
  offset = 10;

  // Geo filter doc:
  let array = [];
  sandwich();
  function sandwich() {
    for (let i = 0; i < 1; i++) {
      factual.get('/t/places-us', {
        filters:{"$and":[{"country":{"$eq":"US"}},
      {"category_ids":{"$includes":"2, 3"}}]},
      geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":radius}}, offset:50*(i), limit:limit},
      (error, res) => {
        if (!error){
          return array.push(res.data[i]);
        }
      });
    }
  }
