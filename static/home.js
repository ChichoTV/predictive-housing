


function openMarketData() {
    var userInput = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    window.open("/market?" + userInput)

}

d3.select('#Submit').on('click' , openMarketData);




{/* <form action="">
<label for="NewWindow"></label>
<button onclick="openAmenities()">Amenities</button>
</form> */}