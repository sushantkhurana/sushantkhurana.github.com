$(document).ready(function(){

	/*Uniform form elements*/
	// $("input:checkbox, input:radio").uniform({
	// 	useID: false
		
	// }); 
	
	/* To add the active class to notifications icon if the box is in expanded state */
	if($(".notifications-container").hasClass("more")) {
		$(".user-notifications").addClass("active");
		//$(".user-settings").removeClass("active");
	}
	else if($(".notifications-container").hasClass("less")) {
		$(".user-notifications").removeClass("active");
		//$(".user-settings").addClass("active");
	}

  	/* Hack to keep the dropdown menu open at all times */
  	$("#org-search-div").live("click", function(){
  		$(this).parents(".dropdown").addClass("open");
  	});

  	/* Add a hidden input field so that the form is submittable */
  	$(".org-list-item").click(function(){
  		var inputVar = $("<input type=hidden name=proxy_org__proxy_org />");
  		inputVar.val($(this).attr('id'));
  		$("#form_proxy_org").append(inputVar).submit();
  		return false;
  	});

  	$("#org-search-div").live("keyup", function(){
  		var keyword = $(this).val().toLowerCase();
  		if(keyword.length == 0){
  			$("#organisation-list li").removeClass("hide");
  		}
  		if(keyword.length > 0){
  			$("#organisation-list li").addClass("hide");
		  	$("#organisation-list li a[data-content*='"+keyword+"']").each(function(){
		  		$(this).parent().removeClass("hide");
		  	});
  		}
  	});

    /* highlight default collapse item in the menu */
    var $init;
    $init = $(".accordion-body .sel");
    $init.parent().addClass("list-item-selected");
    $init = $init.parents("div.accordion-body");
    $init.addClass("in");
    $init.parent().addClass("accordion-group-active");
    $init.prev().addClass("accordion-heading-active");

    /* Install classes on accordion elements upon toggle */
	$(".accordion-toggle").click(function(){
	    
	    if ($(this).parent().hasClass("accordion-heading-active")) {
	        //User clicked active item, so remove the classes
	        $(this).parent().toggleClass("accordion-heading-active");
	        $(this).parents(".accordion-group").toggleClass("accordion-group-active");
	    } else {
	        //User clicked inactive item, remove from everything then add to this one
	        $(".accordion-heading").removeClass("accordion-heading-active");
	        $(".accordion-heading").parents(".accordion-group").removeClass("accordion-group-active");
	        $(this).parent().toggleClass("accordion-heading-active");
	        $(this).parents(".accordion-group").toggleClass("accordion-group-active");                
	    }		
	});

	/* To make the accordion-height dynamic */
	$(".dataTables_length select").on("change", function(){
		$(this).parents(".accordion-body").css("height", "auto");
	});

	/* To make the <small> element lie on the right side of the input element in form */	
	/*var smalls = function(){
		return $("table#box-table-a input:not(input[type=file])").siblings("small");
	}(), smallContent;
	smalls.parent().addClass("relative");
	smalls.addClass("form-absolute-right").wrapInner("<span class='bubble'>");

	//Hide the <small> by default. 
	smalls.addClass("hide");*/

	/* Show the <small> upon focus.	*/
	$("td.relative input").focus(function(){
		$(this).parent().find("small").removeClass("hide");
	});

	/* Hide the <small> upon blur.	*/
	$("td.relative input").blur(function(){
		$(this).parent().find("small").addClass("hide");
	});

	/* for File Input type, can't show it in immediate right because of browse button in Firefox */

	var fileSmalls = function(){
		return $("table#box-table-a input[type=file], table#box-table-a input[type=radio]").siblings("small");
	}();
	fileSmalls.prepend("<br />");


	/* To show the search results */
	$("#list-search").keyup(function(){
		$this = $(this);
		var list = $("#search-result ul");
		var toSearch = $this.val().toLowerCase();
		if(toSearch.length > 0) {
			list.empty();
			var results = $("#sidebar a[id*='" + toSearch + "']");
			var length = results.length, displayed = 0, toShow = 10;
			if(length > 10){
				list.prepend("<h5 class='margin-10'>10+ Results. Refine the search keyword..</h5>");
			}
			$("#sidebar a[id*='" + toSearch + "']").each(function(){
				displayed += 1;
				list.append("<li><a class='tag' href = " + this + ">" + $(this).text() + "</a></li>");
				if(displayed == toShow) {	//just showing 10 results 
					return false;
				}

			});
		} else {
			list.empty();
		}
	});
	
  	/* Hide the flash message after few seconds if its shown by default */
  	if( $(".flash_message").html() != null && $(".flash_message").html().length != 0){
  		// Some notification content is there
 		$(".flash_message").removeClass("hide");
  		setTimeout(function(){
  			$(".flash_message").fadeOut("slow");
  		}, 12000);
  	}
	
  	/* Hide the flash message after few seconds if its shown by default */
  	if( $("#flash_message").html() != null && $("#flash_message").html().length != 0){
  		// Some notification content is there
 		$("#flash_message").removeClass("hide");
  		setTimeout(function(){
  			$("#flash_message").fadeOut("slow");
  		}, 8000);
  	}

	$(".user-links a").tooltip({
		"placement" : "bottom"
	});
	
	$("#sidebar a").tooltip({
		"placement" : "right"
	});

	$("a#make-fav").tooltip({
		"placement" : "top"
	});

	$("#end_date").datepicker({
		yearRange: '-50:+05',
		showOn: 'both', 
		buttonImage: '/images/calendar-icon.gif', 
		buttonImageOnly: true,
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		minDate:1
	});
	
	$("#make-fav").live('click', function(){
		
		$(this).find("i").toggleClass("icon-star-empty icon-star");
		changeFavouriteForAudienceGroup( $(this).attr('group_id') );
		var campaign_id = $('#campaign_id').val();
			
		if( $('#favourites').find("i").hasClass('icon-star') ){
			$('.wait_message').show().addClass('indicator_1');
			oTable.fnReloadAjax('/xaja/AjaxService/campaign/audience.json?campaign_id='+campaign_id+'&favourite=1');
		}
	});
	
	function seasonSale() {
		$("#season-sale-popup").toggle();
		$("#season-sale").toggle();
		$('#campaign-name').val($('#cmp_name').html());
	}
	
	$("#season-sale").live('click', function(){
		$('#error').removeClass('show').addClass('hide');
		seasonSale();
	});

	$("#cancel-campaign").click(function(){
		$("#season-sale-popup").toggle();
		$("#season-sale").toggle();
	});
	
	$("#edit_date").click(function(){

		var start_date = $('#from_date').html();
		var end_date = $('#to_date').html();
		
		$('#edit_date').removeClass('span3 show').addClass('hide');
		$('#show_edit').removeClass('hide').addClass('span3 show');
        $('#start_date').val( start_date );
		$('#end_date').val( end_date );

		
	});
	
	$('#cancel_date').click(function(){
		$('#error').removeClass('show').addClass('hide');
		$('#show_edit').removeClass('span3 show').addClass('hide');
		$('#edit_date').removeClass('hide').addClass('span3');
	});

	if($(".welcome-info").length != 0) {
		$(".welcome-info").parents(".accordion-setup-inner").addClass("white-grey-gradient").find(".inner-right").removeClass("white-grey-gradient");
	}
	
	/* Open the first panel of accordion open by default */
	var accordion_list = $(".prime-content .accordion-body");
	accordion_list.first().addClass("in");
	

    /* highlight default collapse item in the prime-content area */
    var $init;
    $init = $(".accordion-body.in");
    $init.parent().addClass("accordion-group-active");
    $init.prev().addClass("accordion-heading-active");

	/* To add classes to top-level navigation to render images */
	var tabs = $(".c-menu-li a");
	tabs.each(function(){
		if($(this).attr('href').toLowerCase().indexOf("businessprocess") >=0 ){
			$(this).addClass("workbench");
		}
		if($(this).attr('href').toLowerCase().indexOf("campaign") >=0 ){
			$(this).addClass("campaign");
			$(this).attr("id","campaign");
		}
		if($(this).attr('href').toLowerCase().indexOf("orgadmin") >=0 ){
			$(this).addClass("orgadmin");	
		}
		if($(this).attr('href').toLowerCase().indexOf("reports") >=0 ){
			$(this).addClass("reports");
		}
		if($(this).attr('href').toLowerCase().indexOf("mobile") >=0 ){
			$(this).addClass("navmobile");
		}					
		if($(this).attr('href').toLowerCase().indexOf("conquest") >=0 ){
			$(this).addClass("conquest");
		}
	});

	/* TO open the notifications container upon click of Notifications icon at the top*/
	if(window.location.href.indexOf("toggleNotif") > 0) {
		toggleNameAndContainer();
		getNoficationsAjax();			
	}

	var url = window.location.pathname;
	var module = url.split('/');
	module = module[1];
	
	$(".user-notifications").click(function(){
		if( module == 'org' ){
			if(window.location.href.indexOf("/org/index")>0){
				toggleNameAndContainer();
				getNoficationsAjax();
			}
			else {
				window.location.href = "/org/index?toggleNotif";
			}
		}
		else{
			if( module == 'businessProcesses' ){
				if(window.location.href.indexOf("/businessProcesses/index")>0){
					toggleNameAndContainerWorkbench();
					getNoficationsAjax();
				}
				else {
					window.location.href = "/businessProcesses/index?toggleNotif";
				}
			}
		}
	});
});

