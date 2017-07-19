/// Cautiously copy and edit files in a directory tree.

// Import the `fs` module.
const fs = require('fs');

// Import the `cpr` module.
const cpr = require('cpr');

// Declare a list of full absolute destination pathnames of copies of items.
let pathList;

/**
  =========
  FUNCTIONS
  =========
*/

/// Define a function to validate calling arguments.
const areValid = args => {
  // Return whether the calling arguments are superficially valid.
  return (
    args.length > 2 && args.length < 5
    && args.every(arg => arg !== undefined && typeof arg === 'string')
    && args.slice(0, 2).every(arg => arg.length)
    && args[0][0] === '/' && args[1][0] === '/'
    && !args[1].startsWith(args[0])
    && !args[0].startsWith(args[1])
    && (args.length === 3 || /^\/.+\/$/.test(args[2]))
  );
};

/**
  Define a function to obtain editing parameters from arguments.
  Preconditions:
    0. The count of arguments is 1 or 2.
    1. If there are 2 arguments, argument 0 is a nonblank regular expression
      and argument 1 is a string.
    2. If there is 1 argument, it is the name of a known editing rule.
*/
const getEditParams = args => {
  // If thare are 2 arguments:
  if (args.length === 2) {
    // Identify argument 0 as a regular expression.
    try {
      const arg0RegExp = RegExp(args[0], 'mg');
      // Return that and argument 1 as an array of editing parameters.
      return [arg0RegExp, args[1]];
    }
    // If there was an error:
    catch (err) {
      // Report it.
      console.log('[getEditParams]' + err.message);
    }
  }
  // Otherwise, if there is 1 calling argument:
  else if (args.length === 1) {
    // Name it “rule”.
    const rule = args[0];
    // If it is “uncomment”:
    if (rule === 'uncomment') {
      // Convert it to 2 editing parameters and return them as an array.
      return [RegExp('^ *\/\/.+\n|^ *\/\*[^]+?\*\/\n', 'mg'), ''];
    }
    // Otherwise, if the rule is unknown:
    else {
      // Report this.
      console.log('[getEditParams]' + args[0] + '?');
    }
  }
};

/**
  Define a function to cautiously copy the non-hidden items in a directory
  tree and populate the list of destination pathnames.
*/
const treeCopy = (fromDir, toDir, nextFunction) => {
  cpr(
    fromdir,
    todir,
    {
      // Configure the copier to make a list of the copies’ full absolute paths.
      confirm: true,
      // Configure the copier to omit hidden items and their descendants.
      filter: /\/\./
    },
    // When the copying is complete:
    (err, destinationPaths) => {
      // If there was an error in the copying:
      if (err) {
        // Report it.
        console.log('[treeCopy]' + error.message);
      }
      // Otherwise, i.e. if there was no error:
      else {
        // Populate the list of pathnames.
        pathList = destinationPaths;
        // Execute the next function.
        nextFunction();
      }
    })
  );
}

/**
  Define a function to edit the files in a specified array of pathnames
  in accord with a specified rule.
*/
const editFiles = (pathnames, editParams) => {
  // For each pathname:
  for (const pathname of pathnames) {
    // Determine its type.
    fs.stat(
      pathname,
      // When the determination is complete:
      (err, stats) => {
        // If the item is a nondirectory file:
        if (stats.isFile()) {
          // Identify its content.
          fs.readFile(
            pathname,
            'utf8',
            // When the identification is complete:
            (err, data) => {
              // If there was an error identifying the content:
              if (err) {
                // Report it.
                console.log(
                  '[editFiles/readFile] (' + pathname + '): ' + err.message
                );
              }
              // Otherwise, i.e. if there was no error:
              else {
                /*
                  Identify the content, edited in accord with the specified
                  rule.
                */
                const editedContent = content.replace(
                  editParams[0], 'mg', editParams[1]
                );
                // Replace the file with it.
                fs.writeFile(
                  pathname,
                  editedContent,
                  'utf8',
                  // When the replacement is complete:
                  err => {
                    // If there was an error in the replacement:
                    if (err) {
                      // Report it.
                      console.log(
                        '[editFiles/writeFile] (' + pathname + '): '
                        + err.message
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
};

/**
  =========
  EXECUTION
  =========
*/
// Identify the calling arguments.
const callArgs = process.argv.slice(2);
// If they are superficially valid:
if (areValid (callArgs) {
  // Identify the editing parameters.
  const editParams = getEditParams(callArgs.slice(2));
  // If they are valid:
  if (editParams) {
    // Copy and edit the specified files as specified.
    treeCopy(
      callArgs[0],
      callArgs[1],
      () => {editFiles(pathList, editParams);}
    );
  }
}
