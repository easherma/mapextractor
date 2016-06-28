routepoints = [];
//create the map and router
var map =
L.map('map', {
    zoomControl: true,
    maxZoom: 19
}).fitBounds([
    [41.082208455, -82.1033158688], //us bounds
    [41.7934502486, -81.0530349416]
]);


var additional_attrib = 'app created by Eric Sherman, node version by Jinno Redovan';
//add basemap to map
var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});
basemap_0.addTo(map);
var layerOrder = new Array();

//init feature groups
var feature_group = new L.featureGroup([]);
feature_group.addTo(map);


var circles = new L.LayerGroup();
circles.addTo(map);

//init leaflet routing machine with custom marker behavior
routeControl = L.Routing.control({
      waypoints: [
        L.latLng(),
        L.latLng()
    ],
    router: L.Routing.mapzen('valhalla-v9fMrPq', 'auto'), //routing-api, hard-coded atm
    formatter: new L.Routing.Mapzen.Formatter({units: 'imperial'}),
    geocoder: L.Control.Geocoder.mapzen("search-iv_vGuI", "autocomplete"), //routing-api, hard-coded atm
    createMarker: function(i, wp) {
      var options = {
          draggable: this.draggableWaypoints
        },
          marker = L.marker(wp.latLng, options);
          map.setView(wp.latLng);
          //L.circle(routeControl.getWaypoints()[i].latLng, 25000).addTo(circles);
          /*for (var i = 0; i < routeControl.getWaypoints().length; i++) {
            L.circle(routeControl.getWaypoints()[i].latLng, 25000).addTo(circles);
          }*/
      return marker;
    }
}).addTo(map);

//create circels based on waypoints
routeControl.on('waypointschanged', function(wp) {
  markers = routeControl.getWaypoints();
  circles.clearLayers();
  circleSet = [];
  for (var i = 0; i < wp.waypoints.length; i++) {
    circleSet.push(wp.waypoints[i].latLng);
  };
  $(circleSet).each(function(i){
    if (circleSet[i]  !== undefined){
      L.circle(circleSet[i], 12000).addTo(circles);
    }
  });
})

//methods

function drawResults() {
    var markers = results;
    for (var i = 0; i < markers.length; i++) {
        var lon = markers[i]['latitude'];
        var lat = markers[i]['longitude'];
        var popupText = markers[i]['name'];
        var markerLocation = new L.LatLng(lon, lat);
        var marker = new L.Marker(markerLocation).bindPopup(popupText).addTo(feature_group);

    }
}
//get route waypoints and push them. this gets posted
function getRoutepoints() {

    for (var i = 0; i < routeControl.getWaypoints().length; i++) {
        console.log("getting routepoints")
        console.log(getRoutepoints);
        points = routeControl.getWaypoints();
        routepoints.push(points[i]['latLng']); //where is points?
        console.log(routepoints);
    }
};

L.control.layers({
    "result": feature_group,
    "radii": circles
}, {
    collapsed: false
}).addTo(map);
L.control.scale({
    options: {
        position: 'bottomleft',
        maxWidth: 100,
        metric: true,
        imperial: false,
        updateWhenIdle: false
    }
}).addTo(map);

//add buttons for routing and drawing results
//submit parmeters, get routepoints, send points, draw resuls
$(".leaflet-routing-geocoders").append("<input id=\"clickMe\" type=\"button\" value=\"Run Query\" onclick=\"getRoutepoints();post();\" />");
$(".leaflet-routing-geocoders").append("<input id=\"draw\" type=\"button\" value=\"Draw Results\" onclick=\"drawResults();\" />");

//results, output
function post() {
    $.ajax({
        type: 'POST',
        url: '/call',
        data: JSON.stringify(routepoints),
        success: function(data) {
            results = data;//results from API call
        },
        complete: function(data) {
            loadTable();
            routepoints.length = 0;
            console.log("clear routepoints");
            console.log(routepoints);

        },
        contentType: 'application/json',
        dataType: 'json'
    });
}
//load results from query
function loadTable() {
    $(function() {
        $('#table').bootstrapTable({
            data: results
        });
    });
}

//submit search params
$(function() {
    $('button').click(function() {
        var user = $('#txtUsername').val();
        var main = $(sel1);
        var sub = $(sel2).val();
        $.ajax({
            url: '/getParams',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

//messy forms..kinda specific to the factual structure?  not sure how hard to plug in other APIS, like OSM

//load select2
var mainArray = [];
for(i in mainCategories.children) {
  let main = mainCategories.children[i];
  mainArray.push({'text': main.label, 'id': main.id});
}

var big_cats = '';
var id = parseInt($(sel1).val());
var filtered = [];
var catray = [];
function subCats(){
    let sub_cats = '';
    if (filtered.length !== 0) {
      for (i =0; i < filtered[0].children.length; i++) {
      sub_cats += '<option value ='+ filtered[0].children[i].id + '>' + filtered[0]['children'][i].label + '</option><br>';
    }
    $('#sel2').html(sub_cats);
  }
}


var selectone = $(sel1).select2(
  {data: mainArray, placeholder: "Select a Business Category First", allowClear: true}
).on("select2:select", function() {
  $('#sel2').select2('val', ''); //clear subcategory if main is changed
  id = parseInt($(sel1).val());
  console.log('change');
  filtered = jQuery.grep(mainCategories.children,( item, index ) => {
    return id == item.id;
  });
  subCats();
});

var selecttwo = $(sel2).select2({allowClear: true, placeholder: "Optional Sub-Categories"});
// $(sel1).on("change", function() {
//   subCats();
// });
