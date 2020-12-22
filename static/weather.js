// Reload Page 
function handleSubmit(){
    d3.event.preventDefault();
    var input = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    getGEO(input)
}

function getGEO(input){
    console.log(input)
    // grab 2018 cencus data
    d3.json(`/sqlsearch/${input}`).then(function(data){
        var info2 = data
        console.log(data)
        globalLat = info2.lat[0]
        globalLon = info2.lng[0]
        var both = globalLat+","+ globalLon
        console.log(both)
        console.log("CAUSE DRAMA")

        getWeather(both)
    })
}

function reloadAmen(geo) {
    console.log(geo)
    if( geo){
        window.location.reload("/amenity?" + geo)
    }
    // window.open("/amenity?39.21537,-121.20125" )
    
}

// Weather Code 
function getHWeather(latlon){
    d3.json(`/weatherhour/${latlon}`).then(function(data){
        console.log("HOUR")
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
        var Htemp = data.properties.periods
        movingMean[0] = data.properties.periods[0].temperature
        movingMean[1] = data.properties.periods[1].temperature

        movingMean[Htemp.length-1] = data.properties.periods[Htemp.length-1].temperature
        movingMean[Htemp.length-2] = data.properties.periods[Htemp.length-2].temperature

        // for(var i = 2; i < Htemp.length -2; i++) {
        //     var mean =  Math.round(( data.properties.periods[i].temperature +data.properties.periods[i+2].temperature + data.properties.periods[i-1].temperature +  data.properties.periods[i-2].temperature + data.properties.periods[i+1].temperature)/5,2)
        //     movingMean[i] =mean
        // }

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
        var barData = [trace]; 

        var layout = {
            title : "Hourly Weather Forecast",
            yaxis : {
                title : "Tempurature (F)"
            },
            xaxis : {
                title : "Time"
            },
            showlegend: false 
        }
        // Plot the graph 
        Plotly.newPlot('weatherBar', barData , layout );
        // Call the next function using the area category  and the user input
        // Split up lat and lon then send to map function 
        var lat = latlon.split(",")[0]
        var lon = latlon.split(",")[1]
        console.log("Printing CREATE MAP ", lat , lon)
        createMap(lat , lon)
    })
}


// Weather Code 
function getWeather(latlon){
    d3.json(`/weather/${latlon}`).then(function(data){
        console.log(data.properties.periods[9].icon)
        d3.select("#name").html("")
        data.properties.periods.forEach(i => {
            if(i.isDaytime){ var isday = 'isDay'} else{isday =  'isNight'}
            var date = i.startTime.split("T")
            date = date[0].split("-")
            date = `${date[1]}-${date[2]}`
            document.getElementById('name').innerHTML += `
                <div class="boarder rounded col-xs-8   col-lg-3">
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
        getHWeather(latlon)
    })
}

// var streetmap;
let WetherM
function createMap(latitude , longitude){
    // add 1 to counter for if statement. If statement deletes old searched map and generates id for new map to be linked to
    count = 1 + count 
    // d3.select("#imap").html("")
    d3.select('#imap').attr('class','Wborders')
    if (count > 1 ){
        // WetherM.setView(new L.LatLng(latitude, longitude), 8);
        imap.remove()
        document.getElementById('AContianerMap').innerHTML ="<div id='imap' class='Wborders' style=' height: 500px; max-width: 1000;' ></div>" ;
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
    WetherM = L.map("imap", {
    center: [
        latitude , longitude

        ],
    zoom: 12
    });
    // Add street layer to map 
    streetmap.addTo(WetherM)
    
}

var count = 0
var LatLon = window.location.search.slice(1)
// LatLon = "39.21537,-121.20125"
getWeather(LatLon)




d3.select('#WSubmit').on('click' , handleSubmit);

