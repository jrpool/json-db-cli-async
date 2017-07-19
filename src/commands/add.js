/// Process a command to add an item to a list.

const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const writeFile = fileIO.writeFile;
const parseJSON = fileIO.parseJSON;

/**
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
  const readCallback = (err, data) => {
    const listObject = parseJSON(
      data, err, handleMessage, messages, 'addReadFail'
    );
    if (listObject === undefined) {
      return;
    }
    const nextID = listObject['nextID'];
    listObject['nextID'] = listObject['nextID'] + 1;
    listObject[nextID] = itemText;
    const writeCallback = (err) => {
      if (err) {
        handleMessage(messages, 'addWriteFail');
        console.log(err.message);
        return;
      }
      handleMessage(messages, 'addReport', '«addResult»', nextID);
    };
    writeFile(filePath, JSON.stringify(listObject), writeCallback);
  };
  readJSON(filePath, readCallback);
};
