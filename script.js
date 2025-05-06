let verses = [];
let currentVerse = "";
let startTime;

async function loadVerse() {
  const response = await fetch('verses.json');
  verses = await response.json();
  currentVerse = verses[Math.floor(Math.random() * verses.length)];
  document.getElementById('verse-box').innerText = currentVerse;
  document.getElementById('input').value = "";
  document.getElementById('accuracy').innerText = "0%";
  document.getElementById('wpm').innerText = "0";
  startTime = new Date();
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
  const timeElapsed = (new Date() - startTime) / 60000; // in minutes
  const wordsTyped = input.split(" ").length;
  const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

  document.getElementById('accuracy').innerText = accuracy.toFixed(2) + "%";
  document.getElementById('wpm').innerText = wpm;
}

document.getElementById('input').addEventListener('input', calculateStats);

// Load the first verse when the page loads
window.onload = loadVerse;
