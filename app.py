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

@app.route('/call', methods=['GET','POST'])
def call():
    with open("keys.json") as jsonfile:
        keys = json.loads(jsonfile.read())
    factual = Factual(keys["OAuth Key"], keys["OAuth Secret"])
    #catagory filter
    cat = 2
    points = request.get_json()
    print "length of points"
    print len(points)
    results = []
    out = []
    try:
        for idx, val in enumerate(points):
            if val is not None:
                places = factual.table('places')
                from factual.utils import circle

                lat = points[idx]['lat']
                lng = points[idx]['lng']
                print "index, lat, lng"
                print idx,lat, lng
                print "results so far:"
                print len(out)
                for i in range(10):
                    data = places.geo(circle(lat, lng, 25000)).filters({"$and":[{"category_ids":{"$includes": cat}}]}).offset(50*(i)).limit(50).include_count(True).data()
                    print "length of data"
                    print len(data)
                    out.extend(data)
                    print "length of out"
                    print len(out)


        results = json.dumps(out)
        df = pd.DataFrame(out)
        df.to_csv("data.csv",  mode='a')

    except TypeError:
        pass

    return json.dumps(results)

@app.route('/')
def index():
    #with open("cats.json") as f:
    #    cats = json.loads(f.read())
    #    print cats
    results = []
    


    return render_template('index.html', results=results)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
