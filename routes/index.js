const express = require('express');
const router = express.Router();

const requestify = require('requestify');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const async = require('async');

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
  var routes = req.body.routepoints;
  var userParams = req.body.userParams;

  //TODO: try a Promise to handle the end of the tasks or
  //TODO: test http://stackoverflow.com/questions/15170280/node-js-api-calls-in-an-async-loop
  //making multiple api calls in async forEach

  if (routes.length > 0) { //check if empty

    var ran = 0;
    var resArr = [];
    console.log(routes);
    routes.forEach((route, index, array) => {
      console.log(route);
      factual.get('/t/places-us', {"include_count":"true",
        filters:{"$and":[{"country":{"$eq":"US"}},
      {"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}}]},
      geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":radius}}, limit:limit},
      (error, response) => {
        if (!error){
          console.log(response.included_rows+" "+response.total_row_count);
          ran++;
          resArr.push(response.data);
          if (ran === array.length) {
            res.json(resArr);
          }
        } else {
          console.log(error);
        }
      });
    });
  }
});

module.exports = router;
