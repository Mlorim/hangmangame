import '../css/style.css'
import { darkModeHandle } from './utils';
import { startGame } from './game';
darkModeHandle();

const startGameButton = document.getElementById('startButton');
startGameButton.addEventListener('click', startGame);