

var map = L.map('map', {
  bounceAtZoomLimits: true,
  maxBounds: [[-85.0, -180.0],[85.0, 180.0]],
  inertia: false,
  minZoom: 2,
  continuousWorld: false,
  layers: [] //layers added here are shown by default
}).setView([20, 0], 2);
L.tileLayer('https://a.tiles.mapbox.com/v3/mapbox.world-bright/{z}/{x}/{y}.png').addTo(map);

var key = 'SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu';
var end = 'http://api.v3.factual.com/t/places?filters='
var filters = '{"$and":[{"category_labels":{"$includes":"[%5C"AUTOMOTIVE%5C",%5C"MAINTENANCE+AND+REPAIR%5C"]"}}]}&geo={"$circle":{"$center":[41.460460,-81.627303],"$meters":25000}}';

var URL = end + filters + "&KEY=" + key;
document.write(URL);

var result = $.getJSON(URL);
success(data,status,xhr)
document.write(result);