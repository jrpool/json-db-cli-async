// Import the “fs” module.
const fs = require('fs');

// Function that identifies the file pathname, given the base of the filename.
exports.filePath = fileBase => process.cwd() + '/data/' + fileBase + '.json';

// Function that asynchronously reads a specified file as UTF-8.
exports.readJSON = (filePath, callback) => {
  // Start a process to read the file asynchronously.
  fs.readFile(filePath, 'utf8', callback);
};

/*
  Function that asynchronously writes a specified string to a specified file
  as UTF-8.
*/
exports.writeFile = (filePath, string, callback) => {
  // Start a process to write the string to the file asynchronously.
  fs.writeFile(filePath, string, 'utf8', callback);
};

/*
  Function that parses the specified string as JSON and returns an object
  represented by the string, or, if the reading of the data failed, handles
  an error message.
*/
exports.parseJSON = (string, err, handleMessage, messages, failMessage) => {
  // If the reading attempt produced an exception:
  if (err) {
    // Handle the error messages.
    handleMessage(messages, failMessage);
    console.log(err.message);
  }
  // Otherwise, i.e. if the reading succeeded:
  else {
    // Convert the file content from JSON to, and return, an object.
    return JSON.parse(string);
  }

};
