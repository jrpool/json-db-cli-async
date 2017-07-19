/// Process a command to remove items from a list.

const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const writeFile = fileIO.writeFile;
const parseJSON = fileIO.parseJSON;

/**
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
  const readCallback = (err, data) => {
    const listObject = parseJSON(
      data, err, handleMessage, messages, 'doneReadFail'
    );
    if (listObject === undefined) {
      return;
    }
    const removed =[];
    for (let i = doneRange[0]; i <= doneRange[1]; i++) {
      if (listObject.hasOwnProperty(i.toString())) {
        removed.push(i.toString() + ': ' + listObject[i]);
        delete listObject[i];
      }
    }
    if (removed.length) {
      const writeCallback = (err) => {
        if (err) {
          handleMessage(messages, 'doneWriteFail');
          console.log(err.message);
          return;
        }
        for (const item of removed) {
          handleMessage(messages, 'doneReport', '«item»', item);
        }
      };
      writeFile(filePath, JSON.stringify(listObject), writeCallback);
    }
    else {
      handleMessage(messages, 'doneMissingFail');
    }
  };
  readJSON(filePath, readCallback);
};
