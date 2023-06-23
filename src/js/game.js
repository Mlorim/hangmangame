import { WORDS, KEYBOARD_LETTERS } from "./const";

let triesLeft;
let lettersGuessed;

const gameDiv = document.getElementById("game");
const titleDiv = document.getElementById("logo");

const createPlaceHoldersHTML = () => {
  const word = sessionStorage.getItem("word");

  const wordArray = Array.from(word);
  const placeHolderHtml = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  );

  return `<div id="placeHolders" class="placeHolders-wrapper">${placeHolderHtml}</div>`;
};

const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";
  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class = "button-primary keyboard-button" id = "${curr}">${curr}</button>`
    );
  }, "");
  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "public/images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem('word');
  const inputletter = letter.toLowerCase();

  if (!word.includes(inputletter)) {
    const triesCounter = document.getElementById('tries-left');
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById('hangman-img');
    hangmanImg.src = `/public/images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame('lose');
    }
  } else {

    const wordArray = Array.from(word);

    wordArray.forEach((currentLetter, i) => {
      if (currentLetter == inputletter) {
        document.getElementById(`letter_${i}`).innerText = inputletter.toUpperCase();
        lettersGuessed += 1;
      }
    })
    console.log(lettersGuessed,wordArray.length)
    if (lettersGuessed == wordArray.length) {
      stopGame('win');
    }
  }
}

const stopGame = (status) => {

  document.getElementById('placeHolders').remove();
  document.getElementById('tries').remove();
  document.getElementById('keyboard').remove();
  document.getElementById('quit').remove();

  const word = sessionStorage.getItem('word');

  if (status === 'win') {
    // выигрыш
    document.getElementById('hangman-img').src = '/public/images/hg-win.png';
    document.getElementById('game').innerHTML += '<h2 class = "result-header win">You are breathtaking! </h2>';
  } else if (status === 'lose') {
    // проигрыш
    document.getElementById('game').innerHTML += '<h2 class = "result-header lose">You loh </h2>'
  } else if (status === 'quit') {
    titleDiv.classList.remove("logo-sm");
    document.getElementById('hangman-img').remove();
  }

  document.getElementById('game').innerHTML += `<p> The word was: <span class = "result-word"> ${word} </span></p><button id = "play-again" class = "button-primary px-5 py-2 mt-3">Play again!</button>`;
  document.getElementById('play-again').onclick = startGame;
}

export const startGame = () => {
  triesLeft = 10;
  lettersGuessed = 0;
  titleDiv.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);

  const imageDiv = createHangmanImg();

  gameDiv.innerHTML = createPlaceHoldersHTML();
  gameDiv.innerHTML +=
    '<p id="tries" class="mt-2"> TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span> </p>';

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === 'button') {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  gameDiv.appendChild(keyboardDiv);
  gameDiv.prepend(imageDiv);

  gameDiv.insertAdjacentHTML('beforeend','<button id = "quit" class="button-secondary px-2 py-1 mt-4">quit</button>');
  document.getElementById('quit').onclick = () => {
    const isSure = confirm('Are you idiot?');
    if (isSure) {
      stopGame('quit');
    }
  }
};
