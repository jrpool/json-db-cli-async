# json-db-cli
Application using a JSON file as a database and a CLI to query and modify it

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
commands
-  add.js
-  done.js
-  list.js
src
-  messages.js
-  task.js
```

## Discussion

### General

This application demonstrates the use of a JSON-format text file as a database and the use of Node.js’s Filesystem module to read and revise that file in response to commands issued from the command line.

The demonstration takes the form of a to-do list manager. You can use it to add tasks to the list, remove tasks from it (declaring them “done”), and list the tasks in it.

The application fulfills the specifications of the “Command line Todo List With Callbacks” module in Phase 2 of the (Learners Guild)[lg] curriculum.

The features are somewhat enhanced in relation to these specifications, as follows:

- The `done` command takes not only an integer argument but instead, optionally, a range argument in the format of 2 integers delimited by a hyphen-minus character (e.g., `15-20`).

- A `help` command causes a document describing the possible commands to be output.

- The `done` command produces a report showing not only the description of the completed task, but also its ID. In the event that `done` has a range argument, and multiple tasks in the range have identical descriptions, a report needs to include IDs in order to positively identify the removed tasks.

### Implementation Notes

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

2. Clone this project’s repository into it, thereby creating the project directory, named `json-db-cli`, by executing:

    `git clone https://github.com/jrpool/json-db-cli.git json-db-cli`

2. Make the project directory your working directory by executing:

    `cd json-db-cli`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

## Usage and Examples

Make the `src` directory your working directory by executing:

    `cd src`

Enter `node task help` for usage examples. Then enter any command based on any of the examples. Any command that begins with `node task` should produce a response that describes either the successful execution of your command or an error.

[lg]: https://www.learnersguild.org
[npm]: https://www.npmjs.com/
