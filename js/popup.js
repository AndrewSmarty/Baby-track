(function($, undefined){

	var bg = chrome.extension.getBackgroundPage();
	var MAX_PAGE_AMOUNT_COUNT = 8;

	var needToCorrectInputs = false;

	function SnugBabyPerson(nickname, birthday, avatarType, color){
		this.nickname = nickname;
		this.birthday = birthday;
		this.avatarType = avatarType;
		this.color = color;
	}

	SnugBabyPerson.prototype.toString = function() {
		return "{nickname: '" + this.nickname +
			 "', birthday: '" + this.birthday +
			 "', avatarType: '" + this.avatarType +
			 "', color: '" + this.color.toString() + "'}";
	};

	var current_baby = new SnugBabyPerson();

	function IncorrectInputException(message){
		this.message = message;
		this.name = "Incorrect Input Exception";

		this.toString = function(){
			return this.name + ": " + this.message;
		}
	}


	function setInitialPage(page, custom_appear ){

		//setting the default value for the element if it's undefined
		custom_appear = (typeof custom_appear !== 'undefined') ?  custom_appear: {speed: 400};

		//reset mode to 0;
		bg.mode = bg.BabyTrackMode.NONE;

		switch(page){
			
			case bg.BabyTrackInitialPage.WELCOME_POST:

				//Welcome Message appears only when a user got started on using 
				//an app for the 1st time and hadn't posted any notes yet

				//handaling an arrow appearing
				//it fades in once the mouse over and fades out otherwise;
				$("#welcome_guide_block > section > p > img").on("mouseover mouseout", function(event){

					switch(event.type){

						case "mouseover": 

							$("#welcome_guide_block > section > p ~ img")
								.stop()
								.animate({
									"opacity": 1,
								}, 500);
							break;

						case "mouseout":

							$("#welcome_guide_block > section > p ~ img")
								.stop()
								.animate({
									"opacity": 0,
								}, 500);
							break;
					}
				});

				switch(custom_appear.effect){
					case "show":
							$("#welcome_guide_block").show(custom_appear.speed).promise();
					break;


					case "fadeIn":
							$("#welcome_guide_block").fadeIn(custom_appear.speed).promise();
					break;


					case "drop":
							$("#welcome_guide_block").show("drop", custom_appear.speed).promise();
					break;

					default:
						$("#welcome_guide_block").css("display", "block");
				}

			break;


			case bg.BabyTrackInitialPage.POSTED_RESULTS_TABLE:
			
			break;
	
		}

	}




	function diaperWindowLogic(){
		try{
			checkCorrectInputAndSubmit({window: "ADD_DIAPER_EVENT"});
		}catch(e){
			alert(e.toString());
			return;
		}
		
		//this part executes as long as the whole data is full
		//and everything is specified

		bg.mode = bg.BabyTrackMode.ADD_DIAPER_EVENT;
		bg.previousWindow = bg.BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY;

		var $avatar_checked_radio = $("#choose_person input[type='radio']:checked");
		var nickname = $avatar_checked_radio.parent().text();
		
		//setting the default value for the element if it's undefined
		nickname = (nickname !== '') ?  nickname : "a baby";

		$("#diaper_content").find("h1").replaceWith("<h1>"+ nickname +"'s Diaper Content!</h1>");

		$("#diaper_content > section > div > section[data-type='subactivity_diaper']")
					.click(function(){

						unselectOthers({window: "ADD_DIAPER_EVENT"}); 
						$(this).find("div.subactivity_diaper").toggleClass("selected unselected");
						$(this).find("input[type=radio]").prop("checked", true);
					});

		clearWindows({effect: "drop", speed: 500, direction: "left"});
		var timer = setInterval(function(){
			if(bg.windowsAnimationOver){
				$("#diaper_content").show("drop", {direction: "right"}, 400);
				clearInterval(timer);
			}
		}, 10);
	}



	function checkCorrectInputAndSubmit( object ){
		switch( object.window ){
			
			case "CREATE_NEW_PERSON":	
				var nickname = $("#create_person_block  input#person_nickname").val();
				var birthday = $("#create_person_block  input#person_birthday").val();
				var $avatar =  $("#create_person_block  .avatar.selected");
				var color = $("#create_person_block  div#palette_field");     			           //in processing... not supported yet

				if( nickname === "")
					throw new IncorrectInputException( "Nickname is not specified!" );
				else if( birthday === "")
					throw new IncorrectInputException( "Birthday is not specified!" );
				else if( $.isEmptyObject( $avatar[0] ))
					throw new IncorrectInputException( "Avatar is not specified!" );
				break;

			case "CHOOSE_EXISTED_PERSON":
					var $avatar_checked_radio = $("#choose_person input[type='radio']:checked");
					if( $avatar_checked_radio.length == 0 )											//if not exists
						throw new IncorrectInputException( "A baby to snug is not selected! \n Please, create a new one." );
				break;

		}
	}


	//The function is used to get rid of major (not popup and dropdown!!!) 
	//windows as only one major (not popup and dropdown!!!) window may be 
	//displayed on the app screen at the same time

	function clearWindows(custom_appear){

		bg.windowsAnimationOver = false;

		//setting the default value for the element if it's undefined
		custom_appear = (typeof custom_appear !== 'undefined') ?  custom_appear: {effect: "fadeOut", speed: 500, direction:"left"};
		custom_appear.direction = (typeof custom_appear.direction !== 'undefined') ?  custom_appear.direction: "left";

		$( "#bt_container > section" ).each(function(index){
			if ( $( this ).css("display") !== "none"){
				switch(custom_appear.effect){

					case "fadeOut":
						$(this).fadeOut(custom_appear.speed, function(){
							bg.windowsAnimationOver = true;
						});
					break;

					case "hide":
						$(this).hide(custom_appear.speed, function(){
							bg.windowsAnimationOver = true;
						});
					break;

					case "drop":
						$(this).hide("drop", {direction: custom_appear.direction}, custom_appear.speed, function(){
							bg.windowsAnimationOver = true;
						});
					break;

					case "slideDown":
						$(this).slideDown(custom_appear.speed, function(){
							bg.windowsAnimationOver = true;
						});
					break;

				}

			}
		});
	}



	/****** Main Logic for buttons Next and Back in Back Traker *******/

	function setNextBackButtonsLogic(){

		$(document).on("click", ".button.next", function(){

			switch(bg.mode)	{
				
				case bg.BabyTrackMode.CREATE_NEW_PERSON:

					try{
						checkCorrectInputAndSubmit({window: "CREATE_NEW_PERSON"});	
					}
					catch(e){
						alert(e.toString());
						break;
					}

					//this part executes as long as the whole data is full
					//and everything is specified
						  
 
						var nickname = $("#create_person_block  input#person_nickname").val();
						var birthday = $("#create_person_block  input#person_birthday").val();
						var avatarType =  $("#create_person_block  .avatar.selected").attr("data-avatar-type");
						var color = $("#create_person_block  div#palette_field")[0];     			//in processing... not supported yet

						current_baby = new SnugBabyPerson(nickname, birthday, avatarType, color);

						var $prevSibling = $("#choose_person > section > div > .add_person_button").prev();
						if( $.isEmptyObject($prevSibling[0]) ||
							!needToCorrectInputs ){

							$prevSibling.find("div > div[data-avatar-type]").toggleClass("selected unselected");
							$prevSibling.find("label > input[type=radio]").prop("checked", false);

							var newPersonAvatar = 	"<section data-type='avatar'>"+
														"<div>"+
															"<div class = 'avatar selected' data-avatar-type="+ current_baby.avatarType +">"+
															
															"</div>"+
															
															"<label>"+
																"<input type='radio' name='avatar_radio'/>"+
																current_baby.nickname +
															"</label>"+
														"</div>"+
													"</section>";

							var pageAvatarCount = $("#choose_person > section > div > section").length;

							if( pageAvatarCount == MAX_PAGE_AMOUNT_COUNT)
								$("#choose_person > section > div").css({"overflow-y": "scroll"});

							$("#choose_person > section > div > .add_person_button").before( newPersonAvatar );

							$("#choose_person > section > div > section[data-type='avatar']")
								.last()
								.click(function(){

									unselectOthers({window: "CHOOSE_EXISTED_PERSON"}); 
									$(this).find("div.avatar").toggleClass("selected unselected");
									$(this).find("input[type=radio]").prop("checked", true);
								})
								.dblclick(function(event){
									$(this).hide(500,function(){																	
										if( !$.isEmptyObject( $(this).prev()[0] )){														//if previous exists
											if( $(this).find("label > input[type=radio]").is(":checked")){
												$(this).prev().find("div > div[data-avatar-type]").toggleClass("selected unselected");
												$(this).prev().find("label > input[type=radio]").prop("checked", true);
											}
										}else{
											if( $(this).find("label > input[type=radio]").is(":checked")){
												var $nextSibling = $("#choose_person > section > div > .add_person_button").prev();
												if( !$.isEmptyObject( $(this).next()[0]) ){
													$(this).next().find("div > div[data-avatar-type]").toggleClass("selected unselected");
													$(this).next().find("label > input[type=radio]").prop("checked", true);
												}
											}
										}
										$(this).remove();
									});
								})
								.find("label > input[type=radio]")
								.prop("checked", true);

						}else{
							needToCorrectInputs = false;
							$prevSibling.find("div[data-avatar-type]").attr("data-avatar-type", current_baby.avatarType);
							$prevSibling.find("label").html("<input type='radio' name='avatar_radio'/>" + current_baby.nickname);
							$prevSibling.find("label input[type='radio']").prop("checked", true);
							
<<<<<<< HEAD

=======
							
>>>>>>> origin/andrew
							unselectOthers({window:"CHOOSE_EXISTED_PERSON"});
							$prevSibling.find("div.avatar").toggleClass("selected unselected");
						}

						clearWindows({effect: "drop", speed: 500, direction: "left"});

						var timer = setInterval(function(){
							if(bg.windowsAnimationOver){
								$("#choose_person").show("drop", {direction: "right"}, 400);
								clearInterval(timer);
							}
						}, 10);

						bg.mode = bg.BabyTrackMode.CHOOSE_EXISTED_PERSON;
						bg.previousWindow = bg.BabyTrackWindows.CREATE_NEW_PERSON;
					//////

				break;

				case bg.BabyTrackMode.CHOOSE_EXISTED_PERSON:

					try{
						checkCorrectInputAndSubmit({window: "ADD_EVENT_WIZARD_NEW_ACTIVITY"});
					}catch(e){
						alert(e.toString());
						break;
					}
					
					//this part executes as long as the whole data is full
					//and everything is specified

					bg.mode = bg.BabyTrackMode.ADD_EVENT_WIZARD_NEW_ACTIVITY;
					bg.previousWindow = bg.BabyTrackWindows.CHOOSE_EXISTED_PERSON;

					var $avatar_checked_radio = $("#choose_person input[type='radio']:checked");
					var nickname = $avatar_checked_radio.parent().text();
					
					//setting the default value for the element if it's undefined
					nickname = (nickname !== '') ?  nickname : "a baby";

					$("#wizard_new_activity").find("h1").replaceWith("<h1>Choose an activity for "+ nickname +"</h1>");

					$("#wizard_new_activity > section > div > section[data-type='activity']")
								.click(function(){

									unselectOthers({window: "ADD_EVENT_WIZARD_NEW_ACTIVITY"}); 
									$(this).find("div.activity").toggleClass("selected unselected");
									$(this).find("input[type=radio]").prop("checked", true);
								});

					clearWindows({effect: "drop", speed: 500, direction: "left"});
					var timer = setInterval(function(){
						if(bg.windowsAnimationOver){
							$("#wizard_new_activity").show("drop", {direction: "right"}, 400);
							clearInterval(timer);
						}
					}, 10);

				break;

				case bg.BabyTrackMode.ADD_EVENT_WIZARD_NEW_ACTIVITY:

					var $checked_activity = $("#wizard_new_activity   input[type='radio']:checked");
					
					var $data_diaper_type = $checked_activity.parent().prev().attr("data-activity-type")
					
					switch($data_diaper_type){
						case "food":
							break;
						case "diaper":
							diaperWindowLogic();
							break;
						case "weight":
							break;
					}

				break;
			}
		});


		$(document).on("click", ".button.back", function(){
			switch(bg.previousWindow){

				case bg.BabyTrackWindows.NONE:
				break;

				case bg.BabyTrackWindows.WELCOME_POST:

					$("#add_event_button").show(1000);

					//get rid of buttons NEXT and BACK
					$("#bt_body > div").last().hide(600);

					bg.initialPage = bg.BabyTrackInitialPage.WELCOME_POST;
					bg.previousWindow = bg.BabyTrackWindows.NONE;
					bg.mode = bg.BabyTrackMode.NONE;

					clearWindows({effect: "fadeOut", speed: 800});	//asynchronous function

					//awaiting until other animation processes stop
					//as clearWindows function is asynchronous

					var timer = setInterval(function(){
						if(bg.windowsAnimationOver){
							setInitialPage(bg.initialPage, {effect: "drop", speed: 500});
							clearInterval(timer);
						}
					}, 10);

				break;

				case bg.BabyTrackWindows.POSTED_RESULTS_TABLE:
					//get rid of buttons NEXT and BACK
					$("#bt_body > div").last().hide(600);
					$("#add_event_button").show(1000);
				break;
				
				case bg.BabyTrackWindows.CREATE_NEW_PERSON:
					needToCorrectInputs = true;

					bg.previousWindow = bg.BabyTrackWindows.WELCOME_POST;
					bg.mode = bg.BabyTrackMode.CREATE_NEW_PERSON;

					clearWindows({effect: "drop", speed: 500, direction: "right"});
					var timer = setInterval(function(){
						if(bg.windowsAnimationOver){
							$("#create_person_block").show("drop", {direction: "left"}, 400);
							clearInterval(timer);
						}
					}, 10);

				break;
				
				case bg.BabyTrackWindows.CHOOSE_EXISTED_PERSON:
					
					bg.mode = bg.BabyTrackMode.CHOOSE_EXISTED_PERSON;
					bg.previousWindow = bg.BabyTrackWindows.CREATE_NEW_PERSON;

					clearWindows({effect: "drop", speed: 500, direction: "right"});
					var timer = setInterval(function(){
						if(bg.windowsAnimationOver){
							$("#choose_person").show("drop", {direction: "left"}, 400);
							clearInterval(timer);
						}
					}, 10);

				break;

				case bg.BabyTrackWindows.ADD_EVENT_WIZARD_NEW_PERSON:
					break;
				
				case bg.BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY:
					break;

			}
		});
	}

	/******************************************************************/

	function unselectOthers(obj){
		var selector = "";
		switch(obj.window){
			case "CREATE_NEW_PERSON":
				selector = "#create_person_block";
				break;
			case "CHOOSE_EXISTED_PERSON":
				selector = "#choose_person";
				break;
			case "ADD_EVENT_WIZARD_NEW_ACTIVITY":
				selector = "#wizard_new_activity";
				break;
			case "ADD_DIAPER_EVENT":
				selector = "#diaper_content";
				break;
		}

		$(selector).find(".avatar, .activity, .subactivity_diaper").each(function(index){
				if($(this).hasClass("selected"))
					$(this).toggleClass("selected unselected");
		}); 
	}


	$(function(){

		setInitialPage(bg.initialPage);
		setNextBackButtonsLogic();


		$("#wizard_new_activity    section[data-type='activity']:first-child   input[type=radio]").prop("checked", true);
		$("#diaper_content    section[data-type='subactivity_diaper']:first-child   input[type=radio]").prop("checked", true);

		//handaling an avatar selection
		//by means of increasing/descreasing an opacity value
		$("#create_person_block").find(".avatar").each(function(index){

			$(this).bind({

				mouseover: function(){
					if( $(this).hasClass("unselected"))
						$(this)
							.stop()
							.animate(200, 0.6);
				},

				mouseout: function(){

					if( $(this).hasClass("unselected"))
						$(this)
							.stop()
							.animate(200, 0.6);
				},

				click: function(){
					unselectOthers({window: "CREATE_NEW_PERSON"}); 
					$(this).toggleClass("selected unselected");
				}

			});

		});

		$("#bt_search_engine_area > span").last().click(function(){
			$("#bt_search_engine input[name='search_field']").val("");
		});

		$("#add_event_button").click(function(){

			$("#add_event_button").hide(1000);

			//return back buttons NEXT and BACK
			$("#bt_body > div").last().show(600);

			if(bg.initialPage === bg.BabyTrackInitialPage.WELCOME_POST &&
			 	bg.mode === bg.BabyTrackMode.NONE){
						
						bg.previousWindow = bg.BabyTrackWindows.WELCOME_POST;

						//toggling CREATE_NEW_PERSON mode
						bg.mode = bg.BabyTrackMode.CREATE_NEW_PERSON;

						var $welcome_guide_block = $("#welcome_guide_block");
						
						$welcome_guide_block.fadeOut(500, function(){
								
						   		$("#create_person_block").fadeIn(400);

						});
						//--
			}
		});

		$("#choose_person  .add_person_button").click(function(){

					addPersonButtonPressed = true;

					bg.previousWindow = bg.BabyTrackWindows.CHOOSE_EXISTED_PERSON;
					bg.mode = bg.BabyTrackMode.CREATE_NEW_PERSON;

					clearWindows({effect: "fadeOut", speed: 500});
					var timer = setInterval(function(){
						if(bg.windowsAnimationOver){
							$("#create_person_block").fadeIn(400);
							clearInterval(timer);
						}
					}, 10);

					//clear all the fields in Create New Person Window
					$("#create_person_block  input#person_nickname").val("");
					$("#create_person_block  input#person_birthday").val("");
					$("#create_person_block  .avatar.selected").toggleClass("selected unselected");
					var color = $("#create_person_block  div#palette_field")[0];     				//in processing... not supported yet

		});

	});

})(jQuery)