// Import the “fs” module.
const fs = require('fs');

// Function that identifies the file pathname, given the base of the filename.
exports.filePath = fileBase => process.cwd() + '/data/' + fileBase + '.json';

/*
  Function that synchronously reads a specified file as UTF-8 and, if the
  reading succeeds, returns its conversion from JSON to an object.
*/
exports.readJSONSync = (
  filePath, handleMessage, messages, messageKey, symbol, replacement
) => {
  try {
    // Read the file synchronously and identify its content.
    const content = fs.readFileSync(filePath, 'utf8');
    // If the reading succeeded:
    if (content !== undefined) {
      // Identify its conversion from JSON to an object.
      return JSON.parse(content);
    }
  }
  // If the reading attempt produced an exception:
  catch(err) {
    // Handle the error messages.
    handleMessage(messages, messageKey, symbol, replacement);
    console.log(err.message);
    // Quit.
    return;
  }
};

/*
  Function that synchronously writes a specified string to a specified file
  as UTF-8 and, if the writing fails, processes a specified message.
*/
exports.writeFileSync = (
  filePath, string, handleMessage, messages, messageKey, symbol, replacement
) => {
  try {
    // Write the string to the file synchronously.
    fs.writeFileSync(filePath, string, 'utf8');
    // Return a success result.
    return 1;
  }
  // If the writing attempt produced an exception:
  catch(err) {
    // Handle the error messages.
    handleMessage(messages, messageKey, symbol, replacement);
    console.log(err.message);
  }
};
