// Piano notes for "Happy Birthday" melody
// Each entry: {note: 'C', freq: 261.63, black: false}
const keys = [
  {note: 'C', freq: 261.63, black: false},
  {note: 'C#', freq: 277.18, black: true, offset: 38},
  {note: 'D', freq: 293.66, black: false},
  {note: 'D#', freq: 311.13, black: true, offset: 92},
  {note: 'E', freq: 329.63, black: false},
  {note: 'F', freq: 349.23, black: false},
  {note: 'F#', freq: 369.99, black: true, offset: 200},
  {note: 'G', freq: 392.00, black: false},
  {note: 'G#', freq: 415.30, black: true, offset: 254},
  {note: 'A', freq: 440.00, black: false},
  {note: 'A#', freq: 466.16, black: true, offset: 308},
  {note: 'B', freq: 493.88, black: false}
];

const piano = document.getElementById('piano');
// Create white keys
keys.forEach((key, i) => {
  if (!key.black) {
    const container = document.createElement('div');
    container.className = 'key-container';
    const el = document.createElement('div');
    el.className = 'key';
    el.dataset.freq = key.freq;
    el.dataset.note = key.note;
    el.innerHTML = `<span class="key-label">${key.note}</span>`;
    container.appendChild(el);
    piano.appendChild(container);
  }
});
// Create black keys
keys.forEach((key, i) => {
  if (key.black) {
    const el = document.createElement('div');
    el.className = 'key black';
    el.style.left = key.offset + 'px';
    el.dataset.freq = key.freq;
    el.dataset.note = key.note;
    el.innerHTML = `<span class="key-label">${key.note}</span>`;
    piano.appendChild(el);
  }
});

// Web Audio API setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNote(frequency, duration = 350) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = 0.22;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  setTimeout(() => {
    gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    osc.stop(audioCtx.currentTime + 0.1);
  }, duration);
}

// Melody for "Happy Birthday, Arshad Pasha" (notes and timing)
const melody = [
  // Happy Birthday to You
  {note: 'C', duration: 400},
  {note: 'C', duration: 400},
  {note: 'D', duration: 600},
  {note: 'C', duration: 600},
  {note: 'F', duration: 600},
  {note: 'E', duration: 1200},
  // Happy Birthday to You
  {note: 'C', duration: 400},
  {note: 'C', duration: 400},
  {note: 'D', duration: 600},
  {note: 'C', duration: 600},
  {note: 'G', duration: 600},
  {note: 'F', duration: 1200},
  // Happy Birthday dear Arshad Pasha
  {note: 'C', duration: 400},
  {note: 'C', duration: 400},
  {note: 'C', duration: 600},
  {note: 'A', duration: 600},
  {note: 'F', duration: 600},
  {note: 'E', duration: 600},
  {note: 'D', duration: 1200},
  // Happy Birthday to You
  {note: 'A#', duration: 400},
  {note: 'A#', duration: 400},
  {note: 'A', duration: 600},
  {note: 'F', duration: 600},
  {note: 'G', duration: 600},
  {note: 'F', duration: 1200}
];

// Play melody with animation
function playMelody(repeat = 2) {
  let i = 0, r = 0;
  function nextNote() {
    if (i >= melody.length) {
      i = 0;
      r++;
      if (r >= repeat) return;
    }
    const {note, duration} = melody[i];
    const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.dataset.note === note);
    if (keyEl) {
      keyEl.classList.add('playing');
      setTimeout(() => keyEl.classList.remove('playing'), duration - 80);
    }
    const freq = keys.find(k => k.note === note).freq;
    playNote(freq, duration);
    i++;
    setTimeout(nextNote, duration);
  }
  nextNote();
}

// Start animation and melody on load
window.onload = () => {
  setTimeout(() => playMelody(3), 800);
};

// Manual play (optional)
piano.addEventListener('mousedown', e => {
  const key = e.target.closest('.key');
  if (key) {
    key.classList.add('playing');
    playNote(key.dataset.freq);
  }
});
piano.addEventListener('mouseup', e => {
  const key = e.target.closest('.key');
  if (key) key.classList.remove('playing');
});
piano.addEventListener('mouseleave', e => {
  document.querySelectorAll('.key.playing').forEach(k => k.classList.remove('playing'));
});
