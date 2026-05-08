const mainAudio = document.getElementById('mainAudio');
const trumpetAudio = document.getElementById('trumpetAudio');
const backgroundVideo = document.getElementById('backgroundVideo');
const playButton = document.getElementById('playButton');
const volumeControl = document.getElementById('volumeControl');
const volumeDisplay = document.getElementById('volumeDisplay');
const repeatCountInput = document.getElementById('repeatCount');
const trumpetSelect = document.getElementById('trumpetSelect');

let playsRemaining = 0;
let audioCtx;
let gainNode;

function initAudio() {
    if (audioCtx) return; 

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    const mainSource = audioCtx.createMediaElementSource(mainAudio);
    const trumpetSource = audioCtx.createMediaElementSource(trumpetAudio);
    
    mainSource.connect(gainNode);
    trumpetSource.connect(gainNode);

    gainNode.gain.value = parseFloat(volumeControl.value);
}

volumeControl.addEventListener('input', (event) => {
    const currentVolume = parseFloat(event.target.value);
    volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    
    initAudio();
    
    if (gainNode) {
        gainNode.gain.setTargetAtTime(currentVolume, audioCtx.currentTime, 0.05);
    }
});

function playMainAudio() {
    mainAudio.currentTime = 0;
    mainAudio.play();
}

playButton.addEventListener('click', () => {
    initAudio();
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    playsRemaining = parseInt(repeatCountInput.value, 10);
    
    // Pause and reset all media
    mainAudio.pause();
    trumpetAudio.pause();
    backgroundVideo.pause();
    backgroundVideo.currentTime = 0;

    const selectedTrumpet = trumpetSelect.value;

    if (selectedTrumpet === 'none') {
        backgroundVideo.play();
        playMainAudio();
    } else {
        trumpetAudio.src = selectedTrumpet;
        trumpetAudio.currentTime = 0;
        trumpetAudio.play();
    }
});

// When the trumpet finishes, play the main audio AND start the video
trumpetAudio.addEventListener('ended', () => {
    backgroundVideo.play();
    playMainAudio();
});

// Loop Logic: Applies to the main asistencia audio and shuts down the video
mainAudio.addEventListener('ended', () => {
    if (playsRemaining > 0) {
        playsRemaining--; 
        // Restart audio. The video will continue looping naturally without restarting.
        playMainAudio(); 
    } else {
        // When all repeats are completely finished, pause the video
        backgroundVideo.pause();
    }
}); 