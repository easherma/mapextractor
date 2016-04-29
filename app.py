import json
import requests
import pandas as pd

from factual import Factual
from factual.utils import circle

from flask import Flask, request, redirect, url_for, jsonify, render_template, send_from_directory

from classes import *

# CONFIG.
DEBUG = True

# MAIN.
app = Flask(__name__)
app.config.from_object(__name__)


biz = authAPIs("keys.json", "Factual")

@app.route('/')
def index():
    results = []
    #print vars(biz)
    return render_template('index.html', results=results)

@app.route('/call', methods=['GET','POST'])
def call():
    # OAuth Factual
    factual = biz.auth()
    #factual = biz.factual
    print "Using: " + biz.api
    #factual = Factual(biz.keys["Factual"]["OAuth Key"], biz.keys["Factual"]["OAuth Secret"])
    #print(request.values)
    # POST first.
    # Get Results variable.

    #biz.auth()
    #initialize factual api
    search = searchParams()
    #TODO: append input data
    # old waypoints = request.get_json()
    route = request.get_json()
    print (route)
    apiout = API_output(route)
    #loop = looper() hoping to clean this up
    print("BEGIN")
    print apiout.route
    #loop thru points, send each point as a call to api
    for idx, val in enumerate(apiout.route):
        if val is not None:
            loc = apiout.route[idx]
            places = factual.table('places')
            print "index, route_point"
            print idx, loc
            print "results so far:"
            print len(apiout.out)
            print "sending call"

    #loop.get_data()
    #messy loop to offset/combine seperate calls together (due to api rate limits)
            for i in range(10): #range cannot go higher than 10 (offset max is 500) couple ways to address this...filter by factual id, etc.
                print "range: "
                print i
                q = (places.geo(circle(loc['lat'], loc['lng'], search.radius))
                .filters(
                    {"$and":[{"category_ids":
                    {"$includes": search.category}},
                    {"chain_id":{"$blank":search.chain_id}}]}
                    #chain_ids
                )
                .offset(50*(i))
                .limit(50))
                data = q.data()
                print q.params #append to output somehow
                #print vars(q)
                #print factual.get_response()
                print "Call successful! Records returned:"
                print len(data)
                apiout.out.extend(data)
                print "Total records"
                print len(apiout.out)
    df = pd.DataFrame(apiout.out)
    df.to_csv("data.csv",  mode='a')
    results = json.dumps(apiout.out)
    return results
    print("END")
    def ResultsToFile():
        df = pd.DataFrame(apiout.out)
        df.to_csv("data.csv",  mode='a')
    ResultsToFile()


    #TODO add error handiling and/or reporting factual.api.APIException
    #write to file



if __name__ == '__main__':
    app.run(host='0.0.0.0')
