// Clear api doc:
// http://developer.factual.com/api-docs/#Clear

var auth = require('./auth');
var Factual = require('../factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.post('/t/global/21EC2020-3AEA-1069-A2DD-08002B30309D/clear', {
  fields: "address_extended,latitude,longitude",
  user: "a_user_id",
}, function (error, res) {
  if (!error) console.log("success");
});
