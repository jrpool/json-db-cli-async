import { expect } from 'chai';

describe('task', function() {

  it('add outputs message in correct format', function() {
    process.stdout.write('node ../src/task add \'test the add module\'');
    expect(/^Created task \d+\.$/.test(process.stdin.read())).true;
  });

});
