// var homePrice = $("#HomePrice").node.value()

// console.log(homePrice)
// var downPayment = $("#DownPayment").val();
// var interestRate = $("#Interest").val();
// var mortgagePeriod = getSelectedOption("SelectTerm")
// console.log(mortgagePeriod);
var homePrice = 150000
console.log(homePrice)
var downPayment = 12000
var interestRate = 3.5
var mortgagePeriod = 15

// function MortgageCalculator(){
    let i = (interestRate/100)/12;
    let t = mortgagePeriod*12;
    let Value = homePrice - downPayment;
    let mortgagePayment = (Value)*((i*((1+i)**t))/(((1+i)**t)-1));
    // document.getElementById("Monthly_Mortgage").innerHTML=`The monthly mortgage payment is: ${mortagePayment}`;
    console.log(mortgagePayment)
    // return mortgagePayment;


// }
// MortgageCalculator();

// function getSelectedOption(selectID){
//     let htmlElement = document.getElementById(selectID);
//     for (let i = 0; i < htmlElement.options.length; i++){
//         let option = htmlElement.options[i];
//         if(option.selected == true){
//             return option;
//         }
//     }
//     return null
// }


// d3.select("#MortgageCalc_Button").on("click", MortgageCalculator)