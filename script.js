 const pages = document.querySelectorAll('.page');
 const navButtons = document.querySelectorAll('[data-target]');
 
 const studyRecords = [];
 const notes = [];
let quizzes = [];

const timeForm = document.querySelector('#time-form');
const timeList = document.querySelector('#time-list');
const timerDisplay = document.querySelector('#timer-display');
const recordToggle = document.querySelector('#record-toggle');

let timerId = null;
let elapsedSeconds = 0;

function formatDuration(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}시간 ${minutes}분 ${seconds}초`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatDuration(elapsedSeconds);
}

function stopTimer() {
  if (!timerId) {
    return;
  }
  clearInterval(timerId);
  timerId = null;
  recordToggle.textContent = '기록 시작';
}
 
 function showPage(targetId) {
  if (targetId !== 'time-tracker') {
    stopTimer();
  }
   pages.forEach((page) => page.classList.toggle('active', page.id === targetId));
 }
 
 navButtons.forEach((button) => {
   button.addEventListener('click', () => showPage(button.dataset.target));
 });
 
  if (timerId) {
    stopTimer();
    return;
  }

  timerId = setInterval(() => {
    elapsedSeconds += 1;
    updateTimerDisplay();
  }, 1000);
  recordToggle.textContent = '기록 중지';
});
 
 timeForm.addEventListener('submit', (event) => {
   event.preventDefault();
 
   const date = document.querySelector('#study-date').value;
   const subject = document.querySelector('#study-subject').value.trim();
  studyRecords.push({ date, subject, elapsedSeconds });
   timeForm.reset();
  stopTimer();
  elapsedSeconds = 0;
  updateTimerDisplay();
   renderTimeRecords();
 });
 
 function renderTimeRecords() {
   timeList.innerHTML = '';
 
   studyRecords.forEach((record) => {
     const item = document.createElement('li');
    item.textContent = `${record.date} | ${record.subject} | ${formatDuration(record.elapsedSeconds)}`;
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
 
function buildAnswer(content) {
  return content
    .split(/[.!?\n]/)
    .map((line) => line.trim())
    .filter(Boolean)[0] || content;
}

function renderQuizzes() {
  quizList.innerHTML = '';

  quizzes.forEach((quiz, index) => {
    const quizItem = document.createElement('li');

    const question = document.createElement('p');
    question.textContent = `${index + 1}. [${quiz.subject}] ${quiz.question}`;

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = '정답 입력';

    const gradeButton = document.createElement('button');
    gradeButton.type = 'button';
    gradeButton.textContent = '채점';

    const result = document.createElement('p');

    gradeButton.addEventListener('click', () => {
      const userAnswer = answerInput.value.trim();
      if (!userAnswer) {
        result.textContent = '정답을 먼저 입력해주세요.';
        return;
      }

      if (userAnswer === quiz.answer) {
        result.textContent = '정답입니다!';
      } else {
        result.textContent = `오답입니다. 정답: ${quiz.answer}`;
      }
    });

    quizItem.appendChild(question);
    quizItem.appendChild(answerInput);
    quizItem.appendChild(gradeButton);
    quizItem.appendChild(result);
    quizList.appendChild(quizItem);
  });
}

 generateQuizButton.addEventListener('click', () => {
   quizList.innerHTML = '';
 
   if (notes.length === 0) {
     const empty = document.createElement('li');
     empty.textContent = '먼저 과목별 내용 정리를 저장해주세요.';
     quizList.appendChild(empty);
     return;
   }
 
  quizzes = notes.map((note) => ({
    subject: note.subject,
    question: `${note.content.slice(0, 35)}... 의 핵심 한 문장을 입력하세요.`,
    answer: buildAnswer(note.content),
  }));

+  renderQuizzes();
 });
+
+updateTimerDisplay();
