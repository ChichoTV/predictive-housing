


function openMarketData() {
    var userInput = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    var userSelection=d3.select('#hometype').node().value;
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
    window.open("/market?" + userInput+","+indicator)

}

d3.select('#Submit').on('click' , openMarketData);




{/* <form action="">
<label for="NewWindow"></label>
<button onclick="openAmenities()">Amenities</button>
</form> */}