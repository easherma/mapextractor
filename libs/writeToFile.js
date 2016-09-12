const fs = require('file-system');

let incr = 0;

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
}

module.exports = writeToFile;
