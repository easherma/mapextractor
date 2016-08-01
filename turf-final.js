const turf = require('turf');
const Factual = require('factual-api');
const factual = new Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow');
const fs = require('file-system');

var routes = [ { lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];
var features = [];
