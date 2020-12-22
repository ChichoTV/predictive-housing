var areaCategory = "Z"
// var indicatorCodePrice = 'ZSFH'
var indicatorCodeRental = "ZRISFRR.json"
var indicator = "ZSFH";
// var userInput = "93309"
// Use when working with the index.html page
var userInput = d3.select('#input').node().value;

var userInputHolder;

function handleSubmit(){
    // prevent the page from reloading then grab the value the user input and empty the input value
    d3.event.preventDefault();
    var userInput = d3.select('#input').node().value;
    userInputHolder = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    // kick off other function using the user input
    let MedianRentalPrice = APIRentalCall(userInput);
    let MedianHomeValue = APIHomePriceCall(userInput, indicator);
    let MonthlyMortgagePayment = calculateMortagePayment(MedianHomeValue);
    let MonthlySavings = bestvalue(MonthlyMortgagePayment, MedianRentalPrice); 
    let MoneyGrowthArray = investmentCalculator(MonthlySavings); 
    MakeGraph(MoneyGrowthArray);
    SummaryGraphText(MonthlySavings);
    
}

function APIRentalCall(input){
    var urlRental = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodeRental}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`
    var xhReq1 = new XMLHttpRequest();
    xhReq1.open("GET", urlRental, false);
    xhReq1.send(null);
    var myRentalData = JSON.parse(xhReq1.responseText);
    console.log(myRentalData)
    let medRent = getMedianRentalPrice(myRentalData);
    console.log(medRent);
    document.getElementById("RatesTitle").innerHTML = "Median Monthly Rates"
    document.getElementById("Rent").innerHTML = "The estimated monthly rent in this area is: $<b>" + medRent + "</b>"
    return medRent;
    
}

    
function APIHomePriceCall(input, homeChoiceCode){
    console.log(homeChoiceCode);
    console.log(input);
     
    var url = `/test_new_api/${homeChoiceCode}&${input}`

    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", url, false);
    xhReq.send(null);
    var myHomePriceData = JSON.parse(xhReq.responseText);
    console.log(myHomePriceData);
    let MedPriceHome = getMedianHomePrice(myHomePriceData)
    console.log(MedPriceHome)
    document.getElementById("MedianHomeValue").innerHTML = "The Median Price for a home in this area is: $<b>"+
    MedPriceHome + "</b>"
    return MedPriceHome;
    
}
// Function takes in data from API call
function getMedianHomePrice(Price){
    PriceList = [];
    Price.data.forEach(i => {PriceList.push(i[3]) });
    console.log(PriceList)
    let MedianPrice = d3.median(PriceList);
    console.log(MedianPrice)
    return MedianPrice;
}
function getMedianRentalPrice(Price){
    PriceList = [];
    Price.dataset.data.forEach(i => {PriceList.push(i[1]) });
    console.log(PriceList)
    let MedianPrice = d3.median(PriceList);
    console.log(MedianPrice)
    return MedianPrice;
}

// Assume Loan is for  30 years at 5% interest and calculate mortage payment
// Assume $1200 annual home insurance on 1.1% tax on purchase price
 

function calculateMortagePayment(Value){
    let c = 0.05/12
    let t = 12*30
    let mortgagePayment = (0.90 *Value)*((c*((1+c)**t))/(((1+c)**t)-1));
    let insurance = 1200/12;
    let taxes = (0.90*Value * 0.011)/12
    let MonthlyPayment = Math.round(mortgagePayment + insurance + taxes)
    console.log(MonthlyPayment)
    document.getElementById("Mortgage").innerHTML =
     "The estimated monthly mortgage with 10% downpayment, taxes, and insurance in this area is: $<b>" + 
     MonthlyPayment + "</b>"
    return MonthlyPayment;
}


// Function finds the best value between rent and buying.
function bestvalue(Mortgage, Rent){
let savings = -1
// let Mortgage = calculateMortagePayment() This is wrong right now. 
// let Rent = APIRentalCall(userInput); This is wrong right now. 
if  (Mortgage > Rent){
        savings = Math.round(Mortgage - Rent);
        console.log(`The rent is cheaper by ${savings}`)
        document.getElementById("savingsNumber").innerHTML = "The rent is cheaper by $<b>" + savings + "</b>"
        return savings
        
    }
else{
        savings = Math.round(Rent - Mortgage);
        console.log(`The mortgage is cheaper by ${savings}`)
        document.getElementById("savingsNumber").innerHTML = "The mortgage is cheaper by $<b>" + savings + "</b>"
        return savings
    }
}
// Not working with zipcode input

function investmentCalculator(investment){
    let years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let MoneyGrowth = []
    let rate = 0.04
   
    for (let i = 0 ; i < years.length; i++ ){
        //  Compound Monthly 
        let Compound = investment * (1+(rate/12))**(12*i);
        let PaymentGrowth = investment * ((((1 + (rate/12))**(12*i)) - 1)/(rate/12));
        let money = Compound + PaymentGrowth;
        MoneyGrowth.push(money);
        console.log(money);
    }
    console.log(MoneyGrowth);
    return MoneyGrowth;
    
}

function MakeGraph(MoneyArray){
    x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    y = MoneyArray

    let trace = {
        x : x,
        y : y,
        type: "bar"
    }
    let lineData = [trace];

    let layout = {
        font:{
            family: "Helvetica",
            size: 18,
            // color: "e69138"
        },
        title: "Savings Growth Over Time",
       
        yaxis:{
            title: "Money Saved Over Time"
        },
            
        xaxis:{
            title: "Time in Years",
            },
            

    }
    Plotly.newPlot("Calc_Summary_Graph", lineData, layout)

}
function SummaryGraphText(SavingsAmount){
    document.getElementById("Graph_Summary_Text").innerHTML 
    = "If you were to invest your monthly savings of $<b>" + SavingsAmount + "</b> each monthy with  4% return, this could be your savings over time." 

}

function UpdateZillowSalesURL(){
    window.open(`http://www.zillow.com/homes/${userInputHolder}_rb`, "_blank")
    
}

function UpdateZillowRentURL(){
    window.open(`http://www.zillow.com/homes/for_rent/${userInputHolder}_rb`, "_blank");
    

}

d3.select('#Submit').on('click' , handleSubmit);
d3.select("Rent_Button").on("click", UpdateZillowRentURL);
d3.select("Sales_Button").on("click", UpdateZillowSalesURL);
