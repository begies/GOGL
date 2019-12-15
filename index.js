/********************************************************************/
// GOGL index.js
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
             
/********************************************************************/
// P5.js setup()
/********************************************************************/
function setup() {  
  // local variables
  console.log('new index.js  setup:');//BGG
       
  // open & authorise firebase access
  initFirebase();
  accessFirebase();
  
  disp = Math.floor(random(1, 3));
  // select WEBGL or not, based on background to display
  switch(disp) {
	case(1):
		playArea = createCanvas(windowWidth - QPANELW - PADDING * 2, 
						  windowHeight - NAVBARH - H1H - PADDING);
		break;
	case(2):
		playArea = createCanvas(windowWidth - QPANELW - PADDING * 2, 
						  windowHeight - NAVBARH - H1H - PADDING,
						  WEBGL);
		break;
	default:
		playArea = createCanvas(windowWidth - QPANELW - PADDING * 2, 
						  windowHeight - NAVBARH - H1H - PADDING);
		break;
  }
  
  playArea.position(QPANELW, NAVBARH + H1H); 
  textAlign(LEFT);
  textSize(20);
  textFont('arial');
  setupErrP(PADDING, playArea.y);
}

/*==================================================================*/
/*==================================================================*/
// P5.js draw()		/*==============================================*/
/*==================================================================*/
/*==================================================================*/
function draw() {
  // local variables
  
  // select the background to display
  switch(disp) {
	case(1):
		indexPage_1();
		break;
	case(2):
		indexPage_2();
		break;
	default:
		indexPage_1();
		break;
  }
}

/********************************************************************/
//  USER FUNCTIONS
/********************************************************************/

/********************************************************************/
// function indexPage_1()
// 	Called by draw
//  Display interesting index page 1
//  input:  n/a
//  return: n/a
/********************************************************************/
function indexPage_1() {
	// local variables	
	var Ldeg = mouseX;
	var Lrad = radians(Ldeg);

	background(240);

	// the red rectangle is drawn before the rotation so
	// it will stay in place
	fill(255, 0, 0);
	rect(200, 200, 100, 100);
	line(0, 0, 200, 200);

	fill(0, 255, 0);
	text("rotate " + floor(Ldeg) + " degrees", 200, 50);
	
	// rotation is done here. all subsequent drawing
	// is done post-rotation
	rotate(Lrad);
	
	// draw the grid
	drawGrid();
	
	// the green rectangle and grid is drawn after rotating the canvas
	rect(200, 200, 100, 100);
	line(0, 0, 200, 200);	

	function drawGrid() {
		// local variables
		var x, y;
		
		stroke(200);
		fill(120);
		for (x = -2*width; x < 2*width; x += 40) {
			line(x, -2*height, x, 2*height);
			text(x, x+1, 12);
		}
		for (y = -2*height; y < 2*height; y += 40) {
			line(-2*width, y, 2*width, y);
			text(y, 1, y + 12);
		}
		
		return;
	}
}

/********************************************************************/
// function indexPage_2()
// 	Called by draw
//  Display interesting index page 2
//  input:  n/a
//  return: n/a
/********************************************************************/
function indexPage_2() { 
  // local variables
  let radius = width * 0.5;
  
  background(bgCol);

  //drag to move the world.
  orbitControl();

  normalMaterial();
  translate(0, 0, -600);
  for (let i = 0; i <= 12; i++) {
    for (let j = 0; j <= 12; j++) {
      push();
      let a = (j / 12) * PI;
      let b = (i / 12) * PI;
      translate(
        sin(2 * a) * radius * sin(b),
        (cos(b) * radius) / 2,
        cos(2 * a) * radius * sin(b)
      );
      if (j % 2 === 0) {
        cone(30, 30);
      } else {
        box(30, 30, 30);
      }
      pop();
    }
  } 
}

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
// function checkUser(_userid)
//	Called by setup
// 	If userid is in DB, save user's profile data, set heading, 
//	enable nav bar buttons
//  input:  user's id
//  return: n/a
/********************************************************************/
function checkUser(_userid) {
	console.log('NEW index.js  checkUser:');//BGG
	// local variables
	var Luser = '';
	
	dispMsg('', '', 'green', 'i');
	// loop through DB user entries, looking for matching userid
	for (i=0; i < dbUsersArray.length; i++) {
		//console.log(_userid + ' / ' + dbUsersArray[i].userid);//BGG
		if (_userid == dbUsersArray[i].userid) {
			userFName		= dbUsersArray[i].fName;
			userLName 		= dbUsersArray[i].lName;
			userid			= dbUsersArray[i].userid;
			userClassCode	= dbUsersArray[i].classCode;
			Luser			= userFName + ' ' + userLName + ' ' + 
							  userid + ' ' + userClassCode;
			setCookie(GOGLCookie, Luser, 30);
			document.getElementById("GOGL_h1").innerHTML = userFName + 
						": KEEPING ON TRACK WITH PESKY MATHS";
			setNavBar();		// set nav bar options
			break;
		}
	}
	
	if (Luser == '') {
		document.getElementById("GOGL_h1").innerHTML = "unknown" + 
							": KEEPING ON TRACK WITH PESKY MATHS";
		dispMsg('invalid id', 'try again', 'red', 'w');
	}
}

/********************************************************************/
// EVENTS
/********************************************************************/

/********************************************************************/
// function windowResized()
// 	Resize window event: called when user resizes window
//  Re-size canvas
//  input:  n/a
//  return: n/a
/********************************************************************/
function windowResized() {
  console.log('NEW index.js  windowResized:');//BGG
  // local variables
  
  playArea = createCanvas(windowWidth - QPANELW - PADDING * 2, 
						  windowHeight - NAVBARH - H1H - PADDING,
						  WEBGL);
  playArea.position(QPANELW, NAVBARH + H1H);   
}

/********************************************************************/
//      END OF CODE
/********************************************************************/