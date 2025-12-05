// Command definitions and responses
const COMMANDS = {
    help: {
        description: 'Display available commands',
        execute: () => {
            return `Available commands:
  help             - Show this help message
  ls [dir]         - List files and directories
  cat [file]       - Display file contents
  clear            - Clear the terminal
  neofetch         - Display system information
  whoami           - Display current user
  date             - Show current date and time
  echo [text]      - Print text to terminal`;
        }
    },
    
    ls: {
        description: 'List directory contents',
        execute: () => {
            return `projects/     about.txt     skills.txt    contact.txt`;
        }
    },
    
    'ls projects/': {
        description: 'List GitHub repositories',
        execute: () => {
            return `deletd.cc/

Visit: github.com/deletdd`;
        }
    },
    
    'cat about.txt': {
        description: 'Read about file',
        execute: () => {
            window.open('https://guns.lol/deletd', '_blank');
            return 'Redirecting to guns.lol/deletd...';
        }
    },
    
    'cat skills.txt': {
        description: 'Display technical skills',
        execute: () => {
            return `TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Languages:       JavaScript, Python, HTML/CSS, Java
Frameworks:      React, Node.js
Tools:           Git, Docker
Specialties:     Web Development, CLI Tools, PaperMC Plugins`;
        }
    },
    
    'cat contact.txt': {
        description: 'Show contact information',
        execute: () => {
            return `CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email:    deletd@duck.com
GitHub:   github.com/deletdd
Discord:  deletd`;
        }
    },
    
    clear: {
        description: 'Clear terminal screen',
        execute: () => 'CLEAR'
    },
    
    whoami: {
        description: 'Display current user',
        execute: () => 'user@deletdcc'
    },
    
    date: {
        description: 'Show current date and time',
        execute: () => {
            const now = new Date();
            return now.toString();
        }
    },
        
    neofetch: {
        description: 'Display system information',
        execute: () => {
            return `    ___           user@deletdcc
   (.. |          ─────────────────
   (<> |          OS: Web Terminal
  / __  \\         Shell: JavaScript CLI
 ( /  \\ /|        Terminal: deletd.cc
_/\\ __)/_)        Uptime: ${Math.floor(performance.now() / 1000)}s
\\/-____\\/         Theme: Amber CRT
                  Font: VT323`;
        }
    }
};

// Command history management
let commandHistory = [];
let historyIndex = -1;

function getCommandHistory() {
    return commandHistory;
}

function addToHistory(command) {
    if (command.trim()) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
    }
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return null;
    
    if (direction === 'up') {
        historyIndex = Math.max(0, historyIndex - 1);
    } else {
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    }
    
    return historyIndex < commandHistory.length 
        ? commandHistory[historyIndex] 
        : '';
}

// Echo command handler
function handleEcho(args) {
    return args.join(' ');
}

// Cat command handler
function handleCat(args) {
    if (args.length === 0) {
        return 'cat: missing file operand\nTry \'cat <filename>\'';
    }
    
    const filename = args[0];
    const catCommand = `cat ${filename}`;
    
    if (COMMANDS[catCommand]) {
        return COMMANDS[catCommand].execute();
    }
    
    return `cat: ${filename}: No such file or directory`;
}

// Ls command handler
function handleLs(args) {
    // No arguments - list current directory
    if (args.length === 0) {
        return COMMANDS['ls'].execute();
    }
    
    const directory = args[0];
    const lsCommand = `ls ${directory}`;
    
    if (COMMANDS[lsCommand]) {
        return COMMANDS[lsCommand].execute();
    }
    
    return `ls: cannot access '${directory}': No such file or directory`;
}

// Process command
function processCommand(input) {
    const trimmed = input.trim();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Handle cat separately
    if (command === 'cat') {
        return handleCat(args);
    }
    
    // Handle ls separately
    if (command === 'ls') {
        return handleLs(args);
    }
    
    // Handle echo
    if (command === 'echo') {
        return handleEcho(args);
    }
    
    // Check exact match first (shouldn't be needed now)
    if (COMMANDS[trimmed]) {
        return COMMANDS[trimmed].execute();
    }
    
    // Check base command
    if (COMMANDS[command]) {
        return COMMANDS[command].execute(args);
    }
    
    // Command not found
    return `bash: ${command}: command not found`;
}
