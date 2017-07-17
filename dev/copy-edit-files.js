/// Cautiously copy and edit files in a directory tree.

// Import the “fs” module.
const fs = require('fs');

/**

  ===================
  ARGUMENT PROCESSING
  ===================

*/

// Function to validate arguments.
const validate = (...args) => {
  // Return whether the arguments are superficially valid:
  return (
    args.length > 2 && args.length < 5
    && args.every(arg => arg !== undefined)
    && typeof args[0] === string && typeof args[1] === string
    && args[0].length && args[1].length && args[2].length
    && args[0][0] === '/' && args[1][0] === '/'
    && !args[1].startsWith(args[0]);
  );
};

/*
  Function to obtain editing parameters from calling arguments.
  Preconditions:
    0. Calling arguments are valid.
*/
const getEditParams = (...args) => {
  // If thare are 4 calling arguments:
  if (args.length === 4) {
    // Return the editing parameters as a 2-element array.
    return [RegExp(args[2], 'mg'), args[3]];
  }
  // Otherwise, if there are 3 calling arguments:
  else if (args.length === 3) {
    // Name the editing argument “option”.
    const option = args[2];
    // If it is “uncomment”:
    if (option === 'uncomment') {
      // Return the editing parameters as a 2-element array.
      return [RegExp('^ *\/\/.+\n|^ *\/\*[^]+?\*\/\n', 'mg'), ''];
    }
  }
};

/**

  ====================================
  1-TIME VALIDATION AND INITIALIZATION
  ====================================

*/
let fromDirInit, toDirInit, editParams;
// Identify whether the calling arguments are superficially valid.
const callArgs = process.argv.slice(2);
const validCallArgs = validate(callArgs);
// If so:
if (validCallArgs) {
  // Identify the initial pathnames.
  fromDirInit = callArgs[0];
  toDirInit = callArgs[1];
  // Set the editing parameters.
  editParams = getEditParams(callArgs);
}

/**

  ======================================
  FILE-PROCESSING FUNCTIONS: SYNCHRONOUS
  ======================================

*/
/*
  Function to extend and return pathnames.
  Preconditions:
    0. fromDir and toDir are strings representing absolute pathnames of
      directories.
    1. segment is the name of an existing subdirectory of fromDir and a
      a nonexistent but required subdirectory of toDir, or is the name of an
      existing file in fromDir and a file to be created in toDir.
*/
const extendPaths = (fromDir, toDir, segment) => {
  // Return an array of the values of the extended pathnames.
  return [fromDir + '/' + segment, toDir + '/' + segment];
}

/**
  Function to return a copy of a string with a global substring replacement.
  Preconditions:
    0. unedited is a string.
    1. regexp is a regular expression.
    2. string is a string.
*/
const editString = (unedited, regexp, string) => {
  // Return an edited copy of the string.
  return unedited.replace(regexp, 'mg', string);
}

/**

  ========================================
  FILE-PROCESSING  FUNCTIONS: ASYNCHRONOUS
  ========================================

COPYANDEDITFILES: START

  Function to recursively copy the files in a specified directory
  to a new specified directory, and, before writing each file’s content,
  perform specified edits on it.
  Enforced argument requirements:
    0. fromDir is a string representing an absolute directory pathname
      in which the user has read permission.
    1. toDir is a string representing the absolute pathname of a directory
      that does not exist but which the user has permission to create.
    2. toDir is not inside the tree of fromDir.
    3. fromDir is not a child of toDir.
    4. editArgs satisfies the conditions of getEditParams.
*/
const copyAndEditFiles(fromDir, toDir, ...editArgs) => {
  // If the arguments were invalid:
  if (params === undefined) {
    // Quit.
    return;
  }
  /**
    MKDIRCALLBACK: START
  */
  const mkdirCallback = (err) => {
    /**
      READDIRCALLBACK: START
    */
    const readdirCallback = (err, files) => {
      /**
        FOREACHCALLBACK: START
      */
      // Define a callback function for forEach.
      const forEachCallback = dirItem => {
        /**
          STATCALLBACK: START
        */
        // Define a callback function for stat.
        const statCallback = (err, stats) => {
          /**
            READFILECALLBACK: START
          */
          // Define a callback function for readFile.
          const readFileCallback = (err, data) => {
            // Define a callback function for writeFile.
            /**
              WRITEFILECALLBACK: START
            */
            const writeFileCallback = err => {
              // If there was an error in the writing of the file, report it.
              err && console.log(
                '[writeFileCallback] (' + toFile + '): ' + err.message
              );
            };
            /**
              WRITEFILECALLBACK: END
            */
            // If there was an error in the reading of the file:
            if (err) {
              // Report the error.
              console.log(
                '[readFileCallback] (' + fromFile + '): ' + err.message
              );
            }
            // Otherwise, i.e. if there was no error:
            else {
              // Identify an edited version of the content.
              const edited = editString(data, ...editParams);
              /*
                Write it to a new file. When the writing is complete, execute
                writeFileCallback.
              */
              fs.writeFile(toFile, edited, 'utf8', writeFileCallback);
            }
          };
          /**
            READFILECALLBACK: END
          */
          // If the current item is a directory:
          if (stats.isDirectory()) {
            // Extend the directory pathnames to include it.
            const newPaths = extendPaths(fromDir, toDir, dirItem);
            fromDir = newPaths[0];
            toDir = newPaths[1];
            //
              and write a directory there. When
              the writing is complete, execute mkdirCallback.
            */


            subpath = [subpath, currentValue].filter(
              value => value.length).join('/'
            );
            /*
              Start a process to create a directory for the edited copies of
              the files in it. When the creation is complete, execute
              mkdirCallback.
            */
            fs.mkdir(subpath, 'utf8', mkdirCallback);
          }
          // Otherwise, if the current item is a non-directory file:
          else if (stats.isFile()) {
            /*
              Identify its pathname and start a process to read it. When the
              reading is complete, execute readFileCallback.
            */
            fs.readFile(
             [docRoot, subpath, currentValue]
               .filter(value => value.length).join('/'),
               'utf8', readFileCallback
            );
          }
        };
        /**
          STATCALLBACK: END
        */
        if (dirItem[0] === '.') {return;}
        const itemPath = [docRoot, subpath, currentValue]
          .filter(value => value.length).join('/');
        fs.stat(itemPath, statCallback);
      };
      /**
        FOREACHCALLBACK: END
      */
      if (err) {
        console.log('[readdirCallback]' + err.message);
      }
      else {
        // Remove any hidden files from the array of items to be processed.
        fileArray = files = files.filter(value => value[0] !== '.');
        // Execute forEachCallback on each remaining item.
        files.forEach(forEachCallback);
      }
    };
    /**
      READDIRCALLBACK: END
    */
    // If there was an error during the attempt to create toDir:
    if (err) {
      console.log('[mkdirCallback]' + err.message);
      // Return a failure result.
      return;
    }
    // Otherwise, i.e. if the creation succeeded:
    else {
      // Read fromDir. When the reading is complete, execute readdirCallback.
      fs.readdir(fromDir, 'utf8', readdirCallback);
    }
  };
  /**
    MKDIRCALLBACK: END
  */
  /*
    Read fromDir. When the reading is complete, execute readdirCallback.
  */
  fs.readdir(fromDir, 'utf8', readdirCallback);
};
/**
COPYANDEDITFILES: END
*/
