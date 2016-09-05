//Route parser automates a lot of the processing instead of having to write it
//out in index.js

const mT = require('../libs/MapTasks.js');
const _ = require('underscore');
const now = require('performance-now');
/**
* @param {Array} point //array of coordinates
* @param {Array or Number} param
*/
var RouteParser = function(point, param) {
  this.bbox = mT.makeBox(point);
  this.param = param;
}

RouteParser.prototype = {
  //returns number
  getFirstCount: function() {
    return this.getCount(this.bbox, this.param);
  },
  getCount: function(bbox, param) {
    return mT.getCount(bbox, param);
  },
  decide: function(count) {
    if (mT.isWithin(count)) {
      return true;
    } else {
      return false;
    }
  },
  split: function(bbox) {
    return mT.splitBox(bbox);
  }
}

module.exports = RouteParser;
