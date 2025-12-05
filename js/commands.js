// Command definitions and responses
const COMMANDS = {
    help: {
        description: 'Display available commands',
        execute: () => {
            return `
Available commands:
  help          - Show this help message
  about         - Learn about me
  cat about.txt - View detailed information (redirects to guns.lol)
  ls            - List files and directories
  ls projects/  - List my GitHub repositories
  projects      - Quick view of my projects
  skills        - View my technical skills
  contact       - Get my contact information
  clear         - Clear the terminal
  neofetch      - Display system information
  whoami        - Display current user
  date          - Show current date and time
  echo [text]   - Print text to terminal
  history       - Show command history
`;
        }
    },
    
    about: {
        description: 'Information about me',
        execute: () => {
            return `
╔════════════════════════════════════════╗
║           ABOUT DELETD.CC              ║
╚════════════════════════════════════════╝

Welcome to my digital space. I'm a developer passionate 
about building innovative solutions and exploring the 
boundaries of technology.

Type 'cat about.txt' for more details or 'skills' to 
see my technical expertise.
`;
        }
    },
    
    'cat about.txt': {
        description: 'Read about file (redirects to guns.lol)',
        execute: () => {
            window.open('https://guns.lol', '/deletd');
            return 'Opening guns.lol...';
        }
    },
    
    ls: {
        description: 'List directory contents',
        execute: () => {
            return `
projects/     about.txt     skills.txt    contact.txt
README.md
`;
        }
    },
    
    'ls projects/': {
        description: 'List GitHub repositories',
        execute: () => {
            return `
Fetching repositories from GitHub...

[Loading GitHub projects - This would query your actual repos]

Tip: Use 'projects' for a quick overview or implement GitHub API
`;
        }
    },
    
    projects: {
        description: 'View my projects',
        execute: () => {
            return `
╔════════════════════════════════════════╗
║           MY PROJECTS                  ║
╚════════════════════════════════════════╝

→ deletd.cc Terminal Portfolio
  A terminal-style portfolio showcasing technical skills

→ [Project #1]
  Description of project

→ [Project #2]
  Description of project

Visit my GitHub for more: github.com/deletdd
`;
        }
    },
    
    skills: {
        description: 'Display technical skills',
        execute: () => {
            return `
╔════════════════════════════════════════╗
║        TECHNICAL SKILLS                ║
╚════════════════════════════════════════╝

Languages:       JavaScript, Python, HTML/CSS, Java
Frameworks:      React, Node.js
Tools:           Git, Docker
Specialties:     Web Development, CLI Tools, PaperMC Plugins

Type 'projects' to see these skills in action.
`;
        }
    },
    
    contact: {
        description: 'Show contact information',
        execute: () => {
            return `
╔════════════════════════════════════════╗
║         CONTACT INFO                   ║
╚════════════════════════════════════════╝

Email:    deletd@duck.com
GitHub:   github.com/deletdd
Discord:  deletd
`;
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
    
    history: {
        description: 'Show command history',
        execute: () => {
            const history = getCommandHistory();
            return history.length > 0 
                ? history.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n')
                : 'No commands in history.';
        }
    },
    
    neofetch: {
        description: 'Display system information',
        execute: () => {
            return `
    ___           user@deletdcc
   (.. |          ─────────────────
   (<> |          OS: Web Terminal
  / __  \\        Shell: JavaScript CLI
 ( /  \\ /|       Terminal: deletd.cc
_/\\ __)/_)       Uptime: ${Math.floor(performance.now() / 1000)}s
\\/-____\\/       Theme: Amber CRT
                  Font: VT323
`;
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

// Process command
function processCommand(input) {
    const trimmed = input.trim();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Special case for echo
    if (command === 'echo') {
        return handleEcho(args);
    }
    
    // Check exact match first
    if (COMMANDS[trimmed]) {
        return COMMANDS[trimmed].execute();
    }
    
    // Check base command
    if (COMMANDS[command]) {
        return COMMANDS[command].execute(args);
    }
    
    // Command not found
    return `bash: ${command}: command not found\nType 'help' for available commands.`;
}
