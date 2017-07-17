# copy-edit-files
Application that cautiously copies files in a directory tree to a new
directory and edits the copies.

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
- copy-edit-files.js
```

## Discussion

### General

This application copies all non-hidden files in a specified directory to a specified new directory, editing each file according to a specified function.

In this version 0.0.0, only 1 editing function is permitted: a function that replaces all (single- or multi-line) substrings matching a specified regular expression with a specified string.

You can specify this function in either of 2 ways:

- Supplying the regular expression’s construction string and the destination
string as arguments.

- Specifying the function with the single string argument 'uncomment'.

This “uncomment” specification causes the copy to omit all comments introduced by '// ', '//\n', or '/*\n' as long as the introducer is preceded by nothing except spaces or tabs on its line.

This application is cautious. It refuses to copy into a directory that already exists. It creates the destination directory. Therefore, you cannot mistakenly replace existing files by calling this application.

### Implementation Notes

The application performs several operations and requires them to be completed in a prescribed order. It enforces the order of execution by making each asynchronous operation’s callback function perform all subsequent operations. Since they mostly in turn are asynchronous, there is multilevel callback nesting. Synchronous versions of the asynchronous functions, when they exist, are not called.

The first operation is to validate the arguments formally.

If they are formally valid, the second operation is to specify parameters for the function that will edit the files.

Function `getEditParams` perform these first 2 operations.

Function `copyAndEditFiles` performs the remaining operations, listed in order:

- 0. Create the destination (sub)directory, then call `mkdirCallback`.

- 1. Read the source (sub)directory, then call `readdirCallback`.

- 2. Choose the next item in the (sub)directory for processing, then call `forEachCallback`.

- 3. Determine what kind of item it is, then call `statCallback`.

- 4. If it is a directory, insert a new sequence of operations here for that directory, starting an operation 0. When that sequence ends, continue with operation 4.

- 5. If it is a nonhidden nondirectory file, read it, then call `readFileCallback`.

- 6. Create an edited version of the file with `editString`, write that version to the current destination (sub)directory, then call `writeFileCallback`.

- 5. Return to operation 2 unless there is no next item.

The callback functions are defined within function `copyAndEditFiles`.

```
mkdirCallback
readdirCallback
forEachCallback
statCallback
readFileCallback
writeFileCallback
```

Each of them is defined as part of the definition of the function named above it.

This 6-level nesting permits each callback function to make use of variables declared and given values in the definitions of the functions enclosing it. Function `mkdirCallback` depends on no such variable, so it is defined outside of `copyAndEditFiles`. The other callback functions depend on such variables, namely:

- `writeFileCallback` depends on `currentValue`, a parameter of `forEachCallback`.



- `readdirCallback` depends on

dorganization arises from a decision to minimize the use of the global scope

## Installation and Setup

0. These instructions presuppose that [npm][npm] is installed.

1. Your copy of this project will be located in its own directory, inside some other directory that you may choose or create. For example, to create that parent directory inside your own home directory’s `Documents` subdirectory and call it `projects`, you can execute:

    `mkdir ~/Documents/projects`

Make that parent directory your working directory, by executing, for example:

    `cd ~/Documents/projects`

2. Clone this project’s repository into it, thereby creating the project directory, named `json-db-cli-async`, by executing:

    `git clone https://github.com/jrpool/json-db-cli.git json-db-cli-async`

2. Make the project directory your working directory by executing:

    `cd json-db-cli-async`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

## Usage and Examples

Enter `npm run copy-edit-files '/path-to-directory-of-originals' '/path-to-directory-to-create' 'abc' 'xyz'` to recursively create copies of the files in the former directory, replace `abc` wherever it appears with `xyz` in the copies, and write the copies to corresponding subdirectories of the latter directory.

Enter the same command except replacing ``'abc' 'xyz'`` with `'uncomment'` to do the same thing except with the removal of all ordinary line-initial comments.

You must specify both directories with absolute pathnames, and the new directory must be outside the old directory’s tree. These requirements are part of the “cautious” nature of this application.

To perform linting, execute `npm run lint`.

To perform the supplied tests, execute `npm test`.

[lg]: https://www.learnersguild.org
[npm]: https://www.npmjs.com/
[copy-edit-files]: https://github.com/jrpool/copy-edit-files/