function toggleOnOff( id ){
	
	var on_off = $('.'+id.id).val();
	
	if( on_off == "1" )
		$('.'+id.id).val(0);
	else
		$('.'+id.id).val(1);
}

//****************************Mobile/Email check related functions********************************

// hides all mobile check fields
function hideCheckMobile( form ){
	
	$('#error_msg_mobile_no').remove();
	$('#'+form.id+'__verify_admin_mobile').removeClass('show').addClass('hide');
}

//check for mobile availability
function verifyAdminMobile( form , user ){
	var num = $('#'+form.id+'__mobile').val();
	var default_num = $('#'+form.id+'__admin_default_mobile').val();
	$('#'+form.id+'__admin_mobile_pin').css('display','none');
	$('#'+form.id+'__confirm_admin_mobile').removeClass('show').addClass('hide');
	
	//mobile number "1111111" is always validated.
	if( num == 1111111 ){
		$('#'+form.id+'__mobile_validated').val('1');
		return true;
	}else if( num == default_num && $('#'+form.id+'__old_mobile_validated').val() == 1 ){
		$('#'+form.id+'__mobile_validated').val('1');
		return true;
	}
	var sent_mobile = $('#'+form.id+'__sent_pin_mobile').val();
	if( sent_mobile == num && num != '' ){
		if( $('#'+form.id+'__mobile_validated').val() == 0 ){
			$('#'+form.id+'__admin_mobile_pin').css('display','inline');
			$('#'+form.id+'__confirm_admin_mobile').removeClass('hide').addClass('show');
		}
		return true;
	}else{
		$('#'+form.id+'__mobile_validated').val('0');
		$('#error_msg_mobile_no').remove();
		$('#verify-msg').remove();
		var reg = new RegExp('^[0-9]{10,13}$');
		var prefix = $('#'+form.id+'__prefix').val();

		if( reg.test(num) ){
			var ajaxUrl = prefix+'/xaja/AjaxService/org/mobile_availability.json?ajax_params_1='+num+'&ajax_params_2='+user;
			$('.wait_message').show().addClass('indicator_1');
			$.post( ajaxUrl , 
					function(data) {
							if( data.info == 'success'){
								$('.indicator_1').hide();
								$('#'+form.id+'__verify_admin_mobile').removeClass('hide').addClass('show');
							}else{
								$('.wait_message').removeClass('indicator_1');
								$('#'+form.id+'__verify_admin_mobile').before('<span id="error_msg_mobile_no" class="error_msg_admin">'+data.error+'</span>');
							}
						}, "json" );
		}else{
			if( num != '' ){
				$('.flash_message').addClass('redError').show().html('Invalid mobile number');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
			}
		}
	}
}

