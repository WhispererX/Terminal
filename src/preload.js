const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    executeCommand: (command) => {
        if (command === "clear") return document.getElementById("terminal-output").innerHTML = "";
        return ipcRenderer.invoke("execute-command", command)
    },
    receive: (channel, callback) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
});
