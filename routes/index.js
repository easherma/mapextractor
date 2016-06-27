const express = require('express');
const router = express.Router();
const searchParams = require('../classes.js').searchParams;

const requestify = require('requestify');
const Factual = require('factual-api'),
      auth = require('../auth.js')
      factual = new Factual(auth.key, auth.secret);
// const API_output = require('../classes.js').authAPI_outputAPIs;
// const looper = require('../classes.js').looper;

/* GET home page. */
router.get('/', (req, res, next) => {

  params = {'status':'OK','main':2, 'sub':[], 'user':'default'};

  requestify.get('https://api.factual.com/categories?options={"lang":"en","format":"tree"}&KEY=SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu')
          .then((response) => {
            let resp = response.getBody();
            res.render('index', {categories: JSON.stringify(resp.response.data[0])});
          })
});

router.get('/getParams', (req, res, next) => {
  //res.render('index');
});

router.post('/call', (req, res, next) => {
  //res.render('index');
});

module.exports = router;
