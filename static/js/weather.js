// Reload Page 
function handleSubmit(){
    // Prevent reloading
    d3.event.preventDefault();
    // Grab value from user and send to get lat & lon from census
    var input = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    if(input == "Mohan"){
        return ReloadMohan()
    } 
    if(input == "Esme"){
        return ReloadEsme()

    } else{
        getGEO(input)
    }
    
}

// Grab lat and lon from census data 
function getGEO(input){
    // grab 2018 cencus data
    d3.json(`/sqlsearch/${input}`).then(function(data){

        var info2 = data
        // get lat and lon out of Json and then group for Weather api
        globalLat = info2.lat[0]
        globalLon = info2.lng[0]
        var both = globalLat+","+ globalLon
        // send to weather api
        getWeather(both)
    })
}

// Weather API call 
function getHWeather(latlon){
    // Grab from flask app 
    d3.json(`/weatherhour/${latlon}`).then(function(data){
        // create variable and load variable from api
        console.log(data)
        var xWdate = []
        var yWtemp = []
        data.properties.periods.forEach(i => {yWtemp.push(i.temperature)})
        data.properties.periods.forEach(i => { 
            var dateT = i.startTime.split("-")
            var time = dateT[2].split("T")
            time[2] = time[1].split(":")[1]
            time[1] = time[1].split(":")[0]
            dateT = `-${dateT[0]}-${dateT[1]}-${time[0]} ${time[1]}:00`
            xWdate.push(dateT)
        })
        // build trace  data array and layout
        var trace = {
            x : xWdate,
            y: yWtemp,
            type: "line",
            name : "Hourly Tempurature"
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


// Weather  Forecast api call 
function getWeather(latlon){
    d3.json(`/weather/${latlon}`).then(function(data){
        // clear name id on HTML
        d3.select("#name").html("")
        // go through to grab each period
        data.properties.periods.forEach(i => {
            // change background color of cards 
            if(i.isDaytime){ var isday = 'isDay'} else{isday =  'isNight'}
            // format the date 
            var date = i.startTime.split("T")
            date = date[0].split("-")
            date = `${date[1]}-${date[2]}`
            // build the cards that will hold the weather information 
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
        InfoW(latlon)
    })
}

// Place name of area in header 
function InfoW(LL){
    d3.json(`/weatherinfo/${LL}`).then(function(data){
        console.log(data.properties.relativeLocation.properties.city)
        d3.select('#AmenHead').html("").text(`Weather in the ${data.properties.relativeLocation.properties.city} Area`)
        d3.select('#fore').html("").text(`7 Day   Weather Forecast for ${data.properties.relativeLocation.properties.city}`)
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

// activate new search for the page 
d3.select('#WSubmit').on('click' , handleSubmit);



function ReloadEsme(){
    document.getElementById('Surprise').innerHTML = `
    <div class="topnav">
    <a class="active" href="/">Home</a>
    <a href="/calculation">Investment Calculator</a>
    <a href="/mortgage">Mortgage Calculator</a>
    <a href="/amenity">Amenities</a>
    <a href="/about">About</a>
  </div>
    <div class="row">
          <div class="col-md-12 jumbotron text-center" style="background-image: url(https://tse4.mm.bing.net/th?id=OIP.8QgHF_QxuxhVJzKiD-03NwHaEK&pid=Api&P=0&w=338&h=191); background-size: 100% 100%;" >
            <h1  id="AmenHead" style="color: ivory;">This Year sent us so many Curves and We Just want to Thank ....</h1>
            <p style="color: yellow; font-size: 100px;"> <b>Esme</b>  </p>
          </div>
        </div>
        <div class = "row" style = "padding: 25px;">
          <div class="col-md-2">
            <div class="well">
              <form action="">
                <label for="userinput" id="searchLabel"><h3>Type Esme  </h3></label><br>
                <input type="text" id="input" style='width: 100px' placeholder="Esme"><br><br>
                <input id="WSubmit" type="submit" value="Esme Results">
              </form>
              <br>
            </div>
          </div>
          <div class="jumbotron-fluid col-md-8 " style="margin-left: 25px;" >
            <h2 id="fore" style="background-color: blanchedalmond; text-align: center; border :  5px inset burlywood ">5 Thankful people for Esme</h2>
            <div id="name" class="row flex-nowrap inpageScroll tile-div">
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEzdAVdSFaTxg/profile-displayphoto-shrink_200_200/0/1583344439841?e=1614211200&v=beta&t=PVUNT_RYF1npJS6nid6akVqgHo10y2gyk-kU6ym-ljE" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for all your help throughout the class and in tutoring. I appreciate all you did for us." -Michael  </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEcrxwErYfQMg/profile-displayphoto-shrink_200_200/0/1588639219983?e=1614211200&v=beta&t=qlbGy4MWbsqiekD5zc-6r7xMydbxMFWHZEnuBuyMNVo" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for helping out during class, you were very knowledgeable and helpful when I was stuck on a problem" -Nathan    </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQGoffeXdkJpCw/profile-displayphoto-shrink_200_200/0/1593362621589?e=1614211200&v=beta&t=jQXS0eBuaHr2KGyqll-l2rMu7osHuqOHszbwSC3QOys" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Truly a fabulous learning experience. Thank you for your support and encouragement!"  -Rachel   </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEv2sxRNhFTkA/profile-displayphoto-shrink_200_200/0/1573107319746?e=1614211200&v=beta&t=1yoVS2ssZSUJXRpUz8zTY52p0Vf19nRjufIhWOViJkA" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for always being a helping hand in class and taking the time to make sure we are all on track." -Kruti    </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5635AQHLsVYr6yXsmA/profile-framedphoto-shrink_200_200/0/1607534565980?e=1608858000&v=beta&t=VEkgAgzzsPg3oIB8ivigWShGwMoNC5GtycjH9ATvMRk" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Man I can't think of anything. Maybe just put that" -Taylor   </b></div>
                </div>
            </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12"   >
              <h1 style="max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; text-align: center; color: white; background-color:black;"> Esme: Teacher Assistant of the Year!</h1>
            <img  src="https://media-exp1.licdn.com/dms/image/C5603AQG5v9Cj0Nu9aw/profile-displayphoto-shrink_200_200/0/1591250638706?e=1614211200&v=beta&t=8UQ2H5E7RHzdPotwJNdcX3Zw8tOse_d9IoiFvrcWO_I" alt="" style = "max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; border : 10px inset yellowgreen;">
            <h1 style="max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; text-align: center; color: white; background-color:black;"> Esme, a teacher's assistant who shows up during a pandemic. You can count on her to show up even if she moves mid semester. </h1>

            </div>
  
          </div>
            <div class="row">
            <div class="jumbotron-fluid col-md-8 " style="  margin: auto; width: 75%; padding: 10px;" >
                <h2 id="fore" style="background-color: blanchedalmond; text-align: center; border :  5px inset burlywood ">7 Forecast of Esme</h2>
                <div id="name" class="row flex-nowrap inpageScroll tile-div">
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://media-exp1.licdn.com/dms/image/C5603AQG5v9Cj0Nu9aw/profile-displayphoto-shrink_200_200/0/1591250638706?e=1614211200&v=beta&t=8UQ2H5E7RHzdPotwJNdcX3Zw8tOse_d9IoiFvrcWO_I" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Professional Esme   </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.xRRYuBZ76d2mRbJ4V8PrSQHaHm%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Esme Relaxing  </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.NQwL0byHVhjThJqkWBLwUwHaEm%26o%3D6%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b>  Esme Christmasing  </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.-_5DIy3pJagdsTdtEsmAUQHaLG%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Esme in her new job </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.4wk4V-wYXFP5ESLzNcqXwwHaEo%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Esme using time to find herself  </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.qR8zWtkJugP-jBJNb46R7QHaFb%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Esme Traveling   </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.GiK7gyJ_HojZyHWQogr7IwHaD4%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b>  Esme Missing the Class  </b></div>
                    </div>
                </div>
                </div>
              
        </div>
        <div class="row">
          <div class="col-md-12"   >
          <img  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.GiK7gyJ_HojZyHWQogr7IwHaD4%26pid%3DApi&f=1" alt="" style = "max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; border : 10px inset yellowgreen;">

          </div>

        <div class="row">
          <div class="col-md-12 ">
            <div id="weatherBar" style=" max-height: 500px; max-width: 2000;">
            </div>
            
          </div>
        </div>
        <div class="row "> 
          <div id = "AContianerMap" class="col-md-12 ">
            <div id="imap" style=" height: 500px; max-width: 1000;"></div>
          </div>
        </div>
      </div>
    `
}

function ReloadMohan(){
    document.getElementById('Surprise').innerHTML = `
    <div class="topnav">
    <a class="active" href="/">Home</a>
    <a href="/calculation">Investment Calculator</a>
    <a href="/mortgage">Mortgage Calculator</a>
    <a href="/amenity">Amenities</a>
    <a href="/about">About</a>
  </div>
    <div class="row">
          <div class="col-md-12 jumbotron text-center" style="background-image: url(https://tse4.mm.bing.net/th?id=OIP.8QgHF_QxuxhVJzKiD-03NwHaEK&pid=Api&P=0&w=338&h=191); background-size: 100% 100%;" >
            <h1  id="AmenHead" style="color: ivory;">This Year sent us so many Curves and We Just want to Thank ....</h1>
            <p style="color: ivory;">Mohan Mohan Mohan Mohan </p>
          </div>
        </div>
        <div class = "row" style = "padding: 25px;">
          <div class="col-md-2">
            <div class="well">
              <form action="">
                <label for="userinput" id="searchLabel"><h3>Type Mohan  </h3></label><br>
                <input type="text" id="input" style='width: 100px' placeholder="Mohan"><br><br>
                <input id="WSubmit" type="submit" value="Mohan Results">
              </form>
              <br>
            </div>
          </div>
          <div class="jumbotron-fluid col-md-8 " style="margin-left: 25px;" >
            <h2 id="fore" style="background-color: blanchedalmond; text-align: center; border :  5px inset burlywood ">4 Thankful people for Mohan</h2>
            <div id="name" class="row flex-nowrap inpageScroll tile-div">
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEzdAVdSFaTxg/profile-displayphoto-shrink_200_200/0/1583344439841?e=1614211200&v=beta&t=PVUNT_RYF1npJS6nid6akVqgHo10y2gyk-kU6ym-ljE" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for showing me how fun coding can be and encouraging us to pursue our goals." -Michael  </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEcrxwErYfQMg/profile-displayphoto-shrink_200_200/0/1588639219983?e=1614211200&v=beta&t=qlbGy4MWbsqiekD5zc-6r7xMydbxMFWHZEnuBuyMNVo" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for all that you did in the class, you made the learning experience fun and easy... easier." -Nathan    </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQGoffeXdkJpCw/profile-displayphoto-shrink_200_200/0/1593362621589?e=1614211200&v=beta&t=jQXS0eBuaHr2KGyqll-l2rMu7osHuqOHszbwSC3QOys" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for making my first coding experience interesting, fun, and relevant.  Kawhi Leonard for life!" -Rachel   </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5603AQEv2sxRNhFTkA/profile-displayphoto-shrink_200_200/0/1573107319746?e=1614211200&v=beta&t=1yoVS2ssZSUJXRpUz8zTY52p0Vf19nRjufIhWOViJkA" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Thank you for being so enthusiastic and more than willing to help us out then we need it."  -Kruti    </b></div>
                </div>
                <div class="col-3 ">
                    <div class="card card-block isDay" style="padding: 10px;">
                  <img src="https://media-exp1.licdn.com/dms/image/C5635AQHLsVYr6yXsmA/profile-framedphoto-shrink_200_200/0/1607534565980?e=1608858000&v=beta&t=VEkgAgzzsPg3oIB8ivigWShGwMoNC5GtycjH9ATvMRk" class="img-rounded card-img" alt="Weather Image">
                  <br>
                  <b> "Man I can't think of anything. Maybe just put that" -Taylor   </b></div>
                </div>
            </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12"   >
              <h1 style="max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; text-align: center; color: white; background-color:black;"> Mohan: Teacher of the Year!</h1>
            <img  src="https://media-exp1.licdn.com/dms/image/C5603AQEFemBpJfRcxQ/profile-displayphoto-shrink_200_200/0/1585609719238?e=1614211200&v=beta&t=rkGu6fGAYRO4GjwGtVPMbzbJhKi5htE5Q2KrFMCOIl8" alt="" style = "max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; border : 10px inset yellowgreen;">
            <h1 style="max-width: 1000px; margin: auto; width: 75%; padding: 10px; display: block; text-align: center; color: white; background-color:black;"> Mohan, a teacher who cares and will fight for your right to get more office hours. A teacher Kahai Lenard would aprove of. </h1>

            </div>
  
          </div>
            <div class="row">
            <div class="jumbotron-fluid col-md-8 " style="  margin: auto; width: 75%; padding: 10px;" >
                <h2 id="fore" style="background-color: blanchedalmond; text-align: center; border :  5px inset burlywood ">7 Forecast of Mohan</h2>
                <div id="name" class="row flex-nowrap inpageScroll tile-div">
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://media-exp1.licdn.com/dms/image/C5603AQEFemBpJfRcxQ/profile-displayphoto-shrink_200_200/0/1585609719238?e=1614211200&v=beta&t=rkGu6fGAYRO4GjwGtVPMbzbJhKi5htE5Q2KrFMCOIl8" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Professional Mohan   </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.6RtfM-Eba7Qm6dqU2jt1RQHaE8%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Mohan Golfing  </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.pdWDzM0f64KkN13XrdwV2gHaFj%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b>  Mohan Relaxing  </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.rSRri9OwWZadFuTqS9lVUwHaEK%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Mohan Scoring BasketBall Points </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.zRSRowGuEq9eBc413yQeBgHaEK%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Kahai Lenard  </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.XvZ0s_EX9WLyx0HLluIUmwHaFX%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b> Mohan Watching the Clippers   </b></div>
                    </div>
                    <div class="col-3 ">
                        <div class="card card-block isDay" style="padding: 10px;">
                      <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.eUc8fNSVlnZl6tDTDnWiWwAAAA%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                      <br>
                      <b>  Mohan Missing the Class  </b></div>
                    </div>
                </div>
                </div>
                <div class="jumbotron-fluid col-md-8 " style="  margin: auto; width: 75%; padding: 10px;" >
                    <h2 id="fore" style="background-color: blanchedalmond; text-align: center; border :  5px inset burlywood ">A Search for Bob:</h2>
                    <div id="name" class="row flex-nowrap inpageScroll tile-div">
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.jdaRL1RdT4YLXYONtF8rlQHaL3%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b>  Is this Bob  </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wUW4L2vBHLQcg9kloMHtIQHaKX%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Nbvvm3qjzmwZoV0mPMkXoAHaE8%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.lazoDI2Uz4JWicbTibxwkwHaEY%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.0Ql-FQIsy3ImQea0jTKBjgHaEo%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.U1G-aWZixBgnfx5xQ2POcwHaFv%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.DJR5MbVm1Ev622UADcNC7QHaDt%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.e3TJGQ2hRr-5Oxx26hZaqAHaJQ%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.9SIGwu-jome9HNpfhlOtdQHaKB%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.q0rKe_Fh6cEn-0Nq78icJgHaHI%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                        <div class="col-3 ">
                            <div class="card card-block isDay" style="padding: 10px;">
                          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.2DYZaijXY8TaCvqcqRJqPgHaEK%26pid%3DApi&f=1" class="img-rounded card-img" alt="Weather Image">
                          <br>
                          <b> Or is this Bob?   </b></div>
                        </div>
                    </div>
                    </div>
        </div>

        <div class="row">
          <div class="col-md-12 ">
            <div id="weatherBar" style=" max-height: 500px; max-width: 2000;">
            </div>
            
          </div>
        </div>
        <div class="row "> 
          <div id = "AContianerMap" class="col-md-12 ">
            <div id="imap" style=" height: 500px; max-width: 1000;"></div>
          </div>
        </div>
      </div>
    `
    }
