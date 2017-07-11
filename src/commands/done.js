// Process a command to remove items from a list.

// Import the fileIO objects from the readFile module.
const fileIO = module.require('../fileIO');
const readFileSync = fileIO.readFileSync;
const writeFileSync = fileIO.writeFileSync;

/*
  Declare, define, and export a function that removes a specified item from
    the list in a specified JSON file.
  Preconditions:
    0. filePath is the pathname of a UTF-8-encoded JSON file representing
      an object whose keys are string representations of nonnegative integers,
      whose values are nonblank, and which has a property with key "0", the
      value of which property is a positive integer, such that no property of
      the object has a key whose integer representation is greater than or
      equal to it.
    1. handleMessage is a function
*/
exports.done = (filePath, itemIDs, handleMessage, messages) => {
  // Read the file and wait for completion.
  const listString = readFileSync(
    filePath, handleMessage, messages, 'addReadFail'
  );
  // If the reading succeeded:
  if (listString !== undefined) {
    // Identify its conversion from JSON to an object.
    const listObject = JSON.parse(listString);
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
      writeFileSync(filePath, JSON.stringify(listObject));
      // For each removed item:
      for (const item of removed) {
        // Handle a success message.
        handleMessage(messages, 'doneReport', '«item»', item);
      }
    }
    // Otherwise, i.e. if no item was removed:
    else {
      // Act on the error.
      handleMessage(messages, 'doneMissingFail');
    }
  }
};
