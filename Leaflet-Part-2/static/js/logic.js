function createMap(earthquakes) {
// Add the tile layers for the background of the map
// Old map tiles stopped working, found links to google layers on stack overflow https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
let satView = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

let grayscale = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
});

let terrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

// Create the baseMaps object
let baseMaps = {
    'Satellite': satView,
    'Grayscale': grayscale,
    'Terrain': terrain
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

  let legend = L.control({position: "bottomright"});

function getColor(value) {
    return  value > 90 ? "#ff4000" :
            value > 70 ? "#ff8000" :
            value > 50 ? "#ffbf00" :
            value > 30 ? "#ffff00" :
            value > 10 ? "#bfff00" :
            value > -10 ? "#80ff00" :
                       "#80ff00"; 
}
    
legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
        categories = [-10, 10, 30, 50, 70, 90];
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < categories.length; i++) {
            if (categories[i] < 90) {
                div.innerHTML +=
                    '<i class = "circle" style="background:' + getColor(categories[i]+1) + '"></i> ' +
                    (categories[i] ? categories[i] + ' - ' + categories[i+1] + '<br>' : '+');  
            }
            else {
                div.innerHTML +=
                    '<i class = "circle" style="background:' + getColor(categories[i]+1) + '"></i> ' +
                    (categories[i] ? categories[i] + ' + ' + '<br>' : '+');
            }
        };
        return div;

    };
legend.addTo(myMap);
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
