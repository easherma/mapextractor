const Factual = require('factual-api'),
      factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');


module.exports = {
  authAPIs: function(object){
    return (factual);
  },
  searchParams: function(object){
    console.log(object);
  },
  API_output: function(object){},
  looper: function(object){}
};
