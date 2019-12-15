/********************************************************************/
// GOGL GOGL.js
//  Maths co-ordinates and gradiant games
//  By Mr Bob Term 2 2019
//
//  Naming standards:
//    camelCase
//    constants are in UPPERCASEpBtnErrMsg1.html('');
//    input parameters (inside function) begin with an underscore _
//    local variables begin with upper case L
//
//  Definitions:
//    co-ords          = x/y co-ords user deals with 
//	  grid co-ords	   = x/y co-ords origin is centre of grid 
//								due to translate command
//	NOTE: math convention is a gradiant is written as -
//			(change in y-coordinate)/(change in x-coordinate)
//		  However the gradiant is stored in this programs as
//			 change in x-coordinate)/(change in y-coordinate
//		  Therefore when it is displayed in the screen, the
//			order is reversed.
//    pixel            = x/y co-ords of system, ie mouse
//    gradiant co-ords = rise/run co-ords of gradiant user deals with
//    
/********************************************************************/

/********************************************************************/
//  level pass/fail messages
/********************************************************************/
let passMArray   = [
  'Booya\n\nclick START for next level',
  "K'plah\n\nclick START for next level",
  'Ta-dow\n\nclick START for next level',
  'Najah\n\nclick START for next level',
  "They see me rollin they hatin\n\nclick START for next level",
  'Chyeah\n\nclick START for next level',
  'Aqeel\n\nclick START for next level'
                   ];

let failMArray   = [
  'That on the hurns scale?\n\nclick START to redo the same level',
  'Gigli\n\nclick START to redo the same level',
  'Trying\n\nclick START to redo the same level',
  'Who is your math teacher?\n\nclick START to redo the same level',
  "Don't play battleships\n\nclick START to redo the same level",
  'Success is built on failure\n\nclick START for the same level'
                   ];

/********************************************************************/

/*------------------------------------------*/
const MINSIZE    = 50;
const MINCOLS    = 10;

/*------------------------------------------*/
const GRIDXPOS   = 0;
const GRIDYPOS   = 0;6
const GRIDSW     = 1;
const GRIDRAD    = 20;

/*------------------------------------------*/
// music variables
let mcClickOk;
let mcClickFail;
let mcLevelOK;
let mcLevelFail;
let mcGameOK;
let mcGameFail;

/*------------------------------------------*/
// levels
var levelArray   = [];
var currLevel    = 0;

/*------------------------------------------*/
// start/stop button colours
const STARTBTNCOL= 'rgb(0, 204, 0)';
const STOPBTNCOL = 'rgb(255, 0, 0)';

/*------------------------------------------*/
var xyCoordL1    = '';
var xyCoordL2    = '';
var coordArray   = [];   // co-ords; a set for each round in current level
let grad         = false;

/*------------------------------------------*/
// mouse's circle of influence
let chCol        = 0;
let chColCntr    = 0;
let circleCol    = 'rgba(0,255,0, 0.5)';
let radMulti     = 2;
let xGridCoord   = '';
let yGridCoord   = '';
let xGradCoord   = '';
let yGradCoord   = '';
let xGVect       = '';
let yGVect       = '';
let dispCoord    = false;

/*------------------------------------------*/
// timer and counters
var cntTMiss     = 0;
var secDown      = 0;
var timer;
var cntLvlRounds = 0;

/*------------------------------------------*/
// displaying text
let lvlEndMsg    = '';
let angle        = 0.0;
let jitter       = 0.0;
let textToDisp 	 = 'waiting for DB';
const TEXTEND	 = 'GOGL\nco-ords over';
const TEXTCOORD	 = 'GOGL\nCo-ords';
const TEXTGRAD   = 'GOGL\nGradiant';
let cntRotate    = 0;

/*------------------------------------------*/
//  user input variable
var uInitials    = '';

/*------------------------------------------*/
// run: flag so draw does nothing until user clicks START button 
var run          = false;
var activateGame = 0;
let game         = 0;

/*------------------------------------------*/
let diagCntr     = 0;               //DIAG
let diag         = true;            //DIAG
/*------------------------------------------*/
               
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
//			START OF Lines CLASS
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
class Gridlines {
  constructor(_minSize, _minCols,
              _xPos, _yPos,
              _width, _height,
              _gridCol, _gridCLCol, _gridNCol,
			  _gridSW) {
    this.minSize     = _minSize;   // min width of columns
    this.minCols     = _minCols;   // min number of columns
    this.x           = _xPos;      // x position of grid
    this.y           = _yPos;      // y position of grid
    this.width       = _width;     // width of grid
    this.height      = _height;    // height of grid
    this.gridCol     = _gridCol;   // colour of grid
    this.gridCLCol   = _gridCLCol; // colour of central lines
    this.gridNCol    = _gridNCol;  // colour of numbers
    this.gridSW      = _gridSW;    // grid lines stroke weight
    this.textSize    = 20;
    this.textFont    = 'arial';
    this.txtXOffset  = 3;          // text x offset
    this.txtYOffset  = 3;          // text y offset
	this.posInd		 = 'n';   	   // y only if pos quad only
    this.quad1       = false;      // true to draw quad 1
    this.quad2       = false;      // true to draw quad 2
    this.quad3       = false;      // true to draw quad 3
    this.quad4       = false;      // true to draw quad 4
	this.multi		 = 0;          // 1 = half, 2 = full length
    this.numCols     = 0;         
    this.numRows     = 0;
    this.gridWidth   = 0;          // width of grid from origin
    this.gridHeight  = 0;          // height of grid from origin
    this.centreVLine = 0;
    this.centreHLine = 0;
  }
  
  // DEFINE THE Line's METHODS
  /********************************************************************/
  // method calcValues()
  //  Called by setup, setLevel & windowResized
  //  Calculate grid values:
  //    number of grid columns & rows
  //    grid line spacing
  //    grid width & height
  //    position of grid centre lines
  //  input:  n/a
  //  return: n/a
  /********************************************************************/
  calcValues() {
    // local variables 
	     
    // Calculate for positive co-ords quadrant only?
    if (this.posInd == 'y') {
      this.multi = 1;
    }
	else {
	  this.multi = 2;
	}
      
    /*----------------------------------------------------------------*/
    // calculate num of VERTICAL columns to be
    //  even so there is odd number of 
    //  VERTICAL lines & hence a middle line
    this.numCols = Math.floor(this.width / this.minSize); 
    if (this.numCols % 2 != 0) {
      this.numCols --;
    }      
        
    // set grid spacing so number of columns fills entire
    //  screen width and calc X position of middle VERTICAL column 
    this.lineSpacing = Math.floor(this.width / this.numCols);     
    this.width       = this.numCols * this.lineSpacing; 
	this.gridWidth   = this.numCols/2 * this.lineSpacing;     
    this.centreVLine = (this.numCols/2) * this.lineSpacing;           
      
    /*----------------------------------------------------------------*/
    // calculate num of HORIZONTAL rows to be
    //  even so there is odd number of 
    //  HORIZONTAL lines & hence a middle line
    this.numRows = Math.floor(this.height / this.lineSpacing);
    if (this.numRows % 2 != 0) {
      this.numRows --;
    } 
        
    // calculate height of grid & position of 
    //  middle HORIZONTAL row          
    this.height      = this.numRows * this.lineSpacing;
	this.gridHeight  = (this.numRows/2) * this.lineSpacing;      
    this.centreHLine = (this.numRows/2) * this.lineSpacing; 
    /*----------------------------------------------------------------*/
  }
  
  /********************************************************************/
  // method drawGrid()
  //  Called by draw
  //  Draws the grid centered around the middle of canvas
  //  input:  n/a
  //  return: n/a
  /********************************************************************/
  drawGrid() {
    // local variables
    let LxStart;
    let LxEnd;
	let LyStart;    
    let LyEnd
    //console.log('drawGrid: ' + this.quad1 +'/' + this.quad2 + 
	//			'/' + this.quad3 + '/' + this.quad4);//BGG 
				
    // set origin to centre of grid before drawing required quads
	translate(this.centreVLine, this.centreHLine);	
	    
    // quadrant 1
    if (this.quad1) {
      LxStart =  0;
      LxEnd   =  this.gridWidth;
	  LyStart = -this.gridHeight;
      LyEnd   =  0;
      gridLines.drawQuad(LxStart, LxEnd, LyStart, LyEnd);
    }
   
    // quadrant 2
    if (this.quad2) {
      LxStart =  0;
      LxEnd   =  this.gridWidth;
	  LyStart =  0;
      LyEnd   =  this.gridHeight;
      gridLines.drawQuad(LxStart, LxEnd, LyStart, LyEnd);
    }
    
    // quadrant 3
    if (this.quad3) {
      LxStart = -this.gridWidth;
      LxEnd   =  0;
	  LyStart =  0;
      LyEnd   =  this.gridHeight;
      gridLines.drawQuad(LxStart, LxEnd, LyStart, LyEnd);
    }
    
    // quadrant 4
    if (this.quad4) {
      LxStart = -this.gridWidth;
      LxEnd   =  0;
	  LyStart = -this.gridHeight;
      LyEnd   =  0;
      gridLines.drawQuad(LxStart, LxEnd, LyStart, LyEnd); 
    }
  }  
  
