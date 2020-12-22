function getchoice(){
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
