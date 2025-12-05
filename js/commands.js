// Command definitions and responses
const COMMANDS = {
    help: {
        description: 'Display available commands',
        execute: (args, terminal) => {
            const baseCommands = `Available commands:
  help             - Show this help message
  ls [dir]         - List files and directories
  cat [file]       - Display file contents
  clear            - Clear the terminal
  neofetch         - Display system information
  whoami           - Display current user
  date             - Show current date and time
  echo [text]      - Print text to terminal`;

            if (terminal.isRoot) {
                return baseCommands + `
  exit             - Exit root shell

Root commands:
  apt update       - Update package lists (simulated)
  systemctl        - Manage system services (simulated)
  chmod            - Change file permissions (simulated)
  useradd          - Add new user (simulated)`;
            }
            
            return baseCommands;
        }
    },
    
    'sudo -i': {
        description: 'Switch to root user',
        execute: () => 'ROOT_MODE'
    },
    
    exit: {
        description: 'Exit root shell',
        execute: (args, terminal) => {
            if (terminal.isRoot) {
                return 'EXIT_ROOT';
            }
            return 'bash: exit: not in a subshell';
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
        execute: (args, terminal) => {
            return terminal.isRoot ? 'root' : 'user';
        }
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
        execute: (args, terminal) => {
            const user = terminal.isRoot ? 'root@deletdcc' : 'user@deletdcc';
            return `
┌────────┐     ${user}
│           │     -------------
│       JS  │     OS: JavaScript
└────────┘     Uptime: ${Math.floor(performance.now() / 1000)}s
                   Terminal: deletd.cc`;
        }
    },
    
    // ROOT ONLY COMMANDS
    'apt update': {
        description: 'Update package lists',
        execute: (args, terminal) => {
            if (!terminal.isRoot) {
                return 'E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)';
            }
            return `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
Get:3 http://archive.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Fetched 229 kB in 1s (229 kB/s)
Reading package lists... Done
Building dependency tree... Done
All packages are up to date.`;
        }
    },
    
    systemctl: {
        description: 'Manage system services',
        execute: (args, terminal) => {
            if (!terminal.isRoot) {
                return 'Failed to get D-Bus connection: Operation not permitted';
            }
            return `System services running:
● ssh.service - OpenBSD Secure Shell server
● nginx.service - A high performance web server
● terminal.service - deletd.cc`;
        }
    },
    
    chmod: {
        description: 'Change file permissions',
        execute: (args, terminal) => {
            if (!terminal.isRoot) {
                return 'chmod: changing permissions: Operation not permitted';
            }
            if (args.length < 2) {
                return 'chmod: missing operand\nTry \'chmod MODE FILE\'';
            }
            return `Permissions changed: ${args.join(' ')}`;
        }
    },
    
    useradd: {
        description: 'Add new user',
        execute: (args, terminal) => {
            if (!terminal.isRoot) {
                return 'useradd: Permission denied.';
            }
            if (args.length === 0) {
                return 'Usage: useradd [options] LOGIN';
            }
            return `User '${args[0]}' created successfully.`;
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
function processCommand(input, terminal) {
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
    
    // Check exact match first (for sudo -i, ls projects/, etc)
    if (COMMANDS[trimmed]) {
        return COMMANDS[trimmed].execute(args, terminal);
    }
    
    // Check base command
    if (COMMANDS[command]) {
        return COMMANDS[command].execute(args, terminal);
    }
    
    // Command not found
    return `bash: ${command}: command not found`;
}