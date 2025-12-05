// Terminal initialization and interaction
const terminal = {
    output: null,
    input: null,
    terminalBody: null,
    isRoot: false,
    
    init() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.terminalBody = document.querySelector('.terminal-body');
        
        // Welcome message
        this.displayWelcome();
        
        // Event listeners
        this.input.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Add custom scroll behavior for line-by-line scrolling
        this.terminalBody.addEventListener('wheel', (e) => this.handleScroll(e), { passive: false });
        
        // Focus management
        document.addEventListener('click', () => this.input.focus());
        this.input.focus();
    },
    
    displayWelcome() {
        const welcome = `╔══════════════════════════════════════════════════════╗
║                                                       ║
║     Welcome to deletd.cc                              ║
║                                                       ║
║     Type 'help' to see available commands             ║
║     Type 'cat about.txt' to learn more                ║
║                                                       ║
╚══════════════════════════════════════════════════════╝

Initializing system...
Loading configuration...
Ready.
`;
        this.addOutput(welcome, 'output-line');
    },
    
    handleScroll(e) {
        e.preventDefault();
        const lineHeight = 20 * 1.6;
        const scrollAmount = lineHeight * 3;
        
        if (e.deltaY > 0) {
            this.terminalBody.scrollTop += scrollAmount;
        } else {
            this.terminalBody.scrollTop -= scrollAmount;
        }
    },
    
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.input.value;
            this.executeCommand(command);
            return;
        }
        
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCommand = navigateHistory('up');
            if (prevCommand !== null) {
                this.input.value = prevCommand;
            }
            return;
        }
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCommand = navigateHistory('down');
            if (nextCommand !== null) {
                this.input.value = nextCommand;
            }
            return;
        }
        
        if (e.key === 'Tab') {
            e.preventDefault();
            this.handleAutocomplete();
            return;
        }
    },
    
    executeCommand(command) {
        const prompt = this.isRoot ? 'root@deletdcc:~#' : 'user@deletdcc:~$';
        const promptClass = this.isRoot ? 'command-line-root' : 'command-line';
        this.addOutput(`${prompt} ${command}`, promptClass);
        
        if (command.trim()) {
            addToHistory(command);
        }
        
        this.input.value = '';
        
        if (command.trim()) {
            const result = processCommand(command.trim(), this);
            
            if (result === 'CLEAR') {
                this.clearTerminal();
            } else if (result === 'ROOT_MODE') {
                this.enableRootMode();
            } else if (result === 'EXIT_ROOT') {
                this.disableRootMode();
            } else {
                const outputClass = this.isRoot ? 'output-line-root' : 'output-line';
                this.addOutput(result, outputClass);
            }
        }
        
        this.updatePrompt();
        this.scrollToBottom();
    },
    
    enableRootMode() {
        this.isRoot = true;
        this.addOutput('[sudo] password for user: ********', 'output-line');
        this.addOutput('Switching to root user...', 'output-line-root');
        this.updatePrompt();
    },
    
    disableRootMode() {
        this.isRoot = false;
        this.addOutput('Exiting root shell...', 'output-line');
        this.updatePrompt();
    },
    
    updatePrompt() {
        const promptElement = document.querySelector('.prompt');
        if (this.isRoot) {
            promptElement.textContent = 'root@deletdcc:~#';
            promptElement.classList.add('prompt-root');
        } else {
            promptElement.textContent = 'user@deletdcc:~$';
            promptElement.classList.remove('prompt-root');
        }
    },
    
    addOutput(text, className) {
        const div = document.createElement('div');
        div.className = className;
        
        // Check if text contains HTML link markup
        if (text.includes('<a ')) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }
        
        this.output.appendChild(div);
    },
    
    clearTerminal() {
        this.output.innerHTML = '';
    },
    
    scrollToBottom() {
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    },
    
    handleAutocomplete() {
        const input = this.input.value.toLowerCase();
        if (!input) return;
        
        const allCommands = [
            ...Object.keys(COMMANDS),
            'cat about.txt',
            'cat skills.txt',
            'cat contact.txt',
            'cat projects.txt',
            'sudo -i',
            'exit'
        ];
        
        const matches = allCommands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(matches.join('  '), 'output-line');
            const prompt = this.isRoot ? 'root@deletdcc:~#' : 'user@deletdcc:~$';
            const promptClass = this.isRoot ? 'command-line-root' : 'command-line';
            this.addOutput(`${prompt} ${input}`, promptClass);
            this.scrollToBottom();
        }
    }
};

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    terminal.init();
});