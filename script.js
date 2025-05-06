let versesKJV = [];
let currentVerse = "";
let startTime;

async function loadVerse() {
  const translation = document.getElementById("translation").value;
  const mode = document.getElementById("mode").value;

  if (translation === "kjv") {
    const response = await fetch('verses-kjv.json');
    versesKJV = await response.json();
    currentVerse = getVerse(versesKJV, mode);
    displayVerse(currentVerse);
  } else if (translation === "esv") {
    currentVerse = await fetchESV(mode);
    displayVerse(currentVerse);
  }

  document.getElementById('input').value = "";
  document.getElementById('accuracy').innerText = "0%";
  document.getElementById('wpm').innerText = "0";
  startTime = new Date();
}

function getVerse(verses, mode) {
  if (mode === "multi") {
    const start = Math.floor(Math.random() * (verses.length - 3));
    return verses.slice(start, start + 3).join(" ");
  } else {
    return verses[Math.floor(Math.random() * verses.length)];
  }
}

function displayVerse(text) {
  document.getElementById('verse-box').innerText = text;
}

function calculateStats() {
  const input = document.getElementById('input').value;
  const correct = currentVerse.substring(0, input.length);
  let match = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === correct[i]) {
      match++;
    }
  }
  const accuracy = input.length > 0 ? (match / input.length) * 100 : 0;
  const timeElapsed = (new Date() - startTime) / 60000;
  const wordsTyped = input.trim().split(/\s+/).length;
  const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

  document.getElementById('accuracy').innerText = accuracy.toFixed(2) + "%";
  document.getElementById('wpm').innerText = wpm;
}

document.getElementById('input').addEventListener('input', calculateStats);

document.getElementById('fingerGuide').addEventListener('change', function() {
  const guide = document.getElementById('keyboard-guide');
  guide.classList.toggle('hidden', !this.checked);
});

async function fetchESV(mode) {
  const passage = mode === "multi" ? "John+1:1-5" : "John+3:16";
  const response = await fetch(`https://api.esv.org/v3/passage/text/?q=${passage}&include-passage-references=false&include-verse-numbers=false`, {
    headers: {
      'Authorization': 'Token YOUR_ESV_API_KEY_HERE'
    }
  });
  const data = await response.json();
  return data.passages[0].trim();
}

window.onload = loadVerse;