  /********************************************************************/
  // method drawQuad(_xStart, _xEnd, _yStart, _yEnd)
  //  Called by drawGrid
  //  Draws a single quadrant based on input parameters
  //  input:  x co-ord start & end, y co-ord start & end
  //  return: n/a
  /********************************************************************/
  drawQuad(_xStart, _xEnd, _yStart, _yEnd) {
    // local variables
    let Lv0;
    let Lv1;
    
    // VERTICAL LINE LOOP
    for (var i=_xStart; i < _xEnd; i = i + this.lineSpacing) { 
      Lv0 = createVector(i, _yStart);
      Lv1 = createVector(0, this.gridHeight);
      drawLine(Lv0, Lv1, this.gridCol, this.gridSW, false);
    }
	
    // HORIZONTAL LINE LOOP
    for (i=_yStart; i < _yEnd; i = i + this.lineSpacing) {
      Lv0 = createVector(_xStart, i);         
      Lv1 = createVector(this.gridWidth, 0);
      drawLine(Lv0, Lv1, this.gridCol, this.gridSW, false);
    }
  }  
  
  /********************************************************************/
  // method drawCL()
  //  Called by draw
  //  Draw centre VERTICAL & HORIZONTAL lines
  //  input:  n/a
  //  return: n/a
  /********************************************************************/
  drawCL() {
    // local variables
    let LxPos = -this.gridWidth;
    let Lv0;
    let Lv1;
    
    // draw middle VERTICAL column
    Lv0 = createVector(0, -this.gridHeight);
    Lv1 = createVector(0, this.gridHeight * this.multi);
    drawLine(Lv0, Lv1, this.gridCLCol, this.gridSW, false);
  
    // draw middle HORIZONTAL row
    // draw positive co-ords quadrant only?
    if (this.posInd == 'y') {
      LxPos = 0;
    }
    Lv0 = createVector(LxPos, 0);         
    Lv1 = createVector(this.gridWidth * this.multi, 0);
    drawLine(Lv0, Lv1, this.gridCLCol, this.gridSW, false);
  }
  
  /********************************************************************/
  // method drawLNums()
  //  Called by draw
  //  Draw line numbers
  //  input:  n/a
  //  return: n/a
  /********************************************************************/
  drawLNums() {
    // local variables
    
    textSize(this.textSize);
    textFont(this.textFont);
    fill(this.gridNCol);
    
    /*----------------------------------------------------------------*/
    // X-axis line numbers
    textAlign(LEFT, TOP);    
    for (var i = 0; i < this.numCols / 2; i ++) {
      text(i, 
           this.lineSpacing * i + 
           this.txtXOffset,
           0 + this.txtYOffset);
    }
    
    // set up for neg & pos quadrants?
    if (this.posInd != 'y') {
      textAlign(RIGHT, TOP);
      for (i = 0; i < (this.numCols - 1) / 2; i ++) {
        text(-(this.numCols / 2) + i, 
             -this.gridWidth + (this.lineSpacing * i) -
             this.txtXOffset,
             this.txtYOffset);
      }
    }     
    
    /*----------------------------------------------------------------*/
    // Y-axis line numbers
    textAlign(RIGHT, BOTTOM);    
    for (i = 0; i < this.numRows / 2; i ++) {
      text(i, 
           -this.txtXOffset, 
           -this.lineSpacing * i -
           this.txtYOffset);
    }
   
    // set up for neg & pos quadrants?
    if (this.posInd != 'y') {
      textAlign(RIGHT, TOP);
      for (i = 1; i < (this.numRows - 1) / 2; i ++) {
        text(-i, 
             -this.txtYOffset,
             this.lineSpacing * i +
             this.txtXOffset);
      }
    }  
    /*----------------------------------------------------------------*/
  }
  
  /********************************************************************/
  // method setPosInd(_value)
  //  Set positive indicator to input value
  //  input:  'y' if positive grid only else 'n'
  //  return: n/a
  /********************************************************************/
  setPosInd(_value) {
    // local variables    
    this.posInd = _value;
  }
  
  /********************************************************************/
  // method setQuad(_quad1, _quad2, _quad3, _quad4)
  //  Set the four display quadrant values to input parm values
  //  input:  set to true for displaying associated grid else false
  //  return: n/a
  /********************************************************************/
  setQuad(_quad1, _quad2, _quad3, _quad4) {
    // local variables
    
    this.quad1 = _quad1;
    this.quad2 = _quad2;
    this.quad3 = _quad3;
    this.quad4 = _quad4;
  }
    
  /********************************************************************/
  // method rtnQuad()
  //  Return the four display quadrant values
  //  input:  n/a
  //  return: n/a
  /********************************************************************/
  rtnQuad() {
    // local variables
	return [this.quad1, this.quad2, this.quad3, this.quad4];
  }
  
  /********************************************************************/
  // method rtnSize()
  //  Return grid width & height
  //  input:  n/a
  //  return: grid width & height
  /********************************************************************/
  rtnSize() {
    // local variables    
    return [this.width, this.height];
  }
  
  /********************************************************************/
  // method rtnCentre()
  //  Return position of centre VERTICAL & HORIZONTAL lines
  //  input:  n/a
  //  return: position of centre VERTICAL & HORIZONTAL lines
  /********************************************************************/
  rtnCentre() {
    // local variables    
    return [this.centreVLine, this.centreHLine];
  }
  
  /********************************************************************/
  // method rtnPos()
  //  Return The grid's coordinate X & Y positions
  //  input:  n/a
  //  return: The grid's coordinate X & Y positions
  /********************************************************************/
  rtnPos() {
    // local variables    
    return [this.x - this.centreVLine, this.y - this.centreHLine];
  }
  /********************************************************************/
  // method rtnNumColsRows()
  //  Return number of columns & rows
  //  input:  n/a
  //  return: number of columns & rows
  /********************************************************************/
  rtnNumColsRows() {
    // local variables    
    return [this.numCols, this.numRows];
  }
         
  /********************************************************************/
  // method cnvtGridToPixel(_xGrid, _yGrid)
  //  Convert grid co-ordinate X & Y values to pixel X & Y values,
  //    where 0,0 is screen's top left hand corner
  //  input:  n/a
  //  return: converted screen pixel X & Y values
  /********************************************************************/
  cnvtGrid2Pixel(_xGrid, _yGrid) {
    // local variables      
    return [this.centreVLine + (_xGrid * this.lineSpacing),
			this.centreHLine - (_yGrid * this.lineSpacing)];    
  }
  
  /********************************************************************/
  // method cnvtPixel2Coord(_xPixel, _yPixel)
  //  Convert X & Y screen pixel values to co-ordinate
  //    X & Y values, where pixel 0,0 is screen's top left hand corner
  //    and co-ordinates are based on screen's centre due to translate
  //  input:  n/a
  //  return: converted co-ordinate X & Y values
  /********************************************************************/
  cnvtPixel2Coord(_xPixel, _yPixel) {
    // local variables 
    return [_xPixel - this.centreVLine, _yPixel - this.centreHLine];
  }
  
  /********************************************************************/
  // method cnvtCoord2Grid(_xCoord, _yCoord)
  //  Convert co-ordinate X & Y values to grid coordinate X & Y values,
  //    where co-ord 0,0 is based on centre of grid due to translate
  //    and grid co-ord are based on grid 
  //  input:  n/a
  //  return: converted grid co-ordinate X & Y values
  /********************************************************************/
  cnvtCoord2Grid(_xCoord, _yCoord) {
    // local variables          
    return [_xCoord/this.lineSpacing, (_yCoord/this.lineSpacing) * -1];
  }
  
  /********************************************************************/
  // method cnvtGrid2Coord(_xGrid, _yGrid)
  //  Convert grid co-ordinate X & Y values to coordinate X & Y values,
  //    where co-ord 0,0 is based on WEGL's centre of screen
  //    and grid co-ord are based on grid 
  //  input:  n/a
  //  return: converted co-ordinate X & Y values
  /********************************************************************/
  cnvtGrid2Coord(_xGrid, _yGrid) {
    // local variables          
    return [_xGrid * this.lineSpacing, _yGrid * this.lineSpacing * -1];
  }
  
  /********************************************************************/
  // method logValues()                                          //DIAG/
  /********************************************************************/
  logValues() {
	// local variables
	
    console.log( 
      'GRID values: minSize=' + this.minSize +
               '  minCols='	  + this.minCols +
               '  x='		  + this.x + 
               '  y='         + this.y +
               '  spacing='   + this.lineSpacing +
               '  cols='      + this.numCols +
               '  rows='      + this.numRows +
			   '  width='	  + this.width +
			   '  height='	  + this.height +
               '  gW='        + this.gridWidth +
               '  gH='        + this.gridHeight +
               '  VL='        + this.centreVLine +
               '  HL='        + this.centreHLine);
  }
}

/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
//			END OF Lines CLASS
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/


/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
//			START OF Coord CLASS
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
class Coord {
  // DEFINE THE COORD'S PROPERTIES
  constructor(_gridX, _gridY) {
    this.gridX    = _gridX;
    this.gridY    = _gridY;
    this.gradX    = 0;
    this.gradY    = 0;
  }
}

/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
//			END OF Coord CLASS
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/


