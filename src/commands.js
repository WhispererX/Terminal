const { exec } = require("child_process");
const { BrowserWindow } = require("electron");

const customCommands = {
    // Example custom command to display a welcome message
    "hello": () => "Hello! Welcome to your custom terminal.",
    
    // Custom echo command
    "echo": (args) => args.join(" "),
    
    // Another custom command, for demonstration
    "datetime": () => new Date().toString(),
};

function executeShellCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(stderr.trim());
            else resolve(stdout.trim());
        });
    });
}

async function executeCommand(input) {
    const [command, ...args] = input.split(" ");
    
    // Check if it's a custom command first
    if (customCommands[command]) {
        try {
            return customCommands[command](args);
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }
    
    // Fall back to executing as a shell command
    try {
        return await executeShellCommand(input);
    } catch (error) {
        return `Error: ${error}`;
    }
}

module.exports = { executeCommand };
