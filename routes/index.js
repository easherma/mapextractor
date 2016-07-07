const express = require('express');
const router = express.Router();

const requestify = require('requestify');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);

const async = require('async');
const fs = require('file-system');

/* GET home page. */
router.get('/', (req, res, next) => {
  requestify.get('https://api.factual.com/categories?options={"lang":"en","format":"tree"}&KEY=SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu')
          .then((response) => { //same as function(response) {}
            var resp = response.getBody();
            res.render('index', {categories: JSON.stringify(resp.response.data[0])});
          })
});

//make factual api call
router.post('/call', (req, res, next) => {
  var radius = 25000,
      limit = 50,
      offset = 10;
  var routes = req.body.routepoints;
  var userParams = req.body.userParams;

  var incr = 1;

  if (routes.length > 0) { //check if empty

    var ran = 0;
    var resArr = [];

    routes.forEach((route, index, array) => {
      for (var i=0; i < 2; i++) {
        factual.get('/t/places-us', {"include_count":"true",
          filters:{"$and":[{"country":{"$eq":"US"}},
        {"category_ids":{"$includes_any":(userParams.sub ? userParams.sub : [userParams.main])}}]},
        geo:{"$circle":{"$center":[route.lat,route.lng],"$meters":radius}}, offset: 50*i, limit:limit},
        (error, response) => {
          if (!error){
            ran++;
            resArr.push(response.data);
            if (ran === array.length) {
              let flatRes = flattenArray(resArr);
              writeToFile('results', flatRes);
              res.json(flatRes);

            }
          } else {
            console.log(error);
          }
        });
      }
    });

    function flattenArray(arr) {
      return arr.reduce((a, b) => {
        return a.concat(b);
      });
    };

    function writeToFile(fileName, arr) {
      fs.stat((fileName+".csv"), (err, stat) => { //check if exists
        if (err) { //if it doesn't, write to file
          fs.writeFile((fileName+".csv"), JSON.stringify(arr, null, ""), (err) => {
            if (err) { throw err;}
            console.log("File written!");
          });
        } else { //if it does exists, write to next fileName
          writeToFile(('results_'+incr++), arr);
        }
      });
    }
  }
});

module.exports = router;
