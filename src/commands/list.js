/// Process a command to list the items in a list.

const fileIO = module.require('../fileIO');
const readJSON = fileIO.readJSON;
const parseJSON = fileIO.parseJSON;

const Table = require('cli-table2');

/**
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
  const readCallback = (err, data) => {
    const listObject = parseJSON(
      data, err, handleMessage, messages, 'listReadFail'
    );
    if (listObject === undefined) {
      return;
    }
    const table = new Table({
      head: [messages.listCol0Head, messages.listCol1Head]
    });
    const itemIDs =
      Object.keys(listObject)
        .filter(currentValue => currentValue !== 'nextID')
        .map(currentValue => Number.parseInt(currentValue, 10));
    itemIDs.sort((a, b) => a - b);
    itemIDs.forEach(currentValue => {
      table.push([currentValue, listObject[currentValue]]);
    });
    const footer =
      itemIDs.length === 1 ? messages.listSumReport1 : messages.listSumReport2;
    const tableWrapper = {'table': [table.toString(), footer].join('\n')};
    handleMessage(tableWrapper, 'table', '«itemIDs.length»', itemIDs.length);
  };
  readJSON(filePath, readCallback);
};
