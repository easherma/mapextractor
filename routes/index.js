const express = require('express');
const router = express.Router();

const requestify = require('requestify');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

/* GET home page. */
router.get('/', (req, res, next) => {

  requestify.get('https://api.factual.com/categories?options={"lang":"en","format":"tree"}&KEY=SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu')
          .then((response) => { //same as function(response) {}
            var resp = response.getBody();
            res.render('index', {categories: JSON.stringify(resp.response.data[0])});
          })
});

router.post('/getParams', (req, res, next) => {
});

router.post('/call', (req, res, next) => {
  var radius = 25000,
      limit = 50,
      offset = 10;
  var route = req.body;

  if (route.length > 0) { //check if empty

    var array = [];

    for(x in route) {
      console.log(route[x]);
      var loc = route[x];
      // Geo filter doc:

      tasks = function tasks(callback) {
        for (var i = 0; i < 2; i++) {
          factual.get('/t/places-us', {
            filters:{"$and":[{"country":{"$eq":"US"}},
          {"category_ids":{"$includes":"2, 3"}}]},
          geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":radius}}, offset:50*i, limit:limit},
          (error, res) => {
            if (!error){
              return callback(res.data[i]);
            }
          });
        }
      }

      tasks(function(resp){
        array.push(resp);
        console.log(array.length);
      });
    }
  }

});

module.exports = router;
