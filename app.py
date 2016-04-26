#imports
import json
from factual import Factual
from flask import Flask, request, redirect, url_for, jsonify, render_template, send_from_directory
#import time
import requests
import pandas as pd

#config

DEBUG = True

#main

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
            else:
                 pass
            return

biz = authAPIs("keys.json", "Factual")


@app.route('/')
def index():
    results = []
    return render_template('index.html', results=results)



@app.route('/call', methods=['GET','POST'])
def call():
    print biz.api
    print biz.keys["Factual"]["OAuth Key"]
    #biz.auth()
    factual = Factual(biz.keys["Factual"]["OAuth Key"], biz.keys["Factual"]["OAuth Secret"])
    #params constructor
    #var params = {cat, radius, chains}
    cat = 2
    #waypoints sent from ajax/frontend
    waypoints = request.get_json()
    #use waypoints to parse into api calls, store results
    #TODO: append input data
    results = []
    out = []
    try:
        for idx, val in enumerate(waypoints):
            if val is not None:
                places = factual.table('places')
                from factual.utils import circle
                lat = waypoints[idx]['lat']
                lng = waypoints[idx]['lng']
                print "index, lat, lng"
                print idx,lat,lng
                print "results so far:"
                print len(out)
                for i in range(10):
                    data = places.geo(circle(lat, lng, 25000)).filters({"$and":[{"category_ids":{"$includes": cat}}]}).offset(50*(i)).limit(50).data()
                    print "Call successful! Records returned:"
                    print len(data)
                    out.extend(data)
                    print "Total records"
                    print len(out)
        results = json.dumps(out)

        #write to file
        def ResultsToFile(arg):
            df = pd.DataFrame(out)
            df.to_csv("data.csv",  mode='a')

    except TypeError:
        pass

    return json.dumps(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
