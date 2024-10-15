// Create map object
let myMap = L.map("map", {
    center: [39.742043, -104.991531],
    zoom: 5.2
  });

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load GeoJSON data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data d3
d3.json(geoData).then(function(data) {
    let geojson = data.features;
    console.log(data)

    // Loop through geoData
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

        // Add Circles to the map
        L.circle([geojson[i].geometry.coordinates[1], geojson[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: 'black',
            fillColor: color,
            // Adjust the radius
            radius: geojson[i].properties.mag * 15000
        }).bindPopup(`<h1>${geojson[i].properties.place}</h1> <hr>
            <h3>Magnitude: ${geojson[i].properties.mag}</h3>
            <h3>Depth: ${geojson[i].geometry.coordinates[2]}</h3>`).addTo(myMap)   
        };

    });
 
    // Set up legend
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

