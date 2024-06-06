class SudokuSolver {
  
  constructor (){
    this.solution = ''
  }

  checkLength(puzzleString){
    if (puzzleString.length != 81) return false;
    return true;
  }

  checkCharacter(puzzleString){
    if (puzzleString.search(/[^0-9.]/) >= 0 ) return false;
    return true;
  }

  validate(puzzleString){
    if (this.checkLength(puzzleString) && this.checkCharacter(puzzleString)) return true;
    return false;
  }
  
  getRow(puzzleString, row){
    let rowStringArr=[]
    let start = 9*(row-1);
    for (let i = start; i < start+9; i++){
      rowStringArr.push(puzzleString[i])
    }
    //console.log(rowStringArr);
    return rowStringArr
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowStringArr = this.getRow(puzzleString, row);
    //console.log('row:' + row + ' col: ' + column + ' value: '+ value)
    if (rowStringArr[column-1] != '.' || rowStringArr.indexOf(value.toString()) >= 0 ) {
      //console.log('row failed');
      return false;
    }
    return true
  }

  getCol(puzzleString, column){
    let colStringArr=[];

    for(let i=column-1; i<81; i+=9){
      colStringArr.push(puzzleString[i]);
    }
    //console.log(colStringArr);
    return colStringArr;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colStringArr=this.getCol(puzzleString, column);

    if (colStringArr[row-1] != '.' || colStringArr.indexOf(value.toString()) > 0 ) {
      //console.log('col failed');
      return false;
    }
    return true;
  }

  getRegion(puzzleString, zone){
    //zone 1 - 9     1,4,7
    let row, col
    let blkStringArr = [];

    row = [1,4,7][Math.floor((zone-0.1)/3)]
    col = [1,4,7][Math.floor((zone-0.1)%3)] 
    for (let i=0; i<3; i++) {
      for(let j=0; j<3; j++) { 
        blkStringArr.push(puzzleString[(row-1+i) * 9 + col-1+j])
      }
    }
    //console.log(blkStringArr)
    return blkStringArr;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowStart = Math.floor((row-1)/3)*3 + 1    // start row of the 3x3 square
    let colStart = Math.floor((column-1)/3)*3 + 1 // start column of the 3x3 square
    let pos = (row - rowStart)*3 + (column-colStart) + 1 
    let zone = (rowStart-1)+(colStart-1)/3 + 1
    let blkStringArr = this.getRegion(puzzleString, zone);
    //console.log('row: '+ rowStart + ' col: '+ colStart + ' pos: ' + pos + ' zone: ' + zone)

    if (blkStringArr[pos-1] != '.' || blkStringArr.indexOf(value.toString()) > 0 ) {
      //console.log('region failed');
      return false;
    }
    return true;
  }

  checkPlacement(puzzleString, row, column, value) {
    if (this.checkRowPlacement(puzzleString, row, column, value) &&
        this.checkColPlacement(puzzleString, row, column, value) &&
        this.checkRegionPlacement(puzzleString, row, column, value)) {
      return true;  
    }
  }

  check(puzzleString, finished=false) {
    if (this.validate(puzzleString))
    if (finished) {
      if (!this.validate(puzzleString) || puzzleString.indexOf('.') >=0)
      return false;
    }
      
    for (let i=1; i<=9; i++) {
      if (this.haveDuplicate(this.getRow(puzzleString, i))) return false;
      if (this.haveDuplicate(this.getCol(puzzleString, i))) return false;
      if (this.haveDuplicate(this.getRegion(puzzleString, i))) return false;
    }
    return true;
  }

  haveDuplicate(arr) {
   // console.log(arr)
   let duplicate = false
    arr.map((item, index) => {
      //console.log(index + '|' + arr.indexOf(item))
      if (item !== '.' && arr.indexOf(item) !== index) {
        duplicate = true
      }
    })
    return duplicate;
  }

  solve(puzzleString) {
    let puzzleArr = puzzleString.split('')

    let nextEmpty = puzzleString.indexOf('.')
    let row = Math.floor(nextEmpty/9)+1
    let col = Math.floor(nextEmpty)%9+1

    if (nextEmpty >= 0) {
      for (let guess=1; guess<10 ; guess++) {
        //console.log('row: ' + row + ' col: ' + col + ' guess: ' + guess )
        if (this.checkPlacement(puzzleString, row, col, guess)) {
            puzzleArr[nextEmpty]=guess;
            if (this.solve(puzzleArr.join(''))) return true;
        } else {
          puzzleArr[nextEmpty] = '.';
        }
      }
      return false;  // cannot found valid guess
    } else {  // all filled up
      this.solution = puzzleArr.join('')
      return true;
    }
  }
}

module.exports = SudokuSolver;

