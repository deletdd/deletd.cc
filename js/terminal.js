// Terminal initialization and interaction
const terminal = {
    output: null,
    input: null,
    
    init() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        
        // Welcome message
        this.displayWelcome();
        
        // Event listeners
        this.input.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Focus management
        document.addEventListener('click', () => this.input.focus());
        this.input.focus();
    },
    
    displayWelcome() {
        const welcome = `╔════════════════════════════════════════════════════════╗
║  Welcome to deletd.cc Terminal Portfolio              ║
║                                                        ║
║  Type 'help' to see available commands                ║
║  Type 'cat about.txt' to learn more                   ║
╚════════════════════════════════════════════════════════╝

Initializing system...
Loading configuration...
Ready.
`;
        this.addOutput(welcome, 'output-line');
    },
    
    handleKeyPress(e) {
        // Enter key - execute command
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.input.value;
            this.executeCommand(command);
            return;
        }
        
        // Up arrow - previous command
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCommand = navigateHistory('up');
            if (prevCommand !== null) {
                this.input.value = prevCommand;
            }
            return;
        }
        
        // Down arrow - next command
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCommand = navigateHistory('down');
            if (nextCommand !== null) {
                this.input.value = nextCommand;
            }
            return;
        }
        
        // Tab key - autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            this.handleAutocomplete();
            return;
        }
    },
    
    executeCommand(command) {
        // Display command
        this.addOutput(`user@deletdcc:~$ ${command}`, 'command-line');
        
        // Add to history
        if (command.trim()) {
            addToHistory(command);
        }
        
        // Clear input
        this.input.value = '';
        
        // Process command
        if (command.trim()) {
            const result = processCommand(command);
            
            // Handle special commands
            if (result === 'CLEAR') {
                this.clearTerminal();
            } else {
                this.addOutput(result, 'output-line');
            }
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    },
    
    addOutput(text, className) {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = text;
        this.output.appendChild(div);
    },
    
    clearTerminal() {
        this.output.innerHTML = '';
    },
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    },
    
    handleAutocomplete() {
        const input = this.input.value.toLowerCase();
        if (!input) return;
        
        // Get all possible commands including cat and ls variations
        const allCommands = [
            ...Object.keys(COMMANDS),
            'cat about.txt',
            'cat skills.txt',
            'cat contact.txt',
            'ls projects/'
        ];
        
        const matches = allCommands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(matches.join('  '), 'output-line');
            this.addOutput(`user@deletdcc:~$ ${input}`, 'command-line');
            this.scrollToBottom();
        }
    }
};

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    terminal.init();
});