/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
//			START OF Level CLASS
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
class Level {
  // DEFINE THE LEVEL'S PROPERTIES
  constructor(_posInd, _time, _rounds, _missLimit, _rad,
              _bgCol, _mouseCol, _mouseHitCol,
			  _gridCol, _gridCLCol, _gridNumCol) {
    this.posInd      = _posInd;
    this.time		 = _time;
    this.rounds      = _rounds;    
    this.missLimit   = _missLimit
	this.rad         = _rad;	
    this.bgCol		 = _bgCol;   
    this.mouseCol    = _mouseCol;
    this.mouseHitCol = _mouseHitCol;
	this.gridCol	 = _gridCol;
	this.gridCLCol   = _gridCLCol;
	this.gridNumCol  = _gridNumCol;
    this.usrTime     = 0;
    this.usrMiss     = 0;
    this.usrScore    = 0;
	this.result		 = '';
  }
  
  // DEFINE THE Level'S METHODS	
  /********************************************************************/
  // method resetUsrScore(_value)
  //  Reset user's level score count 
  //  input:  value to reset user's level score count 
  //  return: n/a 
  /********************************************************************/
  resetUsrScore(_value) {
	this.usrScore = _value;    
  }
  
  /********************************************************************/
  // method resetUsrMiss(_value)
  //  Reset user's level miss count 
  //  input:  value to reset user's level miss count 
  //  return: n/a 
  /********************************************************************/
  resetUsrMiss(_value) {
	this.usrMiss = _value;    
  }
    
  /********************************************************************/
  // method updateUsrScore(_value)
  //  Update user's score with _value 
  //  input:  value to update score
  //  return: n/a
  /********************************************************************/
  updateUsrScore(_value) {
	this.usrScore = this.usrScore + _value;    
  }
  
  /********************************************************************/
  // method updateUsrMiss(_value)
  //  Update user's miss count with _value 
  //  input:  value to update miss count
  //  return: n/a 
  /********************************************************************/
  updateUsrMiss(_value) {
	this.usrMiss = this.usrMiss + _value;    
  }
  
  /********************************************************************/
  // method updateUsrTime(_value)
  //  Update user's time taken to complete level with _value 
  //  input:  value to update user's time taken for level
  //  return: n/a 
  /********************************************************************/
  updateUsrTime(_value) {
	this.usrTime = _value;    
  }
  
  /********************************************************************/
  // method updateResult(_value)
  //  Update level's result with input value 
  //  input:  value to update level's result
  //  return: n/a 
  /********************************************************************/
  updateResult(_value) {
	this.result = _value;    
  }
    
  /********************************************************************/
  // method rtnUsrCounts()
  //  Return user's score, misses,time taken & result
  //  input:  n/a
  //  return: n/a
  /********************************************************************/
  rtnUsrCounts() {
	return [this.usrScore, this.usrMiss, this.usrTime, this.result];    
  }
  
  /********************************************************************/
  // method rtnUsrWon()
  //  Determine if user miss count > level miss limit 
  //  input:  n/a
  //  return: true if user misses <= level miss limit, else false 
  /********************************************************************/
  rtnUsrWon() {
    if (this.usrMiss <= this.missLimit) {
      return true;
    }
    else {
      return false
    }
  }
  
  /********************************************************************/
  // method rtnPInd()
  //  Return level's positive grid co-ord indicator; 'y' or 'n'
  //  input:  n/a
  //  return: level's positive grid co-ord indicator; 'y'/'n'
  /********************************************************************/
  rtnPosInd() {
	return (this.posInd);
  }
  
  /********************************************************************/
  // method rtnTime()
  //  Return level's time 
  //  input:  n/a
  //  return: level's time 
  /********************************************************************/
  rtnTime() {
	return (this.time);
  }
  
  /********************************************************************/
  // method rtnRounds()
  //  Return level's number of grid coordinates to click 
  //  input:  n/a
  //  return: level's number of grid coordinates to click 
  /********************************************************************/
  rtnRounds() {
	return (this.rounds);
  }
  
  /********************************************************************/
  // method rtnGrid()
  //  Return level's grid colours 
  //  input:  n/a
  //  return: level's grid colours 
  /********************************************************************/
  rtnGrid() {
	return [this.gridCol, this.gridCLCol, this.gridNumCol];
  }
  
  /********************************************************************/
  // method rtnRad()
  //  Return level's radius of mouse's circle of influence
  //  input:  n/a
  //  return: level's radius of mouse's circle of influence
  /********************************************************************/
  rtnRad() {
	return (this.rad);
  }
  
  /********************************************************************/
  // method rtnMLimit()
  //  Return level's miss limit 
  //  input:  n/a
  //  return: level's miss limit
  /********************************************************************/
  rtnMLimit() {
    return (this.missLimit);
  }
    
  /********************************************************************/
  // method rtnColour()
  //  Return level's background colour 
  //  input:  n/a
  //  return: level's background colour 
  /********************************************************************/
  rtnColour() {
	return (color(this.bgCol));
  }
  
  /********************************************************************/
  // method rtnMouseCol()
  //  Return level's mouse circle colour
  //  input:  n/a
  //  return: level's mouse circle colour
  /********************************************************************/
  rtnMouseCol() {
	return (this.mouseCol);
  }
  
  /********************************************************************/
  // method rtnMouseHitCol()
  //  Return level's mouse circle colour if clicked on the coord
  //  input:  n/a
  //  return: level's mouse circle colour if clicked on the coord
  /********************************************************************/
  rtnMouseHitCol() {
	return (this.mouseHitCol);
  }

  /********************************************************************/
  // method logValues()                                          //DIAG/
  /********************************************************************/
  logValues() {
	// local variables
	
    console.log( 
      'LEVEL values: posInd='	+ this.posInd +
			   '  time=' 		+ this.time +
               '  rounds=' 		+ this.rounds +
               '  missLimit='   + this.missLimit + 
               '  rad='     	+ this.rad +
               '  bgCol=' 		+ this.bgCol +
               '  mouseCol='    + this.mouseCol +
               '  mouseHitCol=' + this.mouseHitCol +
			   '  gridCol='		+ this.gridCol +
			   '  gridCLCol='	+ this.gridCLCol +
               '  gridNumCol='  + this.gridNumCol +
               '  usrTime='     + this.usrTime +
               '  usrMiss='     + this.usrMiss +
               '  usrScore='    + this.usrScore +
			   '  result='		+ this.result);
  }
}

/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
//			END OF Level CLASS
/*llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll*/
 
/********************************************************************/
// P5.js setup()
/********************************************************************/
function setup() {  
  // local variables
  
  // open, authorise firebase access & initiate DB read GOGL_Levels
  initFirebase();
  accessFirebase();  
  
  getUserInfo();	// get user info from cookie & set nav bar options
  
  dummy = createCanvas(0,0);
}

/*==================================================================*/
/*==================================================================*/
// P5.js draw()		/*==============================================*/
/*==================================================================*/
/*==================================================================*/
function draw() {
  background(bgCol);
  
  if (run) { 
    // local variables
    
    /*----------------------------------------------------------------*/
    diagCntr++;                    //DIAG
    // display end level message?
    if (lvlEndMsg != '') {       
      endMsg();		// yes
    }
    
    /*----------------------------------------------------------------*/
	// draw the grid lines
    gridLines.drawGrid();
    
	// draw middle VERTICAL   column
	//    & middle HORIZONTAL row
	gridLines.drawCL();
	
	// draw centre line numbers
	gridLines.drawLNums();
			
	//draw mouse's circle of influence
	drawMouseCircle();
  }
 
  /*----------------------------------------------------------------*/
  else {
    jitterText(textToDisp, 55, 'red', width/2, height/2);
  }
}

