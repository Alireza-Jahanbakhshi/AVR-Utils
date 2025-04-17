const { getWorkspaceName } = require("../../core/workspaceManager");

async function compile() {
  const workspaceName = getWorkspaceName();

  try {
    await vscode.workspace.fs.stat(
      vscode.Uri.file(
        path.join(getWorkspaceFolderPath(), redundantDirectory(), "Debug")
      )
    );
  } catch (_) {
    await vscode.workspace.fs.createDirectory(
      vscode.Uri.file(
        path.join(getWorkspaceFolderPath(), redundantDirectory(), "Debug")
      )
    );
  }
  const buildCmd = `"${path.join(
    getToolchainDirectory(),
    "bin",
    currentFileExtension() === ".c" ? "avr-gcc" : "avr-as"
  )}" ${
    currentFileExtension() === ".c"
      ? `-x c -mmcu=${getSelectedMMCUDevice()} `
      : ""
  } "${vscode.window.activeTextEditor.document.uri.fsPath}"`;
  const mainDotO = `${buildCmd} -o "${path.join(
    getWorkspaceFolderPath(),
    redundantDirectory(),
    "Debug",
    `main.o`
  )}"`;
  const elfCmd = `${buildCmd} -o "${path.join(
    getWorkspaceFolderPath(),
    redundantDirectory(),
    "Debug",
    `${workspaceName}.elf`
  )}"`;
  const hexCmd = `"${path.join(
    getToolchainDirectory(),
    "bin",
    "avr-objcopy"
  )}" -O ihex -R .eeprom -R .fuse -R .lock -R .signature -R .user_signatures "${path.join(
    getWorkspaceFolderPath(),
    redundantDirectory(),
    "Debug",
    `${workspaceName}.elf`
  )}" "${path.join(
    getWorkspaceFolderPath(),
    redundantDirectory(),
    "Debug",
    `${workspaceName}.hex`
  )}"`;

  events.emit(ExtensionEvents.COMPILATION_STARTED);
  exec(
    `${mainDotO} && ${elfCmd} && ${hexCmd}`,
    { windowsHide: true },
    (err) => {
      if (err) {
        generateDiagnostics(err.message);
        vscode.window.showErrorMessage(
          "Build Failed. Check Problems tab for possible info!"
        );
        events.emit(ExtensionEvents.COMPILATION_FAILED);
      } else {
        clearDiagnostics();
        vscode.window.showInformationMessage("Build Completed");
        events.emit(ExtensionEvents.COMPILATION_FINISHED);
      }
    }
  );
}

module.exports = compile;