var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5.25
});


L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// link to get the geojson data from USGS
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
    
    createMap(data.features);
});

function createMap(features) {
  for (var i = 0; i < features.length; i++) {
  
    var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
    //console.log(location);

    // add circles to map
    L.circle(location, {
      fillOpacity: 0.65,
      color: "black",
      fillColor: "white",
      // adjust radius
      radius: features[i].properties.mag * 15000
    }).bindPopup("<h3>" + features[i].properties.place + "</h3><hr><p>" + new Date(features[i].properties.time) + "</p>").addTo(myMap);
  }
}
