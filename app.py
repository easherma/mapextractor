from classes import *

# CONFIG.
DEBUG = True

# MAIN.
app = Flask(__name__)
app.config.from_object(__name__)


biz = authAPIs("keys.json", "Factual")
search = searchParams()


@app.route('/')
def index():
    results = []
    #print vars(biz)
    params = search.params
    print type(params)
    print search.params['main']
    print vars(search)
    try:
        parsed_categories = search.categories.json()

        #category = search.category
    except:
        pass
    print parsed_categories["response"].viewkeys()
    return render_template('index.html', results=results, parsed_categories = parsed_categories, params = params)

@app.route('/getParams', methods=['POST'])
def getParams():
    main = request.form['main']
    sub = request.form.getlist('sub')
    user =  request.form['username']
    #params = {'status':'OK','main':2, 'sub':'', 'user':'default' }
    search.category = []
    search.category.extend(main)
    search.category.extend(sub)
    search.category = map(int, search.category)
    category = json.dumps(search.category)
    search.params = json.dumps({'status':'OK','main':main, 'sub':sub, 'user':user }, ensure_ascii=False)
    search.category = json.dumps({'main':main, 'sub':sub})
    #print type(category)
    #print category
    #print search.params
    print search.params['main']
    return search.params

@app.route('/call', methods=['GET', 'POST'])
def call():
    # OAuth Factual
    #print params
    print search.params['main']
    #print cats
    #print type(cats)
    factual = biz.auth()
    #factual = biz.factual
    print "Using: " + biz.api

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
    print route
    apiout = API_output(route)
    #loop = looper() hoping to clean this up
    print "BEGIN"
    print apiout.route
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
                for i in range(4):
                    print "range: "
                    print i

                    query = (places.geo(circle(loc['lat'], loc['lng'], search.radius))
                    .filters(
                        {"$and":[{"category_ids":
                        {"$includes": 2}},
                        {"chain_id":{"$blank":search.chain_id}}]}
                        #chain_ids
                    )
                    .offset(50*(i))
                    .limit(50))
                    print query
                    data = query.data()
                    #print query.params #append to output somehow
                    #print vars(query)
                    #print factual.get_response()
                    print "Call successful! Records returned:"
                    print len(data)
                    apiout.out.extend(data)
                    print "Total records"
                    print len(apiout.out)
        df = pd.DataFrame(apiout.out)
        df.to_csv("data.csv",  mode='a')
        results = json.dumps(apiout.out)

        print("END")
        #def ResultsToFile():
        #    df = pd.DataFrame(apiout.out)
        #    df.to_csv("data.csv",  mode='a')
        #ResultsToFile()
    except TypeError:
        pass
    return results




#TODO add error handiling and/or reporting factual.api.APIException
#write to file


if __name__ == '__main__':
    app.run(host='0.0.0.0')
