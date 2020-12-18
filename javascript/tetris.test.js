const {
    createRowArr,
    createMultiArr,
    createBox,
    convertPartToObject,
    addGamePart,
    moveGamePart,
    moveFall,
    erase,
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
        expect(createBox(0).value).toStrictEqual([
            [1, 1],
            [1, 1],
        ]);
    });

    test('convert game box to array', () => {
        const box = createBox(0);
        box.col = 3;
        box.row = 1;
        const a = convertPartToObject(box);
        expect(a[0]).toStrictEqual({ col: 2, row: 0, value: 1 });
        expect(a[3]).toStrictEqual({ col: 3, row: 1, value: 1 });
    });
});

describe('** GAME LOGIC **', () => {
    it('move game box to the one step right with the key input', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const gameState = { move: 'left' };
        const box = createBox(col);
        moveGamePart(grid, gameState, box, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);

        const a = convertPartToObject(box);
        const gridUpdated = addGamePart(grid, a);

        expect(gridUpdated).toStrictEqual([
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]);
    });

    it('move game box to the one step right with the key input', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const box = createBox(col);
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

    it('collide game box with the other game box', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const gameState = { move: 'left' };
        const box = createBox(col);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        box.isDone = moveFall(box, grid, col, row);

        const a = convertPartToObject(box);
        const gridUpdated = addGamePart(grid, a);

        const box2 = createBox(col);
        moveGamePart(gridUpdated, gameState, box2, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        box2.isDone = moveFall(box2, gridUpdated, col, row);

        const b = convertPartToObject(box2);
        const gridUpdated2 = addGamePart(gridUpdated, b);

        expect(gridUpdated2).toStrictEqual([
            [0, 0, 0, 0, 0],
            [0, 2, 2, 0, 0],
            [0, 2, 2, 0, 0],
            [0, 0, 2, 2, 0],
            [0, 0, 2, 2, 0],
        ]);
    });

    it('collide game box with the other game box horizontally', () => {
        const row = 5;
        const col = 5;
        const grid = createMultiArr(col, row);
        const gameStateRight = { move: 'right' };
        const gameStateLeft = { move: 'left' };
        const box = createBox(col);
        moveGamePart(grid, gameStateRight, box, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        moveFall(box, grid, col, row);
        box.isDone = moveFall(box, grid, col, row);

        const a = convertPartToObject(box);
        const gridUpdated = addGamePart(grid, a);

        const box2 = createBox(col);
        moveGamePart(gridUpdated, gameStateLeft, box2, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveFall(box2, gridUpdated, col, row);
        moveGamePart(gridUpdated, gameStateRight, box2, col, row);

        const b = convertPartToObject(box2);
        const gridUpdated2 = addGamePart(gridUpdated, b);

        expect(gridUpdated2).toStrictEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 2, 2],
            [0, 1, 1, 2, 2],
        ]);

        const grid2 = createMultiArr(col, row);
        grid2[4][0] = 2;
        grid2[4][1] = 2;
        grid2[3][0] = 2;
        grid2[3][1] = 2;
        const box3 = createBox(col);
        moveFall(box3, grid2, col, row);
        moveFall(box3, grid2, col, row);
        moveFall(box3, grid2, col, row);
        moveFall(box3, grid2, col, row);
        moveFall(box3, grid2, col, row);
        moveGamePart(grid2, gameStateLeft, box3, col, row);

        const c = convertPartToObject(box3);
        const gridUpdated3 = addGamePart(grid2, c);

        expect(gridUpdated3).toStrictEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [2, 2, 1, 1, 0],
            [2, 2, 1, 1, 0],
        ]);
    });

    it('erase one row', () => {
        const row = 5;
        const col = 4;
        const grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 2, 2, 0],
            [2, 2, 2, 2],
        ];

        const obj1 = erase(grid, 0, col, row);
        const g = obj1.gameStage;

        expect(g).toStrictEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 2, 2, 0],
        ]);

        const grid2 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [2, 2, 2, 2],
        ];

        const obj2 = erase(grid2, 0, col, row);
        const g2 = obj2.gameStage;

        expect(g2).toStrictEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]);
    });

    it('score', () => {
        const row = 5;
        const col = 4;
        let score = 0;
        const grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 2, 2, 0],
            [2, 2, 2, 2],
        ];

        const obj1 = erase(grid, score, col, row);
        score = obj1.score;

        expect(score).toBe(score);
    });

    it('gameOver', () => {
        const row = 2;
        const col = 3;
        const grid = [
            [0, 0, 0],
            [2, 2, 0],
            [2, 2, 0],
        ];

        const box = createBox(col);
        moveFall(box, grid, col, row);
        const isDone = moveFall(box, grid, col, row);
        const top = box.row + box.origin.row;
        const isGameOver = top < 0 && isDone;

        expect(isGameOver).toBe(true);
    });
});
