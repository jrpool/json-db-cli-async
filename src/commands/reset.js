/// Process a command to reset the next ID to 1.

const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const writeFile = fileIO.writeFile;

/**
  Declare, define, and export a function that resets the next ID in the list
    to 1.
  Preconditions:
    0. filePath is the pathname of a UTF-8-encoded JSON file representing
      an object.
    1. handleMessage is a function.
    2. messages is an object.
*/
exports.reset = (filePath, handleMessage, messages) => {
  const writeCallback = (err) => {
    if (err) {
      handleMessage(messages, 'resetWriteFail');
      console.log(err.message);
      return;
    }
    handleMessage(messages, 'resetReport');
  };
  const readCallback = (err, data) => {
    if (err && err.code === 'ENOENT') {
      handleMessage(messages, 'resetMissingInit');
    }
    else if (err) {
      handleMessage(messages, 'resetReadFail');
      console.log(err.message);
      return;
    }
    else {
      const listObject = JSON.parse(data);
      if (Object.keys(listObject).length > 1) {
        handleMessage(messages, 'resetDoneFail');
        return;
      }
    }
    /// The list is empty or the file is missing, so a reset is permitted.
    writeFile(filePath, JSON.stringify({'nextID': 1}), writeCallback);
  };
  readJSON(filePath, readCallback);
};
