const fs = require('file-system');

let incr = 0;

const writeToFile = (fileName, arr) => {
  fs.stat((fileName+".csv"), (err, stat) => {
    if (err) {
      fs.writeFile((fileName+".csv"), JSON.stringify(arr, null, ""), (err) => {
        if (err) { throw err;}
        console.log("File written!");
      });
    } else {
      writeToFile((fileName+'_'+incr++), arr);
    }
  });
}

module.exports = writeToFile;
