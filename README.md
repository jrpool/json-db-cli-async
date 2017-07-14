# json-db-cli-async
Application using a JSON database and a CLI to query and modify it asynchronously.

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## Project Technical Advisor

[Trevor Little](https://github.com/bundacia)

## modules

```
- task.js
commands
- add.js
- done.js
- list.js
src
- messages.js
```

## Discussion

### General

This application demonstrates the use of a JSON-format text file as a database and the use of Node.js’s Filesystem module to read and revise that file in response to commands issued from the command line.

The demonstration takes the form of a to-do list manager. You can use it to add tasks to the list, remove tasks from it (declaring them “done”), and list the tasks in it.

The application fulfills the requirements of the “Command line Todo List With Callbacks” module in Phase 2 of the [Learners Guild][lg] curriculum, including the requirement that “we're moving from `fs.readFileSync` & `fs.writeFileSync` to `fs.readFile` & `fs.writeFile` requiring you to use callbacks and async code flow control.”

This is a modified version of a parallel application, json-db-cli, which relies on `fs.readFileSync` & `fs.writeFileSync` and therefore does not comply with the above requirement: [json-db-cli].

The features are somewhat enhanced in relation to the requirements, as follows:

- The `done` command takes not only an integer argument but instead, optionally, a range argument in the format of 2 integers delimited by a hyphen-minus character (e.g., `15-20`).

- A `help` command causes a document describing the possible commands to be output.

- The `done` command produces a report showing not only the description of the completed task, but also its ID. In the event that `done` has a range argument, and multiple tasks in the range have identical descriptions, a report needs to include IDs in order to positively identify the removed tasks.

- A `reset` command reinitializes the application, once the database contains no tasks, so that the next task added will have ID 1.

### Asynchronization Notes

This project seeks to illustrate a straightforward, minimal adaptation of a synchronous application to an asynchronous one, with no changes in functionality. The tests implemented for `json-db-cli` are all tests of its interface behavior and therefore should apply equally to `json-db-cli-async`.

The application’s `task` module, in this order:

- 1. receives a command from the `node` JavaScript runtime environment.

- 2. determines whether the command is valid.

- 3. if it is invalid, outputs an error message to the console, or, if it is valid, determines which command module should process it.

- 4. instructs that command module to process the command (except for the `help` command, which the `task` module processes itself).

For the most complex commands, namely `add`, `done`, and `reset`, the selected command module then, in this order:

- 5. reads the database file.

- 6. creates a copy of the database in memory as an object.

- 7. analyzes the data in the database copy to determine how to process the command.

- 8. if the command cannot be processed, outputs an error message to the console, or, if it can be processed, modifies the data in the database copy as required by the command.

- 9. converts the modified database to a string.

- 10. writes the string to the database file, replacing its prior content.

- 11. outputs one or more messages to the console, reporting on the results of the performance of the command.

The `list` command is less complex, because it does not change the database file, so processing that command omits steps 8, 9, and 10.

In the json-db-cli application, these steps are sequential, each beginning only after the previous one has ended.

Changing the application to use `fs.readFile` and `fs.writeFile` directly affects steps 5 and 10. All the other steps are intrinsically sequential: They don’t put anything into the JavaScript event loop, so any subsequent step depending on them can rely on them having been executed to completion.

Steps 5 and 10 do put operations into the JavaScript event loop, and they do not stop subsequent steps from being performed before those operations have been performed to completion. But it is clear that steps 6–11 all depend on step 5 being already executed to completion. Similarly, step 11 depends (except with the`list`command) on step 10 having been already executed to completion,because the messages output in step 11 depend on the success or failure of step 10.

In this asynchronous version of the application, callback functions passed to the `fs.readFile` and `fs.writeFile` functions in steps 5 and 10, respectively, are used to ensure the desired order of execution. The callback function gets executed after the reading or writing operation is complete.

The application uses the `fs.readFile` function’s callback function for the additional purpose of capturing the string contained in the database file. The `fs.readFile` function passes that string as an argument to its callback. In the synchronous version of the application, `fs.readFileSync` returns that string instead.

So, for the `add`, `done`, and `reset` commands, the callback function of `fs.readFile` in step 5 performs steps 6, 7, 8, 9, and 10. Step 10 calls `fs.writeFile`, and its callback function performs step 11. For the `list` command, the callback function of `fs.readFile` in step 5 performs steps 6, 7, and 11. Steps 1–4 are not affected by this adaptation.

### Other Implementation Notes

The implementation aims at:

- Reusability of the application as a template for a more general class of applications.

- Internationalization

The output text strings of the interface are separated from the code in a `messages.js` module. This would facilitate the development of parallel versions in additional languages. Such internationalization would require some additional work, including a similar treatment for input strings (the terms entered on the command line). The same feature would also facilitate adaptation to other use cases, such as inventory management. More extensive genericization would entail additional work, such as provision for items with a configurable count of properties.

The decisions on how user actions are processed has been isolated into the definition of a single function, `resultAction`. In this version the action is to output a message to the console. A change to another action could be made by a modification to the definition of that function.

There is a complete division of labor between validation/assignment and fulfillment. The `task` module evaluates each command and, if it is valid, assigns its fulfillment to another appropriate module: `add`, `list`, `done`, or `help`. After the assignment, the `task` module does nothing else. It receives no report back from the assignee, and it is the assignee, rather than `task`, that is responsible for notifying the user of the outcome.

Inspection of the `add`, `list`, and `done` modules reveals some candidates for further code consolidation.

The application implements a strategy of durable and immutable item identifiers, equivalent to a “serial” type in a relational database. Once an item with identifier `n` exists, `n` is never reused for another item after item `n` is destroyed. This strategy protects the database from inadvertent corruption arising in multi-user situations.

In this implementation, reporting that a task has been completed results in the removal of the task from the list. Another use case might require tasks to be marked as incomplete or complete and remarked, rather than removed, then reported complete.

Another possible extension of this application would include a command to revise an existing task by changing its description.

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

Enter `node task help` for usage examples. Then enter any command based on any of the examples. Any command that begins with `node task` should produce a response that describes either the successful execution of your command or an error.

To perform linting, execute `npm run lint`.

To perform the supplied tests, execute `npm test`.

[lg]: https://www.learnersguild.org
[npm]: https://www.npmjs.com/
[json-db-cli]: https://github.com/jrpool/json-db-cli
