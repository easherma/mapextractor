#imports
import pandas as pd
import os
import csv
import json
import geojson
from factual import Factual
from flask import Flask, request, redirect, url_for, jsonify, render_template, send_from_directory
import time
import requests

#config

DEBUG = True

#main



app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/')
def index():
    factual = Factual('SEQDH9X3sOycBDUzKubGqgzFVOybhdHPgAJrYggu', 'mwjLAzVZsaPOwavzkXBeu44B1VEYNAfRGczh3wow')
    places = factual.table('places')
    #data = ''
    from factual.utils import circle
    out = places.search('auto repair').geo(circle(41.910753, -87.697108, 1000)).data()
    df = pd.DataFrame(out)
    data = json.dumps(out)
    test = geojson.utils.generate_random("Point")
    #with open('data/exp_clevlandfact1.json', 'r') as f:
    #    data = f.read()
    return render_template('index.html', data=out)

if __name__ == '__main__':
    app.run()
    
