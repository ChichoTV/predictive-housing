from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base

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

@app.route("/homes/<zipcode>")  
def homes(zipcode):
    homes = pd.read_sql(f'select year_structure_built_1939_or_earlier, year_structure_built_1940_to_1949, year_structure_built_1950_to_1959, year_structure_built_1960_to_1969, year_structure_built_1970_to_1979, year_structure_built_1980_to_1989, year_structure_built_1990_to_1999, year_structure_built_2000_to_2009, year_structure_built_2010_to_2013, year_structure_built_2014_or_later, year_structure_built_total from public.census_2018 where zipcode={zipcode}', connection)
    return homes.to_json() 

@app.route("/sqlsearch/<zipcode>")  
def sqlsearch(zipcode):
    C2018 = pd.read_sql(f'select zipcode, median_age, median_household_income, poverty_rate, lat, lng, city, state_id from public.census_2018 where zipcode={zipcode}', connection)
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


if __name__ == '__main__':
    app.run(debug=True)