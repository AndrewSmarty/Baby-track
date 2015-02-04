function SnugBabyDayTime(date){
		this.date = (date === undefined) ? new Date() : date;

		this.time = this.formatTimeAMPM();			//E.x.:   "07:36 AM"
		this.fullMonth = this.formatFullMonth();	//E.x.:   "January 24"
		this.shortMonth = this.formatShortMonth();	//E.x.:   "Jan 24"
		this.fullDay = this.formatFullDay(); 		//E.x.:   "Monday"
		this.shortDay = this.formatShortDay();		//E.x.:   "Mon"
		this.year = this.formatFullYear();			//E.x.:   "2015"
	}

	SnugBabyDayTime.prototype.formatTimeAMPM = function(){			//E.x.:   "07:36 AM"
		var hours = this.date.getHours();
		var minutes = this.date.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;									// the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var time = hours + ':' + minutes + ' ' + ampm;
		return time;
	};

	SnugBabyDayTime.prototype.formatMonth = function(month){		//E.x.:   "January"
		var monthNumber = this.date.getMonth();
		var monthName = "";

		month = (typeof month !== 'undefined') ?  month: {type: "full"};

		switch(monthNumber){
			case 0 : 
				monthName = (month.type == "short") ? "Jan" : "January";
				break;
			case 1 : 
				monthName = (month.type == "short") ? "Feb" : "February";
				break;
			case 2 : 
				monthName = (month.type == "short") ? "Mar" : "March";
				break;
			case 3 : 
				monthName = (month.type == "short") ? "Apr" : "April";
				break;
			case 4 : 
				monthName = "May";
				break;
			case 5 : 
				monthName = "June";
				break;
			case 6 : 
				monthName = "July"
				break;
			case 7 : 
				monthName =  (month.type == "short") ? "Aug": "August";
				break;
			case 8 : 
				monthName =  (month.type == "short") ? "Sep": "September";
				break;
			case 9 : 
				monthName =  (month.type == "short") ? "Oct": "October";
				break;
			case 10 : 
				monthName =  (month.type == "short") ? "Nov" : "November";
				break;
			case 11 : 
				monthName =  (month.type == "short") ? "Dec" : "December";
				break;
			default:
				monthName = "undefined";
		}

		return monthName;
	};

	SnugBabyDayTime.prototype.formatFullMonth = function(){					//E.x.:   "January 24"
		var fullMonth = this.formatMonth() + " " + this.date.getDate();		
		return fullMonth;
	};

	SnugBabyDayTime.prototype.formatShortMonth = function(){	
		var shortMonth = this.formatMonth({type: "short"}) + " " + this.date.getDate();		
		return shortMonth;
	};


	SnugBabyDayTime.prototype.formatFullDay = function(){
		var fullDay = this.formatDay();		
		return fullDay;
	};

	SnugBabyDayTime.prototype.formatShortDay = function(){
		var shortDay = this.formatDay({type: "short"});		
		return shortDay;
	};

	SnugBabyDayTime.prototype.formatDay = function(day){						//E.x.:   "Monday"
		var dayNumber = this.date.getDay();
		var dayName = "";

		day = (typeof day !== 'undefined') ?  day: {type: "full"};

		switch(dayNumber){
			case 0 :
				dayName = (day.type == "short") ? "Sun" : "Sunday";
				break;
			case 1 :
				dayName = (day.type == "short") ? "Mon" : "Monday";
				break;
			case 2 :
				dayName = (day.type == "short") ? "Tue" : "Tuesday";
				break;
			case 3 :
				dayName = (day.type == "short") ? "Wed" : "Wednesday";
				break;
			case 4 :
				dayName = (day.type == "short") ? "Thu" : "Thursday";
				break;
			case 5 :
				dayName = (day.type == "short") ? "Fri" : "Friday";
				break;
			case 6 :
				dayName = (day.type == "short") ? "Sat" : "Saturday";
				break;
			default : 
				dayName = "undefined";
		}

		return dayName;
	};

	SnugBabyDayTime.prototype.formatFullYear = function(){					//E.x.:   "2015"	
		var year = this.date.getFullYear().toString();
		return year;
	};

	SnugBabyDayTime.prototype.toString = function(dateCreationWay){						//E.x.:   case FULL_DATE ->  "Thursday, January 22, 2015 at 9:38 AM"	
		var fullDate = "";																//E.x.:   case SHORTEN_DATE -> "January 22, 2015 at 9:38 AM"
		switch(dateCreationWay){
			case "FULL_DATE":
				fullDate = this.fullDay + ", "+ 
					this.fullMonth + ", " +
					this.year + " at " +
					this.time;
				break;

			case "SHORTEN_DATE":
				fullDate = 
					this.fullMonth + ", " +
					this.year + " at " +
					this.time;
				break;

			default : 
				fullDate = this.fullDay + ", "+ 
					this.fullMonth + ", " +
					this.year + " at " +
					this.time;
		}

		return fullDate;
	};