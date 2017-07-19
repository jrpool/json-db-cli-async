/**
  Manager of a list stored in a JSON-format file. Performs additions to it,
  deletions from it, and disclosures and resets of it in response to
  command-line arguments. Called by Node.js.
*/

//////// IMPORTS ////////

const add = module.require('./src/commands/add').add;

const done = module.require('./src/commands/done').done;

const list = module.require('./src/commands/list').list;

const reset = module.require('./src/commands/reset').reset;

const messages = module.require('./src/messages').messages;

const validate = module.require('./src/validate');
const isNonblankString = validate.isNonblankString;
const areIntRangeStrings = validate.areIntRangeStrings;

//////// CONSTANTS ////////

const filePath = process.cwd() + '/data/' + 'tasks' + '.json';

const args = process.argv.slice(2);

const handleMessage = (messages, messageKey, symbol, replacement) => {
  let message = messages[messageKey];
  if (symbol) {
    message = message.replace(RegExp(symbol, 'g'), replacement);
  }
  console.log(message);
};

//////// COMMANDS ////////

if (args[0] !== undefined) {

  //// HELP ////

  if (args[0] === 'help') {
    handleMessage(messages, 'helpTip');
  }

  //// ADD ////

  else if (args[0] === 'add' && isNonblankString(args[1])) {
    add(filePath, args[1], handleMessage, messages);
  }

  //// DONE ////

  else if (args[0] === 'done' && isNonblankString(args[1])) {
    const doneRangeStrings = args[1].split('-');
    doneRangeStrings.length === 1 && (
      doneRangeStrings[1] = doneRangeStrings[0]
    );
    if (areIntRangeStrings(...doneRangeStrings, 1)) {
      const doneRange = doneRangeStrings.map(
        currentValue => Number.parseInt(currentValue)
      );
      done(filePath, doneRange, handleMessage, messages);
    }
    else {
      handleMessage(messages, 'commandFail');
    }
  }

  //// LIST ////

  else if (args[0] === 'list') {
    list(filePath, handleMessage, messages);
  }

  //// RESET ////

  else if (args[0] === 'reset') {
    reset(filePath, handleMessage, messages);
  }
  else {
    handleMessage(messages, 'commandFail');
  }
}
