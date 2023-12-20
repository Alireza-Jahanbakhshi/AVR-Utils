const vscode = require('vscode');
const compileProject = require('./commands/compileProject');
const getToolchain = require('./commands/getToolchain');
const makeProject = require('./commands/makeProject');
const openMicrochipStudioProject = require('./commands/openMicrochipStudioProject');

module.exports = function () {
    vscode.commands.registerCommand('avr-utils.compileProject', compileProject);
    vscode.commands.registerCommand('avr-utils.getToolchain', getToolchain);
    vscode.commands.registerCommand('avr-utils.makeProject', makeProject);
    vscode.commands.registerCommand('avr-utils.openMicrochipStudioProject', openMicrochipStudioProject);
}
