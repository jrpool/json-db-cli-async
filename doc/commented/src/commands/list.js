// Process a command to list the items in a list.

// Import readJSON from the fileIO module.
const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const parseJSON = fileIO.parseJSON;

// Import the “cli-table2” module.
const Table = require('cli-table2');

/*
  Declare, define, and export a function that outputs the items in the list
    in a specified JSON file as a table.
  Preconditions:
  0. filePath is the pathname of a UTF-8-encoded JSON file representing
    an object that has a property named “nextID” with an integer value, and
    whose other properties, if any, have keys that can be cast to integers
    all of which are less than the value of the “nextID” property.
  1. handleMessage is a function.
  2. messages is an object.
*/
exports.list = (filePath, handleMessage, messages) => {
  // Declare and define a callback function for readFile.
  const readCallback = (err, data) => {
    // Identify an object represented by the file that was read.
    const listObject = parseJSON(
      data, err, handleMessage, messages, 'listReadFail'
    );
    // If the reading failed:
    if (listObject === undefined) {
      // Quit.
      return;
    }
    /*
      The file was successfully parsed. Create a table with column headers
      for list items.
    */
    const table = new Table({
      head: [messages.listCol0Head, messages.listCol1Head]
    });
    // Identify an array of the item IDs as integers.
    const itemIDs =
      Object.keys(listObject)
        .filter(currentValue => currentValue !== 'nextID')
        .map(currentValue => Number.parseInt(currentValue, 10));
    // Sort them numerically.
    itemIDs.sort((a, b) => a - b);
    // For each of them, add a row to the table.
    itemIDs.forEach(currentValue => {
      table.push([currentValue, listObject[currentValue]]);
    });
    // Identify a footer template for the table.
    const footer =
      itemIDs.length === 1 ? messages.listSumReport1 : messages.listSumReport2;
    /*
      Identify an object with the table and its footer template as the value
      of a property.
    */
    const tableWrapper = {'table': [table.toString(), footer].join('\n')};
    // Handle the table and its footer template as a message.
    handleMessage(tableWrapper, 'table', '«itemIDs.length»', itemIDs.length);
  };
  /*
    Read the file. When the reading is complete, execute the callback,
    passing the values of its arguments to it.
  */
  readJSON(filePath, readCallback);
};
