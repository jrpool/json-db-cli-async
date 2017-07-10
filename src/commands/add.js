// Process a command to add an item to a list.

// Import the “fs” module.
const fs = require('fs');

// Import the “messages” object from the messages module.
const messages = module.require('../messages').messages;

/*
  Declare, define, and export a function that adds a specified item to the
    list in a specified JSON file.
  Preconditions:
    0. fileBase is the name, less final “.json”, of a readable UTF-8-encoded
      file in the project’s `data` directory in JSON format, representing
      an object whose keys are string representations of nonnegative integers,
      whose values are nonblank, and which has a property with key "0", the
      value of which property is a positive integer, such that no property of
      the object has a key whose integer representation is greater than or
      equal to it.
    1. itemText is a nonblank string.
    2. resultAction is a function.
*/
exports.add = (fileBase, itemText, resultAction) => {
  // Identify the file pathname.
  const filePath = './data/' + fileBase + '.json';
  // Add the specified item to the file, namely:
  // Read the file as UTF-8.
  fs.readFile(
    filePath,
    'utf8',
    // After it is read:
    (err, data) => {
      // If the reading failed:
      if (err) {
        // Act on the error.
        resultAction(messages.addReadFail);
      }
      // Otherwise, i.e. if the reading succeeded:
      else {
        // Convert the file to an object.
        const listObject = JSON.parse(data);
        /*
          Define the property of the object with a string representation
          of the value of the object’s "0" property as its key and itemText
          as its value, and then increment the value of the object’s "0"
          property.
        */
        listObject[listObject['0']++] = itemText;
        // Replace the file with a JSON representation of the modified object.
        fs.writeFile(
          filePath,
          JSON.stringify(listObject),
          // After it is written:
          (err) => {
            // If the writing failed:
            if (err) {
              // Act on the error.
              resultAction(messages.addWriteFail);
            }
            // Otherwise, i.e. if the writing succeeded:
            else {
              // Act on the success.
              resultAction(
                messages.addReport.replace(/«addResult»/, listObject['0'] - 1)
              );
            }
          }
        );
      }
    }
  );
};
