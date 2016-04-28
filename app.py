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
    print vars(biz)
    return render_template('index.html', results=results)

@app.route('/call', methods=['GET','POST'])
def call():
    # OAuth Factual
    factual = Factual(biz.keys["Factual"]["OAuth Key"], biz.keys["Factual"]["OAuth Secret"])
    print(request.values)

    # POST first.

    # Get Results variable.

    print biz.api
    #biz.auth()
    #initialize factual api

    search = searchParams()
    #TODO: append input data
    # old waypoints = request.get_json()
    route = request.get_json()
    print (route)
    apiout = API_output(route)
    print apiout.route
    print type(apiout.out)
    #loop = looper()
    print("YO")
    print apiout.route
    for idx, val in enumerate(apiout.route):
        print "index, lat, lng"
        print idx, apiout.route[idx]['lat']
        print "results so far:"
        print len(apiout.out)
        loc = apiout.route[idx]
        places = factual.table('places')
        #loop.get_data()

        for i in range(10):
            data = (
            places.geo(circle(loc['lat'], loc['lng'], search.radius))
            .filters(
                {"$and":[{"category_ids":
                {"$includes": search.category}}]}
                #chain_ids
            )
            .offset(50*(i))
            .limit(50)
            .data()
            )
    #q = data.get_url())

        print "Call successful! Records returned:"
        print len(data)
        apiout.out.extend(data)
        print "Total records"
        print len(apiout.out)

        results = json.dumps(apiout.out)
    print("YOYO MA")


    #TODO add error handiling and/or reporting factual.api.APIException
    #write to file

    return json.dumps(apiout.results)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
