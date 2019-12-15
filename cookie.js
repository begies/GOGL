/********************************************************************/
// GOGL cookie.js
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

/********************************************************************/
// function checkCookie()
//	Called by setup
// 	If cookie is already set, call ckeckUser to see if userid is 
//	in the DB
//  input:  n/a
//  return: n/a
/********************************************************************/
function checkCookie() {
	console.log('NEW index.js  checkCookie:');//BGG
	// local variables
	Luser = '';
	LuserArray = [];
	
	Luser = getCookie(GOGLCookie);
	// cookie layout: fName, lName, userid, classCode
	if (Luser != "") {
		LuserArray = Luser.split(" ");
		checkUser(LuserArray[2]);
	} 
}

/********************************************************************/
// function setCookie(_cname, _cvalue, _exdays)
//	Called by checkUser
//	Writes specified cookie
//  input:  user's id
//  return: n/a
/********************************************************************/
function setCookie(_cname, _cvalue, _exdays) {
  console.log('setCookie:');//BGG
  // local variables
  var Ldate;
  var Lexpires;

  Ldate = new Date();
  Ldate.setTime(Ldate.getTime() + (_exdays*24*60*60*1000));
  Lexpires = "; expires=" + Ldate.toGMTString();
  console.log("setCookie: " + _cname + "=" + _cvalue + ";" + Lexpires + ";path=/");//BGG
  document.cookie = _cname + "=" + _cvalue + Lexpires + ";";
}

/********************************************************************/
// function getCookie(_cname)
// 	If userid is in DB, save user's profile data, set heading, 
//	enable nav bar buttons
//  input:  user's id
//  return: the specified cookie if it exists
/********************************************************************/
function getCookie(_cname) {
  console.log('getCookie: ' + _cname);//BGG
  // local variables
  var Lname;
  var LdecodedCookie;
  var Lca;
  var Lc;
    
  var x = document.cookie;
  
  Lname = _cname + "=";
  LdecodedCookie = decodeURIComponent(document.cookie);
  console.log('getCookie: cookie=' + LdecodedCookie);//BGG
  Lca = LdecodedCookie.split(';');
  for(var i = 0; i < Lca.length; i++) {
    Lc = Lca[i];
    while (Lc.charAt(0) == ' ') {
      Lc = Lc.substring(1);
    }
    if (Lc.indexOf(Lname) == 0) {
      return Lc.substring(Lname.length, Lc.length);
    }
  }
  return "";
}

/********************************************************************/
//      END OF CODE
/********************************************************************/