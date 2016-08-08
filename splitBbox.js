const splitBbox = (bbox) => {
  var xmin = (bbox[0] || bbox.xmin),
      ymin = (bbox[1] || bbox.ymin),
      xmax = (bbox[2] || bbox.xmax),
      ymax = (bbox[3] || bbox.ymax);

  var halfWidth = (xmax - xmin) / 2.0,
      halfHeight = (ymax - ymin) / 2.0;
  return [
      {xmin: xmin, ymin: ymin, xmax: xmin + halfWidth, ymax: ymin + halfHeight},
      {xmin: xmin + halfWidth, ymin: ymin, xmax: xmax, ymax: ymin + halfHeight},
      {xmin: xmin, ymin: ymin + halfHeight, xmax: xmin + halfWidth, ymax: ymax},
      {xmin: xmin + halfWidth, ymin: ymin + halfHeight, xmax: xmax, ymax: ymax}
  ];
}

module.exports = splitBbox;
