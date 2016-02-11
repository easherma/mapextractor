#imports
import pandas as pd
import os
import csv
import json
import geojson
from factual import Factual
from flask import Flask, request, redirect, url_for, jsonify, render_template, send_from_directory
#import time
import requests

#config

DEBUG = True

#main

app = Flask(__name__)
app.config.from_object(__name__)

@app.route("/results", methods=['GET','POST'])
def results():
	factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
	places = factual.table('places')
	from factual.utils import circle
	out = []  
	for i in range(1):       
		data = places.geo(circle(lat, lng, 25000)).filters({"$and":[{"category_ids":{"$includes": cat}}]}).offset(50*(i)).limit(50).data()
		out.extend(data)
	return json.dumps(out)
	

@app.route("/result", methods=['GET','POST'])
def result():
	call()
	factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
	places = factual.table('places')
	from factual.utils import circle
	out = []  
	for i in range(1):       
		data = places.geo(circle(lat, lng, 25000)).filters({"$and":[{"category_ids":{"$includes": cat}}]}).offset(50*(i)).limit(50).data()
		out.extend(data)
	results = json.dumps(out)
	
	return render_template('echo.html', results=results)

@app.route('/call', methods=['GET','POST'])
def call():
	global cat
	cat = 2



	results = []
	print request.data
	print request.json
	print request.get_json()
	
	points = request.get_json()
	for idx, val in enumerate(points):
		if val is not None:
			print idx
			global lat
			lat = points[idx]['lat']
			global lng
			lng = points[idx]['lng']
			print lat, lng



			#call_api(lat, lng, 2)

	return render_template('index.html', results=results)
	
@app.route('/')
def index():
    #data = ''

    #all_data = []
    #out = places.search('auto repair').geo(circle(41.910753, -87.697108, 1000)).data()
    #out = places.search('').geo(circle(41.910753, -87.697108, 1000)).filters({"$and":[
    #                        {"category_ids":{"$includes":2}}]}).data()
#    for i in range(10):     # iter over pages.
        
        # Filters here.
#        data = places.search('').geo(circle(41.910753, -87.697108, 1000)).filters({"$and":[
#                                {"category_ids":{"$includes":2}}]}).offset(50*(i)).limit(50).data()
#        df = pd.DataFrame(data)
#        all_data.append(df)
        #time.sleep(.1)
#time.sleep(.1)
	results = []
	#run()


    # Concat dataframe.
    #df_full = pd.concat(all_data, ignore_index=True)
    #df = pd.DataFrame(out)
    #data = df_full.to_json(orient='index')
    #results = []
    #for i in range(1):

        # data = places.search('').geo(circle(41.910753, -87.697108, 25000)).filters({"$and":[
                            # {"category_ids":{"$includes":2}}]}).offset(50*(i)).limit(50).data()
        # results.extend(data)    
    # data = json.dumps(results)
    #test = geojson.utils.generate_random("Point")
    #with open('data/exp_clevlandfact1.json', 'r') as f:
    #    data = f.read()
	return render_template('index.html', results=results)

if __name__ == '__main__':
    app.run()
    
