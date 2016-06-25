const Factual = require('factual-api'),
      auth = require('./auth.js')
      factual = new Factual(auth.key, auth.secret);


module.exports = {
  factual: function() {
    return factual;
  },
  searchParams: function(object){

  },
  API_output: function(object){},
  looper: function(object){}
};
