// boost api doc:
// http://developer.factual.com/api-docs/#Boost 

var auth = require('./auth');
var Factual = require('../factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.post('/t/places-us/boost', {
  factual_id: '03c26917-5d66-4de9-96bc-b13066173c65',
  q: "local business data",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
