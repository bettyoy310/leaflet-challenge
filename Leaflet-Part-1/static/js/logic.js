let myMap = L.map("map").setView([39.8283, -98.5795], 5);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// GeoJSON API URL (replace with the actual URL)
let geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define the color scale for depth
function getColor(depth) {
    if (depth >= -10 && depth <= 10) return "green";
    else if (depth > 10 && depth <= 30) return "yellow";
    else if (depth > 30 && depth <= 50) return "#FFBF00"; 
    else if (depth > 50 && depth <= 70) return "orange";
    else if (depth > 70 && depth <= 90) return "#FF4500"; 
    else if (depth > 90) return "red";
    return "purple";
}

// Define marker size based on magnitude
function getSize(magnitude) {
    return magnitude ? magnitude * 4 : 2; // Default size for very small earthquakes
}

// Fetch the GeoJSON data using D3
d3.json(geojsonURL).then(data => {
    // Add the earthquake data to the map
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getSize(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]), // Depth is the 3rd coordinate
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            // Add tooltip to each marker
            layer.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
                             <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                             <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
        }
    }).addTo(myMap);
});


let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.style.backgroundColor = "white";
    div.style.padding = "10px";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";  
    div.style.fontSize = "12px";
   

    div.innerHTML += 
        '<i style="background: green; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i><span>-10 to 10</span><br>';
    div.innerHTML += 
        '<i style="background: yellow; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i><span>11 to 30</span><br>';
    div.innerHTML += 
        '<i style="background: #FFBF00; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i><span>31 to 50</span><br>'; 
    div.innerHTML += 
        '<i style="background: orange; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i><span>51 to 70</span><br>';
    div.innerHTML += 
        '<i style="background: #FF4500; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i><span>71 to 90</span><br>';  
    div.innerHTML += 
        '<i style="background: red; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i><span>91+</span><br>';
    
    return div;
};

legend.addTo(myMap);

fig.write_image("map.png");

