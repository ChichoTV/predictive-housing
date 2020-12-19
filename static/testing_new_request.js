var areaCategory = "Z";
var indicatorCodeRental = "ZRISFRR.json";
var indicator;
var userInput;
var userSelection;
function on_submit(){
    d3.event.preventDefault();
    userInput = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    userSelection = d3.select('#hometype').node().value;
    let pulled_data = Sales_API_Call(userInput);
    BuildSalesGraph(pulled_data);
    linear_regression(indicator,userInput);
}
function Sales_API_Call(input){
    // grabbing zip code from search
    // console.log(userInput);
    // user selects hometype from the dropdown menu
    // based on the user selection we will use a switch statement to choose the right indicator code for the API
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
    // var original_url = `/test_new_api/${indicator}&${input}`
    var xhReq1 = new XMLHttpRequest();
    xhReq1.open("GET", url, false);
    xhReq1.send(null);
    var pulledData = JSON.parse(xhReq1.responseText);
    console.log(pulledData);
    return pulledData;
}
function BuildSalesGraph(pulled){
        var xprice = []
        var ydate = []
        pulled.data.forEach(i => { ydate.push(i[2]) });
        pulled.data.forEach(i => { xprice.push(i[3]) });
        // Write the name of the API pull above the bar graph
        var barT = d3.select('#barText').html("")
        barT.append("h4").attr("class","well").text(`Zillow Median Price - ${userSelection} - ${userInput}`)
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

}
function linear_regression(ind,zip){
    d3.json(`/regression/${ind}&${zip}`).then(function (predictions){
        console.log(predictions)
        predicted_data=Object.values(predictions)
        predicted_years=Object.keys(predictions)
        var trace = {
            x : predicted_years,
            y : predicted_data,
            type : 'bar',
            name:'Predicted Values'
        };
        barData=[trace]
        Plotly.addTraces('bar', trace);
    })
}

d3.select('#Submit').on('click' , on_submit);