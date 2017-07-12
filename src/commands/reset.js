// Process a command to reset the next ID to 1.

// Import the fileIO objects from the readFile module.
const fileIO = module.require('../fileIO');
const readJSONSync = fileIO.readJSONSync;
const writeFileSync = fileIO.writeFileSync;

/*
  Declare, define, and export a function that resets the next ID in the list
    to 1.
  Preconditions:
    0. filePath is the pathname of a UTF-8-encoded JSON file representing
      an object.
    1. handleMessage is a function.
*/
exports.reset = (filePath, handleMessage, messages) => {
  // Read the file and wait for completion.
  const listObject = readJSONSync(
    filePath, handleMessage, messages, 'resetReadFail'
  );
  // If the list contains any tasks:
  if (Object.keys(listObject).length > 1) {
    // Handle an error message.
    handleMessage(messages, 'resetDoneFail');
  }
  // Otherwise, i.e. if the list contains no tasks:
  else {
    /*
    Replace the file with a JSON representation of the object with the
    next ID reset to 1. If the replacement succeeded:
    */
    if (writeFileSync(
      filePath, JSON.stringify({'nextID': 1}),
      handleMessage, messages, 'resetWriteFail'
    )) {
      // Handle the success report.
      handleMessage(messages, 'resetReport');
    }
  }
};
