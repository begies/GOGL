/********************************************************************/
// GOGL DBusers.js
//  Login in to Maths co-ordinates game, display and 
//	activate the nav bar buttons
//  By Mr Bob Term 4 2019
//
//  Naming standards:
//    camelCase
//    constants are in UPPERCASE
//    input parameters (inside function) begin with an underscore _
//    local variables begin with upper case L
/********************************************************************/

/********************************************************************/
//  USER FUNCTIONS
/********************************************************************/

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// accessFirebase()
//  Called by setup
//  Access firebase realtime DB
//  input:  n/a
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function accessFirebase() {
  // local variables
    	
  db = firebase.database();
  dbRefGOGL_Users = db.ref('GOGL_Users');
  dbRefGOGL_Users.on('value', dbReadGOGL_Users, dbReadErr);  
}

/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
// dbReadGOGL_Users(data)
//  Input event; called when database is modified
//	Read data from firebase, populate array & sort data
//  input:  data from firebase
//  return: n/a
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
function dbReadGOGL_Users(_data) {
  console.log('NEW login.js dbReadGOGL_Users:');//BGG
  // local variables
  var i;
  var k;
  var LGOGL_Users;
  var Lkeys;
  
  LGOGL_Users = _data.val();
  
  // anything to read?
  if (LGOGL_Users != null) {
	Lkeys 	   = Object.keys(LGOGL_Users);
	//console.log(Lkeys);				//DIAG

	for (i = 0; i < Lkeys.length; i++) {
		k = Lkeys[i];
		dbUsersArray[i] = new DBUsers (
			LGOGL_Users[k].classCode,
			LGOGL_Users[k].fName, 
			LGOGL_Users[k].lName,
			LGOGL_Users[k].userid);
	}
	checkUser(userid);
  }
}
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/

/********************************************************************/
// EVENTS
/********************************************************************/

/********************************************************************/
//    END OF PROG
/********************************************************************/