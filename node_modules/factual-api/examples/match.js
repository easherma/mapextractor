// match api doc:
// http://developer.factual.com/api-docs/#Match 

var auth = require('./auth');
var Factual = require('../factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.get('/t/places/match?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});