function checkSessionExpiry( data ){
	console.log(data);
	if( data.session_expired == true ){
		
		window.location.href= data.session_expired_redirect_uri + "?flash=" + data.session_expired_redirect_msg;
	}
}

//send verification pin through sms
function verifyAdminMobileNumber( form , user ){
	
	var num = $('#'+form.id+'__mobile').val();
	var prefix = $('#'+form.id+'__prefix').val();
	var sent_mobile = $('#'+form.id+'__sent_pin_mobile').val();
	if( sent_mobile == num ){
		$('#'+form.id+'__verify_admin_mobile').removeClass('show').addClass('hide');
		$('#'+form.id+'__admin_mobile_pin').css('display','inline');
		$('#'+form.id+'__confirm_admin_mobile').removeClass('hide').addClass('show');
		return true;
	}else{
		var ajaxUrl = prefix + '/xaja/AjaxService/org/process_mobile.json?ajax_params_1='+num+'&ajax_params_2='+user;
		$('.wait_message').show().addClass('indicator_1');

		$.getJSON( ajaxUrl,
			function(data) {
				if( data.info == 'success' ){
					$('.indicator_1').hide();
					$('#'+form.id+'__verify_admin_mobile').removeClass('show').addClass('hide');
					$('#'+form.id+'__admin_mobile_pin').css('display','inline');
					$('#'+form.id+'__confirm_admin_mobile').removeClass('hide').addClass('show');
					$('#'+form.id+'__sent_pin_mobile').val(num);
					return true;
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}
			});
	}
}

