# HousingVSRental
In this Project we wanted to create a website to visualize housing data within the entire US. This application can be accessed at the following link: https://predictive-housing.herokuapp.com/ (The application itself runs off of the 'clean' branch of ths repository).

First we used Jupyter Notebook to run an API query through the US Census sight to get the most recent (2018) census data. We also used Jupyter for cleaning up Zillow data we needed to store to use their API. We then saved these datasets as CSV files and created a public AWS RDS server to house the data. 

HOME PAGE:

We then started on our JavaScript and created multiple functions to create and display our data.
The user is able to enter a zip code for anywhere in the US and find the data we pulled.
We make an API call to Zillow in real time to obtain Marked data on the Home Value Index by zipcode and the Rental index in order to viualize what areas may be better to buy in vs rent in. This was displayed using Plotly as bar graphs. 
At the same time a call is made to our SQL server based on the ZipCode entered to display key market data for the area to display in our Market Highlights box as well as generate a pie chart below the map to show the number of house built in that zip code in various year ranges. 
Lastly to comply with Zillow's terms of using thier API we created a button with JQuery that when clicked, routes you to the Zillow website. 

INVESTMENT PAGE:
This page is designed to help the user determine whether renting or purchasing will be more cost effective in the long run. The user enters a zipcode and the page updates with estimated monthly rent, median home price, and estimated monthly payments on a mortgage (with assumptions). As well, after determining which option is more effective, a graph will update showing savings growth over time if that monthly savings were to be invested. Lastly, the links at the bottom capture the zipcode that was entered to link directly to a zillow search of the same zipcode.

MORTGAGE PAGE:

WEATHER PAGE:


Contributers: Michael Munson, Nathan Ashbough, Taylor Vought, Rachel Harless, Kruti Gandhi
UC Davis BootCamp 2020
