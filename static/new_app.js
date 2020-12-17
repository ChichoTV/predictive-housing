var areaCategory = "Z";
var indicatorCodeRental = "ZRISFRR.json";
function on_submit(){
    d3.event.preventDefault();
    // grabbing zip code from search
    var userInput = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    // console.log(userInput);
    // user selects hometype from the dropdown menu
    var userSelection=d3.select('#hometype').node().value;
    // based on the user selection we will use a switch statement to choose the right indicator code for the API
    var indicator='';
    switch (userSelection){
        case '1 Bedroom':
            indicator='Z1BR';
            break;
        case '2 Bedroom':
            indicator='Z2BR';
            break;
        case '3 Bedroom':
            indicator='Z3BR';
            break;
        case '4 Bedroom':
            indicator='Z4BR';
            break;
        case '5+ Bedrooms':
            indicator='Z5BR';
            break;
    }
    console.log(indicator);
    var url = `/test_new_api/${indicator}&${userInput}`
    d3.json(url).then(function (pulled) {
        // create lists and push the data to the list
        console.log(pulled)
        var xprice = []
        var ydate = []
        pulled.data.forEach(i => { ydate.push(i[2]) });
        pulled.data.forEach(i => { xprice.push(i[3]) });
        // Write the name of the API pull above the bar graph
        var barT = d3.select('#barText').html("")
        // barT.append("h4").attr("class","well").text(pulled.datatable.name)
        // create a trace for the houing graph
        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar',
            name: '2017-2020'
        };
        // group the data 
        var barData = [trace];

        // Create the layout, adding in range to make easier to compare 
        var layout = {
            title : "House Price",
            yaxis : {
                title : "Price of House" ,
                range : [ d3.min(xprice) -d3.min(xprice) *.01 , d3.max(xprice) +d3.min(xprice) *.1]
            },
            xaxis : {
                title : "Years"
            }
        };
        // Plot the graph 
        Plotly.newPlot('bar', barData , layout );
        // Call the next function using the area category  and the user input
    })

    var redline = d3.select("#Redline").html("").append("h4").attr("class","well").text('The red line represents the median household income divided by 12(for months) and then divided by 3, because a good rule of thumb is to not spend more than one third of your monthly income on rent')
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${userInput}_${indicatorCodeRental}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`
    // API call to grab the rental data then creating the graph
    d3.json(url).then(function (pulled) {
        // create lists and push the data to the list
        var xprice = []
        var ydate = []
        pulled.dataset.data.forEach(i => { ydate.push(i[0]) });
        pulled.dataset.data.forEach(i => { xprice.push(i[1]) });
        // Write the name of the API pull above the bar graph
        var barT = d3.select('#gaugeText').html("")
        barT.append("h4").attr("class","well").text(pulled.dataset.name)
        // create a trace for the houing graph
        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar'
        };
        // group the data 
        var barData = [trace];

            // Create a line on the graph to show the monthly amount people should be paying for rent( pay / 3) 
            // Use the SQL search to find the median household income
        d3.json(`/sqlsearch/${userInput}`).then(function(data){

            var info1 = data
            // divide the income by 12 for months then by 3, a good rule of thumb is dont spend more than 1/3 of your income fo housing
            var medIncome = (info1.median_household_income[0]/12)/3
            // create the line 
            var hline = {
                type : "line", 
                xref : 'paper', 
                x0 : 0, 
                x1 : 1, 
                y0 : medIncome, 
                y1 : medIncome,
                line : {
                    color: 'rgb(255, 0, 0)',
                    width: 4,
                    dash:'dot'
                }
            } 
        // Find the min and the max values, we want to include the line 
        var minRent = d3.min(xprice)
        if (medIncome < minRent ){
            var minRentRange = medIncome - (medIncome *.01)
        }
        if (medIncome> minRent){
            var minRentRange = minRent  -(minRent * .01)
        }
        var maxRent = d3.max(xprice)
        if (medIncome > maxRent ){
            var maxRentRange = medIncome + (medIncome *.01)
        }
        if (medIncome < maxRent){
            var maxRentRange = maxRent + (maxRent * .01)
        }
        // Create the layout, adding in range to make easier to compare 
        var layout = {
            shapes : [hline], 
            title : "Rental Index",
            yaxis : {
                title : "Rental Price" ,
                range : [ minRentRange, maxRentRange]
            },
            xaxis : {
                title : "Years"
            }
        };
        // plot the graph 
        Plotly.newPlot('gauge', barData , layout );
    })
    })

}
d3.select('#Submit').on('click' , on_submit);