//confirm verification pin
function confirmMobileMsg( form , user ){

	var pin = $('#'+form.id+'__admin_mobile_pin').val();
	if(pin == ''){
		$('.flash_message').addClass('redError').show().html('Error: Please enter verification code');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	}else{
		var mobile = $("#"+form.id+'__mobile').val();
		var prefix = $('#'+form.id+'__prefix').val();
		var ajaxUrl = prefix+'/xaja/AjaxService/org/confirm_mobile.json?ajax_params_1='+pin+'&ajax_params_2='+mobile+'&ajax_params_3='+user;;
		$('.wait_message').show().addClass('indicator_1');
	
		$.getJSON( ajaxUrl,
				function(data) {
					if( data.info == 'success' ){
						$('.indicator_1').hide();
						$('#'+form.id+'__mobile').after('<span id="verify-msg" class="verify-msg-admin">Mobile number verified</span>');
						$('#'+form.id+'__admin_mobile_pin').val('');
						$('#'+form.id+'__admin_mobile_pin').css('display','none');
						$('#'+form.id+'__confirm_admin_mobile').removeClass('show').addClass('hide');
						$('#'+form.id+'__mobile_validated').val('1');
						if( user == -1 )
							$('#'+form.id+'__admin_default_mobile').val(mobile);
						return true;
					}else{
						$('.wait_message').removeClass('indicator_1');
						$('.flash_message').addClass('redError').show().html('Error: Mobile could not be verified');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						$('#'+form.id+'__admin_mobile_pin').val('');
					}
				});
	}
}

