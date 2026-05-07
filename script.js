const audio = document.getElementById('myAudio');
const playButton = document.getElementById('playButton');
const volumeControl = document.getElementById('volumeControl');
const volumeDisplay = document.getElementById('volumeDisplay');
const repeatCountInput = document.getElementById('repeatCount');

let playsRemaining = 0;
let audioCtx;
let gainNode;

function initAudio() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const source = audioCtx.createMediaElementSource(audio);
    
    gainNode = audioCtx.createGain();
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = volumeControl.value;
}

volumeControl.addEventListener('input', (event) => {
    const currentVolume = event.target.value;
    
    volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    
    if (gainNode) {
        gainNode.gain.value = currentVolume;
    } else {
        audio.volume = Math.min(currentVolume, 1);
    }
});

playButton.addEventListener('click', () => {
    initAudio();
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    playsRemaining = parseInt(repeatCountInput.value, 10);
    audio.currentTime = 0; 
    audio.play();
});

audio.addEventListener('ended', () => {
    if (playsRemaining > 0) {
        playsRemaining--; 
        audio.currentTime = 0; 
        audio.play(); 
    }
});