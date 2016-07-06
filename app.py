from classes import *

# CONFIG.
DEBUG = True

# MAIN.
app = Flask(__name__)
app.config.from_object(__name__)


biz = authAPIs("keys.json", "Factual")
#global search variables
search = searchParams()
userParams = str(search.params)

@app.route('/')
def index():
    results = []
    #print vars(biz)
    print search.params
    print vars(search)
    try:
        parsed_categories = search.categories.json()
    except:
        pass
    print parsed_categories["response"].viewkeys()
    return render_template('index.html', results=results, parsed_categories = parsed_categories, params = search.params)

@app.route('/getParams', methods=['POST'])
def getParams():
    print search.params

    main = request.form['main'] if (request.form['main']) else search.params['main']

    sub = request.form.getlist('sub') if (request.form.getlist('sub')) else search.params['sub']

    user =  request.form['username'] if (request.form['username']) else search.params['user']

    global userParams
    userParams = json.dumps({'status':'OK','main':int(main), 'sub':map(int, sub), 'user':user })
    if user == 'default':
        print "using defaults user"
    return userParams

@app.route('/call', methods=['GET', 'POST'])
def call():
    # OAuth Factual
    #print params
    print type(search.params)
    print userParams
    print type(userParams)
    results = []
    #if not (json.loads(userParams)['sub']):
    #    print "using main"
    #else:
    #    print "using subs"
    #if not json.loads(userParams)['sub']):
    #    print "Using subs!"
    #    print json.loads(userParams)['sub']

    #print cats
    #print type(cats)
    factual = biz.auth()
    #factual = biz.factual
    print "Using: %s" % biz.api

    #needs to be called in both routes..
    #factual = Factual(biz.keys["Factual"]["OAuth Key"], biz.keys["Factual"]["OAuth Secret"])
    #print(request.values)
    #print biz.keys
    #factual = Factual(biz.keys["Factual"]["OAuth Key"], biz.keys["Factual"]["OAuth Secret"])
    #print(request.values)


    # POST first.
    # Get Results variable.
    #biz.auth()
    #initialize factual api

    #TODO: append input data
    # old waypoints = request.get_json()
    route = request.get_json()
    print "route %s" % route
    apiout = API_output(route)
    #loop = looper() hoping to clean this up
    print "BEGIN:"
    print "route %s" % apiout.route
    print "apiout variables %s" % vars(apiout)
    #loop thru points, send each point as a call to api
    try:
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
                #range cannot go higher than 10 (offset max is 500)
                #couple ways to address this...filter by factual id, etc.'''
                for i in range(10):
                    print "range: "
                    print i

                    query = (places.geo(circle(loc['lat'], loc['lng'], search.radius))
                    .filters(
                        {"$and":[{"category_ids":
                        {"$includes_any": [json.loads(userParams)['main']] if not (json.loads(userParams)['sub']) else json.loads(userParams)['sub'] }},
                        {"chain_id":{"$blank":search.chain_id}}]}
                        #chain_ids
                    )
                    .offset(50*(i))
                    .limit(50))
                    #print query.filters()
                    #print query.params()
                    data = query.data()
                    #print query.params.values()
                    #print query.params #append to output somehow
                    #print vars(query)
                    #print factual.get_response()
                    print "Call successful! Records returned:"
                    print len(data)
                    apiout.out.extend(data)
                    print "Total records"
                    print len(apiout.out)
        p = query.params
        print "PARAMS"
        print query.params
        print "PATH"
        print query.path
        print "RESPONSE"
        #print query.response
        q_values = vars(query)
        ##print vars(query.user)
        print "USER"
        print userParams
        print type(p)
        print str(datetime.now())
        p['date'] = str(datetime.now())
        p['userParams'] = str(search.params)
        print p
        #params_date = p.append(datetime.now())
        #print params
        #print query.params
        #saved = query.params
        df = pd.DataFrame(apiout.out)

        df2 = pd.DataFrame(p)
        #df2.to_csv("p.csv",  mode='w+', encoding='utf-8')
        latest_df = datetime.now().strftime("%m-%d-%Y-%H.%M")
        filename = "deduped" + str(latest_df) + ".csv"
        print filename
        df.to_csv("temp.csv",  mode='w+', encoding='utf-8')
        dfd = pd.read_csv("temp.csv")
        #print dfd.duplicated('factual_id')
        dfd = dfd.drop_duplicates('factual_id')
        dfd['date'] = str(datetime.now())
        dfd['userParams'] = userParams
        dfd['searchparams'] = str(p)
        with open(filename, 'w+') as f:
            dfd.to_csv(f,  mode='w+', encoding='utf-8')

        dfd.to_csv("master_de_duped_data.csv",  mode='a+', encoding='utf-8')
        results = json.dumps(apiout.out)
        #print df
        print("END")
        #def ResultsToFile():
        #    df = pd.DataFrame(apiout.out)
        #    df.to_csv("data.csv",  mode='a')
        #ResultsToFile()
        #with open('search_params.json', 'w') as paramsfile:
        #    json.dump(p, paramsfile)
        #with open('user_params.json', 'w') as paramsfile:
        #    json.dump(userParams, paramsfile)
    except TypeError:
        pass
    return results




#TODO add error handiling and/or reporting factual.api.APIException



if __name__ == '__main__':
    app.run(host='0.0.0.0')
