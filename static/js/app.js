/* var data = [{"website":"http://www.fletcherjonesvolkswagen.com","category_labels":[["Automotive","Car Dealers and Leasing"]],"fax":"(312) 944-8431","neighborhood":["Gold Coast","Near North Side","Gold Cost"],"name":"Fletcher Jones Volkswagen","hours_display":"Mon-Thu 9:00 AM-8:00 PM; Fri-Sat 9:00 AM-6:00 PM","locality":"Chicago","country":"us","region":"IL","address":"1111 N Clark St","chain_id":"cbd69f0e-1352-498d-9911-ce3359556cbc","longitude":-87.63117,"category_ids":[4],"hours":{"monday":[["9:00","20:00"]],"tuesday":[["9:00","20:00"]],"friday":[["9:00","18:00"]],"wednesday":[["9:00","20:00"]],"thursday":[["9:00","20:00"]],"saturday":[["9:00","18:00"]]},"$distance":3023.1333,"postcode":"60610","factual_id":"dfd8a0fd-acdd-4fda-b8fa-19349700bd2a","chain_name":"Volkswagen Dealer","latitude":41.902274,"tel":"(312) 628-4800","email":"chicagohondafj@workgroup.chat.dealer.com"}]; */
$(function() {
    var $table = $('#table');
    $('#toolbar').find('select').change(function() {
        $table.bootstrapTable('refreshOptions', {
            exportDataType: $(this).val()
        });
    });
});




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


function routePoints() {


    for (var i = 0; i < routeControl.getWaypoints().length; i++) {
        points = routeControl.getWaypoints();
        routepoints.push(points[i]['latLng']);
    }
};



var map = L.map('map', {
    zoomControl: true,
    maxZoom: 19
}).fitBounds([
    [41.082208455, -82.1033158688],
    [41.7934502486, -81.0530349416]
]);
var hash = new L.Hash(map);
var additional_attrib = 'created w. <a href="https://github.com/geolicious/qgis2leaf" target ="_blank">qgis2leaf</a> by <a href="http://www.geolicious.de" target ="_blank">Geolicious</a> & contributors<br>';
var feature_group = new L.featureGroup([]);
var raster_group = new L.LayerGroup([]);
var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});
basemap_0.addTo(map);
var layerOrder = new Array();
//function pop_data(feature, layer) {
//    var popupContent = '<table><tr><th scope="row">address</th><td>' + Autolinker.link(String(feature.properties['address'])) + '</td></tr><tr><th scope="row">category_ids__001</th><td>' + Autolinker.link(String(feature.properties['category_ids__001'])) + '</td></tr><tr><th scope="row">category_ids__002</th><td>' + Autolinker.link(String(feature.properties['category_ids__002'])) + '</td></tr><tr><th scope="row">category_ids__003</th><td>' + Autolinker.link(String(feature.properties['category_ids__003'])) + '</td></tr><tr><th scope="row">category_ids__</th><td>' + Autolinker.link(String(feature.properties['category_ids__'])) + '</td></tr><tr><th scope="row">category_labels__001</th><td>' + Autolinker.link(String(feature.properties['category_labels__001'])) + '</td></tr><tr><th scope="row">category_labels__002</th><td>' + Autolinker.link(String(feature.properties['category_labels__002'])) + '</td></tr><tr><th scope="row">category_labels__003</th><td>' + Autolinker.link(String(feature.properties['category_labels__003'])) + '</td></tr><tr><th scope="row">email</th><td>' + Autolinker.link(String(feature.properties['email'])) + '</td></tr><tr><th scope="row">locality</th><td>' + Autolinker.link(String(feature.properties['locality'])) + '</td></tr><tr><th scope="row">neighborhood__001</th><td>' + Autolinker.link(String(feature.properties['neighborhood__001'])) + '</td></tr><tr><th scope="row">name</th><td>' + Autolinker.link(String(feature.properties['name'])) + '</td></tr><tr><th scope="row">neighborhood__</th><td>' + Autolinker.link(String(feature.properties['neighborhood__'])) + '</td></tr><tr><th scope="row">postcode</th><td>' + Autolinker.link(String(feature.properties['postcode'])) + '</td></tr><tr><th scope="row">region</th><td>' + Autolinker.link(String(feature.properties['region'])) + '</td></tr><tr><th scope="row">tel</th><td>' + Autolinker.link(String(feature.properties['tel'])) + '</td></tr><tr><th scope="row">website</th><td>' + Autolinker.link(String(feature.properties['website'])) + '</td></tr><tr><th scope="row">distance</th><td>' + Autolinker.link(String(feature.properties['distance'])) + '</td></tr></table>';
//    layer.bindPopup(popupContent);
//}

/* old js, use if you parse to geojson
var result = new L.geoJson(data,{
    //onEachFeature: pop_data,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 4.0,
            fillColor: '#94b249',
            color: '#000000',
            weight: 1,
            opacity: 1.0,
            fillOpacity: 1.0
        })
    }
});*/
//add comment sign to hide this layer on the map in the initial view.




//var marker = L.marker([data[i].latitude, data[i].longitude]);
//marker.bindPopup([data[i].name);


//feature_group.addLayer(marker);

feature_group.addTo(map);
var title = new L.Control();
title.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
title.update = function() {
    this._div.innerHTML = '<h2>Factual API Data Extract</h2>Author: Eric Sherman<br> '
};
title.addTo(map);

routeControl = L.Routing.control({
    waypoints: [
        L.latLng(),
        L.latLng()
    ],
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

//L.Routing.Formatter(units: 'imperial');

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}



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
// dumb circle var circle = L.circleMarker([41.505493, -81.681290], {radius: 75}).addTo(map);

routepoints = []
$(".leaflet-routing-geocoders").append("<input id=\"clickMe\" type=\"button\" value=\"Run Query\" onclick=\"routePoints();post();\" />");
$(".leaflet-routing-geocoders").append("<input id=\"draw\" type=\"button\" value=\"Draw Results\" onclick=\"drawResults();\" />");


function bulkDownload() {
    var output = results
    var resultsdata = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output));
    //var results = {{ results|tojson|safe}};

    $('<a href="#bdownload:' + resultsdata + '" download="data.json">download JSON</a>').appendTo('#bdownload');
}


function post() {
    $.ajax({
        type: 'POST',
        url: '/call',
        data: JSON.stringify(routepoints),
        success: function(data) {
            results = JSON.parse(data);
        },
        complete: function(data) {
            loadTable();
        },
        contentType: 'application/json',
        dataType: 'json'
    });
}




function loadTable() {
    $(function() {
        $('#table').bootstrapTable({
            data: results
        });
    });
}
