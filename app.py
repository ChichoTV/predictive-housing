from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
from sqlalchemy import create_engine
import json
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np
import datetime as dt
import dateutil

engine = create_engine('postgresql://admin2:12345@localhost:5432/Project_2')
connection = engine.connect()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/amenities")
def amenities():
    return render_template("Amenities.html")


@app.route("/homes/<zipcode>")  
def homes(zipcode):
    homes = pd.read_sql(f'select year_structure_built_1939_or_earlier, year_structure_built_1940_to_1949, year_structure_built_1950_to_1959, year_structure_built_1960_to_1969, year_structure_built_1970_to_1979, year_structure_built_1980_to_1989, year_structure_built_1990_to_1999, year_structure_built_2000_to_2009, year_structure_built_2010_to_2013, year_structure_built_2014_or_later, year_structure_built_total from census_2018 where zipcode={zipcode}', connection)
    return homes.to_json() 

@app.route("/sqlsearch/<zipcode>")  
def sqlsearch(zipcode):
    C2018 = pd.read_sql(f'select zipcode, median_age, median_household_income, poverty_rate, lat, lng, city, state_id from census_2018 where zipcode={zipcode}', connection)
    return C2018.to_json() 
@app.route("/regression/<zipcode>")
def regression(zipcode):
    # test api starting at the year 2017 to match the current graphs
    test_url=f'https://www.quandl.com/api/v3/datasets/ZILLOW/Z{zipcode}_ZHVISF?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz'
    response=requests.get(test_url).json()
    try:
        data=response['dataset']['data']
        def pull_price(n):
            return [n[1]]
    # date must be converted to ordinal since its a numeric value which regression requires
        def pull_dates(n):
            return [dt.datetime.strptime(n[0], '%Y-%m-%d').toordinal()]
        dates=list(map(pull_dates,data))
        prices=list(map(pull_price,data))
        y=np.array(prices)
    # grabbing the latest date to be able to predict the next 12 months
        now=dt.datetime.now()
    # utility for adding months to a datetime object
        a_month = dateutil.relativedelta.relativedelta(months=1)
    # making 2 lists, one of the dates as strings, one as ordinals
        next_year_ord=[]
        next_year_strings=[]
        temp=now
        for i in range(12):
            temp=temp+a_month
            next_year_ord.append([temp.toordinal()])
            next_year_strings.append(temp.strftime('%Y-%m-%d'))
        X_train, X_test, y_train, y_test = train_test_split(dates, y, random_state=42)
        model=LinearRegression()
        model.fit(X_train,y_train)
        predictions=model.predict(next_year_ord)
        to_return={}
        for i in range(len(predictions)):
            to_return[next_year_strings[i]]=predictions[i][0]
        return to_return
    except:
        return {}


@app.route("/weather/<latlon>")
def weatherAPI(latlon):
    # Api Call, will be used once for the initial pull then 2 more times to get
    # Daily forecast and then Hourly Forecast
    def weather(url):
        headers = {
            'x-rapidapi-key': "76d2396840mshc562c26618d33a2p1fb1e6jsn95b66aa3ea3c",
            'x-rapidapi-host': "national-weather-service.p.rapidapi.com"
            }

        response = requests.request("GET", url, headers=headers)
        return response 
    # Used to format Forecasted data
    def pullData(item):
        Jsoned = item.json()
        DataFramed = pd.DataFrame(Jsoned["properties"]['periods'])
        return DataFramed 
    # Initial API used to pull down area details using Lat and Lon
    url = f'https://national-weather-service.p.rapidapi.com/points/{latlon}'
    firstPull = weather(url)
    # Format first pull then get API url to call both forecasts 
    info = firstPull.json()
    fore = info['properties']['forecast']
    foreHour= info['properties']['forecastHourly']
    # Pull forecast data
    forecast = weather(fore)
    forecastHour = weather(foreHour)
    # use second definition to format forecast api data 
    forcastDay = pullData(forecast)
    forcast_Hour = pullData(forecastHour)
    # put two dataframes into a sinlge dictionary 
    forecastreturn = {"day": forcastDay, "Hour" : forcast_Hour}
    return  forecastreturn


if __name__ == '__main__':
    app.run(debug=True)