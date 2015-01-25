(function($, undefined){
	
	bg = chrome.extension.getBackgroundPage();

	function setInitialPage(page){
		switch(page){
			
			case bg.BabyTrackInitialPage.WELCOME_POST:
			
				//Welcome Message appears only when a user got started on using 
				//an app for the 1st time and hadn't posted any notes yet
				$("#welcome_guide_block").css("display", "inline-block");

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

			break;


			case bg.BabyTrackInitialPage.POSTED_RESULTS_TABLE:
			
			break;
	
		}

	}

	$(function(){

		setInitialPage(bg.initialPage);

		$("#bt_search_engine_area > span").last().click(function(){
			$("#bt_search_engine input[name='search_field']").val("");
		});

		$("#add_event_button").click(function(){

			if(bg.initialPage === bg.BabyTrackInitialPage.WELCOME_POST){
					
						//toggling CREATE_NEW_PERSON mode
						bg.mode = bg.BabyTrackMode.CREATE_NEW_PERSON;

						var $welcome_guide_block = $("#welcome_guide_block");

						if ( !$welcome_guide_block.parent().is( "span" ) )
						    $welcome_guide_block.wrap( "<span></span>" );

						$("#bt_container > span")
							.first()
							.fadeOut(500, function(){
								$welcome_guide_block.css("display", "none");
								if ( $welcome_guide_block.parent().is( "span" ) ) 
						   			$welcome_guide_block.unwrap();


						   		$("#create_person_block").fadeIn(400);
							});
					//--
			}
				

		});



	});

})(jQuery)