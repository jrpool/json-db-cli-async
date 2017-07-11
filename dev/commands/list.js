// Process a command to list the items in a list.

// Import the “fs” module.
const fs = require('fs');

// Import the “cli-table2” module.
const Table = require('cli-table2');

/*
  Import the “messages” object from the messages module. (With module.require,
  a relative path is relative to this file.)
*/
const messages = module.require('../src/messages').messages;

/*
  Declare, define, and export a function that lists the items in the list
    in a specified JSON file.
  Preconditions:
    0. fileBase is the name, less final “.json”, of a readable UTF-8-encoded
      file in the project’s `data` directory in JSON format, representing
      an object, all of whose properties have string values.
    1. resultAction is a function.
*/
exports.list = (fileBase, resultAction) => {
  // Identify the file pathname.
  const filePath = './data/' + fileBase + '.json';
  /*
    Read the file as UTF-8. (With fs, a relative path is relative to
    process.cwd().)
  */
  fs.readFile(
    filePath,
    'utf8',
    // After it is read:
    (err, data) => {
      // If the reading failed:
      if (err) {
        // Act on the error.
        resultAction(messages.listReadFail);
      }
      // Otherwise, i.e. if the reading succeeded:
      else {
        // Convert the file to an object.
        const listObject = JSON.parse(data);
        // Create a table with column headers.
        const table = new Table({
          head: [messages.listCol0Head, messages.listCol1Head]
        });
        // Identify an array of the item IDs as integers.
        const itemIDs = Object.keys(listObject).slice(1).map(function(currentValue) {
          return Number.parseInt(currentValue, 10);
        });
        // Sort them.
        itemIDs.sort((a, b) => a - b);
        // For each of them, add a row to the table.
        itemIDs.forEach(currentValue => {
          table.push([currentValue, listObject[currentValue]]);
        });
        // Act on the table.
        resultAction(
          table.toString() + '\n' + (
            itemIDs.length === 1 ? messages.listSumReport1
              : messages.listSumReport2.replace(
                /«itemIDs.length»/, itemIDs.length
              )
          )
        );
      }
    }
  );
};
