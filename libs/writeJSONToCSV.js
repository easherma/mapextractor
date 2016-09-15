const fs = require('file-system');
const json2csv = require('json2csv');

let incr = 0;

/*
const writeToFile = (fileName, arr) => {
  fs.stat((fileName+".json"), (err, stat) => {
    if (err) {
      fs.writeFile((fileName+".json"), JSON.stringify(arr, null, 2), (err) => {
        if (err) { throw err;}
        console.log("File written!");
      });
    } else {
      writeToFile(('results_'+incr++), arr);
    }
  });
}*/

const writeJSONtoCSV = (fileName, arr) => {
  var csv = json2csv({ data: arr});
  fs.writeFile(fileName+".csv", csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}




module.exports = writeJSONtoCSV;
