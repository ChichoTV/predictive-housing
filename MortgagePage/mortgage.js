
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
    let taxes = (($("#PropertyTax").val()/100)* Value)/12
    let MonthlyPayment = Math.round(mortgagePayment + insurance + taxes)
    document.getElementById("Monthly_Mortgage").innerHTML=`The monthly mortgage payment is: ${MonthlyPayment}`;
    console.log(MonthlyPayment)
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




d3.select("#MortgageCalc_Button").on("click", MortgageCalculator)