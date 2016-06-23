const express = require('express');
const router = express.Router();
const authAPIs = require('../classes.js').authAPIs;
const searchParams = require('../classes.js').searchParams;
const API_output = require('../classes.js').authAPI_outputAPIs;
const looper = require('../classes.js').looper;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/getParams', (req, res, next) => {
  //res.render('index');
});

router.post('/call', (req, res, next) => {
  //res.render('index');
});

module.exports = router;
