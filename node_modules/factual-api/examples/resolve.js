// resolve api doc:
// http://developer.factual.com/api-docs/#Resolve

var auth = require('./auth');
var Factual = require('../factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

// resovle from name and address info
factual.get('/t/places/resolve?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});


// resolve from name and geo location
factual.get('/t/places/resolve?values={"name":"McDonalds","latitude":34.05671,"longitude":-118.42586}', function (error, res) {
  console.log(res.data);
});
