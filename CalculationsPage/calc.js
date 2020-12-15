var areaCategory = "Z"
var indicatorCodePrice = 'ZHVISF'
var indicatorCodeRental = "ZRISFRR.json"
// var userInput = "93309"
// Use when working with the index.html page
var userInput = d3.select('#input').node().value;
// var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodePrice}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`
// var urlRental = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodeRental}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`

function handleSubmit(){
    // prevent the page from reloading then grab the value the user input and empty the input value
    d3.event.preventDefault();
    var userInput = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    // kick off other function using the user input
    let MedianRentalPrice = APIRentalCall(userInput);
    let MedianHomeValue = APIHomePriceCall(userInput);
    let MonthlyMortgagePayment = calculateMortagePayment(MedianHomeValue);
    let MonthlySavings = bestvalue(MonthlyMortgagePayment, MedianRentalPrice); 
    let MoneyGrowthArray = investmentCalculator(MonthlySavings) 
    MakeGraph(MoneyGrowthArray) 
    SummaryGraphText(MonthlySavings)
}

d3.select('#Submit').on('click' , handleSubmit);

function APIRentalCall(input){
    var urlRental = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodeRental}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`
    var xhReq1 = new XMLHttpRequest();
    xhReq1.open("GET", urlRental, false);
    xhReq1.send(null);
    var myRentalData = JSON.parse(xhReq1.responseText);
    let medRent = getMedianPrice(myRentalData);
    console.log(medRent);
    document.getElementById("Rent").innerHTML = "The estimated monthly rent in this area is: $<b>" + medRent + "</b>"
    return medRent;
   
}

function APIHomePriceCall(input){
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodePrice}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`

    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", url, false);
    xhReq.send(null);
    var myHomePriceData = JSON.parse(xhReq.responseText);
    // console.log(myHomePriceData);
    let MedPriceHome = getMedianPrice(myHomePriceData)
    // console.log(MedPriceHome)
    return MedPriceHome;
    
}
// Function takes in data from API call
function getMedianPrice(Price){
    PriceList = [];
    Price.dataset.data.forEach(i => {PriceList.push(i[1]) });
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
    document.getElementById("Mortgage").innerHTML = "The estimated monthly mortgage with 10% downpayment, taxes, and insurance in this area is: $<b>" + MonthlyPayment + "</b>"
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
        title: "Savings Growth Over Time",
        yaxis:{
            title: "Growth of Money Invested"
        },
        xaxis:{
            title: "Time in Years"
        }

    }
    Plotly.newPlot("Calc_Summary_Graph", lineData, layout)

}
function SummaryGraphText(SavingsAmount){
    document.getElementById("Graph_Summary_Text").innerHTML 
    = "If you were to invest your monthly savings of $<b>" + SavingsAmount + "</b> each monthy with  4% return, this could be your savings over time." 

}


