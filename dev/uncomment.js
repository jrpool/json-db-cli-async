// Copy the directories and files in /doc to /, deleting comments.

// Import the “fs” module.
const fs = require('fs');

// Initialize the paths.
const productionRoot = process.cwd();
const docRoot = productionRoot + '/doc';
const subpath = '';

// Define a callback function for writeFile.
const writeFileCallback = err => {
  err && console.log(err.message);
};

// Define a callback function for readFile.
const readFileCallback = (err, data) => {
  if (err) {
    console.log(err.message);
  }
  else {
    const bareCode = data.replace(/^ *\/\/.+\n|^ *\/\*[^]+?\*\/\n/mg, '');
    fs.writeFile(
      productionRoot + '/' + subpath + '/' + fileName, bareCode, 'utf8',
      writeFileCallback
    );
  }
};

// Define a callback function for stat.
const statCallback = (err, stats) => {
  if (err) {console.log(err.message);}
  else {
     if (stats.isDirectory()) {
       const subpath += '/' + currentValue;
       fs.readdir(subpath, 'utf', readdirCallback);
     }
     else if (stats.isFile()) {
       fs.readFile(
         [docRoot, subpath, currentValue].join('/'), 'utf8', readFileCallback
       );
     }
  }
};

// Define a callback function for forEach.
const forEachCallback = currentValue => {
  const itemPath = [docRoot, subpath, currentValue].join('/');
  const itemType = fs.stat(itemPath, statCallback);
};

// Define a callback function for readdir.
const readdirCallback = (err, files) => {
  // Execute forEachCallback on each item in the directory.
  files.forEach(forEachCallback);
};

/*
  Read the doc root directory. When the reading is complete, execute
  readdirCallback.
*/
fs.readdir(docRoot, 'utf8', readdirCallback);
