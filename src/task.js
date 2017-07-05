/*
  Manager of a list stored in a JSON-format file. Performs additions to it,
  deletions from it, and disclosures of it in response to command-line
  arguments. Called by Node.js.
*/

// Import the “fs” module.
const fs = require('fs');

// Import the “add” function from the add module.
const add = module.require('../commands/add').add;

// Import the “done” function from the done module.
const done = module.require('../commands/done').done;

// Import the “list” function from the list module.
const list = module.require('../commands/list').list
;

// Import the “messages” object from the messages module.
const messages = module.require('./messages').messages;

// Identify the base of the name of the JSON file containing the list.
const listFile = 'tasks';

// Identify the command-line arguments.
const args = process.argv.slice(2);

// Define a function that acts on the result.
const resultAction = message => {console.log(message);};

// If a command was named:
if (args[0] !== undefined) {
  // If it was “help”:
  if (args[0] === 'help') {
    // Display the documentation.
    console.log(messages.helpTip);
  }
  // Otherwise, if it was “add” and a valid string was specified:
  else if (args[0] === 'add' && args[1] !== undefined && args[1].length) {
    // Execute the addition function.
    add(listFile, args[1], resultAction);
  }
  // Otherwise, if it was “done” and a formally valid ID argument was specified:
  else if (
    args[0] === 'done'
    && args[1] !== undefined
    && args[1].length
  ) {
    // Identify an array of the item IDs starting and ending the ID range.
    const itemIDs = args[1].split('-');
    itemIDs.length === 1 && (itemIDs[1] = itemIDs[0]);
    // If they are both valid:
    if (
      itemIDs.length > 0 && itemIDs.length < 3
      && Number.isInteger(itemIDs[0] = Number.parseInt(itemIDs[0]))
      && Number.isInteger(itemIDs[1] = Number.parseInt(itemIDs[1]))
      && itemIDs[0] > 0
      && itemIDs[1] >= itemIDs[0]
    ) {
      // Execute the removal function.
      done(listFile, itemIDs, resultAction);
    }
    // Otherwise, i.e. if they are not both valid:
    else {
      resultAction(messages.commandFail);
    }
  }
  // Otherwise, if it was “list”:
  else if (args[0] === 'list') {
    // Execute the listing function.
    list(listFile, resultAction);
  }
  // Otherwise, i.e. if the command was invalid:
  else {
    // Report the error.
    resultAction(messages.commandFail);
  }
}
