/********************************************************************/
// GOGL DBstuff.js
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
//    pixel            = x/y co-ords of system, ie mouse
//    gradiant co-ords = x/y co-ords of gradiant user deals with
//    
/********************************************************************/

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// database variables
let dbUser;
var db;
var dbRefGOGL_Users;
var dbRefGOGL_Scores;
var dbRefGOGL_Levels;
var dbRefGOGL_Scores;
var dbKeys		 = [];
var dbData 	 	 = {};
var dbScoreArray = [];
var dbUsersArray = [];
var dbLevelArray = [];
var	GOGL_Levels;
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/

/*------------------------------------------------------------------*/
// 			START OF DBUsers CLASS
/*------------------------------------------------------------------*/
class DBUsers {
  constructor(_classCode, _fName, _lName, _userid) {
	this.classCode	= _classCode,
	this.fName  	= _fName,
    this.lName 		= _lName,
	this.userid 	= _userid
  }
}
/*------------------------------------------------------------------*/
//			END OF DBUsers CLASS
/*------------------------------------------------------------------*/

/*------------------------------------------------------------------*/
// 			START OF DBLevels CLASS
/*------------------------------------------------------------------*/
class DBLevels {
  constructor(_posQuad, _time, _rounds, _missLimit, _radius,
			  _bgCol, _mouseCol, _mouseHitCol,
			  _gridCol, _gridCLCol, _gridNumCol) {
    this.posQuad   	 = _posQuad,
	this.time  		 = _time,
    this.rounds 	 = _rounds,	  
	this.missLimit 	 = _missLimit,
	this.radius  	 = _radius, 
	this.bgCol 		 = _bgCol,	  
	this.mouseCol 	 = _mouseCol,
	this.mouseHitCol = _mouseHitCol,	
	this.gridCol 	 = _gridCol,	
	this.gridCLCol 	 = _gridCLCol, 
	this.gridNumCol  = _gridNumCol	
  }
}
/*------------------------------------------------------------------*/
//			END OF DBLevels CLASS
/*------------------------------------------------------------------*/
 
//*------------------------------------------------------------------*/
// 			START OF DBScores CLASS
/*------------------------------------------------------------------*/
class DBScores {
  constructor(_dummy, _classCode, _fName, _lName, _userid, _date, _gameid, 
			  _level, _score, _miss, _time, _result) {
	this.dummy		 = _dummy,			  
	this.classCode	 = _classCode,
    this.fName   	 = _fName,
	this.lName   	 = _lName,
	this.userid  	 = _userid,
	this.date   	 = _date,
	this.gameid  	 = _gameid,
	this.level 		 = _level,
	this.score 		 = _score,
	this.miss 		 = _miss,
	this.time 		 = _time,
	this.result 	 = _result
  }
}
/*------------------------------------------------------------------*/
// 			END OF DBScores CLASS
/*------------------------------------------------------------------*/

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// initFirebase()
//  Called by setup
//  Connect & authorise access to firebase realtime DB
//  input:  n/a
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function initFirebase() {
  // local variables
  var Lconfig = {};
   
  Lconfig = {
    apiKey: "AIzaSyAQ5R-XvqE2bDZ1iCyEBoG1jPsbNTQ_-TY",
    authDomain: "comp13-hirescore.firebaseapp.com",
    databaseURL: "https://comp13-hirescore.firebaseio.com",
    projectId: "comp13-hirescore",
    storageBucket: "comp13-hirescore.appspot.com",
    messagingSenderId: "607820825507"
  };

  // Initialize Firebase
  firebase.initializeApp(Lconfig);
    
  firebase.auth().onAuthStateChanged(dbNewLogin); 

  /*------------------------------------------------------------*/
  // function to login via user's Google Account
  function dbNewLogin (_user) {
	// local variables
	var Lprovider;
	
	if (_user) {
		// user is signed in
		dbUser = _user;
		Luser = _user.displayName.split(' ');
		userFName = Luser[0];
		userLName = Luser[1];
		userid	  = _user.email.split('@', 1);
		console.log('username=' + _user.displayName +
					' user.email=' + _user.email +
					' user.uid=' + _user.uid);
	}
	else { // get user to sign in
		var Lprovider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(Lprovider);
	}
    /*------------------------------------------------------------*/
  }	 
}  

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// dbRreadErr(error)
//  Input event; called when database read fails
//	Output DB error message
//  input:  error info from firebase
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function dbReadErr(_err) {
  // local variables
  
  console.log('Error!');
  console.log(_err);
}

/********************************************************************/
//      END OF CODE
/********************************************************************/