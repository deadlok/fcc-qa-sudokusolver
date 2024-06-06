const chai = require('chai');
const assert = chai.assert;

const puzzleArr = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
const Solver = require('../controllers/sudoku-solver.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new Solver;

suite('Unit Tests', () => {
    test ('#1 handles a valid puzzle string of 81 character', function (done){
        assert.equal(solver.checkLength('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),true);
        done();
    })

    test ('#2 handles a puzzle string with invalid characters', function (done){
        assert.equal(solver.checkCharacter('X.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),false)
        done();
    })

    test ('#3 handles a puzzle string that is not 81 characters in length', function (done){
        assert.equal(solver.checkLength('91.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),false);
        done();
    })

    test ('#4 Check handles a valid row placement', function (done){
        assert.equal(solver.checkRowPlacement(puzzleArr[0][0],1,2,9), true);
        assert.equal(solver.checkRowPlacement(puzzleArr[0][0],3,3,9), true);
        done();
    })

    test ('#5 Check handles a invalid row placement', function (done){
        assert.equal(solver.checkRowPlacement(puzzleArr[0][0],1,3,9), false);
        assert.equal(solver.checkRowPlacement(puzzleArr[0][0],1,4,8), false);
        done();
    })

    test ('#6 Check handles a valid column placement', function (done){
        assert.equal(solver.checkColPlacement(puzzleArr[0][0],1,2,4), true);
        assert.equal(solver.checkColPlacement(puzzleArr[0][0],3,3,4), true);
        done();
    })

    test ('#7 Check handles an invalid column placement', function (done){
        assert.equal(solver.checkColPlacement(puzzleArr[0][0],3,2,4), false);
        assert.equal(solver.checkColPlacement(puzzleArr[0][0],3,3,9), false);
        done();
    })

    test ('#8 Check handles an valid region placement', function (done){
        assert.equal(solver.checkRegionPlacement(puzzleArr[0][0],7,5,5), true);
        assert.equal(solver.checkRegionPlacement(puzzleArr[0][0],9,9,3), false);
        done();
    })

    test ('#9 Check handles an invalid region placement', function (done){
        assert.equal(solver.checkRegionPlacement(puzzleArr[0][0],3,2,4), false);
        assert.equal(solver.checkRegionPlacement(puzzleArr[0][0],4,7,4), false);
        done();
    })

    test ('#10 Valid puzzle strings pass the solver', function (done){
        assert.equal(solver.check(puzzleArr[0][0]), true);
        assert.equal(solver.check(puzzleArr[0][1], true), true);
        done();
    })

    test ('#11 Invalid puzzle strings fail the solver', function (done){
        assert.equal(solver.check(puzzleArr[0][0], true), false);
        assert.equal(solver.check('227549163531672894649831527496157382218396475753284916962415738185763249374928651'), false);
        done();
    })

    test ('#12 Solver returns the expected solution for an incompleted puzzle', function (done){
        let solver = new SudokuSolver();
        solver.solve(puzzleArr[0][0])
        assert.equal(solver.solution, puzzleArr[0][1])
        solver.solve(puzzleArr[1][0])
        assert.equal(solver.solution, puzzleArr[1][1])
        done();
    })
});

        //console.log('puzzleArr:')
        //console.log(puzzleArr[0][0]);
        // 1.5   ..2   .84
        // ..6   3.1   2.7
        // .2.   .5.   ...
        
        // .9.   .1.   ...
        // 8.2   .36   74.
        // 3.7   .2.   .9.
        
        // 47.   ..8   ..1
        // ..1   6..   ..9
        // 269   14.   37.