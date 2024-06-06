'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      let failureReason = [];

      //console.log('puzzle: '+puzzle+' coordinate: '+coordinate+ ' value: '+value)

      if (!puzzle || !coordinate || !value ) 
        res.json({error:'Required field(s) missing'});
      if (solver.checkLength(puzzle) == false)
        res.json({error:'Expected puzzle to be 81 characters long'})
      if (solver.checkCharacter(puzzle) == false) 
        res.json({error: 'Invalid characters in puzzle'})
      if (!/[A-I][0-9]/.test(coordinate.toUpperCase()))
        res.json({error: 'Invalid coordinate'})
      if (isNaN(value) || value < 1 || value > 9)
        res.json({error: 'Invalid value'})

      
      let row = 'ABCDEFGHI'.indexOf(coordinate.substring(0,1).toUpperCase()) + 1
      let col = coordinate.substring(1,2)

      if (!solver.checkRowPlacement(puzzle, row, col, value))
        failureReason.push("row")
      if (!solver.checkColPlacement(puzzle, row, col, value))
        failureReason.push("column")
      if (!solver.checkRegionPlacement(puzzle, row, col, value))
        failureReason.push("region")

      if (failureReason.length > 0) {
        res.json({valid:false, conflict:failureReason})
      } else {
        res.json({valid:true})
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      console.log('puzzle: '+ puzzle)

      if (!puzzle) 
        res.json({error: 'Required field missing'});
      if (solver.checkLength(puzzle) == false)
        res.json({error:'Expected puzzle to be 81 characters long'});
      if (solver.checkCharacter(puzzle) == false) 
        res.json({error: 'Invalid characters in puzzle'});

      if (solver.solve(puzzle)){
        res.json({ solution: solver.solution});
        console.log('solved!! ' + solver.solution);
      } else {
        res.json({error: 'Puzzle cannot be solved'});
      }

    });
};
