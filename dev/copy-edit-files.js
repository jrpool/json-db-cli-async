/// Cautiously copy and edit files in a directory tree.

// Import the “fs” module.
const fs = require('fs');

/**

  ===================
  ARGUMENT PROCESSING
  ===================

*/

// Function to validate calling arguments.
const validate = (args) => {
  // Return whether the calling arguments are superficially valid.
  return (
    args.length > 2 && args.length < 5
    && args.every(arg => arg !== undefined)
    && typeof args[0] === string && typeof args[1] === string
    && args[0].length && args[1].length && args[2].length
    && args[0][0] === '/' && args[1][0] === '/'
    && !args[1].startsWith(args[0])
    && !args[0].startsWith(args[1])
  );
};

/*
  Function to obtain editing parameters from the calling arguments.
  Preconditions:
    0. The calling arguments are valid.
*/
const getEditParams = (args) => {
  // If thare are 4 calling arguments:
  if (args.length === 4) {
    // Identify argument 2 as a regular expression.
    try {
      const arg2RegExp = RegExp(args[2], 'mg');
      return [arg2RegExp, args[3]];
    }
    // If there was an error:
    catch (err) {
      // Report it.
      console.log('[getEditParams]' + err.message);
    }
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

  ======================================
  FILE-PROCESSING FUNCTIONS: SYNCHRONOUS
  ======================================

*/
/**
  Function to return a copy of a string with a global substring replacement.
  Preconditions:
    0. original is a string.
    1. editParams is an array of length 2. Element 0 is a regular expression
      and element 1 is a string.
*/
const getEditedString = (original, editParams) => {
  // Return an edited copy of the string.
  return original.replace(editParams[0], 'mg', editParams[1]);
}

/**

  ========================================
  FILE-PROCESSING  FUNCTIONS: ASYNCHRONOUS
  ========================================

CATALOGFILES: START

  Function to recursively catalog the files in a specified directory.
  Preconditions:
    0. fromTop is a valid top-level directory, normally supplied as the first
      command-line argument.
    2. The user has execute permission on fromTop.
*/
const catalogFiles(fromTop) => {
  /*
    Declare and initialize variables, scoped to this function’s outer block,
    to represent the remainder of the pathnames after fromTop and toTop and
    the name of the current item. DELETABLE?
  */
  // let pathRest = itemName = '';
  /**
    READDIRCALLBACK: START
  */
  const readdirCallback = (err, items) => {
    /**
      FOREACHCALLBACK: START
    */
    const forEachCallback = itemName => {
      /**
        STATCALLBACK: START
      */
      const statCallback = (err, stats) => {
        /**
          READFILECALLBACK: START
        */
        const readFileCallback = (err, data) => {
          // If there was an error in the reading of the file:
          if (err) {
            // Report it.
            console.log(
              '[readFileCallback] (' + fromTop + pathRest + itemName + '): ' + err.message
            );
          }
          // Otherwise, i.e. if there was no error:
          else {
            // Identify an edited version of the content.
            const edited = ;
            /*
              Write it to a new file. When the writing is complete, execute
              writeFileCallback.
            */
            fs.writeFile(
              toTop + pathRest + '/' + itemName,
              getEditedString(data, editParams),
              'utf8',
              writeFileCallback
            );
          }
        };
        /**
          READFILECALLBACK: END
        */
        /*
          If this item is the first in its directory and that directory is
          not the top-level directory:
        */
        if (itemName === firstItem && pathRest.length) {
          // Update the rest of the path of that directory.
        };
        /*
          If there was an error in the attempt to identify facts about
          the item:
        */
        if (err) {
          // Report it.
          console.log(
            '[statCallback] (' + fromTop + pathRest + '/' + itemName + ')\n'
            + err.message
          );
          // Return a failure result.
          return;
        }
        // Otherwise, if the item is a directory:
        if (stats.isDirectory()) {
          // Update the rest of the current directory’s pathname.
          pathRest += '/' + itemName;
          /*
            Start a process to create the corresponding toDir with read,
            write, and execute permission for the user. When the creation
            is complete, execute mkdirCallback.
          */
          fs.mkdir(toTop + pathRest, 0o700, mkdirCallback);
        }
        // Otherwise, if the item is a non-directory file:
        else if (stats.isFile()) {
          /*
            Start a process to read it. When the reading is complete,
            execute readFileCallback.
          */
          fs.readFile(
            fromTop + pathRest + '/' + itemName, 'utf8', readFileCallback
          );
        }
      };
      /**
        STATCALLBACK: END
      */
      /*
        Start a process to identify facts about the item. When the
        identification is complete, execute statCallback.
      */
      fs.stat(FromTop + pathRest + '/' + itemName, statCallback);
    };
    /**
      FOREACHCALLBACK: END
    */
    /*
      If there was an error during the attempt to read the directory:
    */
    if (err) {
      // Report it.
      console.log(
        '[readdirCallback] (' + fromTop + pathRest + ')\n' + err.message
      );
      // Return a failure result.
      return;
    }
    // Otherwise, i.e. if the reading succeeded:
    else {
      // Remove any hidden items from the array of items to be processed.
      const visibleItems = files.filter(value => value[0] !== '.');
      // Execute forEachCallback on each remaining item.
      visibleItems.forEach(forEachCallback);
    }
  };
  /**
    READDIRCALLBACK: END
  */
  // Identify the pathname of the directory that will be read.
  const dirPath = fromTop;
  // Read it. When the reading is complete, execute readdirCallback.
  fs.readdir(dirPath, 'utf8', readdirCallback);
};
/**
CATALOGFILES: END
*/

/**
COPYANDEDITFILES: START

  Function to recursively copy the files in a specified directory to a new
  specified directory, and, before writing each file’s content, perform
  specified edits on it.
  Preconditions:
    0. fromTop and toTop are valid top-level source and destination
      directories, respectively, normally supplied as the first 2 command-line
      arguments.
    1. editParams is a 2-element array, normally returned by getEditParams().
      Its element 0 is a regular expression, and its element 1 is a string.
    2. The user has execute permission on fromTop and write permission on
      the parent directory of toTop.
*/
const copyAndEditFiles(fromTop, toTop, editParams) => {
  /*
    Declare and initialize variables, scoped to this function’s outer block,
    to represent the remainder of the pathnames after fromTop and toTop and
    the name of the current item.
  */
  let pathRest = itemName = '';
  /**
    MKDIRCALLBACK: START
  */
  const mkdirCallback = err => {
    /**
      READDIRCALLBACK: START
    */
    const readdirCallback = (err, files) => {
      /**
        FOREACHCALLBACK: START
      */
      const forEachCallback = itemName => {
        /**
          STATCALLBACK: START
        */
        const statCallback = (err, stats) => {
          /**
            READFILECALLBACK: START
          */
          const readFileCallback = (err, data) => {
            /**
              WRITEFILECALLBACK: START
            */
            const writeFileCallback = err => {
              // If there was an error in the writing of the file, report it.
              err && console.log(
                '[writeFileCallback] ('
                + toTop + pathRest + '/' + itemName
                + '): ' + err.message
              );
            };
            /**
              WRITEFILECALLBACK: END
            */
            // If there was an error in the reading of the file:
            if (err) {
              // Report it.
              console.log(
                '[readFileCallback] (' + fromTop + pathRest + itemName + '): ' + err.message
              );
            }
            // Otherwise, i.e. if there was no error:
            else {
              // Identify an edited version of the content.
              const edited = ;
              /*
                Write it to a new file. When the writing is complete, execute
                writeFileCallback.
              */
              fs.writeFile(
                toTop + pathRest + '/' + itemName,
                getEditedString(data, editParams),
                'utf8',
                writeFileCallback
              );
            }
          };
          /**
            READFILECALLBACK: END
          */
          /*
            If this item is the first in its directory and that directory is
            not the top-level directory:
          */
          if (itemName === firstItem && pathRest.length) {
            // Update the rest of the path of that directory.
          };
          /*
            If there was an error in the attempt to identify facts about
            the item:
          */
          if (err) {
            // Report it.
            console.log(
              '[statCallback] (' + fromTop + pathRest + '/' + itemName + ')\n'
              + err.message
            );
            // Return a failure result.
            return;
          }
          // Otherwise, if the item is a directory:
          if (stats.isDirectory()) {
            // Update the rest of the current directory’s pathname.
            pathRest += '/' + itemName;
            /*
              Start a process to create the corresponding toDir with read,
              write, and execute permission for the user. When the creation
              is complete, execute mkdirCallback.
            */
            fs.mkdir(toTop + pathRest, 0o700, mkdirCallback);
          }
          // Otherwise, if the item is a non-directory file:
          else if (stats.isFile()) {
            /*
              Start a process to read it. When the reading is complete,
              execute readFileCallback.
            */
            fs.readFile(
              fromTop + pathRest + '/' + itemName, 'utf8', readFileCallback
            );
          }
        };
        /**
          STATCALLBACK: END
        */
        /*
          Start a process to identify facts about the item. When the
          identification is complete, execute statCallback.
        */
        fs.stat(FromTop + pathRest + '/' + itemName, statCallback);
      };
      /**
        FOREACHCALLBACK: END
      */
      /*
        If there was an error during the attempt to read the current source
        directory:
      */
      if (err) {
        // Report it.
        console.log(
          '[readdirCallback] (' + fromTop + pathRest + ')\n' + err.message
        );
        // Return a failure result.
        return;
      }
      // Otherwise, i.e. if the reading succeeded:
      else {
        // Remove any hidden items from the array of items to be processed.
        const visibleItems = files.filter(value => value[0] !== '.');
        // Execute forEachCallback on each remaining item.
        visibleItems.forEach(forEachCallback);
      }
    };
    /**
      READDIRCALLBACK: END
    */
    /*
      If there was an error during the attempt to create the current destination
      directory:
    */
    if (err) {
      // Report it.
      console.log(
        '[mkdirCallback] (' + toTop + pathRest + '/' + itemName + ')\n' + err.message
      );
      // Return a failure result.
      return;
    }
    // Otherwise, i.e. if the creation succeeded:
    else {
      /*
        Read the current source directory. When the reading is complete,
        execute readdirCallback.
      */
      fs.readdir(fromTop + pathRest, 'utf8', readdirCallback);
    }
  };
  /**
    MKDIRCALLBACK: END
  */
  /*
    Create, only once, the top-level destination directory with read, write,
    and execute permission for the user. When the creation is complete, execute
    mkdirCallback.
  */
  fs.mkdir(toTop, 0o700, mkdirCallback);
};
/**
COPYANDEDITFILES: END
*/

/**

  =========
  EXECUTION
  =========

*/
// Identify whether the calling arguments are superficially valid.
const callArgs = process.argv.slice(2);
const callArgsValid = validate(callArgs);
// If so:
if (callArgsValid) {
  // Identify the editing parameters.
  const editParams = getEditParams(callArgs);
  // If the requested editing parameters were known:
  if (editParams) {
    // Execute the main function with the initial pathnames.
    copyAndEditFiles(callArgs[0], callArgs[1], editParams);
}
