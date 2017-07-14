// Process a command to reset the next ID to 1.

// Import the fileIO objects from the readFile module.
const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const writeFile = fileIO.writeFile;

/*
  Declare, define, and export a function that resets the next ID in the list
    to 1.
  Preconditions:
    0. filePath is the pathname of a UTF-8-encoded JSON file representing
      an object.
    1. handleMessage is a function.
    2. messages is an object.
*/
exports.reset = (filePath, handleMessage, messages) => {
  // Declare and define a callback function for writeFile.
  const writeCallback = (err) => {
    // If the writing attempt produced an exception:
    if (err) {
      // Handle the error messages.
      handleMessage(messages, 'resetWriteFail');
      console.log(err.message);
      // Quit.
      return;
    }
    // The writing succeeded. Handle a success message.
    handleMessage(messages, 'resetReport');
  };
  // Declare and define a callback function for readJSON.
  const readCallback = (err, data) => {
    // If the reading attempt produced a no-such-file error:
    if (err && err.code === 'ENOENT') {
      // Handle the error messages.
      handleMessage(messages, 'resetMissingInit');
    }
    // Otherwise, if the reading attempt produced a different exception:
    else if (err) {
      // Handle the error messages.
      handleMessage(messages, 'resetReadFail');
      console.log(err.message);
      // Quit.
      return;
    }
    // Otherwise, i.e. if the reading succeeded:
    else {
      // Convert the file content from JSON to an object.
      const listObject = JSON.parse(data);
      // If the list contains any tasks:
      if (Object.keys(listObject).length > 1) {
        // Handle an error message.
        handleMessage(messages, 'resetDoneFail');
        // Quit.
        return;
      }
    }
    /*
      The list is empty or the file is missing, so a reset is permitted.
      Replace the file with a JSON representation of the object with the
      next ID reset to 1 and an empty list. When the replacement is complete,
      execute writeCallback, passing the value of its argument to it.
    */
    writeFile(filePath, JSON.stringify({'nextID': 1}), writeCallback);
  };
  /*
    Read the file. When the reading is complete, execute readCallback,
    passing the values of its arguments to it.
  */
  readJSON(filePath, readCallback);
};
