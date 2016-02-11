#imports
import pandas as pd
import os
import csv
import json
import geojson
from factual import Factual
from flask import Flask, Request, request, redirect, url_for, jsonify, render_template, send_from_directory, make_response
#import time
import requests

#config

DEBUG = True

#main



app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/')
def index():

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
    
    # Concat dataframe.
    #df_full = pd.concat(all_data, ignore_index=True)
    #df = pd.DataFrame(out)
    #data = df_full.to_json(orient='index')
	#get points to send to API
	#def results():
	#	routepoints = request.args.get
    #out = []
	
    #for i in range(1):

    #    data = places.search('').geo(circle(41.910753, -87.697108, 25000)).filters({"$and":[
    #                        {"category_ids":{"$includes":2}}]}).offset(50*(i)).limit(50).data()
    #    out.extend(data)    
    #data = json.dumps(out)
    #test = geojson.utils.generate_random("Point")
    #with open('data/exp_clevlandfact1.json', 'r') as f:
    #    data = f.read()
	factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
	places = factual.table('places')
    #data = ''
	from factual.utils import circle

	#conditions

	#prep array for entries
	#out = []
	#collect each waypoint as its own entry
	#import json
	#from factual import Factual
	#import requests

	#factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
		
	#places = factual.table('places')

	#points = [{u'lat': 41.8755546, u'lng': -87.6244211}, None, {u'lat': 41.8755546, u'lng': -87.6244211}, {u'lat': 41.5051613, u'lng': -81.6934445}]

	return render_template('index.html') #data=results)
#@app.route('/results')



@app.route('/results', methods=['GET','POST'])
def results():
	factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
	places = factual.table('places')
    #data = ''
	from factual.utils import circle
	points = request.get_json()
	print points
	#conditions

	#prep array for entries
	#out = []
	#collect each waypoint as its own entry
	#import json
	#from factual import Factual
	#import requests

	#factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
		
	#places = factual.table('places')

	#points = [{u'lat': 41.8755546, u'lng': -87.6244211}, None, {u'lat': 41.8755546, u'lng': -87.6244211}, {u'lat': 41.5051613, u'lng': -81.6934445}]


	def call_api(lat,lng,cat ):
		out = []  
		for i in range(1):       
			data = places.geo(circle(lat, lng, 25000)).filters({"$and":[{"category_ids":{"$includes": cat}}]}).offset(50*(i)).limit(50).data()
			out.extend(data)
		results = json.dumps(out)
		return results

	for idx, val in enumerate(points):
	   if val is not None:
		#print idx
		lat = points[idx]['lat']
		lng = points[idx]['lng']
		call_api(lat, lng, 2)

	
	#filters = {'lat':'100','lng': '200', 'cat_id' :'2'}
	#data = places.search('').geo(circle({p[lat]}, {p[lng]}, 25000)).filters({"$and":[{"category_ids":{"$includes":{p[cat_id]}}}]}).offset(50*(i)).limit(50).data().format(p=filters)
	#data = json.loads(points)
	#routepoints = json.dumps(routepoints1)
	#result.headers['Content-Type'] = 'application/json'
	return results
	
@app.route('/results-json/', methods=['GET','POST'])
def results_json():
	response = make_response(jsonify(points=points))
	print points
	print response
	#print request.data
	#test = request.get_json()
	response.headers['Content-Type'] = 'application/json'
	return response


	
    # here we want to get the value of the key (i.e. ?key=value)
#	value = request.args.get('key')



if __name__ == '__main__':
    app.run()
    
