const letters = document.querySelectorAll('.scoreboard-letter');
const loading = document.querySelector('.info-bar');
const heading = document.querySelector('.brand');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
  let currentGuess = '';
  let currentRow = 0;
  let isLoading = true;
  let done = false; // if game is over

  const res = await fetch('https://words.dev-apis.com/word-of-the-day');
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split('');
  const map = createMap(wordParts);

  console.log(word);
  console.log(map);
  setLoading(false);
  isLoading = false;

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      current = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText =
      letter;
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = ' ';
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }

    // VERIFY WORD
    isLoading = true;
    setLoading(true);
    const res = await fetch('https://words.dev-apis.com/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: currentGuess }),
    });

    const resObj = await res.json();
    const isValid = resObj.validWord;
    isLoading = false;
    setLoading(false);

    if (!isValid) {
      // alert('Not a valid word');
      for (let i = 0; i < ANSWER_LENGTH; i++) {
        letters[currentRow * ANSWER_LENGTH + i].classList.remove('invalid');

        setTimeout(function () {
          letters[currentRow * ANSWER_LENGTH + i].classList.add('invalid');
        }, 10);
      }

      return;
    }

    // TODO See which letters are correct and all
    const guessLetters = currentGuess.split('');

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessLetters[i] === wordParts[i]) {
        // correct letters
        letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
        map[guessLetters[i]]--;
      } else if (
        wordParts.includes(guessLetters[i]) &&
        map[guessLetters[i]] > 0
      ) {
        // close words (not correct index but present)
        letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
      }
    }

    currentRow++;
    if (currentGuess === word) {
      setTimeout(function () {
        alert('You Win');
      }, 1);
      heading.classList.add('winner');
      done = true;
      return;
    } else if (currentRow >= ROUNDS) {
      setTimeout(function () {
        alert(`You Lose, the correct word was ${word}`);
      }, 1);
      done = true;
      return;
    }

    // TODO IS WINNER

    currentGuess = '';
  }

  document.addEventListener('keydown', function handleKeyPress(event) {
    if (done || isLoading) {
      // do nothing
      return;
    }
    const action = event.key;

    if (action == 'Enter') {
      commit();
    } else if (action == 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loading.classList.toggle('show', isLoading);
}

// frequency map
function createMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}
init();
