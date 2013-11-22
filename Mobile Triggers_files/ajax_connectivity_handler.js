$(document).ready(function(){

    $.ajaxSetup({
        error: function(jqXHR, exception) {
        	var msg;
            if (jqXHR.status === 0) {
                //alert('Not connect.\n Verify Network.');
            	//$(".gen-status-tracker-block").removeClass('hide');
            	window.clearTimeout( sec_ticker );
        		window.clearTimeout( main_ticker );
            	checkServerStatus();
            	return;
            } else if (jqXHR.status == 404) {
                //alert('Requested page not found. [404]');
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
            	msg = 'Internal Server Error [500].<br/>Please try again.';
                //alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
            	msg = 'Requested JSON parse failed.';
                //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
            	msg = 'Time out error.';
                //alert('Time out error.');
            } else if (exception === 'abort') {
            	msg = 'Ajax request aborted.';
                //alert('Ajax request aborted.');
            } else {
            	msg = 'Uncaught Error.\n' + jqXHR.responseText;
                //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
            $.blockUI({ message: '<span class="ajax_error">'+msg+'</span>',onOverlayClick: $.unblockUI });
        }
    });

    var TotalSeconds = 0,timer = 0,alive = true,sec_ticker,main_ticker,ping_counter = 1;

    setTimeout( checkServerStatus , 30000 );

    function checkServerStatus(){

			$.ajax({
				url:'/server_ping',
				cache:false,
				timeout:5000,
				success:function(){
					timer = 30;
					if( !alive ){
						$(".gen-status-msg-v1").addClass('hide');
						$(".gen-status-msg-v2").addClass('hide');
						$(".gen-status-msg-block").text("...and, we're back!");
						
						setTimeout( function(){
							$("body").css("overflow", "auto");
							$(".gen-status-tracker-block").addClass('hide');
						} , 2000 );
						//window.location.reload(true);
					}
					window.clearTimeout( sec_ticker );
					window.clearTimeout( main_ticker );
					main_ticker = setTimeout( checkServerStatus , timer*1000 );
				},
				error:function(){
					
					if( ping_counter < 4 ){
						ping_counter = ping_counter+1;
						checkServerStatus();
						return;
					}
					
					ping_counter = 1;
					timer += 30;TotalSeconds = timer;alive = false;

					//if iframe is opened then it will be hidden
					$('#popupiframe').attr( 'src', 'about:blank' );
			        $('#shade').fadeOut(300);
			        $('#popup').fadeOut(300);

					$("body").css("overflow", "hidden");
					$(".gen-status-tracker-block").removeClass('hide');
					$(".gen-status-msg-v1").removeClass('hide');
					$(".gen-status-msg-v2").removeClass('hide');
					window.clearTimeout( sec_ticker );
					secondCounter();
					window.clearTimeout( main_ticker );
					main_ticker = setTimeout( checkServerStatus , timer*1000 );
				}
			});
    }

    function secondCounter() {

    	if (TotalSeconds == 1) {

    		$(".gen-status-msg-block").text("Connecting ... ");
    		window.clearTimeout( sec_ticker );
    		checkServerStatus();
    	}
    	else{
    		TotalSeconds = (TotalSeconds - 1);
    		$(".gen-status-msg-block").text("Connecting in "+TotalSeconds+"s…");
    	}
    	sec_ticker = setTimeout( secondCounter , 1000 );
    }

    $(".gen-status-msg-link").click( function(){

    	window.clearTimeout( sec_ticker );
		window.clearTimeout( main_ticker );
    	checkServerStatus();
    });
});