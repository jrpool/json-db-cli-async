// Process a command to add an item to a list.

// Import the fileIO objects from the fileIO module.
const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const writeFile = fileIO.writeFile;
const parseJSON = fileIO.parseJSON;

/*
  Declare, define, and export a function that adds a specified item to the
    list in a specified JSON file.
  Preconditions:
    0. filePath is the pathname of a UTF-8-encoded JSON file representing
      an object whose keys are string representations of nonnegative integers,
      whose values are nonblank, and which has a property with key "0", the
      value of which property is a positive integer, such that no property of
      the object has a key whose integer representation is greater than or
      equal to it.
    1. itemText is a nonblank string.
    2. handleMessage is a function.
*/
exports.add = (filePath, itemText, handleMessage, messages) => {
  // Declare and define a callback function for readJSON.
  const readCallback = (err, data) => {
    // Identify an object represented by the file that was read.
    const listObject = parseJSON(
      data, err, handleMessage, messages, 'addReadFail'
    );
    // If the reading failed:
    if (listObject === undefined) {
      // Quit.
      return;
    }
    /*
      The file was successfully parsed. Identify the next ID and then
      increment it in the object.
    */
    const nextID = listObject['nextID'];
    listObject['nextID'] = listObject['nextID'] + 1;
    /*
      Add a property to the object with the next ID as its key and itemText
      as its value.
    */
    listObject[nextID] = itemText;
    // Declare and define a callback function for writeFile.
    const writeCallback = (err) => {
      // If the writing attempt produced an exception:
      if (err) {
        // Handle the error messages.
        handleMessage(messages, 'addWriteFail');
        console.log(err.message);
        // Quit.
        return;
      }
      // The writing succeeded. Handle a success message.
      handleMessage(messages, 'addReport', '«addResult»', nextID);
    };
    /*
      Replace the file with a JSON representation of the modified object.
      When the replacement is complete, execute writeCallback, passing the
      value of its argument to it.
    */
    writeFile(filePath, JSON.stringify(listObject), writeCallback);
  };
  /*
    Read the file. When the reading is complete, execute readCallback,
    passing the values of its arguments to it.
  */
  readJSON(filePath, readCallback);
};
