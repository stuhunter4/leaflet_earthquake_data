// create map object
var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5.4
});

// add tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// load in geojson data from USGS
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// grab data with d3
d3.json(url, function(data) {
    // send response.features object to the createMap function
    createMap(data.features);
});

function createMap(features) {
  // loop through the array and create a variable for coordinates and for color
  for (var i = 0; i < features.length; i++) {
  
    var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
    
    // conditions for color, based on depth of earth quake
    var color = "";
    if (features[i].geometry.coordinates[2] > 90) {
      color = "#ff5f65";
    }
    else if (features[i].geometry.coordinates[2] >= 70) {
      color = "#fca35d";
    }
    else if (features[i].geometry.coordinates[2] >= 50) {
      color = "#fdb72a";
    }
    else if (features[i].geometry.coordinates[2] >= 30) {
      color = "#f7db11";
    }
    else if (features[i].geometry.coordinates[2] >= 10) {
      color = "#dcf400";
    }
    else {
      color = "#a3f600";
    }

    // add circles to map
    L.circle(location, {
      fillOpacity: 0.65,
      color: "black",
      weight: 0.5,
      fillColor: color,
      // adjust radius, based on magnitude of earthquake
      radius: features[i].properties.mag * 15000
      // include popup that provides information about time and location of earthquake
    }).bindPopup("<h3>" + features[i].properties.place + "</h3><hr><p>" + new Date(features[i].properties.time) + "</p>").addTo(myMap);
  }
  
}

// set up the legend
var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [-10, 10, 30, 50, 70, 90];
    var colors = ['#a3f600', '#dcf400', '#f7db11', '#fdb72a', '#fca35d', '#ff5f65'];
    var labels = [];

    for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
          "<li style=\"background:" + colors[i] + "\"></li> " +
          limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // add legend to the map
  legend.addTo(myMap);
