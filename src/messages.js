/// Messages in English.
exports.messages = {
  'addReadFail': 'The addition was unsuccessful because of a reading error.',
  'addWriteFail': 'The addition was unsuccessful because of a writing error.',
  'addReport': 'Created task «addResult».',
  'doneReadFail': 'The removal was unsuccessful because of a reading error.',
  'doneWriteFail': 'The removal was unsuccessful because of a writing error.',
  'doneMissingFail':
    'The removal was unsuccessful because no such task exists.',
  'doneReport': 'Completed the task \'«item»\'.',
  'listReadFail': 'The listing was unsuccessful because of a reading error.',
  'listCol0Head': 'ID',
  'listCol1Head': 'Description',
  'listSumReport1': '1 task.',
  'listSumReport2': '«itemIDs.length» tasks.',
  'resetDoneFail': 'Before a reset, you must report all tasks complete.',
  'resetReadFail': 'The reset was unsuccessful because of a reading error.',
  'resetMissingInit': 'The list is missing, so an attempt will be made to create an initial one.',
  'resetWriteFail': 'The reset was unsuccessful because of a writing error.',
  'resetReport': 'The list is empty and the next ID is 1.',
  'commandFail': 'The command was unsuccessful because of a format error.',
  'helpTip': '\n==============================================\nThis application manages a simple to-do list.\nYou can add tasks to it, remove tasks from it\n(declaring them “done”), list the tasks in it,\nand reset it to its initial state.\n\nExamples of valid commands:\n\nnode task help\nnode task list\nnode task add \'Study calculus\'\nnode task done 4\nnode task done 13-18\nnode task reset\n==============================================\n'
};