/*function hideCheckEmail( form ){
	$('#error_msg_email').remove();
	$('#'+form.id+'__verify_admin_email').removeClass('show').addClass('hide');
}

//check for email availability
function verifyAdminEmail( form , user ){
	var email = $('#'+form.id+'__email').val();
	var default_email = $('#'+form.id+'__admin_default_email').val();
	$('#'+form.id+'__admin_email_pin').css('display','none');
	$('#'+form.id+'__confirm_admin_email').removeClass('show').addClass('hide');
	
//	if( email == 'test@capillarytech.com' ){$('#'+form.id+'__email_validated').val('1');return true;}
	if( email == default_email && $('#'+form.id+'__old_email_validated').val() == 1 ){
		$('#'+form.id+'__email_validated').val('1');
		return true;
	}
	var sent_email = $('#'+form.id+'__sent_pin_email').val();
	if( sent_email == email && email != '' ){
		if( $('#'+form.id+'__email_validated').val() == 0 ){
			$('#'+form.id+'__admin_email_pin').css('display','inline');
			$('#'+form.id+'__confirm_admin_email').removeClass('hide').addClass('show');
		}
		return true;
	}else{
		$('#'+form.id+'__email_validated').val('0');
		$('#error_msg_email').remove();
		$('#verify-email').remove();
		var prefix = $('#'+form.id+'__prefix').val();
		var reg = /^([a-zA-Z0-9-_+.])+@([a-zA-Z0-9-_.])+\.([a-zA-Z]{2,})$/;
	
		if( reg.test(email) == true ){
			var ajaxUrl = prefix+'/xaja/AjaxService/org/email_availability.json?ajax_params_1='+email+'&ajax_params_2='+user;
			$('.wait_message').show().addClass('indicator_1');
			$.post( ajaxUrl , 
					function(data) {
							if( data.info == 'success'){
								$('.indicator_1').hide();	
								$('#'+form.id+'__verify_admin_email').removeClass('hide').addClass('show');
							}else{
								$('.wait_message').removeClass('indicator_1');
								$('#'+form.id+'__verify_admin_email').before('<span id="error_msg_email" class="error_msg_admin">'+data.error+'</span>');
							}
						}, "json" );
		}
	}
}

function verifyAdminEmailAddr( form , user ){
	
	var email = $('#'+form.id+'__email').val();
	var prefix = $('#'+form.id+'__prefix').val();
	var sent_email = $('#'+form.id+'__sent_pin_email').val();
	if( sent_email == email ){
		$('#'+form.id+'__verify_admin_email').removeClass('show').addClass('hide');
		$('#'+form.id+'__admin_email_pin').css('display','inline');
		$('#'+form.id+'__confirm_admin_email').removeClass('hide').addClass('show');
		return true;
	}else{
		var ajaxUrl = prefix + '/xaja/AjaxService/org/process_email.json?ajax_params_1='+encodeURIComponent(email)+'&ajax_params_2='+user;;
		$('.wait_message').show().addClass('indicator_1');
	
		$.getJSON( ajaxUrl,
			function(data) {
				if( data.info == 'success' ){
					$('.indicator_1').hide();
					$('#'+form.id+'__verify_admin_email').removeClass('show').addClass('hide');
					$('#'+form.id+'__admin_email_pin').css('display','inline');
					$('#'+form.id+'__confirm_admin_email').removeClass('hide').addClass('show');
					$('#'+form.id+'__sent_pin_email').val(email);
					return true;
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}
			});
	}
}

function confirmEmailMsg( form , user ){
	
	var pin = $('#'+form.id+'__admin_email_pin').val();
	if(pin == ''){
		$('.flash_message').addClass('redError').show().html('Error: Please enter verification code');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	}else{
		var email = $('#'+form.id+'__email').val();
		var prefix = $('#'+form.id+'__prefix').val();
		var ajaxUrl = prefix + '/xaja/AjaxService/org/confirm_email.json?ajax_params_1='+pin+'&ajax_params_2='+email+'&ajax_params_3='+user;
		$('.wait_message').show().addClass('indicator_1');
		
		$.getJSON( ajaxUrl,
				function(data) {
					if( data.info == 'success' ){
						$('.indicator_1').hide();
						$('#'+form.id+'__email').after('<span id="verify-email" class="verify-msg-admin">Email id verified</span>');
						$('#'+form.id+'__admin_email_pin').css('display','none');
						$('#'+form.id+'__admin_email_pin').val('');
						$('#'+form.id+'__confirm_admin_email').removeClass('show').addClass('hide');
						$('#'+form.id+'__email_validated').val('1');
						if( user == -1 )
							$('#'+form.id+'__admin_default_email').val(email);
						return true;
					}else{
						$('.wait_message').removeClass('indicator_1');
						$('.flash_message').addClass('redError').show().html('Error: Email could not be verified');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						$('#'+form.id+'__admin_email_pin').val('');
					}
				});
	}
}*/

