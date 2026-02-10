// Simon Says Game for rabbit r1
// Game Boy-style memory game

class SimonSaysGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 1;
        this.score = 0;
        this.highScore = 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.isPlayerTurn = false;
        
        // Action types
        this.actions = {
            UP: { symbol: '▲', name: 'up' },
            DOWN: { symbol: '▼', name: 'down' },
            BUTTON: { symbol: '●', name: 'button' },
            SHAKE: { symbol: '✱', name: 'shake' }
        };
        
        // Audio context for sound effects
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Frequencies for each action (retro beep tones)
        this.frequencies = {
            up: 523.25,    // C5
            down: 392.00,  // G4
            button: 659.25, // E5
            shake: 783.99   // G5
        };
        
        this.init();
    }
    
    async init() {
        // Load high score
        await this.loadHighScore();
        
        // Set up r1 SDK event listeners
        this.setupControls();
        
        // Show title screen
        this.showScreen('title-screen');
    }
    
    async loadHighScore() {
        try {
            if (typeof creationStorage !== 'undefined') {
                const saved = await creationStorage.plain.get('highScore');
                this.highScore = parseInt(saved) || 0;
            }
        } catch (e) {
            console.log('No saved high score');
            this.highScore = 0;
        }
    }
    
    async saveHighScore() {
        try {
            if (typeof creationStorage !== 'undefined') {
                await creationStorage.plain.set('highScore', this.highScore.toString());
            }
        } catch (e) {
            console.log('Could not save high score');
        }
    }
    
    setupControls() {
        // r1 SDK event listeners
        if (typeof creation !== 'undefined') {
            creation.on('scrollUp', () => this.handleInput('up'));
            creation.on('scrollDown', () => this.handleInput('down'));
            creation.on('sideClick', () => this.handleInput('button'));
            
            // Shake detection
            creation.on('accelerometer', (data) => {
                if (this.detectShake(data)) {
                    this.handleInput('shake');
                }
            });
        }
        
        // Fallback keyboard controls for testing
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') this.handleInput('up');
            if (e.key === 'ArrowDown') this.handleInput('down');
            if (e.key === ' ' || e.key === 'Enter') this.handleInput('button');
            if (e.key === 's' || e.key === 'S') this.handleInput('shake');
        });
    }
    
    detectShake(data) {
        // Simple shake detection based on acceleration magnitude
        const magnitude = Math.sqrt(
            data.x * data.x + 
            data.y * data.y + 
            data.z * data.z
        );
        return magnitude > 20; // Threshold for shake
    }
    
    handleInput(action) {
        if (!this.isPlaying) {
            // Start game on button press from title or game over screen
            if (action === 'button') {
                this.startGame();
            }
            return;
        }
        
        if (this.isShowingSequence || !this.isPlayerTurn) {
            return; // Ignore input during sequence display
        }
        
        // Add to player sequence
        this.playerSequence.push(action);
        
        // Show the action
        this.showAction(action);
        this.playTone(action);
        
        // Check if correct
        const currentIndex = this.playerSequence.length - 1;
        const expectedAction = Object.values(this.actions)[this.sequence[currentIndex]].name;
        
        if (action !== expectedAction) {
            // Wrong! Game over
            this.gameOver();
            return;
        }
        
        // Check if sequence complete
        if (this.playerSequence.length === this.sequence.length) {
            // Success! Next round
            this.isPlayerTurn = false;
            this.score += this.sequence.length;
            setTimeout(() => this.nextRound(), 1000);
        }
    }
    
    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 1;
        this.score = 0;
        this.isPlaying = true;
        
        this.showScreen('game-screen');
        this.updateDisplay();
        
        // Start first round
        setTimeout(() => this.nextRound(), 1000);
    }
    
    nextRound() {
        this.playerSequence = [];
        
        // Add new random action to sequence
        const actionKeys = Object.keys(this.actions);
        const randomIndex = Math.floor(Math.random() * actionKeys.length);
        this.sequence.push(randomIndex);
        
        this.updateDisplay();
        
        // Show sequence
        setTimeout(() => this.showSequence(), 500);
    }
    
    async showSequence() {
        this.isShowingSequence = true;
        this.showMessage('WATCH');
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.delay(800);
            
            const actionIndex = this.sequence[i];
            const action = Object.values(this.actions)[actionIndex];
            
            this.showAction(action.name);
            this.playTone(action.name);
            
            await this.delay(600);
            this.hideAction();
        }
        
        await this.delay(500);
        this.isShowingSequence = false;
        this.isPlayerTurn = true;
        this.showMessage('YOUR TURN');
    }
    
    showAction(actionName) {
        const actionDisplay = document.getElementById('action-display');
        const action = Object.values(this.actions).find(a => a.name === actionName);
        
        if (action) {
            actionDisplay.textContent = action.symbol;
            actionDisplay.classList.remove('hidden');
            
            // Re-trigger animation
            actionDisplay.style.animation = 'none';
            setTimeout(() => {
                actionDisplay.style.animation = 'flash 0.3s ease-in-out';
            }, 10);
        }
    }
    
    hideAction() {
        const actionDisplay = document.getElementById('action-display');
        actionDisplay.classList.add('hidden');
    }
    
    showMessage(text) {
        const messageDisplay = document.getElementById('message-display');
        messageDisplay.textContent = text;
        messageDisplay.classList.remove('hidden');
    }
    
    hideMessage() {
        const messageDisplay = document.getElementById('message-display');
        messageDisplay.classList.add('hidden');
    }
    
    updateDisplay() {
        document.getElementById('round-display').textContent = `ROUND ${this.round}`;
        document.getElementById('score-display').textContent = `SCORE: ${this.score}`;
    }
    
    gameOver() {
        this.isPlaying = false;
        this.isPlayerTurn = false;
        
        // Play error sound
        this.playErrorSound();
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        // Show game over screen
        setTimeout(() => {
            document.getElementById('final-score').textContent = `SCORE: ${this.score}`;
            document.getElementById('high-score').textContent = `HIGH: ${this.highScore}`;
            this.showScreen('game-over-screen');
        }, 1000);
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen-content').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show requested screen
        document.getElementById(screenId).classList.remove('hidden');
        this.hideMessage();
        this.hideAction();
    }
    
    // Audio functions
    playTone(action) {
        const frequency = this.frequencies[action];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square'; // Retro square wave
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    playErrorSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new SimonSaysGame();
});
