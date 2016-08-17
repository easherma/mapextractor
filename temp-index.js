// var params = req.body.userParams,
//     routes = req.body.routes;

var routes = [ //{ lat: 41.81173, lng: -87.666227},
  { lat: 42.03725, lng: -88.28119 } ];

const turf = require('turf');
const split = require('./splitBbox.js');
const write = require('./writeToFile.js');

const Factual = require('factual-api'),
      auth = require('./auth.js')
      factual = new Factual(auth.key, auth.secret);

let master = [];
let routeCount = 0;

//checks if it's > 50 results
let withinRange = (count) => {
  if (count > 0 && count < 50) {
    return true;
  } else {
    return false;
  }
}

let pushToFront = () => {
  console.log("returning to front");
  write("results",master);
  console.log(master.length);
  //res.json(master);
}

let makeBox = (route) => {
  let pt = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [route.lng, route.lat]
    }
  };
  return turf.bbox(turf.buffer(pt, 10000, 'meters'));
}

let decide = (response, bbox) => {
  console.log("deciding...");
  if (withinRange(response.total_row_count)) {
    console.log("all goodz");
    master.push(response.data);
  } else {
    console.log("TOOBIG"+response.total_row_count);
    findSmallest(split(bbox));
  }
}

let findSmallest = (splitBoxes) => {
  let arr = [];
  let ran = 0;
  splitBoxes.map((box) => {
    getSplitCount(box).then((response) => {
      ran++;
      callback(response);
    });
  });

  let callback = (response) => {
    if (withinRange(response.total_row_count)) {
      master.push(response.data);
    } else {

    }
  }
}

let createFeature = (rData) => {
  let features = [];
  //console.log(rData);
  rData.map((data) => {
    var resp = {
      "type": "Feature",
      "properties": {"response": JSON.stringify(data)},
      "geometry": {
        "type": "Point",
        "coordinates": [data.longitude, data.latitude]
      }
    };
    features.push(resp);
  });
  return features;
}

let getSplitCount = (box) => {
  return new Promise((resolve, reject) => {
    factual.get('/t/places-us', {"include_count":"true",
      filters:{"category_ids":{"$includes_any":[23]}},
      geo:{"$within":{"$rect":[[box.ymax , box.xmin],[box.ymin, box.xmax]]}}, limit:50},
    (error, response) => {
      if (error || response === null) {
        console.log(error);
      } else {
        console.log("ROWS"+response.total_row_count);
        resolve(response);
      }
    });
  });
}

let getCount = (bbox) => {
  console.log("getting count");
  factual.get('/t/places-us', {"include_count":"true",
    filters:{"category_ids":{"$includes_any":[23]}},
    geo:{"$within":{"$rect":[[bbox[3] , bbox[0]],[bbox[1], bbox[2]]]}}, limit:50},
      (error, response) => {
        if (error || response === null) {
          console.log(error);
        } else {
          decide(response, bbox);
        }
      });
}

routes.map((route) => {
  let bbox = makeBox(route);
  getCount(bbox);
});