$('.entrdusrmailaddr').live( 'focus' , function(){
	$('.mailaddrlnkvrfy').remove();
	$('#email-error-msg').remove();
});

$('.entrdusrmailaddr').live('blur',function(){
	
	var email=$(this).val();
	var form = $(this).closest('form').attr('id');
	if( ( $('#'+form+'__email_validated').val() == 1 ) && ( $('#'+form+'__email_default').val() == email ) ) 
		return true;
	
	if( $(this).attr('readonly') == 'readonly' )
		return true;
		
	var prefix=$('#prefix').val();
	var email=$(this).val();
	var usr=$(this).attr('ref_id');
	var reg = /^([a-zA-Z0-9-_+.])+@([a-zA-Z0-9-_.])+\.([a-zA-Z]{2,})$/;
	$('#email-error-msg').remove();
	$('.verify-email-msg').remove();
	
	if( reg.test(email) == true ){
		var ajaxUrl = prefix+'/xaja/AjaxService/org/email_availability.json?ajax_params_1='+email+'&ajax_params_2='+usr;
		$('.wait_message').show().addClass('indicator_1');
		$.getJSON( ajaxUrl,
			function(data) {
				if( data.info == 'success'){
					
					if( data.valid == 'validated' ){
						$('.wait_message').removeClass('indicator_1');
						$('#email-error-msg').remove();
						var msg = '<span class="verify-email-msg" style="margin-left: 25%;">Email already verified</span>';
						$('.entrdusrmailaddr').parent('li').after(msg);
						$('#'+form+'__email_validated').val(1);
						$('#'+form+'__email_default').val(email);
					}else{
						$('#email-error-msg').remove();
						$('.entrdusrmailaddr').parent('li').after('<a class="btn1 btn-warning btn-verify mailaddrlnkvrfy">Verify Now</a>');
					}
					$('.indicator_1').hide();
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.mailaddrlnkvrfy').removeClass('hide').addClass('show');
					$('#email-error-msg').remove();
					$('.entrdusrmailaddr').parent('li').after('<span id="email-error-msg">'+data.error+'</span>');
				}
			});
	}
});

$('.mailaddrlnkvrfy').live('click',function(){
	
	var prefix=$('#prefix').val();
	var email = encodeURIComponent( $('.entrdusrmailaddr').val() );
	var ajaxUrl = prefix+'/xaja/AjaxService/org/process_email.json?ajax_params_1='+email;
	var form = $(this).closest('form').attr('id');
	$('#'+form+'__email_validated').val(0);

	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info == 'success' ){
				$('.mailaddrlnkvrfy').addClass('hide');
				$('.entrdusrmailaddr').attr('readonly','readonly');
				$('.target_loader').removeClass('hide').addClass('show');
				$('.flash_message').removeClass('redError')
				$('.flash_message').show().html(data.status);
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 15000);
				var form_name = $('.mailaddrlnkvrfy').closest('form').attr('id');
				setTimeout( checkEmailStatus , 10000 );
			}else{
				$('.flash_message').addClass('redError').show().html(data.error);
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
			}
	});
});

function checkEmailStatus(){
	
	var prefix = $('#prefix').val();
	var form = $('.mailaddrlnkvrfy').closest('form').attr('id');
	var email = $('.entrdusrmailaddr').val();
	var encoded = encodeURIComponent(email);
	var ajaxCheck = prefix+'/xaja/AjaxService/org/check_email_status.json?ajax_params_1='+encoded;
	
	$.getJSON( ajaxCheck,
			function(data){
				if( data.info == 'success' ){
					$('#'+form+'__email_validated').val(1);
					$('#'+form+'__email_default').val(email);
					$('.target_loader').removeClass('show').addClass('hide');
					$('.verify-email-msg').remove();
					$('.entrdusrmailaddr').parent('li').after('<span class="verify-email-msg">Email id verified</span>');
				}else{
					setTimeout( checkEmailStatus , 10000 );
				}
	});
}
