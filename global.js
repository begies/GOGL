/********************************************************************/
// GOGL global.js
//  Maths co-ordinates and gradiant games
//  By Mr Bob Term 2 2019
//
//  Naming standards:
//    camelCase
//    constants are in UPPERCASE
//    input parameters (inside function) begin with an underscore _
//    local variables begin with upper case L
//
//  Definitions:
//    co-ords          = x/y co-ords user deals with
//	  grid co-ords	   = x/y co-ords origin is centre of grid 
//								due to translate command
//    pixel            = x/y co-ords of system, ie mouse
//    gradiant co-ords = x/y co-ords of gradiant user deals with
//    
/********************************************************************/
/********************************************************************/
const QPANELW    = 120;				// side panel width
const NAVBARH	 = 56;				// nav bar height
const H1H		 = 75;				// h1 height
const PADDING    = 8;
const OFFSET     = 280;
const btnCol	 = 'rgb(255, 204, 0)';//BGG
const GOGLCookie = "gogluser";

/*------------------------------------------*/
var userFName;
var userLName;
var userid;
var userClassCode;

/*------------------------------------------*/
var playArea;
var bgCol        = 'rgb(140, 140, 140)';
var disp;

/*------------------------------------------*/
// displaying text
let inconsolata;
       
/********************************************************************/
//  USER FUNCTIONS
/********************************************************************/

/********************************************************************/
// function getUserInfo()
//	Called by various modules
// 	Set nav bar options based on user's class code
//  input:  n/a
//  return: n/a
/********************************************************************/
function getUserInfo(){
  console.log('getUserInfo:');//BGG
  // local variables
  Luser		 = '';
  LuserArray = [];
  
  Luser = getCookie(GOGLCookie);
  // cookie layout: fName, lName, userid, classCode
  if (Luser != "") {
	LuserArray = Luser.split(" ");
	userid 		  = LuserArray[2];
	userClassCode = LuserArray[3];
	
	setNavBar();		// set nav bar options
  }
  
  else {
	  console.log('getUserInfo: no gogluser cookie set');
	  window.location.replace("http://hvhs-school.com/GL/index.html");
  }	  
}

/********************************************************************/
// function setNavBar()
//	Called by getUserInfo + index.js
// 	Set nav bar button based on user's class code
//  input:  n/a
//  return: n/a
/********************************************************************/
function setNavBar(){
	console.log('setNavBar:');//BGG
	// local variables
	
	removeDisabled("coords");
	removeDisabled("grad");
	removeDisabled("results");
	
	if (userClassCode == "teacher") {
		removeDisabled("levels");// only teachers access levels
	}		
}

/********************************************************************/
// function removeDisabled(_DOM)
//	Called by various modules
// 	Remove disabled class from DOM element
//  input:  DOM element
//  return: n/a
/********************************************************************/
function removeDisabled(_DOM) {
	console.log('removeDisabled: ' + _DOM);//BGG
	// local variables
	var Lelement;
	
	Lelement = document.getElementById(_DOM);
	Lelement.classList.remove("w3-disabled");
}

/********************************************************************/
// setupErrP(_x, _y)
//	Called by various modules
//	Set up the error paragraphs
// 	input:	X & Y position of first element
//	return: n/a 
/********************************************************************/
function setupErrP(_x, _y) {
  console.log('setupErrP:');//BGG
  // local variables
  var LbtnFSize = '20px';
  var LpFSize 	= '20px';
  
  /*----------------------------------------------------------------*/
  // create ERROR MESSAGE paragraph 1 & 2
  pErrMsg1 = createP('');
  pErrMsg1.position(_x, _y);
  pErrMsg1.style('font-size', LpFSize);
  pErrMsg1.style('font-weight', 'bold');
  pErrMsg1.style('color', 'red');
  pErrMsg1.style('margin', '0px'); 
  
  pErrMsg2 = createP('');
  pErrMsg2.position(pErrMsg1.x, pErrMsg1.y + pErrMsg1.height + 20);
  pErrMsg2.style('font-size', LpFSize);
  pErrMsg2.style('font-weight', 'bold');
  pErrMsg2.style('color', 'red');
  pErrMsg2.style('margin', '0px'); 
}


/********************************************************************/
// function dispMsg((_line1, _line2, _colour, _type)
// 	Called by various functions
//  Display message in screen and for errors, log to console.
//  input:  line 1 & 2 to display, colour to use & msg type: 
//					i = info, w = warning, e = error
//  return: n/a
/********************************************************************/
function dispMsg(_line1, _line2, _colour, _type) {
	console.log('dispMsg:');//BGG
	// local variables
	 
	pErrMsg1.style('color', _colour);
	pErrMsg1.html(_line1);
	pErrMsg2.style('color', _colour);
	pErrMsg2.html(_line2);
	
	if (_type == 'e') {
		console.log(_line1 + ' / ' + _line2);
	}
}

/********************************************************************/
//      END OF CODE
/********************************************************************/