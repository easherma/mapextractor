#imports
import json
from factual import Factual
from flask import Flask, request, redirect, url_for, jsonify, render_template, send_from_directory
#import time
import requests
import pandas as pd
from factual.utils import circle

#config

DEBUG = True

#main

app = Flask(__name__)
app.config.from_object(__name__)



class authAPIs(object):
    def __init__(self, keys_dir, api):
        self.keys_dir = keys_dir
        self.keys = self.getKeys()
        self.api = api
    def getKeys(self):
        with open(self.keys_dir) as jsonfile:
            return json.loads(jsonfile.read())
    def auth(self):
            if self.api == Factual:
                 factual = Factual(keys["Factual"]["OAuth Key"], keys["Factual"]["OAuth Secret"])
                 #self.category_ids
                 #self.chain
            else:
                 pass
            return

class searchParams(object):
    def __init__(self):
        self.api = "Factual"
        self.category = 2
        self.radius = 25000
        self.limit = 10

    def getCategories(self, api):
        r = requests.get(catapiURL)
        categorys = r.json
        #pass categories back to front for search
    def passParams(self, arg):
        self.category_ids
        self.chain_ids
        #match params from input
        pass

class getRoute(object):
    """get the entire route submitted by user. clear after query is run? """
    def __init__(self, waypoints):
        pass


class API_output(object):
    def __init__(self):
        self.results = []
        self.out = []
    def send_to_table(self):
        pass
    def ResultsToFile(self):
        df = pd.DataFrame(out)
        df.to_csv("data.csv",  mode='a')
    def write_db(self):
        pass

    def loop_waypoints(apiout):
        out = []
        results = []
        for idx, val in enumerate(route):
        #if val is not None:
            #lat = route.waypoints[idx]['lat']
            #lng = route.waypoints[idx]['lng']
            print "index, lat, lng"
            print idx,lat,lng
            print "results so far:"
            print len(out)
            loc = route.waypoints[idx]
            places = factual.table('places')
            looper().get_data()
            class looper():
                def __init__(self, loc, search):
                    self.loc = loc
                    self.search = search
                    self.data = self.get_data()

                def get_data(self):
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
                print q
                print "Call successful! Records returned:"
                print len(data)
                out.extend(data)
                print "Total records"
                print len(out)
    results = json.dumps(out)

biz = authAPIs("keys.json", "Factual")


@app.route('/')
def index():
    results = []
    return render_template('index.html', results=results)



@app.route('/call', methods=['GET','POST'])
def call():
    print biz.api
    #biz.auth()
    #initialize factual api
    factual = Factual(biz.keys["Factual"]["OAuth Key"], biz.keys["Factual"]["OAuth Secret"])

    search = searchParams()
    apiout = API_output()
    #TODO: append input data
    # old waypoints = request.get_json()
    route = request.get_json()
    try:
        loop_waypoints(apiout)


        #TODO add error handiling and/or reporting factual.api.APIException
        #write to file
    except TypeError:
        pass
    return json.dumps(apiout.results)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
