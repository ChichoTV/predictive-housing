


// Weather Code 
function getWeather(latlon){
    d3.json(`/weather/${latlon}`).then(function(data){
        console.log(data.properties.periods.name)
        console.log("Blue Balls")
        d3.select("#name").html("")
        data.properties.periods.forEach(i => {
            if(i.isDaytime){ var isday = 'isDay'} else{isday =  'isNight'}
            document.getElementById('name').innerHTML += `
                <div class="col-xs-8   col-lg-3">
                    <div class="card card-block ${isday} " style="padding: 10px;">
                        <b>${i.name} </b>
                        ${i.temperature} ${i.temperatureUnit} and ${i.shortForecast}
                        <img src = ${i.icon} class="img-rounded card-img" alt="Weather Image">
                        WindSpeed: ${i.windSpeed} ${i.windDirection}
                        <br>
                        
                    </div>
                </div>`
        })
        data.properties.periods.forEach(i => {console.log(i.icon)})
    })
}



var LatLon = window.location.search.slice(1)
// LatLon = "39.21537,-121.20125"
getWeather(LatLon)