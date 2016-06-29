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
  var route = req.body;
  if (route.length > 0) {
    for(x in route) {
      console.log(route[x]);
      var loc = route[x];
      // var places = factual.table('places');
    }
  }
});

module.exports = router;
