/********************************************************************/
// GOGL results.js
//  Maths co-ordinates game results
//  By Mr Bob Term 2 2019
//
//  Naming standards:
//    camelCase
//    constants are in UPPERCASE
//    input parameters (inside function) begin with an underscore _
//    local variables begin with upper case L
/********************************************************************/

var filter_selection;
var filter_input;

/********************************************************************/
// main line code
/********************************************************************/

initFirebase();
accessFirebase();

Luser = getCookie(GOGLCookie);
// cookie layout: fName, lName, userid, classCode
if (Luser != "") {
	LuserArray = Luser.split(" ");
	userid 		  = LuserArray[2];
	userClassCode = LuserArray[3];
}

if (userClassCode == "teacher") {
	removeDisabled("filterSel");
	removeDisabled("filterIn");
	removeDisabled("filterBtn");
}
else {
	document.getElementById("filterIn").value = userid;
}
document.getElementById("filterIn").value = userid;			//BGG testing only

/********************************************************************/
// runProg()
//	Called by filter submit button in html
//	Start building results table based on filter
// 	input:	n/a
//	return: n/a
/********************************************************************/
function runProg() {
	console.log('runProg');//BGG
	// local variables
	var Lx;
	var Ly;
	
	filter_selection = document.getElementById("filterSel").value;
	filter_input	 = document.getElementById("filterIn").value;
	
	Lx = document.getElementById("filterSel").selectedIndex;
	Ly = document.getElementsByTagName("option");
	if (Ly[Lx].defaultSelected) {
		filter_selection = Ly[Lx].text;
	}
	
	console.log(filter_selection+'/'+filter_input);//BGG
	accessFirebase();
	//setupControls(PADDING, 130);
}

//********************************************************************/
//  USER FUNCTIONS
/********************************************************************/

/********************************************************************/
// setupControls(_x, _y)
//	Called by setup
//	Set up the user control/question area
// 	input:	X & Y position of first element
//	return: n/a
/********************************************************************/
function setupControls(_x, _y) {
  // local variables
  var LbtnFSize = '20px';
  var LpFSize 	= '20';
  var Lcolour = 'rgb(250, 250, 250'; 
}

/********************************************************************/
// function removeDisabled(_DOM)
// 	Remove disabled from DOM element
//  input:  DOM element
//  return: n/a
/********************************************************************/
function removeDisabled(_DOM) {
	console.log('results.js  removeDisabled: ' + _DOM);//BGG
	// local variables
	
	document.getElementById(_DOM).disabled = false;
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// accessFirebase()
//  Called by main
//  Access firebase realtime DB
//  input:  n/a
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function accessFirebase() {
  // local variables
     	
  db = firebase.database();
  dbRefGOGL_Scores = db.ref('GOGL_Scores');
  dbRefGOGL_Scores.on('value', dbReadGOGL_Scores, dbReadErr);    
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// dbReadGOGL_Scores(data)
//  Input event; called when database is modified
//	Read data from firebase, populate array & sort data
//  input:  data from firebase
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function dbReadGOGL_Scores(_data) {
  console.log('dbReadGOGL_Scores: ' + userid + 
			  ', filter_sel= ' + filter_selection +
			  ', filter_in= ' + filter_input);//BGG
  // local variables
  var i;
  var k;
  var LGOGL_Scores;
  var Lkeys;
  let Ldate;
	  
  LGOGL_Scores = _data.val();
  
  // anything to read?
  if (LGOGL_Scores != null) {
	Lkeys = Object.keys(LGOGL_Scores);
	//console.log(Lkeys);				//DIAG
		
	for (i = 0; i < Lkeys.length; i++) {
		k = Lkeys[i];
		console.log('LGOGL_Scores[k].classCode='+LGOGL_Scores[k].classCode+
					', LGOGL_Scores[k].fName='+LGOGL_Scores[k].fName+'<');//BGG
		dbScoreArray[i] = new DBScores (
			'x',
			LGOGL_Scores[k].classCode,		 
			LGOGL_Scores[k].fName,							
			LGOGL_Scores[k].lName,
			LGOGL_Scores[k].userid,
			LGOGL_Scores[k].date,
			LGOGL_Scores[k].gameid,
			LGOGL_Scores[k].level,	
			LGOGL_Scores[k].score,
			LGOGL_Scores[k].miss,
			LGOGL_Scores[k].time,
			LGOGL_Scores[k].result);
		console.log('CLASSCODE='+dbScoreArray[i].classCode+
				', FNAME='+dbScoreArray[i].fName+'<');//BGG
	}
	for (i=0; i < dbScoreArray.length; i++) {
	console.log('classCode='+dbScoreArray[i].classCode+
				', fName='+dbScoreArray[i].fName+'<');//BGG
	}
	/*
	// sort dbSscoreArray
	dbScoreArray.sort(function(_obj1, _obj2) {
		// decending DBScores	
		return _obj1.score - _obj2.score;
	});
	*/
  }
  
  else {
	Ldate = new Date();
	dbScoreArray[0] = new DBScores (
		'',
		'',
		'no results saved in DB',
		Ldate.getTime(),
		'',
		'',	
		'',
		'',
		'',
		'')
  }
  
  // display the results
  disp();
}
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/

/********************************************************************/
// disp()
//	Called by dbReadGOGL_Scores
//	Initialize display DB info
// 	input:	n/a
//	return: n/a
/********************************************************************/
function disp() {
	// local variables
	var LscorePointer;
	var Ldate;
	var LdateShort;
	var Ltable;
	var Lrow;
	var Lcell00, Lcell01, Lcell02, Lcell03, Lcell04, 
		Lcell05, Lcell06, Lcell07, Lcell08, Lcell09;
	  
	document.getElementById("GOGL_h1").innerHTML = userFName + 
						": RESULTS";
						
	for (i = 0; i < dbScoreArray.length; i++) {
		Ltable = document.getElementById("resultsTable");
		Lrow = Ltable.insertRow(1);
		Ldate = new Date(dbScoreArray[i].date);
		Ldate = Ldate.toString();
		LdateShort = Ldate.split("GMT");
		
		Lcell00 = Lrow.insertCell(0);
		Lcell01 = Lrow.insertCell(1);
		Lcell02 = Lrow.insertCell(2);
		Lcell03 = Lrow.insertCell(3);
		Lcell04 = Lrow.insertCell(4);
		Lcell05 = Lrow.insertCell(5);
		Lcell06 = Lrow.insertCell(6);
		Lcell07 = Lrow.insertCell(7);
		Lcell08 = Lrow.insertCell(8);
		Lcell09 = Lrow.insertCell(9);
		Lcell10 = Lrow.insertCell(10);
		
		Lcell00.innerHTML = dbScoreArray[i].classCode;
		Lcell01.innerHTML = dbScoreArray[i].fName;
		Lcell02.innerHTML = dbScoreArray[i].lName;
		Lcell03.innerHTML = dbScoreArray[i].userid; 
		Lcell04.innerHTML = LdateShort[0]; 
		Lcell05.innerHTML = dbScoreArray[i].gameid; 
		Lcell06.innerHTML = dbScoreArray[i].level; 
		Lcell07.innerHTML = dbScoreArray[i].score; 
		Lcell08.innerHTML = dbScoreArray[i].miss; 
		Lcell09.innerHTML = dbScoreArray[i].time; 
		Lcell10.innerHTML = dbScoreArray[i].result; 
	}
}

/********************************************************************/
//    END OF PROG
/********************************************************************/