import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementList, getCellElementAtIdx,getGameStatusElement, getCurrentTurnElement, getReplayButtonElement,  getBlockElement, } from "./selectors.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */

let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");


function toggleTurn() {
    currentTurn = currentTurn == TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;


}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add('show');
}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove('show');
}

function highlightWincells(winPossition) {
    if (!Array.isArray(winPossition) || winPossition.length != 3) {
        throw new Error('LỖI VALUE POSSITION');
    }

    for (const position of winPossition) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add('win');
    }

}

function handleCellClick(cell, index) {
    // set selected cell
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus != GAME_STATUS.PLAYING
    if (isClicked || isEndGame) return;
    cell.classList.add(currentTurn);

    cellValues[index] = currentTurn == TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS
    toggleTurn();

    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED:
            {
                updateGameStatus(game.status);
                showReplayButton();
                break;
            }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:
            {
                updateGameStatus(game.status);
                showReplayButton();
                highlightWincells(game.winPositions);
                break;
            }
        default:
            break;
    }

}


// gắn sự kiện cho các thẻ li 
function initCellElementLis() {
    const blockCell = getCellElementList();
    blockCell.forEach((cell, index) => {
        cell.dataset.idx = index;
    })

    const ulElement = getBlockElement();
    if (ulElement) {
        ulElement.addEventListener('click', (event) => {
            if (event.target.tagName != 'LI') return;

            const index = Number.parseInt(event.target.dataset.idx);
            handleCellClick(event.target, index);
        })
    }
}

function resetGame() {
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");

    updateGameStatus(GAME_STATUS.PLAYING);
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }

    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = '';

    }

    hideReplayButton();

}



function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener('click', resetGame)
    }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(()=>{
    initCellElementLis();
    initReplayButton();
})()
