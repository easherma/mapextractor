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
routepoints = []
function getWaypoints() {

    for (var i = 0; i < routeControl.getWaypoints().length; i++) {
        console.log("getting waypoints")
        console.log(routepoints);
        points = routeControl.getWaypoints();
        routepoints.push(points[i]['latLng']); //where is points?
        console.log(routepoints);
    }
};


//create the map and router
var map = L.map('map', {
    zoomControl: true,
    maxZoom: 19
}).fitBounds([
    [41.082208455, -82.1033158688], //us bounds
    [41.7934502486, -81.0530349416]
]);
var hash = new L.Hash(map);
var additional_attrib = 'app created by Eric Sherman';
var feature_group = new L.featureGroup([]);
var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});
basemap_0.addTo(map);
var layerOrder = new Array();

feature_group.addTo(map);
var title = new L.Control();
title.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
title.update = function() {
    this._div.innerHTML = '<h2>Factual API Data Extract</h2>'
};
title.addTo(map);

routeControl = L.Routing.control({
    waypoints: [
        L.latLng(),
        L.latLng()
    ],
    router: L.Routing.mapzen('valhalla-v9fMrPq', 'auto'),
    formatter: new L.Routing.Mapzen.Formatter({units: 'imperial'}),
    geocoder: L.Control.Geocoder.mapzen("search-iv_vGuI", "autocomplete")

}).addTo(map);


var baseMaps = {
    'OSM Standard': basemap_0
};
L.control.layers(baseMaps, {
    "result": feature_group
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
$(".leaflet-routing-geocoders").append("<input id=\"clickMe\" type=\"button\" value=\"Run Query\" onclick=\"getWaypoints();post();\" />");
$(".leaflet-routing-geocoders").append("<input id=\"draw\" type=\"button\" value=\"Draw Results\" onclick=\"drawResults();\" />");

//results, output, controller?
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

//messy forms..may not bee needed anymore?
//change label to text for Select2
var main_categories = bigcats[0].children
//function to split

var parsed_main_array = [];
for(var i = 0, len = main_categories .length; i < len; i++) {
  parsed_main_array.push( {"text": main_categories[i].label, "id" : main_categories[i].id});
}
function mapCategories(array) {
  $.map(array,function(o){
    o.text = o.text || o.label;
    return o;
  });
  return array
}
var parsed_sub_array =[];

/*$.map(array, function(o){
  o.text = o.text || o.label;
  return o;
});*/
//filter sub categories based on main selection, i think we can change this to match the above process(map, then parse)
//var id = parseInt($(sel1).val());
var main_categories_selection = [];
var main_id = main_categories[0].id;

//this creates the html for the sub selection
function subCats(){
    parsed_sub_array = [];
    var main_id = main_categories[0].id;
    for(var i = 0, len = main_categories.length; i < len; i++) {
      var main_id = main_categories[i].id;
      parsed_sub_array.push({"text": main_categories_selection[0].children[i].label, "id" : main_categories_selection[0].children[0].id});
    }

}

//main
  var selectone = $(sel1).select2(
    {data: parsed_main_array, placeholder: "Select a Business Category First", allowClear: true}
  ).on("select2:select", function() {
    id = parseInt($(sel1).val());
    console.log('change');
    //get the selected category id
    main_categories_selection = jQuery.grep(bigcats[0].children, function( item, index ) {
      return ( item.id == id  );
    });
  });
//});

//sub
$(sel2).select2({data: mapCategories(main_categories_selection[0].children) , allowClear: true, placeholder: "Optional Sub-Categories"});
//main_categories_selection[0].children
$(sel1).on("change", function() {
});
