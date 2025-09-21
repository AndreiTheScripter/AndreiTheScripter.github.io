// Initialize AOS animation library
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Game variables
let gameScore = 0;
let highScore = 0;
let gameActive = false;
let gameTimeout;
let gameColors = ['gray', 'red', 'yellow', 'green'];
let currentColorIndex = 0;
let gameSpeed = 2000; // Initial speed in milliseconds

// Hide loading screen after 4 seconds
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 800);
        
        // Create particles
        createParticles();
        
        // Load saved settings
        loadSettings();
        
        // Initialize game
        initGame();
    }, 4000);
    
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Handle game link separately
                if (targetId === '#game') {
                    showGameSection();
                } else {
                    hideGameSection();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Settings panel functionality
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    const themeSelect = document.getElementById('theme-select');
    const themeOptions = document.querySelectorAll('.theme-option');
    const animationToggle = document.getElementById('animation-toggle');
    
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.add('open');
    });
    
    closeSettings.addEventListener('click', function() {
        settingsPanel.classList.remove('open');
    });
    
    saveSettings.addEventListener('click', function() {
        saveSettingsToLocalStorage();
        alert('Settings saved successfully!');
        settingsPanel.classList.remove('open');
    });
    
    // Theme selection
    themeSelect.addEventListener('change', function() {
        setTheme(this.value);
        updateThemeOptions(this.value);
    });
    
    // Quick theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            themeSelect.value = theme;
            updateThemeOptions(theme);
        });
    });
    
    // Return from game button
    const returnFromGame = document.getElementById('return-from-game');
    returnFromGame.addEventListener('click', function(e) {
        e.preventDefault();
        hideGameSection();
    });
    
    // Game link
    const gameLink = document.getElementById('game-link');
    gameLink.addEventListener('click', function(e) {
        e.preventDefault();
        showGameSection();
    });
});

// Create particles function
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 10 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 15;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.top = `${posY}vh`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Random color based on theme
        const colors = [
            'rgba(110, 69, 226, 0.5)',
            'rgba(136, 211, 206, 0.5)',
            'rgba(255, 126, 95, 0.5)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
}

// Settings functions
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function updateThemeOptions(theme) {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        }
    });
}

function saveSettingsToLocalStorage() {
    const settings = {
        theme: document.getElementById('theme-select').value,
        animations: document.getElementById('animation-toggle').checked,
        sound: document.getElementById('sound-toggle').checked,
        notifications: document.getElementById('notifications-toggle').checked,
        fontSize: document.getElementById('font-size').value,
        gameDifficulty: document.getElementById('game-difficulty').value,
        gameSound: document.getElementById('game-sound-toggle').checked
    };
    
    localStorage.setItem('portfolioSettings', JSON.stringify(settings));
    applySettings(settings);
}

function loadSettings() {
    const savedSettings = localStorage.getItem('portfolioSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply settings to form
        document.getElementById('theme-select').value = settings.theme;
        document.getElementById('animation-toggle').checked = settings.animations;
        document.getElementById('sound-toggle').checked = settings.sound;
        document.getElementById('notifications-toggle').checked = settings.notifications;
        document.getElementById('font-size').value = settings.fontSize;
        document.getElementById('game-difficulty').value = settings.gameDifficulty;
        document.getElementById('game-sound-toggle').checked = settings.gameSound;
        
        // Apply settings to page
        applySettings(settings);
    }
}

function applySettings(settings) {
    setTheme(settings.theme);
    updateThemeOptions(settings.theme);
    
    // Apply font size
    document.body.style.fontSize = `${settings.fontSize}px`;
    
    // Apply animation settings
    if (settings.animations) {
        document.documentElement.style.setProperty('--transition-speed', '0.4s');
    } else {
        document.documentElement.style.setProperty('--transition-speed', '0s');
    }
}

// Game functions
function initGame() {
    const startButton = document.getElementById('start-game');
    const resetButton = document.getElementById('reset-game');
    const colorGame = document.getElementById('color-game');
    
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    colorGame.addEventListener('click', handleGameClick);
    
    // Load high score
    const savedHighScore = localStorage.getItem('colorGameHighScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
        document.getElementById('high-score').textContent = highScore;
    }
}

function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    gameScore = 0;
    document.getElementById('game-score').textContent = gameScore;
    document.getElementById('start-game').textContent = 'Playing...';
    document.getElementById('start-game').disabled = true;
    
    // Start the color cycle
    cycleColors();
}

function resetGame() {
    // Clear any existing timeout
    clearTimeout(gameTimeout);
    
    gameActive = false;
    gameScore = 0;
    currentColorIndex = 0;
    
    document.getElementById('game-score').textContent = gameScore;
    document.getElementById('start-game').textContent = 'Start Game';
    document.getElementById('start-game').disabled = false;
    
    const colorGame = document.getElementById('color-game');
    colorGame.style.backgroundColor = 'gray';
    colorGame.textContent = 'Wait...';
}

function cycleColors() {
    if (!gameActive) return;
    
    currentColorIndex = (currentColorIndex + 1) % gameColors.length;
    const color = gameColors[currentColorIndex];
    const colorGame = document.getElementById('color-game');
    
    colorGame.style.backgroundColor = color;
    
    switch(color) {
        case 'red':
            colorGame.textContent = 'Wait...';
            break;
        case 'yellow':
            colorGame.textContent = 'Get Ready...';
            break;
        case 'green':
            colorGame.textContent = 'CLICK NOW!';
            break;
        default:
            colorGame.textContent = 'Wait...';
    }
    
    // Schedule next color change
    gameTimeout = setTimeout(cycleColors, gameSpeed);
}

function handleGameClick() {
    if (!gameActive) return;
    
    if (gameColors[currentColorIndex] === 'green') {
        // Successful click
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        
        if (gameScore > highScore) {
            highScore = gameScore;
            document.getElementById('high-score').textContent = highScore;
            localStorage.setItem('colorGameHighScore', highScore);
        }
        
        // Increase speed
        gameSpeed = Math.max(500, gameSpeed - 100);
        
        // Visual feedback
        const colorGame = document.getElementById('color-game');
        colorGame.style.transform = 'scale(1.1)';
        setTimeout(() => {
            colorGame.style.transform = 'scale(1)';
        }, 200);
    } else {
        // Failed click - end game
        endGame();
    }
}

function endGame() {
    gameActive = false;
    clearTimeout(gameTimeout);
    
    const colorGame = document.getElementById('color-game');
    colorGame.style.backgroundColor = 'red';
    colorGame.textContent = 'Game Over!';
    
    document.getElementById('start-game').textContent = 'Play Again';
    document.getElementById('start-game').disabled = false;
    
    // Reset speed
    gameSpeed = 2000;
}

function showGameSection() {
    document.querySelector('.game-section').style.display = 'block';
    document.querySelectorAll('section:not(.game-section)').forEach(section => {
        section.style.display = 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideGameSection() {
    document.querySelector('.game-section').style.display = 'none';
    document.querySelectorAll('section:not(.game-section)').forEach(section => {
        section.style.display = 'block';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}