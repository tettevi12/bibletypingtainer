
let lessons = [];
let currentLesson = {};
let startTime;

async function loadLessons() {
  const response = await fetch('lessons.json');
  lessons = await response.json();
  const list = document.getElementById('lessonList');
  list.innerHTML = '';
  lessons.forEach((lesson, index) => {
    const item = document.createElement('li');
    item.textContent = lesson.title;
    if (localStorage.getItem('lesson_' + index) === 'completed') {
      item.classList.add('completed');
    }
    item.onclick = () => startLesson(index);
    list.appendChild(item);
  });
}

function startLesson(index) {
  currentLesson = lessons[index];
  document.getElementById('lessonTitle').textContent = currentLesson.title;
  document.getElementById('verse-box').textContent = currentLesson.text;
  document.getElementById('input').value = '';
  document.getElementById('wpm').textContent = '0';
  document.getElementById('accuracy').textContent = '0%';
  document.getElementById('errors').textContent = '0';
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('lessonScreen').classList.remove('hidden');
  startTime = new Date();
}

function exitLesson() {
  document.getElementById('lessonScreen').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  loadLessons();
}

document.getElementById('input').addEventListener('input', () => {
  const input = document.getElementById('input').value;
  const original = currentLesson.text;
  let correct = 0, errors = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === original[i]) correct++;
    else errors++;
  }
  const accuracy = input.length > 0 ? (correct / input.length) * 100 : 0;
  const timeElapsed = (new Date() - startTime) / 60000;
  const wpm = timeElapsed > 0 ? Math.round((input.split(' ').length) / timeElapsed) : 0;
  document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
  document.getElementById('errors').textContent = errors;
  document.getElementById('wpm').textContent = wpm;
  if (input === original) {
    alert('Well done! Lesson completed 🎉');
    localStorage.setItem('lesson_' + lessons.indexOf(currentLesson), 'completed');
    exitLesson();
  }
});

window.onload = loadLessons;
