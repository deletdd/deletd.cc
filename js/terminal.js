// Terminal initialization and interaction
const terminal = {
    output: null,
    input: null,
    cursor: null,
    
    init() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.cursor = document.querySelector('.cursor');
        
        // Welcome message
        this.displayWelcome();
        
        // Event listeners
        this.input.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Remove input event listener that was causing lag
        // Only update cursor on actual typing, not every input event
        
        // Focus management
        document.addEventListener('click', () => this.input.focus());
        this.input.focus();
    },
    
    displayWelcome() {
        const welcome = `╔════════════════════════════════════════════════════════╗
║                                                        ║
║     Welcome to deletd.cc Terminal Portfolio           ║
║                                                        ║
║     Type 'help' to see available commands             ║
║     Type 'cat about.txt' to learn more                ║
║                                                        ║
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
        
        // Tab key - autocomplete (basic)
        if (e.key === 'Tab') {
            e.preventDefault();
            this.handleAutocomplete();
            return;
        }
    },
    
    executeCommand(command) {
        // Display command with glow
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
        
        // Scroll to bottom - use requestAnimationFrame for smooth scroll
        requestAnimationFrame(() => this.scrollToBottom());
    },
    
    addOutput(text, className) {
        const pre = document.createElement('pre');
        pre.className = className;
        pre.style.margin = '5px 0';
        pre.style.fontFamily = 'inherit';
        pre.style.fontSize = 'inherit';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordWrap = 'break-word';
        pre.textContent = text;
        this.output.appendChild(pre);
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
        
        // Find matching commands
        const matches = Object.keys(COMMANDS).filter(cmd => 
            cmd.startsWith(input)
        );
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput('\n' + matches.join('  '), 'output-line');
            this.addOutput(`user@deletdcc:~$ ${input}`, 'command-line');
            requestAnimationFrame(() => this.scrollToBottom());
        }
    }
};

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    terminal.init();
});
