// Copy the directories and files in /doc to /, deleting comments.

// Import the “fs” module.
const fs = require('fs');

// Identify the arguments in the call to copyAndModifyFiles.

// Define a function to create a modified version of a string.
const

// Define a function to uncomment code in a project.
const copyAndModifyFiles = (dir, fromRegExp, toString) => {
  /**
    CALLBACK FUNCTION DEFINITIONS:

      READDIRCALLBACK
  */
  // Define a callback function for readdir.
  const readdirCallback = (err, files) => {
    console.log('\nabout to execute readdirCallback on ' + files.join(', '));
    /**
        FOREACHCALLBACK
    */
    // Define a callback function for forEach.
    const forEachCallback = currentValue => {
      /**
            STATCALLBACK
      */
      // Define a callback function for stat.
      const statCallback = (err, stats) => {
        console.log('\nabout to execute statCallback');
        console.log(
          'The names of the properties of its stats parameter are: '
            + Object.keys(stats).join(', ')
        );
        /**
                READFILECALLBACK
        */
        // Define a callback function for readFile.
        const readFileCallback = (err, data) => {
          console.log('\nabout to execute readFileCallback');
          // Define a callback function for writeFile.
          /**
                  WRITEFILECALLBACK
          */
          const writeFileCallback = err => {
            console.log('\nabout to execute writeFileCallback');
            // If there was an error in the writing of the file, report the error.
            err && console.log(
              '[writeFileCallback] (' + currentValue + '): ' + err.message
            );
          };

          // If there was an error in the reading of the file:
          if (err) {
            // Report the error.
            console.log('[24]' + err.message);
          }
          // Otherwise, i.e. if there was no error:
          else {
            // Identify the file content without its comments.
            const bareCode = data.replace(/^ *\/\/.+\n|^ *\/\*[^]+?\*\/\n/mg, '');
            /*
              Identify the production-code destination pathname for the
              uncommented file and start a process to write the file to it,
              replacing any existing file at the same pathname. When the
              writing is complete, execute writeFileCallback.
            */
            fs.writeFile(
              [productionRoot, subpath, currentValue].filter(
                value => value.length
              ), bareCode, 'utf8', writeFileCallback
            );
          }
        };
        Object.keys(stats).forEach(key => console.log(key + ' = ' + stats[key]));
        // If the current item is a directory:
        if (stats.isDirectory()) {
          // Redefine subpath to include it.
          console.log('currentValue in statCallback is ' + currentValue);
          subpath = [subpath, currentValue].filter(value => value.length).join('/');
          console.log('new subpath is ' + subpath);
          console.log('statCallback about to execute readdir');
          /*
            Start a process to identify its contents. When the identification is
            complete, execute readdirCallback.
          */
          fs.readdir(subpath, 'utf8', readdirCallback);
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
      if (currentValue[0] === '.') {return;}
      console.log('\nabout to execute forEachCallback');
      console.log(
        'making itemPath from ' + docRoot + ', ' + subpath + ', & ' + currentValue
      );
      const itemPath = [docRoot, subpath, currentValue]
        .filter(value => value.length).join('/');
      console.log('currentValue in forEachCallback is ' + currentValue);
      console.log('about to examine ' + itemPath);
      fs.stat(itemPath, statCallback);
    };
    if (err) {
      console.log('[readdirCallback]' + err.message);
    }
    else {
      console.log('no error in readdirCallback');
      // Remove any hidden files from the array of items to be processed.
      fileArray = files = files.filter(value => value[0] !== '.');
      // Execute forEachCallback on each remaining item.
      files.forEach(forEachCallback);
    }
  };
  // Initialize the bare-code directory.
  const bareDir = projectDir;
  // Initialize the explained-code directory.
  const docDir = bareDir + '/doc';
  /*
    Read the explained-code directory. When the reading is complete, execute
    readdirCallback.
  */
  fs.readdir(docRoot, 'utf8', readdirCallback);
};
