function createMap(earthquakes) {
// Add the tile layers for the background of the map
let satView = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});

let grayscale = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
});

let outdoor = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}', {
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

// Create the baseMaps object
let baseMaps = {
    'Satellite': satView,
    'Grayscale': grayscale,
    'Outdoors': outdoor
};

// Create the overlayMaps object
let overlayMaps = {
    'Earthquakes': earthquakes
};

// Create map object
let myMap = L.map("map", {
    center: [39.742043, -104.991531],
    zoom: 5.2,
    layers: [satView, earthquakes]
  });

  // Create a layer control
  let layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

function createMarkers(response) {
    let geojson = response.features;

    let earthquakes = [];

    for (let i = 0; i < geojson.length; i++) {
        let color = "";
        // Conditionals for earthquake depth, geometry.coordinates[2]
        if (geojson[i].geometry.coordinates[2] < 10) {
            color = "#80ff00";
        }
        else if (geojson[i].geometry.coordinates[2] < 30) {
            color = "#bfff00";
        }
        else if (geojson[i].geometry.coordinates[2] < 50) {
            color = "#ffff00";
        }
        else if (geojson[i].geometry.coordinates[2] < 70) {
            color = "#ffbf00";
        }
        else if (geojson[i].geometry.coordinates[2] < 90) {
            color = "#ff8000";
        }
        else {
            color = "#ff4000";
        }

        let earthquake = L.circle([geojson[i].geometry.coordinates[1], geojson[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: 'black',
            fillColor: color,
            // Adjust the radius
            radius: geojson[i].properties.mag * 15000
        }).bindPopup(`<h1>${geojson[i].properties.place}</h1> <hr>
            <h3>Magnitude: ${geojson[i].properties.mag}</h3>
            <h3>Depth: ${geojson[i].geometry.coordinates[2]}</h3>`);
            
            earthquakes.push(earthquake)
        }
        createMap(L.layerGroup(earthquakes));

}






d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);



