

var map = L.map('map', {
  bounceAtZoomLimits: true,
  maxBounds: [[-85.0, -180.0],[85.0, 180.0]],
  inertia: false,
  minZoom: 2,
  continuousWorld: false,
  layers: [] //layers added here are shown by default
}).setView([20, 0], 2);
L.tileLayer('https://a.tiles.mapbox.com/v3/mapbox.world-bright/{z}/{x}/{y}.png').addTo(map);