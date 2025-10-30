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
  {note: 'B', freq: 493.88, black: false},
  {note: 'C5', freq: 523.25, black: false, high: true}, // High C
  {note: 'Bb', freq: 466.16, black: true, offset: 362} // Bb
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
function playNote(frequency, duration = 350, velocity = 0.22, sustain = false) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = frequency;
  gain.gain.value = velocity;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  if (sustain) {
    setTimeout(() => {
      gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
      osc.stop(audioCtx.currentTime + 0.5);
    }, duration);
  } else {
    setTimeout(() => {
      gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      osc.stop(audioCtx.currentTime + 0.1);
    }, duration);
  }
}

// Melody and chords for "Happy Birthday to you, Arshad Pasha"
const melody = [
  // Line 1: Happy birthday to you
  {note: 'C', duration: 400, chord: ['C','E','G'], lyric: 'Happy birthday to you'},
  {note: 'C', duration: 400, chord: null},
  {note: 'D', duration: 600, chord: null},
  {note: 'C', duration: 600, chord: null},
  {note: 'F', duration: 600, chord: ['G','B','D','F']}, // G7
  {note: 'E', duration: 1200, chord: null},
  // Line 2: Happy birthday to you
  {note: 'C', duration: 400, chord: ['C','E','G'], lyric: 'Happy birthday to you'},
  {note: 'C', duration: 400, chord: null},
  {note: 'D', duration: 600, chord: null},
  {note: 'C', duration: 600, chord: null},
  {note: 'G', duration: 600, chord: ['G','B','D','F']}, // G7
  {note: 'F', duration: 1200, chord: null},
  // Line 3: Happy birthday dear Arshad Pasha
  {note: 'C', duration: 400, chord: ['C','E','G'], lyric: 'Happy birthday dear Arshad Pasha'},
  {note: 'C', duration: 400, chord: null},
  {note: 'C5', duration: 600, chord: ['F','A','C']}, // F
  {note: 'A', duration: 600, chord: ['C','E','G']}, // C
  {note: 'F', duration: 600, chord: ['G','B','D','F']}, // G7
  {note: 'E', duration: 600, chord: null},
  {note: 'D', duration: 1200, chord: null},
  // Line 4: Happy birthday to you
  {note: 'Bb', duration: 400, chord: ['C','E','G'], lyric: 'Happy birthday to you 🎂'},
  {note: 'Bb', duration: 400, chord: null},
  {note: 'A', duration: 600, chord: ['G','B','D','F']}, // G7
  {note: 'F', duration: 600, chord: null},
  {note: 'G', duration: 600, chord: null},
  {note: 'F', duration: 1200, chord: ['C','E','G']}
];

// Arpeggio ending and fancy ending
const arpeggio = [
  {note: 'C', duration: 400},
  {note: 'E', duration: 400},
  {note: 'G', duration: 400},
  {note: 'C5', duration: 1200},
];
const fancyEnding = [
  {note: 'C', duration: 300},
  {note: 'G', duration: 300},
  {note: 'F', duration: 300},
  {note: 'C', duration: 300},
  {note: 'E', duration: 300},
  {note: 'G', duration: 300},
  {note: 'C5', duration: 1200},
];

function playChord(notes, duration = 350, velocity = 0.07) {
  // Play each chord note with a slight delay for clarity
  notes.forEach((n, idx) => {
    setTimeout(() => {
      const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.dataset.note === n);
      if (keyEl) {
        keyEl.classList.add('playing');
        setTimeout(() => keyEl.classList.remove('playing'), duration - 60);
      }
      const freq = keys.find(k => k.note === n)?.freq;
      if (freq) playNote(freq, duration, velocity, true);
    }, idx * 40); // 40ms spacing between notes
  });
}

function playMelody(repeat = 2, onEnd) {
  let i = 0, r = 0;
  const lyricsDiv = document.getElementById('lyrics');
  function nextNote() {
    if (i >= melody.length) {
      i = 0;
      r++;
      if (r >= repeat) {
        if (lyricsDiv) lyricsDiv.textContent = '';
        if (onEnd) onEnd();
        return;
      }
    }
    const {note, duration, chord, lyric} = melody[i];
    const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.dataset.note === note);
    if (keyEl) {
      keyEl.classList.add('playing');
      setTimeout(() => keyEl.classList.remove('playing'), duration - 80);
    }
    const freq = keys.find(k => k.note === note)?.freq;
    playNote(freq, duration, 0.18, true);
    if (chord) playChord(chord, 250, 0.06); // Shorter, softer chords
    // Show lyric if present
    if (lyric && lyricsDiv) {
      lyricsDiv.textContent = lyric;
    }
    i++;
    setTimeout(nextNote, duration + 60); // Add a small gap for clarity
  }
  nextNote();
}

function playArpeggio(onEnd) {
  let i = 0;
  function next() {
    if (i >= arpeggio.length) {
      if (onEnd) onEnd();
      return;
    }
    const {note, duration} = arpeggio[i];
    const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.dataset.note === note);
    if (keyEl) {
      keyEl.classList.add('playing');
      setTimeout(() => keyEl.classList.remove('playing'), duration - 80);
    }
    const freq = keys.find(k => k.note === note)?.freq;
    playNote(freq, duration, 0.18, true);
    i++;
    setTimeout(next, duration);
  }
  next();
}

function playFancyEnding(onEnd) {
  let i = 0;
  function next() {
    if (i >= fancyEnding.length) {
      if (onEnd) onEnd();
      return;
    }
    const {note, duration} = fancyEnding[i];
    const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.dataset.note === note);
    if (keyEl) {
      keyEl.classList.add('playing');
      setTimeout(() => keyEl.classList.remove('playing'), duration - 80);
    }
    const freq = keys.find(k => k.note === note)?.freq;
    playNote(freq, duration, 0.18, true);
    i++;
    setTimeout(next, duration);
  }
  next();
}

function finishWithChord() {
  const msg = document.createElement('div');
  msg.className = 'header';
  msg.style.fontSize = '1.5rem';
  msg.style.marginTop = '24px';
  msg.innerText = '🎶 Happy birthday, dear Arshad Pasha… 🎶';
  document.body.appendChild(msg);
  playChord(['C','E','G'], 1800, 0.18);
}

window.onload = () => {
  setTimeout(() => {
    playMelody(2, () => {
      playArpeggio(() => {
        playFancyEnding(finishWithChord);
      });
    });
  }, 800);
};

// Manual play (optional)
piano.addEventListener('mousedown', e => {
  const key = e.target.closest('.key');
  if (key) {
    key.classList.add('playing');
    playNote(key.dataset.freq, 350, 0.22, true);
  }
});
piano.addEventListener('mouseup', e => {
  const key = e.target.closest('.key');
  if (key) key.classList.remove('playing');
});
piano.addEventListener('mouseleave', e => {
  document.querySelectorAll('.key.playing').forEach(k => k.classList.remove('playing'));
});
