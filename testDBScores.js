
var dbScoreArray = [];

//*------------------------------------------------------------------*/
// 			START OF DBScores CLASS
/*------------------------------------------------------------------*/
class DBScores {
  constructor(_classCode, _fName, _lName, _userid, _date, _gameid, 
			  _level, _score, _miss, _time, _result) {
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
var fName ='fName';
var classCode = 'classCode';				
var	lName ='lName';
var	userid ='userid';
var	date ='date';
var	gameid ='gameid';
var	level ='level';	
var	score ='score';
var	miss ='miss';
var	time ='time';
var	result ='result';
/*------------------------------------------------------------------*/
// 			END OF DBScores CLASS
/*------------------------------------------------------------------*/
for (i=0; i<10; i++) {
	dbScoreArray[i] = new DBScores (
					fName,
					classCode,		//BGG				
					lName,
					userid,
					date,
					gameid,
					level,	
					score,
					miss,
					time,
					result);					
	console.log(dbScoreArray[i].fName + '/' + dbScoreArray[i].classCode); 
}			