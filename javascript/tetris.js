const gameState = {
    move: null,
};

function moveGamePart(gameStateValue, gamePart, colNum, rowNum) {
    if (gameStateValue.move === 'right') {
        const gamePartRight = gamePart.col + gamePart.width - 1 + gamePart.origin.col;

        gamePart.col =
            gamePartRight + 1 >= colNum
                ? colNum - gamePart.width - gamePart.origin.col
                : gamePart.col + 1;
    } else if (gameStateValue.move === 'left') {
        gamePart.col =
            gamePart.col + gamePart.origin.col - 1 < 0 ? -gamePart.origin.col : gamePart.col - 1;
    }
}

function moveFall(gamePart, gameStage, colNum, rowNum) {
    const gamePartBot = gamePart.row + gamePart.origin.row + gamePart.height;

    // gamePartBot

    const isGameFall = gamePart.value[gamePart.value.length - 1].reduce(
        (accumulator, gameItem, colIndex) => {
            if (gameItem === 1) {
                const col = gamePart.col + gamePart.origin.col + colIndex;
                if (gameStage[gamePartBot] && gameStage[gamePartBot][col] === 2) {
                    return true;
                }
            }
            return accumulator;
        },
        false
    );
    
    if (isGameFall) {
        return isGameFall;
    }

    if (gamePartBot >= rowNum) {
        gamePart.row = rowNum - (gamePart.origin.row + gamePart.height);
        return true;
    }

    gamePart.row = gamePart.row + 1;
    return false;
}

function resetState() {
    gameState.move = null;
}

function createMultiArr(colNum, rowNum) {
    return createArr(() => createRowArr(colNum, rowNum), rowNum);
}

function createRowArr(colNum, rowIndex, movingGamePart) {
    return createGridItemVal(colNum, rowIndex, calGridValue(movingGamePart));
}

function calGridValue(movingGamePart) {
    return (colIndex, rowIndex) => {
        return judgeGameParts(colIndex - 1, rowIndex - 1, movingGamePart);
    };
}

function judgeGameParts(colIndex, rowIndex) {
    return 0;
}

function createGridItemVal(colIndex, rowIndex, fn) {
    return colIndex === 0
        ? []
        : (() => {
              const t = createGridItemVal(colIndex - 1, rowIndex, fn);
              const value = fn(colIndex, rowIndex);

              t.push(value);
              return t;
          })();
}

function createArr(func, index) {
    return index === 0
        ? []
        : (() => {
              const t = createArr(func, index - 1);
              t.push(func());
              return t;
          })();
}

function addGamePart(multiArr, partArr) {
    const arr = [];
    multiArr.forEach((rowArr, rowIndex) => {
        arr[rowIndex] = [];
        rowArr.forEach((value, colIndex) => {
            arr[rowIndex][colIndex] = value;
        });
    });

    partArr.forEach((part) => {
        if (multiArr[part.row] !== undefined && multiArr[part.row][part.col] !== undefined) {
            arr[part.row][part.col] = part.value;
        }
    });

    return arr;
}

function createTetrisPart(col, row) {
    return createBox(col);
    // ++
    // ++
    // partsInGame();
}

function convertPartToObject(gamePart) {
    const arr = [];
    gamePart.value.forEach((rowArr, rowIndex) => {
        rowArr.forEach((itemVal, colIndex) => {
            if (itemVal === 1) {
                arr.push({
                    col: colIndex + gamePart.col + gamePart.origin.col,
                    row: rowIndex + gamePart.row + gamePart.origin.row,
                    value: gamePart.isDone ? 2 : 1,
                });
            }
        });
    });

    return arr;
}

function createBox(rowNum) {
    return {
        width: 2,
        height: 2,
        origin: {
            col: -1,
            row: -1,
        },
        col: Math.floor(rowNum / 2),
        row: -1,
        rot: 0,
        isDone: false,
        value: [
            [1, 1],
            [1, 1],
        ],
    };
}

function showStage(value) {
    console.clear();
    process.stdout.write(converToString(value));
}

function converToString(value) {
    return (
        value.reduce((accumulator, currentValue) => {
            return (
                accumulator +
                currentValue.reduce((accumulator2, currentValue2) => {
                    return currentValue2 === 0 ? accumulator2 + '-' : accumulator2 + '+';
                }, '') +
                '\n'
            );
        }, '') + '\n\n'
    );
}

function isLoop() {
    return true;
}

function moveRight() {
    gameState.move = 'right';
}

function moveLeft() {
    gameState.move = 'left';
}

function addKeyboardEvent() {
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            if (key.name === 'right') moveRight();
            if (key.name === 'left') moveLeft();
        }
    });
}

if (require.main === module) {
    const colNum = 10;
    const rowNum = 5;

    let gameStage = createMultiArr(colNum, rowNum);
    addKeyboardEvent();
    loop(gameStage, colNum, rowNum, [], 0);
}

function loop(gameStage, colNum, rowNum, gameParts, cnt) {
    const loopIntervaTime = 100;
    let gamePartArr = [];

    gameParts.forEach((gamePart) => {
        moveGamePart(gameState, gamePart, colNum, rowNum);
        gamePartArr = gamePartArr.concat(convertPartToObject(gamePart));
    });
    let updatedGamedStage = addGamePart(gameStage, gamePartArr);
    showStage(updatedGamedStage);

    resetState();
    if (cnt % 6 === 0) {
        gameParts = gameParts.filter((gamePart) => {
            gamePart.isDone = moveFall(gamePart, gameStage, colNum, rowNum);
            if (gamePart.isDone) {
                gameStage = addGamePart(gameStage, convertPartToObject(gamePart));
            }
            return !gamePart.isDone;
        });
    }

    if (isLoop())
        setTimeout(() => {
            if (gameParts.length === 0) {
                gameParts.push(createTetrisPart(colNum, rowNum));
            }
            loop(gameStage, colNum, rowNum, gameParts, cnt + 1);
        }, loopIntervaTime);
}

module.exports = {
    createRowArr,
    createMultiArr,
    createBox,
    convertPartToObject,
    addGamePart,
    showStage,
    moveGamePart,
    moveFall,
    loop,
    addKeyboardEvent,
};
