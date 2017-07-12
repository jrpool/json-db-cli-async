// Process a command to add an item to a list.

// Import the fileIO objects from the readFile module.
const fileIO = module.require('../fileIO');
const readJSONSync = fileIO.readJSONSync;
const writeFileSync = fileIO.writeFileSync;

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
  // Read the file and wait for completion.
  const listObject = readJSONSync(
    filePath, handleMessage, messages, 'addReadFail'
  );
  // Identify the next ID and then increment it in the object.
  const nextID = listObject['nextID'];
  listObject['nextID'] = listObject['nextID'] + 1;
  /*
    Add a property to the object with the next ID as its key and itemText
    as its value.
  */
  listObject[nextID] = itemText;
  /*
    Replace the file with a JSON representation of the modified object.
    If the replacement succeeded:
  */
  if (writeFileSync(
    filePath, JSON.stringify(listObject),
    handleMessage, messages, 'addWriteFail'
  )) {
    // Handle the success report.
    handleMessage(messages, 'addReport', '«addResult»', nextID);
  }
};
