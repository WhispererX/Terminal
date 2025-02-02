const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const os = require("os");
const { executeCommand } = require("./commands");
const { exec } = require('child_process');

process.chdir("C:/Users/myPc");
let currentDirectory = process.cwd(); 

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadFile(path.join(__dirname, "terminal.html"));
}

app.whenReady().then(() => {
    createWindow();
    BrowserWindow.getFocusedWindow().webContents.send('directory', currentDirectory);
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});


ipcMain.handle("execute-command", async (event, command) => {
    const [cmd, ...args] = command.split(" ");

    if (cmd === 'cd') {
        if (args[0] === "*") {
            const projectPath = path.resolve(__dirname);
            process.chdir(projectPath);
            currentDirectory = projectPath;
            BrowserWindow.getFocusedWindow().webContents.send('directory', currentDirectory);
            return `Changed directory to: ${projectPath}`;
        }
        const newDir = args[0] ? path.resolve(currentDirectory, args[0]) : process.env.HOME || process.env.USERPROFILE;
        try {
            process.chdir(newDir);
            currentDirectory = newDir;
            BrowserWindow.getFocusedWindow().webContents.send('directory', currentDirectory);
            return `Changed directory to: ${newDir}`;
        } catch (error) {
            return `cd: ${error.message}`;
        }
    } else return await executeCommand(command);
});