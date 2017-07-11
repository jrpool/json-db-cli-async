/*
  Manager of a list stored in a JSON-format file. Performs additions to it,
  deletions from it, and disclosures of it in response to command-line
  arguments. Called by Node.js.
*/

// Import the “add” function from the add module.
const add = module.require('./src/commands/add').add;

// Import the “done” function from the done module.
const done = module.require('./src/commands/done').done;

// Import the “list” function from the list module.
const list = module.require('./src/commands/list').list;

// Import the “reset” function from the reset module.
const reset = module.require('./src/commands/reset').reset;

// Import the “messages” object from the messages module.
const messages = module.require('./src/messages').messages;

// Identify the path of the JSON file containing the list.
const filePath = process.cwd() + '/data/' + 'tasks' + '.json';

// Identify the command-line arguments.
const args = process.argv.slice(2);

// Define a function that acts on a message.
const handleMessage = (messages, messageKey, symbol, replacement) => {
  // Initialize the message.
  let message = messages[messageKey];
  // If there is a symbol to replace in it:
  if (symbol) {
    // Replace all instances of it.
    message = message.replace(RegExp(symbol, 'g'), replacement);
  }
  // Output the message.
  console.log(message);
};

// If a command was named:
if (args[0] !== undefined) {
  // If it was “help”:
  if (args[0] === 'help') {
    // Process the documentation.
    handleMessage(messages, 'helpTip');
  }
  // Otherwise, if it was “add” and a valid string was specified:
  else if (args[0] === 'add' && args[1] !== undefined && args[1].length) {
    // Execute the addition function.
    add(filePath, args[1], handleMessage, messages);
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
      done(filePath, itemIDs, handleMessage, messages);
    }
    // Otherwise, i.e. if they are not both valid:
    else {
      handleMessage(messages, 'commandFail');
    }
  }
  // Otherwise, if it was “list”:
  else if (args[0] === 'list') {
    // Execute the listing function.
    list(filePath, handleMessage, messages);
  }
  // Otherwise, if it was “reset”:
  else if (args[0] === 'reset') {
    // Execute the reset function.
    reset(filePath, handleMessage, messages);
  }
  // Otherwise, i.e. if the command was invalid:
  else {
    // Report the error.
    handleMessage(messages, 'commandFail');
  }
}
