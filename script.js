const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('[data-target]');

const studyRecords = [];
const notes = [];

function showPage(targetId) {
  pages.forEach((page) => page.classList.toggle('active', page.id === targetId));
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.target));
});

const timeForm = document.querySelector('#time-form');
const timeList = document.querySelector('#time-list');

timeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = document.querySelector('#study-date').value;
  const subject = document.querySelector('#study-subject').value.trim();
  const minutes = Number(document.querySelector('#study-minutes').value);

  studyRecords.push({ date, subject, minutes });
  timeForm.reset();
  renderTimeRecords();
});

function renderTimeRecords() {
  timeList.innerHTML = '';

  studyRecords.forEach((record) => {
    const item = document.createElement('li');
    item.textContent = `${record.date} | ${record.subject} | ${record.minutes}분`;
    timeList.appendChild(item);
  });
}

const noteForm = document.querySelector('#note-form');
const noteList = document.querySelector('#note-list');

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const subject = document.querySelector('#note-subject').value.trim();
  const content = document.querySelector('#note-content').value.trim();

  notes.push({ subject, content });
  noteForm.reset();
  renderNotes();
});

function renderNotes() {
  noteList.innerHTML = '';

  notes.forEach((note, index) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${index + 1}. ${note.subject}</strong><br />${note.content}`;
    noteList.appendChild(item);
  });
}

const generateQuizButton = document.querySelector('#generate-quiz');
const quizList = document.querySelector('#quiz-list');

generateQuizButton.addEventListener('click', () => {
  quizList.innerHTML = '';

  if (notes.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = '먼저 과목별 내용 정리를 저장해주세요.';
    quizList.appendChild(empty);
    return;
  }

  notes.forEach((note) => {
    const quiz = document.createElement('li');
    quiz.textContent = `[${note.subject}] ${note.content.slice(0, 40)}... 이 내용을 3문장으로 설명해보세요.`;
    quizList.appendChild(quiz);
  });
});
