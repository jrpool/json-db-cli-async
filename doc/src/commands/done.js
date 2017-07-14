// Process a command to remove items from a list.

// Import the fileIO objects from the readFile module.
const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const writeFile = fileIO.writeFile;
const parseJSON = fileIO.parseJSON;

/*
  Declare, define, and export a function that removes a the items in a
  specified range of IDs from the list in a specified JSON file.
  Preconditions:
    0. filePath is the pathname of a UTF-8-encoded JSON file representing
      an object whose keys are string representations of nonnegative integers,
      whose values are nonblank, and which has a property with key "0", the
      value of which property is a positive integer, such that no property of
      the object has a key whose integer representation is greater than or
      equal to it.
    1. doneRange is an array of 2 positive integers in ascending order.
    2. handleMessage is a function.
    3. messages is an object.
*/
exports.done = (filePath, doneRange, handleMessage, messages) => {
  // Declare and define a callback function for readJSON.
  const readCallback = (err, data) => {
    // Identify an object represented by the file that was read.
    const listObject = parseJSON(
      data, err, handleMessage, messages, 'doneReadFail'
    );
    // If the reading failed:
    if (listObject === undefined) {
      // Quit.
      return;
    }
    /*
      The file was successfully parsed. Initialize a list of removed items’
      IDs and texts.
    */
    const removed =[];
    // For each item ID in the specified range:
    for (let i = doneRange[0]; i <= doneRange[1]; i++) {
      // If the item to be removed exists:
      if (listObject.hasOwnProperty(i.toString())) {
        // Append its ID and text to the list of removals.
        removed.push(i.toString() + ': ' + listObject[i]);
        // Remove it from the object.
        delete listObject[i];
      }
    }
    // If any item was removed:
    if (removed.length) {
      // Declare and define a callback function for writeFile.
      const writeCallback = (err) => {
        // If the writing attempt produced an exception:
        if (err) {
          // Handle the error messages.
          handleMessage(messages, 'doneWriteFail');
          console.log(err.message);
          // Quit.
          return;
        }
        // The writing succeeded. For each removed item:
        for (const item of removed) {
          // Handle a success message.
          handleMessage(messages, 'doneReport', '«item»', item);
        }
      };
      /*
        Replace the file with a JSON representation of the modified object.
        When the replacement is complete, execute writeCallback, passing the
        value of its argument to it.
      */
      writeFile(filePath, JSON.stringify(listObject), writeCallback);
    }
    // Otherwise, i.e. if no item was removed:
    else {
      // Handle a message reporting this.
      handleMessage(messages, 'doneMissingFail');
    }
  };
  /*
    Read the file. When the reading is complete, execute readCallback,
    passing the values of its arguments to it.
  */
  readJSON(filePath, readCallback);
};
