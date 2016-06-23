# About

This is the Factual-supported Node.js driver for [Factual's public API](http://developer.factual.com).

# Install

```bash
$ npm install factual-api
```

# Get Started

Include this driver in your projects:
```javascript
var Factual = require('factual-api');
var factual = new Factual('YOUR_KEY', 'YOUR_SECRET');
```

If you don't have a Factual API account yet, [it's free and easy to get one](https://www.factual.com/api-keys/request).

## Read
Doc: http://developer.factual.com/api-docs/#Read
```javascript
// Full-text search:
factual.get('/t/places',{q:"starbucks", "include_count":"true"}, function (error, res) {
  console.log("show "+ res.included_rows +"/"+ res.total_row_count +" rows:", res.data);
});

// Row filters:
factual.get('/t/places', {filters:{category_ids:{"$includes":10}}}, function (error, res) {
  console.log(res.data);
});

factual.get('/t/places', {q:"starbucks", filters:{"region":"CA"}}, function (error, res) {
  console.log(res.data);
});

factual.get('/t/places', {q:"starbucks", filters:{"$or":[{"region":{"$eq":"CA"}},{"locality":"newyork"}]}}, function (error, res) {
  console.log(res.data);
});

// Geo filter:
factual.get('/t/places', {q:"starbucks", geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}}, function (error, res) {
  console.log(res.data);
});

// Get a row by factual id:
factual.get('/t/places/03c26917-5d66-4de9-96bc-b13066173c65', function (error, res) {
  console.log(res.data[0]);
});

```

## Schema
Doc: http://developer.factual.com/api-docs/#Schema
```javascript
factual.get('/t/places/schema', function (error, res) {
  console.log(res.view);
});
```

## Facets
Doc: http://developer.factual.com/api-docs/#Facets
```javascript
// show top 5 cities that have more than 20 Starbucks in California
factual.get('/t/places/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5}, function (error, res) {
  console.log(res.data);
});
```

## Resolve
Doc: http://developer.factual.com/api-docs/#Resolve
```javascript
// resovle from name and address info
factual.get('/t/places/resolve?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});

// resolve from name and geo location
factual.get('/t/places/resolve?values={"name":"McDonalds","latitude":34.05671,"longitude":-118.42586}', function (error, res) {
  console.log(res.data);
});
```

## Match
Doc: http://developer.factual.com/api-docs/#Match
Match the data with Factual's, but only return the matched Factual ID:
```javascript
factual.get('/t/places/match?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});
```

## Crosswalk
Doc: http://developer.factual.com/places-crosswalk/
Query with factual id, and only show entites from Yelp:
```javascript
factual.get('/t/crosswalk?filters={"factual_id":"57ddbca5-a669-4fcf-968f-a1c8210a479a","namespace":"yelp"}', function (error, res) {
  console.log(res.data);
});
```

Or query with an entity from Foursquare:
```javascript
factual.get('/t/crosswalk?filters={"namespace":"foursquare", "namespace_id":"4ae4df6df964a520019f21e3"}', function (error, res) {
  console.log(res.data);
});
```

## Multi
Doc: http://developer.factual.com/api-docs/#Multi
Query read and facets in one request:
```javascript
var readQuery = factual.requestUrl('/t/places', {q:"starbucks", geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}});
var facetsQuery = factual.requestUrl('/t/places/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5});
factual.get('/multi', {queries:{
  read: readQuery,
  facets: facetsQuery
}}, function (error, res) {
  console.log('read:', res.read.response);
  console.log('facets:', res.facets.response);
});
```
Note that sub-responses in multi's response object might be factual api's error responses.

## Reverse Geocoder
Doc: http://developer.factual.com/api-docs/#Geocode
Get the nearest valid address from a latitude and longitude
```javascript
factual.get('/places/geocode', {geo:{"$point":[34.06021,-118.41828]}}, function (error, res) {
  console.log(res.data);
});
```

## Geopulse
Doc: http://developer.factual.com/api-docs/#Geopulse
Get geographic attributes from a latitude and longitude
```javascript
factual.get('/places/geopulse', {geo:{"$point":[34.06021,-118.41828]}}, function (error, res) {
  console.log(res.data);
});
```

## World Geographies
World Geographies contains administrative geographies (states, counties, countries), natural geographies (rivers, oceans, continents), and assorted geographic miscallaney.  This resource is intended to complement the Global Places and add utility to any geo-related content.
```javascript
factual.get('/t/world-geographies?select=neighbors&filters={"factual_id":{"$eq":"08ca0f62-8f76-11e1-848f-cfd5bf3ef515"}}', function (error, res) {
  console.log(res.data);
});
```

## Submit
Doc: http://developer.factual.com/api-docs/#Submit
NOTICE: At the current time, this API call is ONLY compatible with places-v3. Please see the [the migration page](http://developer.factual.com/display/docs/Places+API+-+v3+Migration) for more details.
---

```javascript
factual.post('/t/global/submit', {
  values: JSON.stringify({
    name: "Factual North",
    address: "1 North Pole",
    latitude: 90,
    longitude: 0
  }),
  user: "a_user_id"
}, function (error, res) {
  console.log(res);
});
```

## Diffs
Doc: http://developer.factual.com/api-docs/#Diffs
NOTICE: _Server support for this feature is still under development._ You are getting a preview of how this driver will support the feature. If you try using this feature now, you may not get a successful response. We will remove this notice once the feature is fully supported.
---

```javascript
// callback to handle all the diffs
var now = new Date().getTime();
var start = now - 7*24*3600*1000; // last week
factual.get('/t/global/diffs?start='+start+'&end='+now, function (err, res) {
  console.log(res);
});


// callback to handle each diff
factual.get('/t/global/diffs?start='+start+'&end='+now, {
  customCallback: function (req) {

    req.on('response', function (response) {
      var data = "";

      var cb = function () {
        var idx;
        while (-1 != (idx = data.indexOf("\n"))) {
          var row = data.slice(0, idx);
          data = data.slice(idx + 1);
          if (row.length > 2) console.log(JSON.parse(row));
        }
      };

      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        data += chunk.toString();
        cb();
      });
      response.on('end', function () {
        if (data) cb();
      });
      response.on('close', function () {
        if (data) cb();
      });
      response.on('error', function (error) {
        console.log(error);
      });
    });

    req.end();
  }
});
```

## Flag
Doc: http://developer.factual.com/api-docs/#Flag
NOTICE: At the current time, this API call is ONLY compatible with places-v3. Please see the [the migration page](http://developer.factual.com/display/docs/Places+API+-+v3+Migration) for more details.

```javascript
factual.post('/t/global/21EC2020-3AEA-1069-A2DD-08002B30309D/flag', {
  problem: "duplicate",
  user: "a_user_id",
  comment: "I think this is identical to 9d676355-6c74-4cf6-8c4a-03fdaaa2d66a"
}, function (error, res) {
  if (!error) console.log("success");
});
```

## Clear
Doc: http://developer.factual.com/api-docs/#Clear
Clear existing attributes in an entity
```javascript
factual.post('/t/global/21EC2020-3AEA-1069-A2DD-08002B30309D/clear', {
  fields: "address_extended,latitude,longitude",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```

## Boost
Doc: http://developer.factual.com/api-docs/#Boost
```javascript
factual.post('/t/places-us/boost', {
  factual_id: '03c26917-5d66-4de9-96bc-b13066173c65',
  q: "local business data",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```



## Error Handling
The error object is the first argument of the callback functions, it will be null if no errors.

## Debug Mode
To see detailed debug information at runtime, you can turn on Debug Mode:
```javascript
// start debug mode
factual.startDebug();

// run your querie(s)

// stop debug mode
factual.stopDebug();
```
Debug Mode will output useful information about what's going on, including  the request sent to Factual and the response from Factual, outputting to stdout and stderr.


## Change base url
If you want to send the requests to other hosts/port instead of "http://api.v3.factual.com:80", you can set it manually:
```javascript
// 1.set globally
factual.setBaseURI('http://dev.api.v3.factual.com');
// back to default
factual.setBaseURI();
// 2. set for each request
factual.get('http://dev.api.v3.factual.com/t/places',{q:"starbucks", "include_count":"true"}, function (error, res) {
});
```

## Use custom timeout
You can set the request timeout(in milliseconds) now:
```javascript
// set the timeout as 1 second
factual.setRequestTimeout(1000);
// clear the custom timeout setting
factual.setRequestTimeout();
```
You will get [Error: socket hang up] for custom timeout errors.


# Where to Get Help

If you think you've identified a specific bug in this driver, please file an issue in the github repo. Please be as specific as you can, including:

  * What you did to surface the bug
  * What you expected to happen
  * What actually happened
  * Detailed stack trace and/or line numbers

If you are having any other kind of issue, such as unexpected data or strange behaviour from Factual's API (or you're just not sure WHAT'S going on), please contact us through [GetSatisfaction](http://support.factual.com/factual).
