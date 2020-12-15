from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
from sqlalchemy import create_engine
import json

engine = create_engine('postgresql://admin2:12345@localhost:5432/Project_2')
connection = engine.connect()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/homes/<zipcode>")  
def homes(zipcode):
    homes = pd.read_sql(f'select year_structure_built_1939_or_earlier, year_structure_built_1940_to_1949, year_structure_built_1950_to_1959, year_structure_built_1960_to_1969, year_structure_built_1970_to_1979, year_structure_built_1980_to_1989, year_structure_built_1990_to_1999, year_structure_built_2000_to_2009, year_structure_built_2010_to_2013, year_structure_built_2014_or_later, year_structure_built_total from census_2018 where zipcode={zipcode}', connection)
    return homes.to_json() 

@app.route("/sqlsearch/<zipcode>")  
def sqlsearch(zipcode):
    C2018 = pd.read_sql(f'select zipcode, median_age, median_household_income, poverty_rate, lat, lng, city, state_id from census_2018 where zipcode={zipcode}', connection)
    return C2018.to_json() 

@app.route('/test_new_api/<home>')
def api(home):
    Response= requests.get(f'https://www.quandl.com/api/v3/datatables/ZILLOW/DATA?indicator_id={home}&region_id=99999&api_key=74g3zUso-i7jUjwzzsgh')
    return Response.json()


if __name__ == '__main__':
    app.run(debug=True)