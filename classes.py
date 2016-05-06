import json
import requests
from factual import Factual
import pandas as pd


class authAPIs(object):
    """ Authenticates the API"""

    def __init__(self, keys_dir, api):
        self.keys_dir = keys_dir
        self.keys = self.getKeys()
        self.api = api

    def getKeys(self):
        with open(self.keys_dir) as jsonfile:
            return json.loads(jsonfile.read())

    def auth(self):
            if self.api == "Factual":
                 factual = Factual(self.keys["Factual"]["OAuth Key"], self.keys["Factual"]["OAuth Secret"])
                 return factual
                 #self.category_ids
                 #self.chain

class searchParams(object):

    def __init__(self):
        self.api = "Factual"
        self.category = 2
        self.radius = 25000
        self.limit = 10
        self.chain_id = True
        self.categories = self.getCategories()

    def getCategories(self):
        return requests.get('https://api.factual.com/categories?options={"lang":"en","format":"tree"}&KEY=SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu')

        #pass categories back to front for search

    def passParams(self, arg):
        self.category_ids
        self.chain_ids
        #match params from input


class API_output(object):

    def __init__(self, route):
        self.route = route

        self.results = []
        self.out = []


    def send_to_table(self):
        pass

    def ResultsToFile(self):
        df = pd.DataFrame(out)
        df.to_csv("data.csv",  mode='a')

    def write_db(self):
        pass

    def loop_waypoints():

        for idx, val in enumerate(self.route):
            print "index, lat, lng"
            print idx,lat,lng
            print "results so far:"
            print len(out)
            loc = self.route.waypoints[idx]
            places = factual.table('places')

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
        print len(self.data)
        out.extend(self.data)
        print "Total records"
        print len(self.out)



if __name__ == "__main__":
    pass
