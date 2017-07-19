const fs = require('fs');

/// Function that identifies the file pathname, given the base of the filename.
exports.filePath = fileBase => process.cwd() + '/data/' + fileBase + '.json';

/// Function that asynchronously reads a specified file as UTF-8.
exports.readJSON = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', callback);
};

/**
  Function that asynchronously writes a specified string to a specified file
  as UTF-8.
*/
exports.writeFile = (filePath, string, callback) => {
  fs.writeFile(filePath, string, 'utf8', callback);
};

/**
  Function that parses the specified string as JSON and returns an object
  represented by the string, or, if the reading of the data failed, handles
  an error message.
*/
exports.parseJSON = (string, err, handleMessage, messages, failMessage) => {
  if (err) {
    handleMessage(messages, failMessage);
    console.log(err.message);
  }
  else {
    return JSON.parse(string);
  }

};
