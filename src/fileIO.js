// Import the “fs” module.
const fs = require('fs');

// Function that identifies the file pathname, given the base of the filename.
exports.filePath = fileBase => process.cwd() + '/data/' + fileBase + '.json';

/*
  Function that synchronously reads a specified file as UTF-8 and, if the
  reading fails, processes a specified message.
*/
exports.readFileSync = (
  filePath, handleMessage, messages, messageKey, symbol, replacement
) => {
  try {
    // Read the file synchronously and identify its content.
    const content = fs.readFileSync(filePath, 'utf8');
    // If the reading produced a string:
    if (typeof content === 'string') {
      // Return it.
      return content;
    }
    // Otherwise, i.e. if the reading produced a result of another type:
    else {
      // Handle the error message.
      handleMessage(messages, messageKey, symbol, replacement);
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
