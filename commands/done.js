// Process a command to remove an item from a list.

// Import the “fs” module.
const fs = require('fs');

// Import the “messages” object from the messages module.
const messages = module.require('../src/messages').messages;

/*
  Declare, define, and export a function that removes a specified item from
    the list in a specified JSON file.
  Preconditions:
    0. fileBase is the name, less final “.json”, of a readable UTF-8-encoded
      file in the project’s `data` directory in JSON format, representing
      an object.
    1. ItemIDs is an array of 2 integers in nondescending order.
    2. resultAction is a function.
*/
exports.done = (fileBase, itemIDs, resultAction) => {
  // Identify the file pathname.
  const filePath = './data/' + fileBase + '.json';
  // Read the file as UTF-8.
  fs.readFile(
    filePath,
    'utf8',
    // After it is read:
    (err, data) => {
      // If the reading failed:
      if (err) {
        // Act on the error.
        resultAction(messages.doneReadFail);
      }
      // Otherwise, i.e. if the reading succeeded:
      else {
        // Convert the file to an object.
        const listObject = JSON.parse(data);
        // Initialize a list of removed items’ IDs and texts.
        const removed =[];
        // For each item ID in the specified range:
        for (let i = itemIDs[0]; i <= itemIDs[1]; i++) {
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
          // Replace the file with a JSON representation of the modified object.
          fs.writeFile(
            filePath,
            JSON.stringify(listObject),
            // After it is written:
            (err) => {
              // If the writing failed:
              if (err) {
                // Act on the error.
                resultAction(messages.doneWriteFail);
              }
              // Otherwise, i.e. if the writing succeeded:
              else {
                // For each removed item:
                for (const item of removed) {
                  // Act on the success.
                  resultAction(
                    messages.doneReport.replace(/«item»/, item)
                  );
                }
              }
            }
          );
        }
        // Otherwise, i.e. if no item was removed:
        else {
          // Act on the error.
          resultAction(messages.doneMissingFail);
        }
      }
    }
  );
};