/********************************************************************/
//  USER FUNCTIONS
/********************************************************************/

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// accessFirebase()
//  Called by setup
//  Access & read firebase realtime DB
//  input:  n/a
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function accessFirebase() {
  // local variables
     
  db = firebase.database();
  dbRefGOGL_Levels = db.ref('GOGL_Levels');
  dbRefGOGL_Scores = db.ref('GOGL_Scores');
  dbRefGOGL_Levels.once('value', dbReadGOGL_Levels, dbReadErr);  
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// dbReadGOGL_Levels(data)
//  Called by initFirebase
//	Read data from firebase, populate array & sort data
//  input:  n/a
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function dbReadGOGL_Levels(_data) {
  // local variables  
      
  GOGL_Levels = _data.val();
  console.log('dbReadGOGL_Levels:>' + GOGL_Levels + '<');//BGG
  if (GOGL_Levels != null) {
	dbKeys = Object.keys(GOGL_Levels);
	console.log('DB=' + dbKeys);				//DIAG
	buildLevels();
	// set up canvas, etc
	setupCanvas(); 
  }
  else {
	document.getElementById("head1").innerHTML = "unable to continue; no level data in database";
  }    
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// buildLevels(data)
//  Called by dbReadGOGL_Levels & clacResult
//	Build level array
//  input:  n/a
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function buildLevels() {
  // local variables 
  var i;
  var k;
  
  for (i=0; i < dbKeys.length; i++) {
		k = dbKeys[i];
		levelArray[i] = new Level (
			GOGL_Levels[k].posQuad,
			GOGL_Levels[k].time,
			GOGL_Levels[k].rounds,	 
			GOGL_Levels[k].missLimit, 
			GOGL_Levels[k].radius,
			GOGL_Levels[k].bgCol,	  
			GOGL_Levels[k].mouseCol,
			GOGL_Levels[k].mouseHitCol,	
			GOGL_Levels[k].gridCol,	
			GOGL_Levels[k].gridCLCol, 
			GOGL_Levels[k].gridNumCol);
  }    
  for (i=0; i< levelArray.length; i++) {				//DIAG
	levelArray[i].logValues();
  } 
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// dbWriteGOGL_scores()
//  Called by result when level ends 
//	Write data to firebase
//	input:  n/a
//	return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function dbWriteGOGL_Scores() {
  // local variables
  let Ldate;
	
  Ldate = new Date();
  // obtain level's scores & misses
  LrtnUsrCounts = levelArray[currLevel].rtnUsrCounts() 
  console.log('dbWriteGOGL_Scores: user=' + userFName + '/' + userid);
  
  dbData.classCode 	= userClassCode,
  dbData.fName 		= userFName,
  dbData.lName 		= userLName,
  dbData.userid		= userid;
  dbData.date		= Ldate.getTime();
  dbData.gameid		= game;
  dbData.level		= currLevel + 1;
  dbData.score		= LrtnUsrCounts[0];
  dbData.miss		= LrtnUsrCounts[1];
  dbData.time		= levelArray[currLevel].rtnTime() - LrtnUsrCounts[2]; 
  dbData.result 	= LrtnUsrCounts[3];
     
  //dbRef = db.ref('GOGL_Scores');
  dbRefGOGL_Scores.push(dbData);
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/

/********************************************************************/
// setupCanvas()
//  Called by dbReadGOGL_Levels
//  Setup canvas
//  input:  n/a
//  return: n/a
/********************************************************************/
function setupCanvas() {
  // local variables  
  var LscriptTag;
  var Lrtn = [];  
	  
  Lrtn = levelArray[currLevel].rtnGrid();	
  // calculate & draw grid lines 
  gridLines = new Gridlines(MINSIZE, MINCOLS, 
							GRIDXPOS, GRIDYPOS,
							windowWidth - QPANELW - PADDING * 2, 
							windowHeight - NAVBARH - PADDING,
							Lrtn[0], Lrtn[1], Lrtn[2],
							GRIDSW);
/*							
  gridLines.setPosInd(levelArray[currLevel].rtnPosInd());
  
  // grid display settings based on if level is positive grid only 
  if (levelArray[currLevel].rtnPosInd() == 'y') {
	gridLines.setQuad(true, false, false, false);
  }
  else {
	gridLines.setQuad(true, true, true, true);
  }
*/ 
  gridLines.calcValues();
  gridLines.logValues();        //DIAG
	
  /*----------------------------------------------------------------*/
  // Remove dummy canvas
  // create canvas size to match grid lines,
  //  register mousePressed event & set font
  dummy.remove();
  Lrtn	   = gridLines.rtnSize();
  playArea = createCanvas(Lrtn[0], Lrtn[1]);
  playArea.position(QPANELW, NAVBARH);    
  textFont('arial');
  
  // setup control panel
  setupControls(PADDING, playArea.y);
	
  //determine the game type
  LscriptTag = document.getElementById('game')
  if (LscriptTag.getAttribute("data-game") == 'coords') {
	  // set game id, clear gradiant text, set game text to display
	  game = 1;
	  pGradL1.html('');	  
	  pGradL2.html('');
	  pGradL3.html('');
	  pGradV.html('');
	  textToDisp = TEXTCOORD;
	  playArea.mousePressed(mouseCClick);  
  }
  else {
	  // set game id, clear gradiant text, set game text to display
	  game = 2;	  
	  textToDisp = TEXTGRAD;
	  playArea.mousePressed(mouseGClick);  	  
  }
  
  // flag run is initialised to false   
  // set level data & initialise counters, timers, etc
  setLevel(); 
}

/********************************************************************/
// drawMouseCircle()
//  Called by draw
//  Display mouse's circle of influence
//  input:  n/a
//  return: n/a
/********************************************************************/
function drawMouseCircle() {
	// local variabes
	let Lrtn = [];
    
    switch(chCol) {
      // mouse NOT clicked so keep circle unaltered
      case(0):        
        break;
      
      /*------------------------------------------------------------*/
      // GRID
      /*------------------------------------------------------------*/
      // mouse's circle over grid coord, so alter colour & 
      // make circle grow for a moment
      case(1):  
        if (chColCntr >= 10) {  // moment over, so back to normal circle
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = 2;
        }
        else { // make circle grow & add to counter
          circleCol    = levelArray[currLevel].rtnMouseHitCol();
          radMulti++;
          chColCntr++;
        }
        
        fill(circleCol);
        ellipse(xGridCoord, yGridCoord, levelArray[currLevel].rtnRad());
        break;
      
      /*------------------------------------------------------------*/
      // mouse's circle NOT over grid coord, so reset colour & 
      // make circle shrink for a moment
      case(3):
        if (chColCntr >= 10) {  // moment over, so back to normal circle
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = 2;
          chColCntr    = 0;
          chCol        = 0;
        }
        else {  // make circle shrink & add to counter
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = radMulti * 0.9;
          chColCntr++;
        }
        
        break;           
      
      /*------------------------------------------------------------*/
      // GRADIANT      
      /*------------------------------------------------------------*/
      // mouse's circle over GRADIANT coord, so alter colour & 
      // make circle grow for a moment
      case(5):         
        if (chColCntr >= 10) {// moment over so back to normal circle
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = 2;         
          
          v0 = createVector(xGridCoord, yGridCoord);
          v1 = createVector(xGVect, yGVect);
          drawLine(v0, v1, 'yellow', 2, false);
                   
        }
        else { // make circle grow & add to counter
          radMulti++;
          chColCntr++;
        }
        
        fill(levelArray[currLevel].rtnMouseHitCol());
        ellipse(xGradCoord, yGradCoord, 
                levelArray[currLevel].rtnRad());
        
      /*------------------------------------------------------------*/
      // mouse's circle over GRADIANT base coord, so alter colour & 
      // make circle grow for a moment
      case(6):         
        if (chColCntr >= 10) {  // moment over, so back to normal circle
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = 2;          
        }
        else { // make circle grow & add to counter
          radMulti++;
          chColCntr++;
        }

        fill(levelArray[currLevel].rtnMouseHitCol());
        ellipse(xGridCoord, yGridCoord, levelArray[currLevel].rtnRad());
        break;
        
      /*------------------------------------------------------------*/
      // mouse's circle NOT over GRADIANT coord, so reset colour & 
      // make circle shrink for a moment
      case(8):
        if (chColCntr >= 10) {  // moment over, so back to normal circle
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = 2;
          //chColCntr    = 0;
          //chCol        = 0;
        }
        else {  // make circle shrink & add to counter
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = radMulti * 0.9;
          chColCntr++;
        }
        
        fill(levelArray[currLevel].rtnMouseHitCol());
        ellipse(xGridCoord, yGridCoord, levelArray[currLevel].rtnRad());
        break;          
     
      /*------------------------------------------------------------*/
      // mouse's circle NOT over grid coord, so reset colour & 
      // make circle shrink for a moment
      case(9):
        if (chColCntr >= 10) {  // moment over, so back to normal circle
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = 2;
          chColCntr    = 0;
          chCol        = 0;
        }
        else {  // make circle shrink & add to counter
          circleCol    = levelArray[currLevel].rtnMouseCol();
          radMulti     = radMulti * 0.9;
          chColCntr++;
        }
        
        break; 
    }
    
    /*------------------------------------------------------------*/
    // draw mouse
    /*------------------------------------------------------------*/
    fill(circleCol);
	Lrtn = gridLines.cnvtPixel2Coord(mouseX, mouseY);
    ellipse(Lrtn[0], Lrtn[1], 
            levelArray[currLevel].rtnRad() * radMulti);
}

/********************************************************************/
// endMsg()
//  Called by draw
//  Display end message in empty quadrant, will need to ensure grid
//    is NOT drawn in that quad by settings associated grid.quad 
//    feild to false as it would have overwritten the msg text
//  Quadrants are numbered: 1 = top R/H, 2 = bottom R/H
//    3 = bottom L/H, 4 = top L/H
//  For co-ordinate game, just determine if y co-ord is above 0
//	For gradiant game, use y = mx + c  reconfiged to c = y - mx
//    to determine empty quadrant.
//  input:  n/a
//  return: n/a
/********************************************************************/
function endMsg() {
  // local vriables
  var LrtnQuad  = [];
  var LcolsRows = [];
  var Lcoord	= [];
  var Lgradiant = 0;
  var Lc        = 0;
  var Lrtn		= [];
	  
  // return quadrant display setting values
  LrtnQuad  = gridLines.rtnQuad();
  
  // get num of cols, rows & calc default quadrant middle
  LcolsRows = gridLines.rtnNumColsRows();
  Lcoord    = gridLines.cnvtGrid2Coord(LcolsRows[0]/4, 
                                       LcolsRows[1]/4);
  
  // Note 1: after translate, a neg y co-ord is ABOVE y = 0
  // Note 2: Lcoords[0] is positive, Lcoords[1] is negative
  //    so default position is quadrant 0
  /* 
   console.log('endMsg: Lcoords=' + Lcoord[0] +
			   '/' + Lcoord[1] +
			   '   xGridCoord=' + xGridCoord + 
			   '   yGridCoord=' + yGridCoord);	//BGG
*/		   
  /*------------------------------------------------------------*/
  // co-ordinate game?
  if (game == 1) {
    if (yGridCoord > 0) {
      // display msg in quad 1
      LrtnQuad[0] = false;
    }
    else {
      // display msg in quad 2
      LrtnQuad[1] = false;
      Lcoord[1]   = Lcoord[1] * -1;	    // invert y coord      
    }
  }
  
  /*------------------------------------------------------------*/
  // gradiant game, so determine the quadrant 
  else {
    // 1st check if either grad co-ord is zero
    if (xGVect == 0) {
  	  if (xGridCoord > 0) {
        // display msg in quad 4
        LrtnQuad[3] = false;
	    Lcoord[0]   = Lcoord[0] * -1;	// invert x coord
      }	
      else {  // display msg in default quad 1
        LrtnQuad[0] = false;
      }
    }
    else if (yGVect == 0) {
  	  if (yGridCoord < 0) {
        // display msg in quad 2
        LrtnQuad[1] = false;
        Lcoord[1]   = Lcoord[1] * -1;	// invert y coord
	  }
      else {  // display msg in default quad 1
        LrtnQuad[0] = false;
      }
    }
    
    /*------------------------------------------------------------*/
    // calculate gradiant
    else {
      Lgradiant = (yGVect * -1) / xGVect;
	  Lc = -yGridCoord - Lgradiant * xGridCoord;
     	
      /*------------------------------------------------------------*/
      // positive gradiant
      if (Lgradiant > 0) {	
        if (Lc < 0) {
          // display msg in quad 4
          LrtnQuad[3] = false;
	      Lcoord[0]   = Lcoord[0] * -1;	// invert x coord
        }
        else {
          // display msg in quad 2
          LrtnQuad[1] = false;
          Lcoord[1]   = Lcoord[1] * -1;	// invert y coord
        }
      }    
  
      /*------------------------------------------------------------*/
      // negative gradiant
      else {
	    if (Lc > 0) {
          // display msg in quad 3
          LrtnQuad[2] = false;
	      Lcoord[0]   = Lcoord[0] * -1;	// invert x coord
          Lcoord[1]   = Lcoord[1] * -1;	// invert y coord
	    }
	    else {
          // display msg in quad 1
          LrtnQuad[0] = false;
        }
      }
    }
  }
  
  /*------------------------------------------------------------*/
  // update grid quadrant display settings
  gridLines.setQuad(LrtnQuad[0], LrtnQuad[1],
                    LrtnQuad[2], LrtnQuad[3]);
  /*
  if (diag) {                                          //DIAG
   
  console.log('endMsg:' +
              '   xyVect=' + xGVect + '/' + yGVect +
              ',  Lgrad=' + Lgradiant + 
              ',  Lcoords=' + Lcoord[0] +
              '/' + Lcoord[1] + ', Lc=' + Lc + 
              ',  quads=' + LrtnQuad[0] + '/' + LrtnQuad[1] +
              '/' + LrtnQuad[2] + '/' + LrtnQuad[3]);  //DIAG
  */
  push();
  Lrtn = gridLines.rtnCentre();
  translate(Lrtn[0], Lrtn[1]);  
  fill(140, 140, 140);
  rectMode(CENTER);
  rect(Lcoord[0], Lcoord[1], 
       abs(Lcoord[0]*2) - 60, abs(Lcoord[1]*2) - 60);
  fill('white')
  textSize(20);
  textAlign(CENTER, CENTER);
  text(lvlEndMsg, Lcoord[0], Lcoord[1]);
  pop();
  /*------------------------------------------------------------*/
}

/********************************************************************/
// jitterText(_text, _textSize, _textCol, _xPos, _yPos)
//  Called by setup & draw
//  Display text is a jittery fashion
//  input:  text to display, its size & colour and X & Y text position
//  return: n/a
/********************************************************************/
function jitterText(_text, _textSize, _textCol, _xPos, _yPos) {  
  // local variables
  let Lc;
  let Ltime
  
  // only jitter for a few seconds
  if (cntRotate < 500) {
    cntRotate++;  
    // during even-numbered secs add jitter to rotation
	if (second() % 2 === 0) {
		jitter = random(-0.1, 0.1);
	}
	//increase angle value using most recent jitter value
	angle = angle + jitter;
	//use cosine to get smooth CW & CCW motion when not jittering
	Lc = cos(angle);
  }
  else {
	  Lc = 0;
  }
  
  //move text to  center of canvas
  push();
  translate(_xPos, _yPos);
  //apply the final rotation
  rotate(Lc);				 
  textAlign(CENTER, CENTER);
  textSize(_textSize);
  fill(_textCol);
  text(_text, 0, 0);
  pop();
}

/********************************************************************/
// setupControls(_x, _y)
//  Called by setup
//  Set up the user control/question area
//  input:  X & Y position of 1st element
//  return: n/a
/********************************************************************/
function setupControls(_x, _y) {
  // local variables
  var LbtnFSize = '20px';
  var LpFSize 	= '20px';
      
  /*----------------------------------------------------------------*/
  // create CO-ORDINATES text
  pCoordL1 = createP('co-ordinate');
  pCoordL1.position(_x, _y);
  pCoordL1.style('font-size', LpFSize);
  pCoordL1.style('margin', '0px');  
   
  pCoordL2 = createP('(x, y)');
  pCoordL2.position(pCoordL1.x, pCoordL1.y + pCoordL1.height-10);
  pCoordL2.style('font-size', LpFSize);
  pCoordL2.style('margin', '0px'); 
   
  // create CO-ORDINATES value
  pCoordV = createP('.');
  pCoordV.position(pCoordL1.x, pCoordL2.y + pCoordL2.height-10);
  pCoordV.style('font-size', LpFSize);
  pCoordV.style('margin', '0px'); 
   
  /*----------------------------------------------------------------*/
  // create GRADIANT text
  pGradL1 = createP('with a');
  pGradL1.position(pCoordL1.x, pCoordV.y + pCoordV.height);
  pGradL1.style('font-size', LpFSize);
  pGradL1.style('margin', '0px'); 
     
  pGradL2 = createP('gradiant of');
  pGradL2.position(pCoordL1.x, pGradL1.y + pGradL1.height - 10);
  pGradL2.style('font-size', LpFSize);
  pGradL2.style('margin', '0px'); 
  pGradL2.style('padding', '0px'); 
  
  pGradL3 = createP('(rise/run)');
  pGradL3.position(pCoordL1.x, pGradL2.y + pGradL2.height - 10);
  pGradL3.style('font-size', LpFSize);
  pGradL3.style('margin', '0px');
  pGradL3.style('padding', '0px');
  
  // create GRADIANT value
  pGradV = createP('.');
  pGradV.position(pCoordL1.x, pGradL3.y + pGradL3.height-10);
  pGradV.style('font-size', LpFSize);
  pGradV.style('margin', '0px'); 
  
  /*----------------------------------------------------------------*/
  // create START / STOP / RESET button
  startBtn = createButton('start');
  startBtn.position(pCoordL1.x, pGradV.y + pGradV.height+10);
  startBtn.size(100, 40);
  startBtn.style('background-color', color(STARTBTNCOL));
  startBtn.style('font-size', 25 + 'px'); 
  startBtn.mousePressed(startPlay);
      
  /*----------------------------------------------------------------*/
  // create LEVEL text & value
  pLevel = createP('level: 1');
  pLevel.position(pCoordL1.x, startBtn.y + startBtn.height+15);
  pLevel.style('font-size', LpFSize);
  pLevel.style('margin', '0px'); 
     
  /*----------------------------------------------------------------*/
  // create SCORE & MISS text & value
  pScore = createP('score: 0');
  pScore.position(pCoordL1.x, pLevel.y + pLevel.height);
  pScore.style('font-size', '18px');
  pScore.style('margin', '0px'); 
  
  pLMiss = createP('misses: 0');
  pLMiss.position(pCoordL1.x, pScore.y + pScore.height);
  pLMiss.style('font-size', '18px');
  pLMiss.style('margin', '0px'); 
    
  /*----------------------------------------------------------------*/
  // create ROUNDS text & value
  pLRounds = createP('rounds: 0');
  pLRounds.position(pCoordL1.x, pLMiss.y + pLMiss.height);
  pLRounds.style('font-size', '18px');
  pLRounds.style('margin', '0px'); 
    
  /*----------------------------------------------------------------*/
  // create TOTAL MISSES text & value
  pLTText = createP('total');
  pLTText.position(pCoordL1.x, pLRounds.y + pLRounds.height);
  pLTText.style('font-size', LpFSize);
  pLTText.style('margin', '0px');
  pLTText.style('margin-top', '20px');
    
  pTMiss = createP('misses: 0');
  pTMiss.position(pCoordL1.x, pLTText.y + pLTText.height);
  pTMiss.style('font-size', '18px');
  pTMiss.style('margin', '0px'); 
    
  /*----------------------------------------------------------------*/
  // create TIMER text & value
  pTimer = createP('secs: 0');
  pTimer.position(pCoordL1.x, pTMiss.y + pTMiss.height);
  pTimer.style('font-size', LpFSize);
  pTimer.style('margin', '0px');
    
  /*----------------------------------------------------------------*/
  // create ERROR MESSAGE paragraphs 1 & 2
  setupErrP(pCoordL1.x, pTimer.y + pTimer.height);            

  /*----------------------------------------------------------------*/
  /*
  // create DIAG button      //DIAG
  diagBtn = createButton('diag');
  diagBtn.position(pCoordL1.x, pTimer.y + pTimer.height);
  diagBtn.size(100, 40);
  diagBtn.style('background-color', color(STARTBTNCOL));
  diagBtn.style('font-size', LbtnFSize); 
  diagBtn.style('margin', '0px'); 
  diagBtn.style('margin-top', '20px'); 
  diagBtn.mousePressed(diagFunc);					  
  */  
  /*----------------------------------------------------------------*/
}

/********************************************************************/
// function result(seconds to go)
// 	Called by countDown, mouseCClick or mouseGClick
//	Set game to inactive
//	If timer still active, stop it
// 	Determine if user won level, display result & setup for next level
//  input:  seconds to go
//  result: n/a
/********************************************************************/
function result(_time){ 
  // local variables
	var Lrtn = [];
	
	Lrtn = levelArray[currLevel].rtnUsrCounts();	//BGG
	console.log('result: ' + (currLevel+1) + 
				', usrMiss=' + Lrtn[1] + ' time=' + _time);//BGG
  /*----------------------------------------------------------------*/
  clearInterval(timer);
  /*
  console.log('result: time=' + _time +            //DIAG
              ', coordArray=' + coordArray +  
              ', coordArrayLen=' + coordArray.length + 
              ', ' + levelArray[currLevel].rtnMLimit());
  */
  
  // set start/stop button to START
  startBtn.style('background-color', color(STARTBTNCOL));
  startBtn.html('start');
  
  // set co-ord & grad values to black
  pCoordV.style('color', 'black');
  pCoordV.style('font-weight', 'normal');
  pGradV.style('color', 'black');
  pGradV.style('font-weight', 'normal');
  
  // set game inactive
  activateGame = 0;
  
  /*----------------------------------------------------------------*/
  // determine if user won
  if (cntLvlRounds <= 0) {  
    // no rounds remaining, so determine who won the level
    whoWon();							 
  }
    
  else {
	// rounds remaining, so user lost 
	// display random Loss msg  
    selectMsg('L', 'NO TIME LEFT & ROUNDS REMAINING\n\n');
	// subtract this levels misses from total & set same level info
	Lrtn = levelArray[currLevel].rtnUsrCounts();
	cntTMiss = cntTMiss - Lrtn[1];
	// write to db and set same level info
	dbWriteGOGL_Scores();
    setLevel();						 
  }
  /*----------------------------------------------------------------*/
}

/********************************************************************/
// function whoWon()
// 	Called by result
//	Detrermine who won, set error msg & set level
//  input:  n/a
//  result: n/a
/********************************************************************/
function whoWon() {
  // local variables
	var Lrtn = [];
	
	Lrtn = levelArray[currLevel].rtnUsrCounts();	//BGG
	console.log('whoWon: ' + (currLevel+1) + ', usrMiss=' + 
		Lrtn[1] + '<======');	//BGG
  // check who won the level
  if (levelArray[currLevel].rtnUsrWon()) {     
	// user won, so display random won msg
	selectMsg('W', 'YOU WON THE LEVEL\n\n');                  
	// save level's time taken & increase level number
	levelArray[currLevel].updateUsrTime(secDown);  
	// write to db and increase level info
	dbWriteGOGL_Scores();
	currLevel ++;					 
	
    // a level left to play?
    if (currLevel >= levelArray.length) {    
      // no more levels so game end & deactivate start/stop 
      //  button via setting activateGame
      calcResult();
    }	
    setLevel();					    // set new level information    
  }
  else {							
	// user lost, so display random Loss msg  
	selectMsg('L', 'TOO MANY MISSES, YOU LOST\n\n');
	// subtract this levels misses from total & set same level info
	Lrtn = levelArray[currLevel].rtnUsrCounts();
	cntTMiss = cntTMiss - Lrtn[1];
	// write to db and set same level info
	dbWriteGOGL_Scores();
	setLevel();	
  }
}

/********************************************************************/
// function calcResult()
// 	Called by result & whoWon
//	Calculate final results, indicate stop game & display results
//  input:  n/a
//  result: n/a
/********************************************************************/
function calcResult() {
  // local variables
  let Lmusic;
  let LrtnUsrCounts =[];
  let LcntTScore    = 0;
  let LcntTMiss     = 0;
  let LcntTTime     = 0;
  let i;
    
  /*----------------------------------------------------------------*/
  // more levels?
  if (currLevel >= levelArray.length) {    
    // no more levels so game end & deactivate start/stop 
    //  button via setting activateGame
    //mcGameOK.play() 						//MUSIC
		
    // calc total score by adding up level scores
    for (i = 0; i < levelArray.length; i++) {
      LrtnUsrCounts = levelArray[i].rtnUsrCounts();
      LcntTScore    = LcntTScore + LrtnUsrCounts[0];
      LcntTMiss     = LcntTMiss  + LrtnUsrCounts[1];
      LcntTTime     = LcntTTime  + levelArray[i].rtnTime() - 
                                   LrtnUsrCounts[2]; 
	  console.log('calcResult: i=' + i + 
				  ', level time=' + levelArray[i].rtnTime() + 
				  ' time=' + LrtnUsrCounts[2] +
				  ' result=' + LrtnUsrCounts[3]);	//BGG
    }
    
    // Set text to display 
    bgCol = 'rgb(0, 0, 0)';
    textToDisp = TEXTEND +
                '\ntotal score: '  + LcntTScore +
                '\ntotal misses: ' + LcntTMiss +
                '\ntotal time: '   + LcntTTime;
    
    // stop the game
    startBtn.style('background-color', color(255, 153, 204));
	startBtn.style('font-size', 20 + 'px');
  	startBtn.html('restart'); 
    //mcGameOK.stop();							//MUSIC
    
    // reset counters & rebuild level array
    lvlEndMsg 	 = '';
    pTimer.style('color', 'black');
	pLMiss.style('color', 'black');
	currLevel    = 0;
    cntTMiss     = 0;
	
    buildLevels();
  	activateGame = 0; 
    run = false;
  }
}

/********************************************************************/
// function selectMsg(_type, _msg)
// 	Called by result & whoWon
//	Randomly select pass or failure phrase to display
//  input:  'W' for Won or 'L' for Loss 
//			_msg is text to display (set to null if no text)
//  result: n/a
/********************************************************************/
function selectMsg(_type, _msg) { 
  // local variables
  
  levelArray[currLevel].updateResult(_type);
  if (_type == 'W') { 
    // level success
    //mcLevelOK.play();               // play sound of success	//MUSIC
    lvlEndMsg = _msg +
				passMArray[Math.round(random(0, passMArray.length-1))];
  }
  else {
    // level failure
    //mcLevelFail.play();             // play sound of failure //MUSIC
    lvlEndMsg = _msg + 
				failMArray[Math.round(random(0, failMArray.length-1))];
  }
}

/********************************************************************/
// function setLevel()
// 	Called by initCoord, initGrad, result & whoWon
// 	Sets level values based on level array:
//	  set background colour
//	  set time to level's time
//    set circle to level's colour
//  input:  n/a
//  return: n/a
/********************************************************************/
function setLevel() {
  // local variables  
  
  // rebuild grid incase format alters inbetween levels
  gridLines.setPosInd(levelArray[currLevel].rtnPosInd());
    
  // grid display settings based on if level is positive grid only 
  if (levelArray[currLevel].rtnPosInd() == 'y') {
    gridLines.setQuad(true, false, false, false);
  }
  else {
    gridLines.setQuad(true, true, true, true);
  }
    
  gridLines.calcValues();
  //gridLines.logValues();            //DIAG 
    
  // level's background colour & time
  bgCol		   = levelArray[currLevel].rtnColour();    
  secDown      = levelArray[currLevel].rtnTime();
  circleCol    = levelArray[currLevel].rtnMouseCol();
  cntLvlRounds = levelArray[currLevel].rtnRounds();
      
  var Lrtn = [];	//BGG
  Lrtn = levelArray[currLevel].rtnUsrCounts();	//BGG
  console.log('setLevel: ' + (currLevel+1) + 
			  ', usrMiss=' + Lrtn[1] + '<======');	//BGG
      
  // update display
  pLevel.html('level: ' + (currLevel + 1));	// +1 as its an index
  pLRounds.html('rounds: ' + cntLvlRounds);
}

/********************************************************************/
// function drawLine(_base, _vec, _col, _strokeWeight, _arrow)
//  Called by drawGrid, drawCL & drawMouseCircle
//  Draw line for vector at given base position,
//  Optionly add arrow head
//  input:  base co-ord, 
//          vector,
//          line colour & stroke weight,
//          true to draw arrow head
//  return: n/a
/********************************************************************/
function drawLine(_base, _vec, 
                  _col, _strokeWeight,
                  _arrow) {
  // local variables
  let LarrowSize;
  
  push();  
  stroke(_col);
  strokeWeight(_strokeWeight);
  fill(_col);
  
  translate(_base.x, _base.y);
  line(0, 0, _vec.x, _vec.y);
  //console.log(_base.x + ', ' + _base.y + ', ' +          //DIAG
  //            _vec.x + ', ' + _vec.y);
  //rotate(_vec.heading());        
  
  if (_arrow) {
    LarrowSize = 7;
    translate(_vec.mag() - LarrowSize, 0);
    triangle(0, LarrowSize/2,    0, -LarrowSize/2,    LarrowSize, 0);
  }  
  pop();
}

/********************************************************************/
// function randomXY(_posInd)
//  Called by startPlay
//  Sets random X & Y grid coordinates in coordArray (a set for each
//    round in the current level) and sets control panel to display
//    first X & Y grid coordinates.
//  input:  'y' indicates positive quadrant grid co-ord only
//  return: n/a
/********************************************************************/
function randomXY(_posInd) {	
  // local variables
  var LgridV  = [];
  var Lrounds;
  let LxMin; let LxMax; let LyMin; let LyMax;
    
  /*----------------------------------------------------------------*/
  LgridV = gridLines.rtnNumColsRows();
  Lrounds = (levelArray[currLevel].rtnRounds());
  
  // input param 'y', ensure positive grid co-ords only
  if (_posInd == 'y') {
    LxMin = 0;
    LxMax = (LgridV[0] / 2) - 1;
    LyMin = 0;
    LyMax = (LgridV[1] / 2) - 1;
  }
  
  // positive & negative grid co-ords allowed
  else {
    LxMin   = -(LgridV[0] / 2) + 1;
    LxMax   =  (LgridV[0] / 2) - 1;
    LyMin   = -(LgridV[1] / 2) + 1;
    LyMax   =  (LgridV[1] / 2) - 1;
  }
  /*
  console.log('randomXY: ' + _posInd + '> ' + LgridV[0] + '/' + LgridV[1] +
              ', LxMin=' + LxMin + '  LxMax=' + LxMax + 
              ', LyMin=' + LyMin + '  LyMax=' + LyMax + 
              ',  Lrounds=' + Lrounds);    //DIAG   
  */ 
  
  /*----------------------------------------------------------------*/
  // set X & Y grid co-ords for each round in current level
  for (var i = 0; i < Lrounds; i++) {  
    coordArray[i] = new Coord (Math.floor(random(LxMin, LxMax)),
                               Math.floor(random(LyMin, LyMax)));
    /* 
    console.log('randomXY:   coordArray x=' + coordArray[i].gridX +
                ' y=' + coordArray[i].gridY);  //DIAG
    */
  }
  
  /*----------------------------------------------------------------*/
  xyCoordL1 = 'co-ordinate';
  xyCoordL2 = '(x, y)';  
}

/********************************************************************/
// function randomGrad(_posInd)
//  Called by startPlay
//  Sets random X & Y gradiant in coordArray
//  Sets random X & Y grid coordinates & gradiant in coordArray grid
//    (a set for each round in the current level) and sets 
//    control panel to display first X & Y grid coordinates.
//	NOTE: math convention is a gradiant is written as -
//			(change in y-coordinate)/(change in x-coordinate)
//		  However the gradiant is stored in this programs as
//			 change in x-coordinate)/(change in y-coordinate
//		  Therefore when it is displayed in the screen, the
//			order is reversed.
//  input:  'y' indicates positive quadrant grid co-ord only
//  return: n/a
/********************************************************************/
function randomGrad(_posInd) {	
  // local variables
  var LgridV  = [];
  let LxMin; let LxMax; let LyMin; let LyMax;
  
  /*----------------------------------------------------------------*/   
  LgridV = gridLines.rtnNumColsRows();
  
  /*----------------------------------------------------------------*/
  // set X & Y grid co-ords & gradiant for each round in current level
  for (var i = 0; i < cntLvlRounds; i++) {
    // input param 'y', ensure grad restricted to positive quadrant
    if (_posInd == 'y') {
      LyMin = -coordArray[i].gridY;
      LyMax = ((LgridV[1] / 2) - 1) - coordArray[i].gridY;
	  LxMin = -coordArray[i].gridX;
      LxMax = ((LgridV[0] / 2) - 1) - coordArray[i].gridX;
    }
    else {
      LyMin = -((LgridV[1] / 2) - 1) - coordArray[i].gridY;
      LyMax =  ((LgridV[1] / 2) - 1) - coordArray[i].gridY;
	  LxMin = -((LgridV[0] / 2) - 1) - coordArray[i].gridX;
      LxMax =  ((LgridV[0] / 2) - 1) - coordArray[i].gridX;
    }
    
    coordArray[i].gradY = Math.floor(random(LyMin, LyMax));
	coordArray[i].gradX = Math.floor(random(LxMin, LxMax));
    
    // do not allow gradiant of (0,0)
    while (coordArray[i].gradY == 0 && coordArray[i].gradX ==0) {
      coordArray[i].gradY = Math.floor(random(LyMin, LyMax));
	  coordArray[i].gradX = Math.floor(random(LxMin, LxMax));
    }
	/*
    console.log('randGrad: for grid x=' + coordArray[i].gridX + 
                ' y=' + coordArray[i].gridY +
                ' GRAD (rise/run): y=' + coordArray[i].gradY + 
                ' x=' + coordArray[i].gradX);  //DIAG
	*/
    }
  /*----------------------------------------------------------------*/
}

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
//			EVENTS			/$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/

/********************************************************************/
// function startPlay()
//  Input event; called when user clicks start/stop or reset button
//  input:  n/a
//  return: n/a
/********************************************************************/
function startPlay() {  
  // local variables
  
  /*----------------------------------------------------------------*/
  // game currently INACTIVE (START/STOP button is green)
  //                                (OR pink for RESTART):
  //	start timer
  //    set level end msg to empty
  //	set start/stop button to STOP	
  //	initialise program variables
  //    randomly obtain X & Y grid coordinates
  //	indicate game is active (activateGame = 1)
  if (activateGame == 0) {
	bgCol = 'rgb(140, 140, 140)';
    
    timer = setInterval(countDown, 1000); 
    
    startBtn.style('background-color', color(STOPBTNCOL));
  	startBtn.html('stop');  
        
    // set random X & Y grid coordinates user is to click on,
    //  passing 'y' if only positive grid co-ords required
    randomXY(levelArray[currLevel].rtnPosInd());
    
    // display first grid co-ordinates for the level in white
	pCoordV.style('color', 'white');
	pCoordV.style('font-weight', 'bold');
    pCoordV.html('(' + coordArray[0].gridX + 
                 ',' + coordArray[0].gridY + ')');
    
    // randomly select X & Y gradiants for gradiant game?
    if (game == 2) {
      pGradV.html('');
      randomGrad(levelArray[currLevel].rtnPosInd());
      grad = false;
    }
    
    // reset display only if there was an end level msg
	if (lvlEndMsg != '') {
	  lvlEndMsg = '';
	  // reset level counts & time taken
	  levelArray[currLevel].resetUsrScore(0);
	  levelArray[currLevel].resetUsrMiss(0);
	  levelArray[currLevel].updateUsrTime(0);
	  pScore.html('score:  0');
	  pLMiss.html('misses: 0');
	  pLMiss.style('color', 'black');
	}
	
	// reset program flags
    pTimer.style('color', 'black'); 
    cntRotate    = 0;
    chColCntr    = 0;
    chCol        = 0;
    dispCoord    = false;
    activateGame = 1;
    run          = true;
 
    // grid display settings based on if level is positive grid only 
    if (levelArray[currLevel].rtnPosInd() == 'y') {
      gridLines.setQuad(true, false, false, false);
    }
    else {
      gridLines.setQuad(true, true, true, true);
    }
  }
  
  /*----------------------------------------------------------------*/
  // game currently ACTIVE (START/STOP button is red):
  //	stop timer
  //	set start/stop button to START
  //    clear X & Y coordArray & text
  //	set game to inactive (activateGame = 0)
  else if (activateGame == 1) {	
    clearInterval(timer);
	
  	startBtn.style('background-color', color(STARTBTNCOL));
  	startBtn.html('start');    
    coordArray	  = [];    
    activateGame  = 0;
  }
  /*----------------------------------------------------------------*/
}

/********************************************************************/
// function countDown()
//  Timer event; called every 1 second once level has started
//  Only count down if game active
//  If seconds remain - decrease seconds remaining by 1
//  If no secs remain - stop timer & determine result of level
//  input:  n/a
//  return: n/a
/********************************************************************/
function countDown() {
  // local variables
  
  // only count down time if game active
  if (activateGame == 1) {
    if (secDown >0) {
      secDown--;
      pTimer.html('secs: '  + secDown);
    }  
    else {
      clearInterval(timer);
      pTimer.style('color', 'yellow');
      result(0);
    }
  }
}

/********************************************************************/
// function mouseCClick()
//  Mouse event (via coord button): when mouse clicked over canvas.
//  If game is active & mouse or its associated circle of influence
//    is over the target grid coordinate, delete the coord in array,
//    add 1 to score & set new grid co-ord.
//	If no coords left, call result to determine who won the level
//  input:  n/a
//  return: n/a
/********************************************************************/
function mouseCClick() {
  // local variables
  var LdistToBall;
  var Lxy = [];
  let LrtnUsrCounts = [];
  
  /*----------------------------------------------------------------*/
  if (activateGame == 1) {
    Lxy = gridLines.cnvtGrid2Pixel(coordArray[0].gridX,
                                   coordArray[0].gridY);
  	LdistToBall = dist(Lxy[0], Lxy[1], mouseX, mouseY);
    /*
    console.log('mouseCClick LdistToBall: ' + coordArray[0].gridX + 
                '/' + coordArray[0].gridY + 
                '   ' + Lxy[0] + '/' + Lxy[1] +
                '    ' + mouseX + '/' + mouseY);    //DIAG
    */
    if(LdistToBall <= levelArray[currLevel].rtnRad()) {
      chCol = 1;            // indicate clicked on grid co-ordinate
      levelArray[currLevel].updateUsrScore(1);
      //mcClickOk.play()    // music indicates clicked on grid co-ord //MUSIC
      
      // convert & save co-ordinates of hit before they are deleted
      Lxy = gridLines.cnvtPixel2Coord(Lxy[0], Lxy[1]);
      xGridCoord = Lxy[0];
      yGridCoord = Lxy[1];
      
      // delete current grid co-ords, so new element moves to the top
      coordArray.splice(0, 1);
	  cntLvlRounds--;
      
      // if no rounds left, determine the result
      if (cntLvlRounds <= 0) {
		  console.log('mouseCClick: no more rounds left');//BGG
         result(secDown);
      }
      else {  // set new X & Y grid co-ordinates in white
		pCoordV.style('color', 'white');
		pCoordV.style('font-weight', 'bold');
        pCoordV.html('(' + coordArray[0].gridX + 
                     ',' + coordArray[0].gridY + ')');
      }
    }
      
    // clicking off target coordinate is a miss
    else {
      chCol = 3;            // indicate clicked off grid co-ordinate
      //mcClickFail.play()  // music indicating clicked off grid co-ord //MUSIC
      levelArray[currLevel].updateUsrMiss(1);
      cntTMiss++;
	  if (!levelArray[currLevel].rtnUsrWon()) {
		pLMiss.style('color', 'yellow');
	  }
    }
  }
    
  /*----------------------------------------------------------------*/
  // update display with scores & misses
  LrtnUsrCounts = levelArray[currLevel].rtnUsrCounts()
  pScore.html  ('score: ' + LrtnUsrCounts[0]);
  pLMiss.html  ('misses:' + LrtnUsrCounts[1]);
  console.log  ('mouseCClick end : usrMiss=' + LrtnUsrCounts[1]);	//BGG
  pLRounds.html('rounds:' + cntLvlRounds); 
  pTMiss.html  ('misses:' + cntTMiss);
  /*----------------------------------------------------------------*/
}  

/********************************************************************/
// function mouseGClick()
//  Mouse event (via grad button): when mouse clicked over canvas.
//  Two parts to function: grid co-ord OR associated gradiant
//  If checking grid co-ord:
//    If game is active & mouse/its associated circle is over the
//      target grid coordinate, delete the coord in array & set 
//      associated gradiant.
//  If checking gradiant:
//    If mouse/its associated circle is over sum of co-ord + gradiant,
//      delete the gradiant, add 1 to score & set new grid co-ord.
//	If no coords left, call result to determine who won
//  input:  n/a
//  return: n/a
/********************************************************************/
function mouseGClick() {
  // local variables
  var LdistToBall;
  var Lxy   = [];
  let Ltemp = [];
  let LrtnUsrCounts = [];
  
  /*----------------------------------------------------------------*/
  if (activateGame == 1) {
    // check if we are dealing with a grid co-ordinate or gradiant
    if(!grad) {  // grid co-ordinate
      Lxy = gridLines.cnvtGrid2Pixel(coordArray[0].gridX,
                                     coordArray[0].gridY);
  	  LdistToBall = dist(Lxy[0], Lxy[1], mouseX, mouseY);
      /*
      console.log('mouseGClick LdistToBall: ' + coordArray[0].gridX + 
                  '/' + coordArray[0].gridY + 
                  '   ' + Lxy[0] + '/' + Lxy[1] + '    ' +
                  mouseX + '/' + mouseY);      //DIAG
      */
      if(LdistToBall <= levelArray[currLevel].rtnRad()) {
        chCol = 6;            // indicate clicked on grid co-ordinate
        //mcClickOk.play()    // music indicates clicked on grid co-ord //MUSIC
      
        // convert & save co-ordinates of hit before they are deleted
        Lxy = gridLines.cnvtPixel2Coord(Lxy[0], Lxy[1]);
        xGridCoord = Lxy[0];
        yGridCoord = Lxy[1];
        
        // display associated gradiant values in white
		//NOTE: math convention is a gradiant is written as -
		//		(change in y-coordinate)/(change in x-coordinate)
		//	However the gradiant is stored in this programs as
		//		change in x-coordinate)/(change in y-coordinate
		//	Therefore when it is displayed in the screen, the
		//		order is reversed.
		pGradV.style('color', 'white');
		pGradV.style('font-weight', 'bold');
        pGradV.html('(' + coordArray[0].gradY + 
                    '/' + coordArray[0].gradX + ')');
        
        // set to work on associated gradiant
        grad = true;
      }
      else {
        chCol = 9;            // indicate clicked off grid co-rodinate
        //mcClickFail.play()  // music indicating clicked off grid coord //MUSIC
        levelArray[currLevel].updateUsrMiss(1);
        cntTMiss++;
		if (!levelArray[currLevel].rtnUsrWon()) {
		  pLMiss.style('color', 'yellow');
		}
      }
    }
      
    else {  // gradiant
      // position to click on = grid co-ord X & Y plus gradiant X & Y
      Lxy[0] = coordArray[0].gridX + coordArray[0].gradX;
      Lxy[1] = coordArray[0].gridY + coordArray[0].gradY;
      Ltemp    = gridLines.cnvtGrid2Coord(Lxy[0], Lxy[1]);
      xGradCoord = Ltemp[0]; 
      yGradCoord = Ltemp[1]; 
      
      Lxy = gridLines.cnvtGrid2Pixel(Lxy[0], Lxy[1]);
  	  LdistToBall = dist(Lxy[0], Lxy[1], mouseX, mouseY);
                                     
      if(LdistToBall <= levelArray[currLevel].rtnRad()) {
        chCol = 5;            // indicate clicked on grad co-ordinate
        levelArray[currLevel].updateUsrScore(1);
        //mcClickOk.play()    // music indicates clicked on grad co-ord //MUSIC
      
        // convert pixels to co-ords & save gradiant hit before deletion
        Lxy     = gridLines.cnvtGrid2Coord(coordArray[0].gradX, 
                                           coordArray[0].gradY);
        xGVect = Lxy[0];
        yGVect = Lxy[1];
         
        coordArray.splice(0, 1);
		cntLvlRounds--;
         
        // set back to work on grid co-ordinates
        grad = false;
            
        // if no rounds left, determine the result
        if (cntLvlRounds <= 0) {
           result(secDown);
        }
        else { //set new grid co-ordinates in white & clear gradiant values
		  pCoordV.style('color', 'white');
		  pCoordV.style('font-weight', 'bold');
          pCoordV.html('(' + coordArray[0].gridX + 
                     ',' + coordArray[0].gridY + ')');
          pGradV.html('');
        }  
      }
      
      // clicking off target grid coordinate is a miss
      else {
        chCol = 8;            // indicate clicked off grid co-rodinate
        //mcClickFail.play()  // music indicatnig clicked off grid coord //MUSIC
        levelArray[currLevel].updateUsrMiss(1);
        cntTMiss++;
		if (!levelArray[currLevel].rtnUsrWon()) {
		  pLMiss.style('color', 'yellow');
		}
      }
    }
  }
  
  /*----------------------------------------------------------------*/  
  // update display with scores & misses
  LrtnUsrCounts = levelArray[currLevel].rtnUsrCounts()
  pScore.html('score: '   + LrtnUsrCounts[0]);
  pLMiss.html('misses:'   + LrtnUsrCounts[1]);
  pLRounds.html('rounds:' + cntLvlRounds); 
  pTMiss.html('misses:'   + cntTMiss); 
  /*----------------------------------------------------------------*/
}  

/********************************************************************/
// function windowResized()
// 	Resize window event: called when user resizes window
//  Re-size canvas
//  input:  n/a
//  return: n/a
/********************************************************************/
function windowResized() {
  // local variables
  LrtnSize = [];
  
  Lrtn = levelArray[currLevel].rtnGrid();
    
  // calculate & draw grid lines 
  //  GridLines constructor(_minSize, _minCols, 
  //                        _xPos, _yPos,
  //                        _width, 
  //                        _height,
  //                        _gridCol, _gridCLCol, _gridNumCol,
  //						_GRIDSW);
  gridLines = new Gridlines(MINSIZE, MINCOLS, 
                            GRIDXPOS, GRIDYPOS,
                            windowWidth - QPANELW - PADDING * 2, 
							windowHeight - NAVBARH - PADDING,
							Lrtn[0], Lrtn[1], Lrtn[2],
                            GRIDSW);

	gridLines.setPosInd(levelArray[currLevel].rtnPosInd());

	// grid display settings based on if level is positive grid only 
	if (levelArray[currLevel].rtnPosInd() == 'y') {
	  gridLines.setQuad(true, false, false, false);
	}
	else {
	  gridLines.setQuad(true, true, true, true);
	}

	gridLines.calcValues();
	LrtnSize  = gridLines.rtnSize();

	resizeCanvas(LrtnSize[0], LrtnSize[1]);
	playArea.position(QPANELW, NAVBARH); 
}

/********************************************************************/
// function diagFunc()
// 	Flip diag variable true/false
//  input:  n/a
//  return: n/a
/********************************************************************/
function diagFunc() {         //DIAG
  //local variables           //DIAG
  if (diag) {                 //DIAG    
    noLoop();                 //DIAG
  }                           //DIAG
  else {                      //DIAG
    loop();                   //DIAG
  }                           //DIAG
  diag = !diag                //DIAG
}

/********************************************************************/
//      END OF CODE
/********************************************************************/