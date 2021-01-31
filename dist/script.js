const modal = document.querySelector('.start-modal');
const modalHeading = document.querySelector('.start-modal h1');
const modalText = document.querySelector('.start-modal p');
const startButton = document.querySelector('.start-btn');
const gameContainer = document.querySelector('main');
const scoreDisplay = document.querySelector('.score span');
const questionDisplay = document.querySelector('.question');
const answerContainer = document.querySelector('.answers');

let questionArray = []; // stores questions fetched from API
let answerArray = []; // array of arrays storing the possible answers for each question
let questionNumber = 0; // counter for which question is to be displayed
let score = 0; // keeps track of player's score as they progress

// fetch questions and answers
function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium')
    .then(res => res.json())
    .then(data => {
        data.results.forEach(item => {
            questionArray.push(item.question);
            answerArray.push([item.correct_answer, ...item.incorrect_answers]);
        })
    })
}

fetchQuestions();

// start game
startButton.addEventListener('click', () => {
    modal.classList.toggle('hidden')
    gameContainer.classList.toggle('hidden');
    fetchQuestion();
})

//displays new question and answer
function fetchQuestion() {
    if (questionNumber > 9) {
        endGame();
    } else {
        questionDisplay.innerHTML = `#${questionNumber + 1}. ${questionArray[questionNumber]}`;
        correctAnswer = answerArray[questionNumber][0]; // first element of array is always correct
        answerArray[questionNumber].sort( () => .5 - Math.random() ); // shuffle answers
        answerArray[questionNumber].forEach(answer => {
            let answerButton = document.createElement('button');
            answerButton.innerHTML = answer;
            answerButton.classList.add('answer-btn');
            answerContainer.appendChild(answerButton);
        })
        validateAnswer();
    }
}

// checks if answer user selected is correct
function validateAnswer() {
    answerContainer.childNodes.forEach(answer => {
        answer.addEventListener('click', () => {
            if (answer.textContent === correctAnswer) {
                score++;
                scoreDisplay.textContent = `${score}/10`;
            }
            // remove answer elements to leave space for next question
            while(answerContainer.firstChild) {
                answerContainer.removeChild(answerContainer.lastChild);
            }
            questionNumber++;
            fetchQuestion();
        })
    })
}

// handles game ending
function endGame() {
    modalHeading.textContent = `Thanks for playing! You scored a ${score}/10!`;

    if (score <= 4) {
        modalText.textContent = 'You are not very smart...';
    } else if (score <= 7) {
        modalText.textContent = 'Not bad!';
    } else {
        modalText.textContent = 'You are very knowledgeable!!';
    }
    score = 0;
    questionNumber = 0;
    questionArray = [];
    answerArray = [];
    fetchQuestions();
    startButton.textContent = 'Play Again';
    scoreDisplay.textContent = `${score}/10`;
    modal.classList.toggle('hidden')
    gameContainer.classList.toggle('hidden');
}

