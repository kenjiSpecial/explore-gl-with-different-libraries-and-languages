const {
    createRowArr,
    createMultiArr,
    createBox,
    convertPartToObject,
    addGamePart,
    moveGamePart,
    moveFall,
} = require('./tetris');

describe('** Array **', () => {
    test('create [0]', () => {
        expect(createRowArr(1)).toStrictEqual([0]);
    });

    test('create [0, 0, 0]', () => {
        expect(createRowArr(3)).toStrictEqual([0, 0, 0]);
    });

    test('create [[0, 0, 0], [0, 0, 0]]', () => {
        expect(createMultiArr(3, 2)).toStrictEqual([
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });
});

describe('** GAME PART **', () => {
    test('gameBox is [[1, 1], [1, 1]]', () => {
        expect(createBox().value).toStrictEqual([
            [1, 1],
            [1, 1],
        ]);
    });

    test('convert game box to array', () => {
        const box = createBox();
        box.col = 3;
        box.row = 1;
        const a = convertPartToObject(box);
        expect(a[0]).toStrictEqual({ col: 2, row: 0, value: 1 });
        expect(a[3]).toStrictEqual({ col: 3, row: 1, value: 1 });
    });
});

describe('** GAME LOGIC **', () => {
    describe('move game box to the one step right with the key input', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const gameState = { move: 'right' };
        const box = createBox(col);
        moveGamePart(gameState, box, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);

        const a = convertPartToObject(box);
        const gridUpdated = addGamePart(grid, a);

        expect(gridUpdated).toStrictEqual([
            [0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]);
    });

    describe('move game box to the one step right with the key input', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const gameState = { move: 'right' };
        const box = createBox(col);
        moveGamePart(gameState, box, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        box.isDone = moveFall(box, grid, col, row);

        const a = convertPartToObject(box);
        const gridUpdated = addGamePart(grid, a);

        expect(gridUpdated).toStrictEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 2, 2, 0],
            [0, 0, 2, 2, 0],
        ]);
    });

    describe('collide game box with the other game box', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const gameState = { move: 'right' };
        const box = createBox(col);
        moveGamePart(gameState, box, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        box.isDone = moveFall(box, grid, col, row);

        const a = convertPartToObject(box);
        const gridUpdated = addGamePart(grid, a);

        const box2 = createBox(col);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        box2.isDone = moveFall(box2, gridUpdated, col, row);

        const b = convertPartToObject(box2);
        const gridUpdated2 = addGamePart(gridUpdated, b);
        console.log(gridUpdated2);

        expect(gridUpdated2).toStrictEqual([
            [0, 0, 0, 0, 0],
            [0, 2, 2, 0, 0],
            [0, 2, 2, 0, 0],
            [0, 0, 2, 2, 0],
            [0, 0, 2, 2, 0],
        ]);
    });
});
