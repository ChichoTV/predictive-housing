// Weather Code 
function getWeather(latlon){
    d3.json(`/weatherhour/${latlon}`).then(function(data){
        console.log(data.properties.periods.name)
        console.log("Blue Balls")
        d3.select("#name").html("")
        // data.properties.periods.forEach(i => {})
        data.properties.periods.forEach(i => {console.log(i)})
    })
}


// Weather Code 
function getWeather(latlon){
    d3.json(`/weather/${latlon}`).then(function(data){
        console.log(data.properties.periods.name)
        console.log("Blue Balls")
        d3.select("#name").html("")
        data.properties.periods.forEach(i => {
            if(i.isDaytime){ var isday = 'isDay'} else{isday =  'isNight'}
            var date = i.startTime.split("T")
            date = date[0].split("-")
            date = `${date[1]}-${date[2]}`
            document.getElementById('name').innerHTML += `
                <div class="col-xs-8   col-lg-3">
                    <div class="card card-block ${isday} " style="padding: 10px;">
                        <h2><b>${date} 
                        <br>${i.name} 
                        </br>${i.temperature} ${i.temperatureUnit} and ${i.shortForecast}</b></h2>
                        <img src = ${i.icon} class="img-rounded card-img" alt="Weather Image">
                        WindSpeed: ${i.windSpeed} ${i.windDirection}
                        <br>
                    </div>
                </div>`
        })
        data.properties.periods.forEach(i => {console.log(i.icon)})
        var lat = latlon.split(",")[0]
        var lon = latlon.split(",")[1]
        createMap(lat , lon)
    })
}

function createMap(latitude , longitude){
    // add 1 to counter for if statement. If statement deletes old searched map and generates id for new map to be linked to
    count = 1 + count 
    if (count > 1 ){
        map.remove()
        document.getElementById('AContianerMap').innerHTML ="<div id='map' style='height: 400px;'    ></div>" ;
    }
    // Create streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 50,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1Ijoiam9yZGFudSIsImEiOiJja2dyYjN0MGowMHZ5MnVuenR0ZG8weHl2In0.wlCzpVVa_PgxzWRK2s2rRA"

    // accessToken: API_KEY
    });
    // Creates map for layers to be placed on. 
    var myMap = L.map("map", {
    center: [
        latitude , longitude

        ],
    zoom: 12
    });
    // Add street layer to map 
    streetmap.addTo(myMap)
    
}

var LatLon = window.location.search.slice(1)
// LatLon = "39.21537,-121.20125"
getWeather(LatLon)