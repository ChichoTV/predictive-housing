// Weather Code 
function getHWeather(latlon){
    d3.json(`/weatherhour/${latlon}`).then(function(data){
        // console.log(data.properties.periods)
        var xWdate = []
        var yWtemp = []
        var movingMean = []
        data.properties.periods.forEach(i => {yWtemp.push(i.temperature)})
        data.properties.periods.forEach(i => { 
            var dateT = i.startTime.split("-")
            var time = dateT[2].split("T")
            time[2] = time[1].split(":")[1]
            time[1] = time[1].split(":")[0]
            dateT = `-${dateT[0]}-${dateT[1]}-${time[0]} ${time[1]}:00`
            xWdate.push(dateT)

        })
        console.log(data.properties.periods[1].temperature)
        var Htemp = data.properties.periods
        console.log(Htemp.length)
        movingMean[0] = data.properties.periods[0].temperature
        movingMean[1] = data.properties.periods[1].temperature

        movingMean[Htemp.length-1] = data.properties.periods[Htemp.length-1].temperature
        movingMean[Htemp.length-2] = data.properties.periods[Htemp.length-2].temperature

        for(var i = 2; i < Htemp.length -2; i++) {
            var mean =  Math.round(( data.properties.periods[i].temperature +data.properties.periods[i+2].temperature + data.properties.periods[i-1].temperature +  data.properties.periods[i-2].temperature + data.properties.periods[i+1].temperature)/5,2)
            movingMean[i] =mean
        }

        var Wbar = d3.select("#weatherBar").html("")

        var trace = {
            x : xWdate,
            y: yWtemp,
            type: "line",
            name : "Hourly Tempurature"
        }; 
        var trace2 = {
            x: xWdate,
            y: movingMean,
            type: 'line', 
            name : 'Moving 5 Ave. Tempurature'
          };
        console.log(trace2)
        var barData = [trace, trace2]; 

        var layout = {
            title : "Hourly Weather Forecast",
            yaxis : {
                title : "Tempurature (F)"
            },
            xaxis : {
                title : "Time"
            },
            showlegend: true 
        }
        // Plot the graph 
        Plotly.newPlot('weatherBar', barData , layout );
        // Call the next function using the area category  and the user input
        rentalAPI(areaCategory , input)
        // Split up lat and lon then send to map function 
        var lat = latlon.split(",")[0]
        var lon = latlon.split(",")[1]
        createMap(lat , lon)
    })
}


// Weather Code 
function getWeather(latlon){
    d3.json(`/weather/${latlon}`).then(function(data){
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
        getHWeather(LatLon)
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