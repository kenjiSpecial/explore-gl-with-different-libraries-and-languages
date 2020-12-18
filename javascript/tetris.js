const readline = require('readline');

if (require.main === module) {
    const colNum = 10;
    const rowNum = 5;
    const gameState = {
        move: null,
        score: 0,
        gameOver: false,
    };

    const gameStage = createMultiArr(colNum, rowNum);
    addKeyboardEvent(gameState);
    loop(gameState, gameStage, colNum, rowNum, [], 0);
}

function moveGamePart(gameStage, gameStateValue, gamePart, colNum, rowNum) {
    if (gameStateValue.move === 'right') {
        let canMoveRight = true;
        const gamePartRight = gamePart.col + gamePart.width - 1 + gamePart.origin.col;

        for (let rowIndex = 0; rowIndex < gamePart.value.length; rowIndex++) {
            const gameRowArr = gamePart.value[rowIndex];
            const colSize = gameRowArr.length;
            let rightCol = colSize - 1;

            for (let colIndex = colSize - 2; colIndex >= 0; colIndex--) {
                if (gameRowArr[colIndex] === 1 && gameRowArr[colIndex + 1] === 0) {
                    rightCol = colIndex;
                    break;
                }
            }

            const row = rowIndex + gamePart.row + gamePart.origin.row;
            const col = rightCol + 1 + gamePart.col + gamePart.origin.col;

            if (gameStage[row] && gameStage[row][col]) {
                canMoveRight = false;
                break;
            }
        }

        if (canMoveRight) {
            gamePart.col =
                gamePartRight + 1 >= colNum
                    ? colNum - gamePart.width - gamePart.origin.col
                    : gamePart.col + 1;
        }
    } else if (gameStateValue.move === 'left') {
        let canMoveLeft = true;

        for (let rowIndex = 0; rowIndex < gamePart.value.length; rowIndex++) {
            const gameRowArr = gamePart.value[rowIndex];
            const colSize = gameRowArr.length;
            let leftCol = 0;

            for (let colIndex = 1; colIndex < colSize; colIndex++) {
                if (gameRowArr[colIndex - 1] === 0 && gameRowArr[colIndex] === 1) {
                    leftCol = colIndex;
                    break;
                }
            }

            const row = rowIndex + gamePart.row + gamePart.origin.row;
            const col = leftCol - 1 + gamePart.col + gamePart.origin.col;

            if (gameStage[row] && gameStage[row][col]) {
                canMoveLeft = false;
                break;
            }
        }

        if (canMoveLeft) {
            gamePart.col =
                gamePart.col + gamePart.origin.col - 1 < 0
                    ? -gamePart.origin.col
                    : gamePart.col - 1;
        }
    }
}

function moveFall(gamePart, gameStage, colNum, rowNum) {
    const gamePartBot = gamePart.row + gamePart.origin.row + gamePart.height;

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

function resetState(gameState) {
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

function createBox(colNum) {
    return {
        width: 2,
        height: 2,
        origin: {
            col: -1,
            row: -1,
        },
        col: Math.ceil(colNum / 2),
        row: -1,
        rot: 0,
        isDone: false,
        value: [
            [1, 1],
            [1, 1],
        ],
    };
}

function showStage(value, score) {
    console.clear();
    console.log('=============\n');
    process.stdout.write(converToString(value));
    console.log('=============\n');
    console.log('SCORE:' + score + '\n\n');
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
        }, '') + '\n'
    );
}

function converToNum(value) {
    return (
        value.reduce((accumulator, currentValue) => {
            return (
                accumulator +
                currentValue.reduce((accumulator2, currentValue2) => {
                    return accumulator2 + ' ' + currentValue2;
                }, '') +
                '\n'
            );
        }, '') + '\n'
    );
}

function erase(gameStage, score, colNum, rowNum) {
    const a = createMultiArr(colNum, rowNum);
    const eraseRowArr = [];
    let curScore = score;

    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        let isErase = true;
        for (let colIndex = 0; colIndex < colNum; colIndex++) {
            if (gameStage[rowIndex][colIndex] !== 2) {
                isErase = false;
                break;
            }
        }

        if (isErase) {
            curScore++;
            eraseRowArr.push(rowIndex);
        }
    }
    let targetRow = rowNum - 1;
    for (let rowIndex = rowNum - 1; rowIndex >= 0; rowIndex--) {
        if (!eraseRowArr.includes(rowIndex)) {
            for (let colIndex = 0; colIndex < colNum; colIndex++) {
                a[targetRow][colIndex] = gameStage[rowIndex][colIndex];
            }

            targetRow--;
        }
    }

    return { gameStage: a, score: curScore };
}

function isLoop(isGameOver) {
    return !isGameOver;
}

function moveRight(gameState) {
    gameState.move = 'right';
}

function moveLeft(gameState) {
    gameState.move = 'left';
}

function addKeyboardEvent(gameState) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            if (key.name === 'right') moveRight(gameState);
            if (key.name === 'left') moveLeft(gameState);
        }
    });
}

function loop(gameState, gameStage, colNum, rowNum, gameParts, cnt) {
    const loopIntervaTime = 100;
    let gamePartArr = [];

    const obj = erase(gameStage, gameState.score, colNum, rowNum);
    gameStage = obj.gameStage;
    gameState.score = obj.score;

    gameParts.forEach((gamePart) => {
        moveGamePart(gameStage, gameState, gamePart, colNum, rowNum);
        gamePartArr = gamePartArr.concat(convertPartToObject(gamePart));
    });

    const updatedGamedStage = addGamePart(gameStage, gamePartArr);
    showStage(updatedGamedStage, gameState.score);

    resetState(gameState);

    if (cnt % 6 === 0) {
        gameParts = gameParts.filter((gamePart) => {
            gamePart.isDone = moveFall(gamePart, gameStage, colNum, rowNum);
            const top = gamePart.row + gamePart.origin.row;
            if (gamePart.isDone) {
                if (top >= 0) {
                    gameStage = addGamePart(gameStage, convertPartToObject(gamePart));
                } else {
                    gameState.gameOver = true;
                }
            }

            return !gamePart.isDone;
        });
    }

    if (isLoop(gameState.gameOver))
        setTimeout(() => {
            if (gameParts.length === 0) {
                gameParts.push(createTetrisPart(colNum, rowNum));
            }
            loop(gameState, gameStage, colNum, rowNum, gameParts, cnt + 1);
        }, loopIntervaTime);
    else console.log('=== GAME OVER ===');
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
    erase,
};
