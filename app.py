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



class authAPIs(object):
    def __init__(self, keys, api):
        with open(keys) as jsonfile:
            keys = json.loads(jsonfile.read())
        self.keys = keys
        self.api = api
    def auth(self):
            if self.api == Factual:
                 factual = Factual(keys["Factual"]["OAuth Key"], keys["Factual"]["OAuth Secret"])
                 self.category_ids = https://api.factual.com/categories?options={"lang":"en","format":"index"}
            else:
                 pass
            return

biz = authAPIs("keys.json", "Factual")

@app.route('/')
def index():
    results = []
    print vars(biz)
    return render_template('index.html', results=results)

@app.route('/call', methods=['GET','POST'])
def call():
    # OAuth Factual
    #print biz.keys
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
        if val is not None:
            loc = apiout.route[idx]
            places = factual.table('places')
            print "index, lat, lng"
            print idx, loc
            print "results so far:"
            print len(apiout.out)

        #loop.get_data()

            for i in range(2):
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
    #return results
    print("YOYO MA")
    print results


    #TODO add error handiling and/or reporting factual.api.APIException
    #write to file


if __name__ == '__main__':
    app.run(host='0.0.0.0')
