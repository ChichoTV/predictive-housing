from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
import numpy as np
import dateutil
import datetime as dt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

engine = create_engine('postgresql://MasterUser:Bootcamp123@predictivehousingvsrental.cx0mfruhncd6.us-east-2.rds.amazonaws.com:5432/postgres')
connection = engine.connect()
Base=automap_base()
Base.prepare(engine,reflect=True)
regions=Base.classes.regions
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculation")
def calc():
    return render_template("calculation.html")

@app.route("/amenity")
def amenities():
    return render_template("Amenities.html")

@app.route("/market")
def marketData():
    return render_template("MarketData.html")

@app.route("/mortgage")
def mortgage():
    return render_template("mortgage.html")
    
@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/Mohan")
def mohan():
    return render_template("Mohan.html")
    
@app.route("/homes/<zipcode>")  
def homes(zipcode):
    homes = pd.read_sql(f'select year_structure_built_1939_or_earlier, year_structure_built_1940_to_1949, year_structure_built_1950_to_1959, year_structure_built_1960_to_1969, year_structure_built_1970_to_1979, year_structure_built_1980_to_1989, year_structure_built_1990_to_1999, year_structure_built_2000_to_2009, year_structure_built_2010_to_2013, year_structure_built_2014_or_later, year_structure_built_total from public.census_2018 where zipcode={zipcode}', connection)
    return homes.to_json() 

@app.route("/sqlsearch/<zipcode>")  
def sqlsearch(zipcode):
    C2018 = pd.read_sql(f'select zipcode, median_age, median_household_income, poverty_rate, lat, lng, city, state_id from public.census_2018 where zipcode={zipcode}', connection)
    return C2018.to_json() 
    
@app.route("/regression/<home_zipcode>")
def regression_api(home_zipcode):
    session=Session(engine)
    home=home_zipcode.split('&')[0]
    zipcode=home_zipcode.split('&')[1]
    region=session.query(regions.region_id).filter(regions.zip==zipcode).all()[0][0]
    Response= requests.get(f'https://www.quandl.com/api/v3/datatables/ZILLOW/DATA?indicator_id={home}&region_id={region}&api_key=74g3zUso-i7jUjwzzsgh').json()
    data=Response['datatable']['data']
    to_return={'data':[]}
    for item in data:
        if int(item[2].split('-')[0])>=2017:
            to_return['data'].append(item)
        else:
            pass
    def pull_price(n):
        return [n[3]]
    # date must be converted to ordinal since its a numeric value which regression requires
    def pull_dates(n):
        return [dt.datetime.strptime(n[2], '%Y-%m-%d').toordinal()]
    dates=list(map(pull_dates,to_return['data']))
    prices=list(map(pull_price,to_return['data']))
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
    ret={}
    for i in range(len(predictions)):
        ret[next_year_strings[i]]=predictions[i][0]
    return ret


@app.route('/test_new_api/<home_zipcode>')
def api(home_zipcode):
    session=Session(engine)
    home=home_zipcode.split('&')[0]
    zipcode=home_zipcode.split('&')[1]
    region=session.query(regions.region_id).filter(regions.zip==zipcode).all()[0][0]
    Response= requests.get(f'https://www.quandl.com/api/v3/datatables/ZILLOW/DATA?indicator_id={home}&region_id={region}&api_key=74g3zUso-i7jUjwzzsgh').json()
    to_return={'data':[]}
    for item in Response['datatable']['data']:
        if int(item[2].split('-')[0])>=2017:
            to_return['data'].append(item)
        else:
            pass
    session.close()
    return to_return

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
    # Initial API used to pull down area details using Lat and Lon
    url = f'https://national-weather-service.p.rapidapi.com/points/{latlon}'
    firstPull = weather(url)
    # Format first pull then get API url to call both forecasts 
    info = firstPull.json()
    fore = info['properties']['forecast']
    # Pull forecast data
    forecast = weather(fore).json()
    return  forecast 

@app.route("/weatherinfo/<latlon>")
def weatherInfo(latlon):
    # Api Call, will be used once for the initial pull then 2 more times to get
    # Daily forecast and then Hourly Forecast
    def weather(url):
        headers = {
            'x-rapidapi-key': "76d2396840mshc562c26618d33a2p1fb1e6jsn95b66aa3ea3c",
            'x-rapidapi-host': "national-weather-service.p.rapidapi.com"
            }

        response = requests.request("GET", url, headers=headers)
        return response 
    # Initial API used to pull down area details using Lat and Lon
    url = f'https://national-weather-service.p.rapidapi.com/points/{latlon}'
    firstPull = weather(url)
    # Format first pull then get API url to call both forecasts 
    info = firstPull.json()
    return  info 

@app.route("/weatherhour/<latlon>")
def weatherhourly(latlon):
    # Api Call, will be used once for the initial pull then 2 more times to get
    # Daily forecast and then Hourly Forecast
    def weatherH(url):
        headers = {
            'x-rapidapi-key': "76d2396840mshc562c26618d33a2p1fb1e6jsn95b66aa3ea3c",
            'x-rapidapi-host': "national-weather-service.p.rapidapi.com"
            }

        response = requests.request("GET", url, headers=headers)
        return response 
    # Initial API used to pull down area details using Lat and Lon
    url = f'https://national-weather-service.p.rapidapi.com/points/{latlon}'
    firstPull = weatherH(url)
    # Format first pull then get API url to call both forecasts 
    info = firstPull.json()
    foreHour= info['properties']['forecastHourly']
    # Pull forecast data
    forecastHour = weatherH(foreHour).json()
    return  forecastHour
    
if __name__ == '__main__':
    app.run(debug=True) 