var BabyTrackInitialPage = {
	NONE: 0,
	WELCOME_POST: 1,
	POSTED_RESULTS_TABLE: 2
}

var BabyTrackMode = {
	NONE: 0,
	CREATE_NEW_PERSON: 1,
	ADD_EVENT_WIZARD_NEW_PERSON: 2,
	ADD_EVENT_WIZARD_NEW_ACTIVITY: 3,
	CHOOSE_EXISTED_PERSON: 4,
	ADD_FOOD_EVENT: 5,
	ADD_DIAPER_EVENT: 6
}

var BabyTrackWindows = {
	NONE: 0,
	WELCOME_POST: 1,
	POSTED_RESULTS_TABLE: 2,
	CREATE_NEW_PERSON: 3,
	ADD_EVENT_WIZARD_NEW_PERSON: 4,
	ADD_EVENT_WIZARD_NEW_ACTIVITY: 5,
	CHOOSE_EXISTED_PERSON: 6,
	ADD_FOOD_EVENT: 7,
	ADD_DIAPER_EVENT: 8
}

var mode = BabyTrackMode.NONE;
var initialPage = BabyTrackInitialPage.WELCOME_POST;
var previousWindow = BabyTrackWindows.NONE;
//var currentWindow; // DOM object

var windowsAnimationOver = false;