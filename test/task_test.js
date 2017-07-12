import { expect } from 'chai';
const { execSync } = require('child_process');

describe('task', function() {

  beforeEach('factory reset before each test', function() {
    execSync('node task done 1-9');
    execSync('node task reset');
  });

  after('factory reset after final test', function() {
    execSync('node task done 1-9');
    execSync('node task reset');
  });

  context('valid arguments', function() {

    it('first add command adds task 1', function() {
      const response = execSync(
        'node task add \'test the add module\''
      ).toString();
      expect(response).equal('Created task 1.\n');
    });

    it('second add command adds task 2', function() {
      execSync('node task add \'test the add module once\'').toString();
      const response = execSync(
        'node task add \'test the add module again\''
      ).toString();
      expect(response).equal('Created task 2.\n');
    });

    it('done command on 1 task deletes it', function() {
      execSync('node task add \'test done\'').toString();
      execSync('node task add \'test done again\'').toString();
      const response = execSync('node task done 2').toString();
      expect(response).equal('Completed the task \'2: test done again\'.\n');
    });

    it('list command gets answer in correct format', function() {
      execSync('node task add \'test list\'').toString();
      execSync('node task add \'test list again\'').toString();
      const response = execSync('node task list').toString();
      expect(response).match(/^[^]+ID.+Description[^]+2 tasks\.\n$/);
    });

    it('reset command resets the list', function() {
      execSync('node task add \'test reset\'').toString();
      execSync('node task add \'test reset again\'').toString();
      execSync('node task done 1-2').toString();
      const response = execSync('node task reset').toString();
      expect(response).equal('Next ID reset to 1\n');
    });

    it('help command gets answer in correct format', function() {
      const response = execSync('node task help').toString();
      expect(response).match(/^\n=+\nThis application manages [^]+$/);
    });

  });

  context('invalid arguments', function() {

    it('add command with blank description', function() {
      const response = execSync('node task add \'\'').toString();
      expect(response).equal(
        'The command was unsuccessful because of a format error.\n'
      );
    });

    it('done command with an ID range containing no tasks', function() {
      const response = execSync('node task done 999-1002').toString();
      expect(response).equal(
        'The removal was unsuccessful because no such task exists.\n'
      );
    });

    it('done command with an ID range in descending order', function() {
      const response = execSync('node task done 2-1').toString();
      expect(response).equal(
        'The command was unsuccessful because of a format error.\n'
      );
    });

    it('done command with a nonnumeric ID', function() {
      const response = execSync('node task done V').toString();
      expect(response).equal(
        'The command was unsuccessful because of a format error.\n'
      );
    });

    it('reset command with tasks in existence', function() {
      execSync('node task add \'test reset\'').toString();
      const response = execSync('node task reset').toString();
      expect(response).equal(
        'Before a reset, you must report all tasks complete.\n'
      );
    });

    it('invalid command name', function() {
      const response = execSync('node task kill 1').toString();
      expect(response).equal(
        'The command was unsuccessful because of a format error.\n'
      );
    });

  });

});
