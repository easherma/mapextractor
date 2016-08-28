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
  getFirstCount: function(callback) {
    this.getCount(this.bbox).then((data) => {
      return data.response.total_row_count;
    });
  },
  getCount: function(bbox) {
    return mT.getCount(bbox);
  }
}

module.exports = RouteParser;
