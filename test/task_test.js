import { expect } from 'chai';
const { execSync } = require('child_process');

let thisID;

describe('task', function() {

  context('valid arguments', function() {

    it('add command gets answer in correct format', function() {
      const response = execSync(
        'node task add \'test the add module\''
      ).toString();
      // EXPECT RESPONSE TO MATCH(/.../)
      expect(/^Created task \d+\./.test(response)).true;
      // Identify the ID of the just-added task.
      thisID = response.replace(/[^\d]+/g, '');
    });

    it('done command gets correct answer', function() {
      const response = execSync(
        'node task done ' + thisID
      ).toString();
      expect(response).equal(
        'Completed the task \'' + thisID + ': ' + 'test the add module\'.\n'
      );
    });

    it('list command gets answer in correct format', function() {
      const response = execSync(
        'node task list'
      ).toString();
      console.log('The response is ' + response);
      //expect(/^.+ID.+Description.+ tasks?\..*$/m.test(response)).true;
      expect(/^.+ID.+Description.+tasks?/m.test(response)).true;
    });

    it('help command gets answer in correct format', function() {
      const response = execSync(
        'node task help'
      ).toString();
      expect(/^This application manages .+$/m.test(response)).true;
    });

  });

  context('invalid arguments', function() {

    it('add command with blank description', function() {
      const response = execSync('node task add \'\'').toString();
      expect(response).equal(
        'The command was unsuccessful because of a format error.\n'
      );
    });

    it('done command with invalid ID range', function() {
      const response = execSync('node task done 999-1002').toString();
      expect(response).equal(
        'The removal was unsuccessful because no such task exists.\n'
      );
    });

    it('invalid command name', function() {
      const response = execSync('node task kill').toString();
      expect(response).equal(
        'The command was unsuccessful because of a format error.\n'
      );
    });

  });

});
