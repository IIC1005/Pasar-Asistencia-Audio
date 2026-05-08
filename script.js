const mainAudio = document.getElementById('mainAudio');
const trumpetAudio = document.getElementById('trumpetAudio');
const playButton = document.getElementById('playButton');
const volumeControl = document.getElementById('volumeControl');
const volumeDisplay = document.getElementById('volumeDisplay');
const repeatCountInput = document.getElementById('repeatCount');
const trumpetSelect = document.getElementById('trumpetSelect');

let playsRemaining = 0;
let audioCtx;
let gainNode;

// 1. Initialize the Web Audio API for BOTH audio elements
function initAudio() {
    if (audioCtx) return; 

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create the master volume node
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    // Connect BOTH the trumpet and main audio to the same volume controller
    const mainSource = audioCtx.createMediaElementSource(mainAudio);
    const trumpetSource = audioCtx.createMediaElementSource(trumpetAudio);
    
    mainSource.connect(gainNode);
    trumpetSource.connect(gainNode);

    gainNode.gain.value = parseFloat(volumeControl.value);
}

// 2. Handle Volume slider
volumeControl.addEventListener('input', (event) => {
    const currentVolume = parseFloat(event.target.value);
    volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    
    initAudio();
    
    if (gainNode) {
        gainNode.gain.setTargetAtTime(currentVolume, audioCtx.currentTime, 0.05);
    }
});

// Helper function to play the main asistencia audio
function playMainAudio() {
    mainAudio.currentTime = 0;
    mainAudio.play();
}

// 3. Handle the Play Button Sequence
playButton.addEventListener('click', () => {
    initAudio();
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    playsRemaining = parseInt(repeatCountInput.value, 10);
    
    // Pause anything currently playing to prevent overlapping sounds
    mainAudio.pause();
    trumpetAudio.pause();

    const selectedTrumpet = trumpetSelect.value;

    if (selectedTrumpet === 'none') {
        // If "No Sound" is selected, skip straight to the main audio
        playMainAudio();
    } else {
        // Otherwise, load the specific trumpet sound and play it
        trumpetAudio.src = selectedTrumpet;
        trumpetAudio.currentTime = 0;
        trumpetAudio.play();
    }
});

// 4. Sequence Logic: When the trumpet finishes, play the main audio
trumpetAudio.addEventListener('ended', () => {
    playMainAudio();
});

// 5. Loop Logic: Only applies to the main asistencia audio
mainAudio.addEventListener('ended', () => {
    if (playsRemaining > 0) {
        playsRemaining--; 
        playMainAudio(); 
    }
});