// Copy the directories and files in /doc to /, deleting comments.

// Import the “sylar” module.
const sylar = require('sylar');

// Copy the files in ./doc to ./, recursively, while also uncommenting them.
sylar(
  {
    src: "./doc",
    dest: ".",
    filter: {
      "*.js": content => {
        return content.replace(/^ *\/\/.+\n|^ *\/\*[^]+?\*\/\n/mg, '');
      }
    }
  }
).done(() => {console.log("Done");}).fail(err => console.log(err.message));
