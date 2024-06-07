const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const puzzleArr = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Sove a puzzle with valid puzzle string', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
            puzzle: puzzleArr[0][0],
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, puzzleArr[0][1]);
            done()
        })
    });

    test('Sove a puzzle with missing puzzle string', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field missing');
            done()
        })
    });

    test('Sove a puzzle with invalid characters', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
            puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done()
        })
    });

    test('Sove a puzzle with incorrect length', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done()
        })
    });

    test('Sove a puzzle that cannot be solved', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
            puzzle: '5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done()
        })
    });

    test('Check a puzzle placement with all fields', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            coordinate:'A2',
            value: 6
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true);
            done()
        })
    });

    test('Check a puzzle placement with single placement conflict', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            coordinate:'A2',
            value: 8
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.typeOf(res.body.conflict, 'array', 'conflict should be an array')
            assert.deepEqual(res.body.conflict, ['column'], 'Should have single conflict only')
            done()
        })
    });

    test('Check a puzzle placement with multiple placement conflict', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            coordinate:'A2',
            value: 2
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.typeOf(res.body.conflict, 'array', 'conflict should be an array')
            assert.deepEqual(res.body.conflict, ['row','column'], 'Should have multiple conflict')
            done()
        })
    });

    test('Check a puzzle placement with all placement conflict', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            coordinate:'A2',
            value: 9
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.typeOf(res.body.conflict, 'array', 'conflict should be an array')
            assert.deepEqual(res.body.conflict, ['row','column','region'], 'Should have multiple conflict')
            done()
        })
    });

    test('Check a puzzle placement with missing required field', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            //coordinate:'A2',
            value: 9
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field(s) missing','Should return required field missing')
            done()
        })
    });

    test('Check a puzzle placement with invalid characters', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate:'A2',
            value: 9
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle','Should return invalid character')
            done()
        })
    });

    test('Check a puzzle placement with invalid characters', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.',
            coordinate:'A2',
            value: 9
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long','Should return error message')
            done()
        })
    });

    test('Check a puzzle placement with invalid placement coordinate', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            coordinate:'A0',
            value: 9
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid coordinate','Should return error message')
            done()
        })
    });

    test('Check a puzzle placement with invalid placement value', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
            puzzle: puzzleArr[1][0],
            coordinate:'A1',
            value: 10
        })
        .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid value','Should return error message')
            done()
        })
    });
});

