/**
  Manager of a list stored in a JSON-format file. Performs additions to it,
  deletions from it, and disclosures and resets of it in response to
  command-line arguments. Called by Node.js.
*/

//////// IMPORTS ////////

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

// Import the validate objects from the validate module.
const validate = module.require('./src/validate');
const isNonblankString = validate.isNonblankString;
const areIntRangeStrings = validate.areIntRangeStrings;

//////// CONSTANTS ////////

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

//////// COMMANDS ////////

// If a command was named:
if (args[0] !== undefined) {

  //// HELP ////

  if (args[0] === 'help') {
    // Process the documentation.
    handleMessage(messages, 'helpTip');
  }

  //// ADD ////

  else if (args[0] === 'add' && isNonblankString(args[1])) {
    // Execute the addition function.
    add(filePath, args[1], handleMessage, messages);
  }

  //// DONE ////

  else if (args[0] === 'done' && isNonblankString(args[1])) {
    /*
      Identify an array of strings representing the item IDs starting and
      ending the ID range to be removed.
    */
    const doneRangeStrings = args[1].split('-');
    doneRangeStrings.length === 1 && (
      doneRangeStrings[1] = doneRangeStrings[0]
    );
    // If the range is valid:
    if (areIntRangeStrings(...doneRangeStrings, 1)) {
      // Convert the range boundaries to integers.
      const doneRange = doneRangeStrings.map(
        currentValue => Number.parseInt(currentValue)
      );
      // Execute the removal function.
      done(filePath, doneRange, handleMessage, messages);
    }
    // Otherwise, i.e. if they are not both valid:
    else {
      // Handle an error message.
      handleMessage(messages, 'commandFail');
    }
  }

  //// LIST ////

  else if (args[0] === 'list') {
    // Execute the listing function.
    list(filePath, handleMessage, messages);
  }

  //// RESET ////

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
