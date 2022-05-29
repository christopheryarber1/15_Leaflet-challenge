//SET the variable URL for the JSON Data
var URL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Get the Data, and log it to the console
d3.json(URL).then(function (data){
console.log(data.features);

//Build GeoJson 
let earthquakeData =data.features;

// move data into new function
createFeatures(earthquakeData)
});
function createFeatures(earthquakeData){
    //Function binds the marker html data
    function onEachFeature(feature,layer)
    {
    layer.bindPopup(`<h2>${feature.properties.place}</h2>
                        <hr>
                        <p>${new Date(feature.properties.time)}</p>
                        <hr>
                        <b>Magnitude: </b> ${feature.properties.mag}</br>
                        <b>Location: </b> ${feature.properties.place}</br>
                        <b>Depth: </b> ${feature.geometry.coordinates[2]}</br>
                        `);
    }
    //set colors for data points
    function getColor(depth)
    {
        if (depth > 125)
        return "#FF0000"
        else if (depth > 75)
            return "#FC4903"
        else if (depth > 75)
            return "#FC8403"
        else if (depth > 50)
            return "#FCAD03"
        else if (depth > 25)
            return "#CAFC03"
        else 
            return "#00FF00"
    }
    //calculate the radius of the marker 
    function getRadius(magnitude)
    {
        if(magnitude ===0)
            return 1;
        else 
            return magnitude *5;
    }
    //setting style info of marker based on depth 
    function styleInfo(feature)
    {
        return {
            opacity:1,
            fillcolor:getColor(feature.geometry.coordinates[2]),
            color:getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            stroke: true
        };
    }
    //create the GeoJSON for 
    var earthquakes = L.geoJSON(earthquakeData,
        {
            pointToLayer: function(feature,latlng){
                return L.circleMarker(latlng);
            },
            // use the style info from function above
            style: styleInfo,
            onEachFeature: onEachFeature
        });
    createMap(earthquakes);     
}

//Take GeoJSON data and pull it into the map image
function createMap(earthquakes) {
    //Base Layers set here
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    //Base Map for Base Layers
    var baseMaps = {
        "Street Map": street,
        "Topograpgic Map": topo
    };
    //Earthquake overlay 
    var overlays = {
        "Earthquakes": earthquakes
    }
    //Create the map, center on marietta GA
    var myMap = L.map("map", {
        center: [
            33.95, -84.55
        ],
        zoom: 3,
        layers: [street,earthquakes]
    });
    //Layer control containing basemap and overlays. 
    L.control.layers(baseMaps, overlays, {
        collapsed:false
    }).addTo(myMap);


    let colors = [
        "#00FF00",
        "#CAFC03",
        "#FCAD03",
        "#FC8403",
        "#FC4903",
        "#FF0000"
    ];

var earthquakeLegend = L.control({position: 'bottomright'});

earthquakeLegend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'legend');
    let intervals = [0, 25, 50, 75, 100, 125];
    for(var i = 0; i < intervals.length; i++) {
        div.innerHTML += `<i style="color:#FFFFFF; background-color: ${colors[i]}">${intervals[i]}${(intervals[i+1] ? " &ndash;" + intervals[i+1] + "</i><br>" : "+")}`
    }
    return div;
};

//Add Legend
earthquakeLegend.addTo(myMap);

}