const outputDiv = document.getElementById("terminal-output");
const inputField = document.getElementById("terminal-input");

let commandHistory = [];
let historyIndex = -1;

let currentDirectory = '';

window.api.receive('directory', (newDirectory) => {
    currentDirectory = newDirectory;
});

inputField.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const command = inputField.value.trim();
        if (!command) return;
        //${currentDirectory} 
        addOutput(`> ${command}`, "command");
        inputField.value = "";

        commandHistory.push(command);
        historyIndex = commandHistory.length;

        const result = await window.api.executeCommand(command);
        addOutput(result, getOutputType(result));
    } else if (event.key === "ArrowUp" && historyIndex > 0) {
        historyIndex--;
        inputField.value = commandHistory[historyIndex];
    } else if (event.key === "ArrowDown" && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputField.value = commandHistory[historyIndex] || "";
    }
});

function addOutput(text, type) {
    const div = document.createElement("div");
    const words = text.trim().split(/\s+/);
    const symbol = words[0];
    const command = words[1];
    const remainingText = words.slice(2).join(" ");

    if (type === 'command') {
        div.classList.add("command-line");
        div.setAttribute('data-directory', `${currentDirectory}`);
    }

    div.textContent = text;
    div.classList.add(type);  // Apply the style based on type
    outputDiv.appendChild(div);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

function getOutputType(text) {
    if (text.startsWith("Error:")) return "error";
    if (text.startsWith("Warning:")) return "warning";
    if (text.startsWith(">")) return "command";
    if (text.startsWith("Echo:")) return "echo";
    return "normal";
}
