// Process a command to list the items in a list.

// Import the “cli-table2” module.
const Table = require('cli-table2');

// Import the readFileSync from the readFile module.
const readJSONSync = module.require('../fileIO').readJSONSync;

/*
  Declare, define, and export a function that lists the items in the list
    in a specified JSON file.
  Preconditions:
  0. filePath is the pathname of a UTF-8-encoded JSON file representing
    an object whose keys are string representations of nonnegative integers,
    whose values are nonblank, and which has a property with key "0", the
    value of which property is a positive integer, such that no property of
    the object has a key whose integer representation is greater than or
    equal to it.
  1. handleMessage is a function.
*/
exports.list = (filePath, handleMessage, messages) => {
  // Read the file and wait for completion.
  const listObject = readJSONSync(
    filePath, handleMessage, messages, 'listReadFail'
  );
  // Create a table with column headers.
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
  // Identify a footer for the table.
  const footer =
    itemIDs.length === 1 ? messages.listSumReport1 : messages.listSumReport2;
  /*
    Identify an object with the table and its footer template as the value
    of a property.
  */
  const tables = {'table': [table.toString(), footer].join('\n')};
  // Handle the table and its footer template as a message.
  handleMessage(tables, 'table', '«itemIDs.length»', itemIDs.length);
};
