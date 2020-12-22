
// Hard coding practice values. 
// var downPayment = 12000
// var interestRate = 3.5
// var mortgagePeriod = getSelectedOption(SelectTerm);

function MortgageCalculator(){
    let homePrice = $("#HomePrice").val()
    let downPayment = $("#DownPayment").val();
    let interestRate = $("#Interest").val();
    let mortgagePeriod = formatOption();
    let i = (interestRate/100)/12;
    let t = mortgagePeriod*12;
    let Value = homePrice - downPayment;
    let mortgagePayment = (Value)*((i*((1+i)**t))/(((1+i)**t)-1));
    let insurance = $("#HomeInsurance").val()/12
    let taxRate = $("#PropertyTax").val();
    let taxes = ((taxRate/100)*homePrice)/12;
    let MonthlyPayment = Math.round(mortgagePayment + insurance + taxes)
    document.getElementById("Monthly_Mortgage").innerHTML=`The monthly mortgage payment is: $${MonthlyPayment}`;
    console.log(MonthlyPayment)
    makeGraph();
    return MonthlyPayment;
}

function formatOption(){
    let term = getSelectedOption("SelectTerm");
    let answer = term.value;
    let finalAnswer = parseInt(answer)
    console.log(term);
    console.log(answer);
    console.log(typeof answer);
    console.log(typeof finalAnswer)
    return finalAnswer
}
function getSelectedOption(selectID){
    let htmlElement = document.getElementById(selectID);
    for (let i = 0; i < htmlElement.options.length; i++){
        let option = htmlElement.options[i];
        if(option.selected == true){
            return option;
        }
    }
    return null
}
function makeGraph(){
    let homePrice = $("#HomePrice").val()
    let downPayment = $("#DownPayment").val();
    let interestRate = $("#Interest").val();
    let mortgagePeriod = formatOption();
    let i = (interestRate/100)/12;
    let t = mortgagePeriod*12;
    let Value = homePrice - downPayment;
    let mortgagePayment = Math.round((Value)*((i*((1+i)**t))/(((1+i)**t)-1)));
    let insurance = Math.round($("#HomeInsurance").val()/12)
    let taxRate = $("#PropertyTax").val();
    let taxes = Math.round(((taxRate/100)*homePrice)/12);
    console.log("hi")
    let graph_values = [mortgagePayment, insurance, taxes]
    let graph_labels = ["Mortgage", "Homeonwer's Insurance", "Property Taxes"]
    let trace = {
        values: graph_values,
        labels: graph_labels,
        name: "Monthly Payment Breakdown",
        hoverinfo: 'value+label',
        hole: .4,
        type: "pie"
    }
    var graphdata= [trace]
    Plotly.newPlot("piechart",graphdata)
}



d3.select("#MortgageCalc_Button").on("click", MortgageCalculator)