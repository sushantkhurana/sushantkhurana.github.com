/**
 * @author pv
 * processing form inside accordion
 * @param id
 */
var dragsort;
var junkdrawer;

function processCampaignFilterForm( id ){

	$('.wait_message').show().addClass('indicator_1');
    var filterType = $('#filter_type').val();

    if( filterType=='createFresh' ){

    	$('#audience_filter_form__createFresh__button').trigger('click');
    }

    var postData = $('#audience_filter_form__'+filterType).serialize();
    var ajaxUrl = "/xaja/AjaxService/filter/sigle_step_filter.json?ajax_params_1="+postData+"&ajax_params_2="+filterType;

    //do a post call and then handles the response to redirect to the messages place
    $.post( ajaxUrl , postData ,
                    function(data) {
    	
    	checkSessionExpiry( data );
		if( data.info == 'success' ){

			$('.indicator_1').hide();
			window.location.href=data.url;
		}else{
			$('.wait_message').removeClass('indicator_1');
			$('.flash_message').addClass('redError').show().html('Error: We Were Unable to process your request please try again later');
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
		}

    },'json' );
}

function resetForm( id ){
	var form_data = id.split('__');
	$('#'+form_data[0]+'__'+form_data[1])[0].reset();
}

function validateDateRange( from_date , to_date ){

	var fromDate = $('#'+from_date).val();
    var toDate = $('#'+to_date).val();

    if ( Date.parse(fromDate) > Date.parse(toDate) ){

        $('#'+to_date).val('');
        $('#'+to_date).focus();
        return false;
    }
    return true;
}

/**
 * Process campaign filter form with campaign details
 * @author nayan
 */
function processCampaignFilterFormWithCampaign( id ){

	if( !$('#campaign_create_form').validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
		return false;
	}else{
		var status = validateDateRange('starting_date','ending_date');

		if( !status ){
			$('.flash_message').addClass('redError').show().html('Invalid Date Range Given!');
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
			return false;
		}
	}

	$('.wait_message').show().addClass('indicator_1');

	var filter_data = id.split('__');

	var prefix = $('#prefix').val();
    var filterType = filter_data[1];

    var campaign_name = $('#campaign_name').val();
    var campaign_desc = $('#desc').val();
    var start_date = $('#camp_start_date').val();
    var end_date = $('#camp_end_date').val();
    var org_id = $('#org_id').val();
    
    var postData = $('#audience_filter_form__'+filterType).serialize();
    postData += '&campaign_name='+encodeURIComponent(campaign_name)+'&campaign_desc='+encodeURIComponent(campaign_desc);
    postData += '&start_date='+start_date+'&end_date='+end_date;

    var ajaxUrl = prefix+"/xaja/AjaxService/filter/single_step_campaign_filter.json?ajax_params_1="+postData+"&ajax_params_2="+filterType+"&ajax_params_3="+org_id;

    //do a post call and then handles the response to redirect to the messages place
    $.post( ajaxUrl, postData,function(data) {
    	
    	checkSessionExpiry( data );
		if( data.info == 'success' ){

			$('#campaign_name').val('');
		    $('#desc').val('');
			$('.indicator_1').hide();
			window.location.href=data.url;
		}else{
			$('.wait_message').removeClass('indicator_1');
			var error = 'Error: We Were Unable to process your request please try again later';
			if( data.error != '' )
				error = 'Error: '+data.error;
			$('.flash_message').addClass('redError').show().html(error);
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
		}
    },'json' );
}

/**
 * Process campaign filter form with campaign details
 * @author nayan
 */
function processReferralCampaignCreation( id ){

	if( !$('#campaign_create_form__referral').validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
		return false;
	}else{
		var status = validateDateRange('starting_date','ending_date');

		if( !status ){
			$('.flash_message').addClass('redError').show().html('Invalid Date Range Given!');
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
			return false;
		}
	}

	$('.wait_message').show().addClass('indicator_1');

	var prefix = $('#prefix').val();
    var filterType = 'referral';

    var campaign_name = $('#campaign_name').val();
    var campaign_desc = $('#desc').val();
    var start_date = $('#camp_start_date').val();
    var end_date = $('#camp_end_date').val();

    var postData = 'campaign_name='+encodeURIComponent(campaign_name)+'&campaign_desc='+encodeURIComponent(campaign_desc);
    postData += '&start_date='+start_date+'&end_date='+end_date;

    var ajaxUrl = prefix+"/xaja/AjaxService/filter/single_step_referral_creation.json?ajax_params_1="+postData+"&ajax_params_2="+filterType;

    //do a post call and then handles the response to redirect to the messages place
    $.post( ajaxUrl, postData,function(data) {
    	checkSessionExpiry( data );
		if( data.info == 'success' ){

			$('#campaign_name').val('');
		    $('#desc').val('');
			$('.indicator_1').hide();
			window.location.href=data.url;
		}else{
			$('.wait_message').removeClass('indicator_1');
			var error = 'Error: We Were Unable to process your request please try again later';
			if( data.error != '' )
				error = 'Error: '+data.error;
			$('.flash_message').addClass('redError').show().html(error);
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
		}
    },'json' );
}

function changeFavouriteForAudienceGroup( group_id ){

	var ajaxUrl = '/xaja/AjaxService/campaign/changeFavourite.json?group_id='+group_id;
    //do a post call and then handles the response to redirect to the messages place
	$('.table_campaign_home_css_1_processing').css('display','inline');
    $.post( ajaxUrl, function(data) {
    	checkSessionExpiry( data );
    },'json' );
}

function reloadGroup( campaign_id, group_id, id ){

	var ajaxUrl = '/xaja/AjaxService/filter/reload.json?group_id='+group_id+'&campaign_id='+campaign_id;

	$('#reload__'+group_id).addClass( 'loading' );
	$('#reload__'+group_id).attr( 'onClick', 'return false' );
	$('#reload__'+group_id).attr( 'rel', 'tooltip' );
	$('#reload__'+group_id).attr( 'title', 'Reloading The Group...' );

	var functionCall = 'reloadGroup( '+campaign_id+ ', '+group_id+' );'
    //do a post call and then handles the response to redirect to the messages place
    $.getJSON( ajaxUrl, function(data) {

    	checkSessionExpiry( data );
    	
    	$('#reload__'+group_id).removeClass( 'loading' );
    	$('#reload__'+group_id).attr( 'onClick', functionCall );
    	$('#reload__'+group_id).attr( 'rel', '' );
    	$('#reload__'+group_id).attr( 'title', '' );

    	if( data.success == 'FAILURE' ){

    		$('.flash_message').addClass('redError').html( data.info ).show();
    		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
    	}else{

    		oTable.fnReloadAjax('/xaja/AjaxService/campaign/audience.json?campaign_id='+campaign_id+'&favourite=0')
    		$('.flash_message').removeClass('redError').html( data.info ).show();
    		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
    	}
    } );
}

function downloadGroup( campaign_id, group_id, id ){

	var ajaxUrl = '/xaja/AjaxService/filter/download.json?group_id='+group_id+'&campaign_id='+campaign_id;

	$('#download__'+group_id).addClass( 'loading' );
	$('#download__'+group_id).attr( 'onClick', 'return false' );
	$('#download__'+group_id).attr( 'rel', 'tooltip' );
	$('#download__'+group_id).attr( 'title', 'Requesting For Group Download...' );

	var functionCall = 'downloadGroup( '+campaign_id+ ', '+group_id+' );'
    //do a post call and then handles the response to redirect to the messages place
    $.getJSON( ajaxUrl, function(data) {

    	checkSessionExpiry( data );
    	$('#download__'+group_id).removeClass( 'loading' );
    	$('#download__'+group_id).attr( 'onClick', functionCall );
    	$('#download__'+group_id).attr( 'rel', '' );
    	$('#download__'+group_id).attr( 'title', '' );

    	if( data.success == 'FAILURE' ){

    		$('.flash_message').addClass('redError').html( data.info ).show();
    		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
    	}else{
    		$('.flash_message').html( data.info ).show();
    		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
    	}
    } );
}

/**
 * Renew Bulk SMS Credit action show hide
 */
function renewCredit(){

	if( $('.buy_more_shown').hasClass('submit_credit') ){
		console.log($('#sms_credit_value').val());
		renewBulkCredit();
	}else{
		$('.sms_credit_shown').css('display','none');
		$('.sms_credit_hidden').removeClass('hide').addClass('show');
		$('.buy_more_shown').addClass('submit_credit');
		$('#cancel_button').removeClass('hide').addClass('show');

		$('#error1').css('display','none');
		$('.buy_more_shown').attr('value' , 'Buy');
	}
	$('#sms_credit_value').val('');
	$('#email_credit_Value').val('');
}

/**
 * show hode cancel buttin for the bulk sms credit update.
 */
$('#cancel_button').live('click',function(){


	$('.sms_credit_hidden').removeClass('show').addClass('hide');
	$('#cancel_button').removeClass('show').addClass('hide');
	$('.sms_credit_shown').show();
	$('.buy_more_shown').removeClass('submit_credit');
	$('#error1').css('display','none');
	$('.buy_more_shown').attr('value' , 'Buy More');
});

/**
 * opneing model for campaign creation.
 * @param id
 */
function openModal( id ){

	$('#campaign_form__camp_type').val(id);
	$('#myModal').modal('show');
}

/**
 * hide renew credit.
 */
function hideCredit(){
	$('#credit').removeClass('show').addClass('hide');
}

/**
 * renew credit processing.
 * @returns {Boolean}
 */
function renewBulkCredit(){

	var credit = $('#sms_credit_value').val();
	var email = $('#email_credit_Value').val();

	$('#error1').css('display','none');

	console.log('inside renew Credit :'+credit);

	//checking for null
	if( credit == "" ){
		$('#error1').css('display','inline');
		$('#error1').html('Please enter sms credits value !');
		return false;
	}

	//checking for is number or not
	if( isNaN( credit ) || isNaN( email ) ){
		$('#error1').css('display','inline');
		$('#error1').html('Specify integral values for credits !');
		return false;
	}
	 //checking for negative number
	if( credit < 0 || email < 0 ){
		$('#error1').css('display','inline');
		$('#error1').html('Specify integral values for credits !');
        return false;
	}

	if( Math.ceil(credit) != Math.floor(credit) ){
		$('#error1').css('display','inline');
		$('#error1').html('Specify integral values for SMS credits !');
        return false;
	}

	if( Math.ceil(email) != Math.floor(email) ){
		$('#error1').css('display','inline');
		$('#error1').html('Specify integral values for Email credits !');
        return false;
	}

	var prefix = $('#prefix').val();
	var ajaxUrl = prefix+"/xaja/AjaxService/campaign/renew_credit.json?sms_credit="+credit+"&email_credit="+email;

	var updated_credit = parseInt($('#old_sms_credit').val()) + parseInt(credit);

	$.getJSON( ajaxUrl ,
			function(data) {

				checkSessionExpiry( data );
				if( data.info == 'success' ){
					//$('#new_sms_credit').html( credit );
					//$('#old_sms_credit').val( credit );
					$('.sms_credit_shown').css('display','inline');
					$('.sms_credit_hidden').removeClass('show').addClass('hide');
					$('.buy_more_shown').removeClass('submit_credit');
					$('#cancel_button').removeClass('show').addClass('hide');

					$('.buy_more_shown').attr('value' , 'Buy More');
					$('.flash_message').html('Request email has been sent to the concerned authority successfully.');
					$('.flash_message').css('display','inline');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}else{
					$('#loading').removeClass('show').addClass('hide');
					$('#error1').html(data.message);
					$('#error1').css('display','inline');
					setTimeout(function(){ $('#error1').css('display','none'); }, 5000);
				}
			});
}

/**
 * updating campaing name.
 */
function updateCampaign(){

	var c_name = $('#campaign-name').val();
	var c_id = $('#campaign_id').val();
	var prefix = $('#prefix').val();

	$("#season-sale-popup").toggle();
	$("#season-sale").toggle();

	var ajaxUrl = prefix+"/xaja/AjaxService/campaign/update_campaign.json?ajax_params_1="+c_name+"&ajax_params_2="+c_id;
	$.getJSON( ajaxUrl ,
			function(data) {

				checkSessionExpiry( data );
				if( data.info == 'SUCCESS' ){
					$('#season-sale').html(c_name+'<i class="icon-edit"></i>');
					$('#cmp_name').html(c_name);
				}else{
					$("#season-sale-popup").toggle();
				    $("#season-sale").toggle();
					$('#campaign-name').select();
					$('.flash_message').html('Campaign Name Already Exists' );
					$('.flash_message').css('display','inline');
				}
			});
}

/**
 * update campaig date
 * @returns {Boolean}
 */
function updateCampaignDate(){

	var cmp_name = $('#campaign-name').val();
	var c_id = $('#campaign_id').val();
	var start = $('#start_date').val();
	var end = $('#end_date').val();
	var prefix = $('#prefix').val();

	var d1 = new Date( start );
	var d2 = new Date( end );

	$('#show_edit').removeClass('hide').addClass('span3 show');
	$('#edit_date').removeClass('span3').addClass('hide');

	var ajaxUrl = prefix+"/xaja/AjaxService/campaign/update_campaign_date.json?ajax_params_1="+c_id+"&ajax_params_2="+start+"&ajax_params_3="+end;
	$('#edit_date_loading').removeClass('hide').addClass('show');
	$('#edit_date').removeClass('show').addClass('hide');

	$.getJSON( ajaxUrl ,
			function(data) {

				checkSessionExpiry( data );
				if( data.info == 'SUCCESS' ){
					$('#show_edit').removeClass('span3 show').addClass('hide');
					$('#edit_date').removeClass('hide').addClass('span3');
					$('#from_date').html( start );
					$('#to_date').html( end );
				}else{
					$('#error').removeClass('hide').addClass('show');
				}

			});
}

/**
 * Process the selected template for the edit message step
 */
function processSelectMessage(){

	$('.flash_message').hide();

	var btn_text = $('#select_msg_btn').html();
	var prefix = $('#prefix').val();
	var campaign_id = $('#campaign_id').val();
	var message_id = $('#message_id').val();
	
	var html = $('#model_template_preview').html();
	
	//$('#model_template_preview').html( decodeURIComponent($('#model_template_preview').html()) );

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_select_msg.json';

	$('#select_msg_btn').html(' Loading... ');
	$('.wait_message').show().addClass('indicator_1');

	$.post(ajaxUrl ,{'campaign_id':campaign_id, 'message_id':message_id,'template_html':html},
			function(data){
				if( data.info ){

					checkSessionExpiry( data );
					if( message_id != '' ){

						$('#edit_msg__widget').html('');
						$('#delivery_msg__widget').html('');
						$('#review_msg__widget').html('');
					}

					$('#select_msg__widget').hide();

					$('.msg_menu a').each(function(){
						if( $(this).hasClass('active') ){
							$(this).removeClass('active');
						}
					});

					$('#edit_msg').addClass('active');
					$('#edit_msg__widget').show().html( data.info );
					$('.indicator_1').hide();
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.flash_message').addClass('redError').show().html(data.error);
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}
				$('#select_msg_btn').html(btn_text);
			},'json');
}

/**
 * processing edit message action.
 */
function processEditMessage( form ){
	
	$('.flash_message').hide();

	var btn_text = $('#edit_msg_btn').html();

	var prefix = $('#prefix').val();
	var subject = $('#'+form.id+'__msg_subject').val();
	var campaign_id = $('#campaign_id').val();
	var message_id = $('#message_id').val();
	
	var editor_mode = CKEDITOR.instances.edit_template.mode;
	
	if( editor_mode != 'wysiwyg' ){
		$('.flash_message').addClass('redError').show().html( 'You are viewing the source. Please switch to template view to proceed.' );
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 3000);
		return false;
	}
	
	$('.subject-help').css('display','none');
	
	if( subject == "" ){
		$('#'+form.id+'__msg_subject').focus();
		$('.subject-help').css('color','red');
		setTimeout(function(){ $('.subject-help').css('color',''); }, 5000);
		return false;
	}
	
	var word_count = subject.trim().split(' ');
	if( word_count.length > 12 ){
		$('#'+form.id+'__msg_subject').focus();
		$('.flash_message').addClass('redError').show().html('Subject should be less than 12 words to avoid spam');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
		return false;
	}

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_edit_message.json?campaign_id='+campaign_id+'&message_id='+message_id;

	//var html = FCKeditorAPI.GetInstance('edit_template').GetData();
	var html = CKEDITOR.instances.edit_template.getData();

	$('.wait_message').show().addClass('indicator_1');
	$('#edit_msg_btn').html(' Loading... ');

	$.post(ajaxUrl ,{'html_content':encodeURIComponent(html) , 'subject':encodeURIComponent(subject)},
					function(data){

						checkSessionExpiry( data );
						if( data.info ){

							$('#edit_msg__widget').hide();

							$('.msg_menu a').each(function(){
								if( $(this).hasClass('active') ){
									$(this).removeClass('active');
								}
							});

							$('#delivery_msg').addClass('active');
							$('#delivery_msg__widget').show().html(data.info);
							$('#delivery__camp_group').trigger('change');
							$('.indicator_1').hide();
						}else{
							$('.flash_message').addClass('redError').show().html( data.error );
							setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 4000);
							$('.wait_message').removeClass('indicator_1');
						}
						$('#edit_msg_btn').html( btn_text );
				},'json');
	return false;
}

/**
 * Getting spam score for the email template selected
 */
function getSpamStatus(){

	var btn_text = $('#spam_checker').html();
	var prefix = $('#prefix').val();
	//var html = FCKeditorAPI.GetInstance('edit_template').GetData();
	var html = CKEDITOR.instances.edit_template.getData();
	html = html.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
	var subject = $('#edit_message__msg_subject').val();
	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/spam_status.json';

	$('#spam_checker').html(' Processing... ');
	$('#spam_checker').addClass( 'loading' );
	$('#spam_checker').attr( 'onClick', 'return false' );
	$('#spam_checker').attr( 'rel', 'tooltip' );
	$('#spam_checker').attr( 'title', 'Processing Spam Checker...' );

	$('#spam_score__widget').html( '' );

	$.post(ajaxUrl , { 'html_content' : html , 'subject' : encodeURIComponent(subject) } ,
				function(data) {

		checkSessionExpiry( data );
		if( data.score ){

			var score = data.score;
			var percentage = (score * 10);
			$('.bar').css('width', percentage + '%');
			$('.bar').html(percentage + '%');

			$('#spam_score__widget').html( decodeURIComponent(data.spam_html) );
			$('#spamModal').modal('show');
		}

		$('#spam_checker').html(btn_text);
		$('#spam_checker').removeClass( 'loading' );
		$('#spam_checker').attr( 'onClick', 'getSpamStatus();' );
		$('#spam_checker').attr( 'rel', '' );
		$('#spam_checker').attr( 'title', '' );

	},'json');
}

function processReview(){

	var id = $('#delivery__camp_group').val();
	var email_count = $('#email_help_value_'+id).attr('email_address');

	if( email_count <= 0 ){

		$('.flash_message').addClass('redError').show().html( 'Selected list has no email addresses!');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
		return false;
	}else
		$('#checkListModal').modal('show');

}
function processReviewProceed(){

	var id = $('#delivery__camp_group').val();
	var email_count = $('#email_help_value_'+id).attr('email_address');
	if( email_count <= 0 ){

		$('.flash_message').addClass('redError').show().html( 'Selected list has no email addresses!');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
		return false;
	}

	$('#checkListModal').modal('hide');
	$('.flash_message').hide();

	var btn_text = $('#delivery__review_send_btn').html();

	var prefix = $('#prefix').val();

	var subject = $('#edit_message__msg_subject').val();
	//var html = FCKeditorAPI.GetInstance('edit_template').GetData();
	var html = CKEDITOR.instances.edit_template.getData();

	var post_data = $('#delivery').serialize();

	var campaign_id = $('#campaign_id').val();
	var message_id = $('#message_id').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_review.json?campaign_id='+campaign_id+'&message_id='+message_id;
	$('.wait_message').show().addClass('indicator_1');
	$('#delivery__review_send_btn').html(' Loading... ');

	$.post(ajaxUrl, post_data+'&html_content='+encodeURIComponent(html)+'&subject='+encodeURIComponent(subject) , function(data){

			checkSessionExpiry( data );
			if( data.info ){

				$('#delivery_msg__widget').hide();

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#review_sms__widget').hide().html('');
				$('#review_customer__widget').hide().html('');

				$('#select_customer').addClass('active');
				$('#select_customer__widget').show();

				$('#select_sms').addClass('active');
				$('#select_sms__widget').show();

				$('#review_msg').addClass('active');
				$('#review_msg__widget').show().html( decodeURIComponent(data.review_send) );
				$('.indicator_1').hide();
			}else{
				$('.flash_message').addClass('redError').show().html( data.error );
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
				$('.wait_message').removeClass('indicator_1');
			}
			$('#delivery__review_send_btn').html( btn_text );
	},'json');
}

function queueMessage( form ){

	$('.flash_message').hide();

	var btn_text = $('#review_send__queue_btn_1').html();

	var prefix = $('#prefix').val();
	var post_data = $('#'+form).serialize();
	var campaign_id = $('#campaign_id').val();
	var message_id = $('#message_id').val();
	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/queue_message.json?campaign_id='+campaign_id+'&message_id='+message_id;

	var url = prefix+'/xaja/AjaxService/campaign/campaign_messages.json?selection_parameter_type='+campaign_id;
	$('.wait_message').show().addClass('indicator_1');
	$('#review_send__queue_btn_1').html(' Loading... ');
	$('#review_send__queue_btn_2').html(' Loading... ');
	$.post(ajaxUrl, post_data, function(data){

			checkSessionExpiry( data );
			var status = '';
			if( data.info == 'success' ){

				status = data.info_msg;

				$('#review_msg__widget').hide().html('');
				$('#delivery_msg__widget').hide().html('');
				$('#edit_msg__widget').hide().html('');

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#select_msg').addClass('active');
				$('#select_msg__widget').show().html( data.template_selection );

				$("#collapsable_inner_element_messages_setup").collapse('toggle');
				$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

				$('#collapse_campaign_ajaxify').addClass('accordion-heading-active');
				$('#collapse_campaign_ajaxify').parent().addClass('accordion-group-active');

				$('#collapse_messages_setup').removeClass('accordion-heading-active');
				$('#collapse_messages_setup').parent().removeClass('accordion-group-active');

				//$('.indicator_1').hide();
				oTable_msg.fnReloadAjax(url);

				$('#select_customer').addClass('active');
				$('#select_sms').addClass('active');

				$('.flash_message').removeClass('redError').show().html( status );
				
				$('#task_id').val('');
				$('#task_message_id').val('');
				$('#message_id').val('');
				$('#sms_message_id').val('');
			}else{
				status = data.error;
				$('.wait_message').removeClass('indicator_1');
				$('.flash_message').addClass('redError').show().html( status );
			}
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
			$('#review_send__queue_btn_1').html( btn_text );
			$('#review_send__queue_btn_2').html( btn_text );
	},'json');
}

function setPreview(){

	//var html = FCKeditorAPI.GetInstance('edit_template').GetData();
	var html = CKEDITOR.instances.edit_template.getData();

	if( html == '' )
		html = 'Nothing to Preview';

	$('#preview_content').html( html );

	return true;
}

function showMsgForEdit( campaign_id , msg_id ){

	$('.flash_message').hide();

	var btn_text = $('#edit_email_btn_'+campaign_id+'_'+msg_id).html();
	$('#edit_msg').addClass('visited');
	$('#select_msg__widget').hide();

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/edit_msg_flow.json?ajax_params_1='+campaign_id+'&ajax_params_2='+msg_id;

	$('.wait_message').show().addClass('indicator_1');
	$('#edit_email_btn_'+campaign_id+'_'+msg_id).html(' Loading... ');
	$.getJSON(ajaxUrl ,
		function(data) {

			checkSessionExpiry( data );
			$('#edit_email_btn_'+campaign_id+'_'+msg_id).html(btn_text);
			$('.indicator_1').hide();
			$('.wait_message').removeClass('indicator_1');

			if( data.error ){

				$('.flash_message').addClass('redError').show().html( data.error );
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
				return false;
			}
			$('#message_id').val( msg_id );

			$('.msg_menu a').each(function(){
				if( $(this).hasClass('active') ){
					$(this).removeClass('active');
				}
			});

			$('#delivery_msg__widget').hide().html(data.info_delivery);

			$('#edit_msg').addClass('active');
			$('#edit_msg__widget').show().html(data.info_edit_msg);

			$("#collapsable_inner_element_messages_setup").collapse('toggle');
			$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

			$('#collapse_messages_setup').addClass('accordion-heading-active');
			$('#collapse_messages_setup').parent().addClass('accordion-group-active');

			$('#collapse_campaign_ajaxify').removeClass('accordion-heading-active');
			$('#collapse_campaign_ajaxify').parent().removeClass('accordion-group-active');

			$('#delivery__camp_group').trigger('change');

			$('#msg_call').addClass('active');
			$('#select_customer').addClass('active');
			$('#select_sms').addClass('active');
	});
}

function reviewSMS( btn_id , form ){

	$('.flash_message').hide();

	var btn_text = $('#'+btn_id).html();

	var prefix = $('#prefix').val();

	var html = '';

	var post_data = $('#'+form).serialize();

	var campaign_id = $('#campaign_id').val();
	var message_id = $('#sms_message_id').val();
	var select_id = $('#sms_settings__camp_group').val();
	var total_cust = parseInt( $('#sms_help_value_'+select_id).attr('cust-count') );
	console.log(total_cust);
	if( total_cust < 1 ){
		$('.flash_message').show().addClass('redError').html('Selected customer list has no mobile!');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
		return false;
	}
	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_sms_review.json?campaign_id='+campaign_id+'&message_id='+message_id+'&msg_content='+encodeURIComponent(html);
	$('.wait_message').show().addClass('indicator_1');
	$('#'+btn_id).html(' Loading... ');
	$.post(ajaxUrl,post_data , function(data){

			checkSessionExpiry( data );
			if( data.info ){

				$('#select_sms__widget').hide();

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#review_msg__widget').hide().html('');
				$('#delivery_msg__widget').hide().html('');
				$('#edit_msg__widget').hide().html('');

				$('#review_customer__widget').hide().html('');

				$('#select_msg').addClass('active');
				$('#select_msg__widget').show();

				$('#select_customer').addClass('active');
				$('#select_customer__widget').show();
				
				$('#group_call__widget').hide().html('');
				$('#review_call__widget').hide().html('');
				$('#msg_call').addClass('active');
				$('#msg_call__widget').show();

				$('#review_sms').addClass('active');
				$('#review_sms__widget').show().html( decodeURIComponent(data.review_send) );
				$('.indicator_1').hide();
			}else{
				$('.flash_message').addClass('redError').show().html( data.error );
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
				$('.wait_message').removeClass('indicator_1');
			}
			$('#'+btn_id).html( btn_text );
	},'json');
}

function queueSMS( form ){

	$('.flash_message').hide();

	var btn_text = $('#'+form+'__queue_btn_2').html();

	var prefix = $('#prefix').val();
	var post_data = $('#'+form).serialize();

	var campaign_id = $('#campaign_id').val();
	var message_id = $('#sms_message_id').val();
	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/queue_sms.json?campaign_id='+campaign_id+'&message_id='+message_id;

	var url = prefix+'/xaja/AjaxService/campaign/campaign_messages.json?selection_parameter_type='+campaign_id;
	$('.wait_message').show().addClass('indicator_1');
	$('#'+form+'__queue_btn_1').html(' Loading... ');
	$('#'+form+'__queue_btn_2').html(' Loading... ');
	$.post(ajaxUrl, post_data, function(data){

			checkSessionExpiry( data );
			var status = '';

			if( data.info == 'success' ){

				status = data.info_msg;

				$('#review_sms__widget').hide().html('');

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#select_sms').addClass('active');
				$('#select_sms__widget').show().html( data.sms_selection );

				$("#collapsable_inner_element_messages_setup").collapse('toggle');
				$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

				$('#collapse_campaign_ajaxify').addClass('accordion-heading-active');
				$('#collapse_campaign_ajaxify').parent().addClass('accordion-group-active');

				$('#collapse_messages_setup').removeClass('accordion-heading-active');
				$('#collapse_messages_setup').parent().removeClass('accordion-group-active');

				//$('.indicator_1').hide();
				oTable_msg.fnReloadAjax(url);

				$('#select_msg').addClass('active');
				$('#select_customer').addClass('active');
				$('#msg_call').addClass('active');
				
				$('.flash_message').removeClass('redError').show().html( status );
				
				$('#task_id').val('');
				$('#task_message_id').val('');
				$('#message_id').val('');
				$('#sms_message_id').val('');
			}else{
				status = data.error;
				$('.flash_message').addClass('redError').show().html( status );
				$('.wait_message').removeClass('indicator_1');
			}
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
			$('#'+form+'__queue_btn_1').html( btn_text );
			$('#'+form+'__queue_btn_2').html( btn_text );
	},'json');
}

function reviewCustomer( btn_id , form ){

	$('.flash_message').hide();

	var btn_text = $('#'+btn_id).html();

	var prefix = $('#prefix').val();

	var html = '';

	var post_data = $('#'+form).serialize();

	var campaign_id = $('#campaign_id').val();
	var task_id = $('#task_id').val();
	var message_id = $('#task_message_id').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_customer_review.json?campaign_id='+campaign_id+'&task_id='+task_id+'&message_id='+message_id+'&msg_content='+encodeURIComponent(html);
	$('.wait_message').show().addClass('indicator_1');
	$('#'+btn_id).html(' Loading... ');
	$.post(ajaxUrl,post_data , function(data){

			checkSessionExpiry( data );
			if( data.info ){

				$('#select_customer__widget').hide();

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#review_msg__widget').hide().html('');
				$('#delivery_msg__widget').hide().html('');
				$('#edit_msg__widget').hide().html('');

				$('#review_sms__widget').hide().html('');

				$('#select_msg').addClass('active');
				$('#select_msg__widget').show();

				$('#select_sms').addClass('active');
				$('#select_sms__widget').show();

				$('#group_call__widget').hide().html('');
				$('#review_call__widget').hide().html('');
				$('#msg_call').addClass('active');
				$('#msg_call__widget').show();
				
				$('#review_customer').addClass('active');
				$('#review_customer__widget').show().html( decodeURIComponent(data.review_send) );
				$('.indicator_1').hide();
			}else{
				$('.flash_message').addClass('redError').show().html( data.error );
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
				$('.wait_message').removeClass('indicator_1');
			}
			$('#'+btn_id).html( btn_text );
	},'json');
}

function queueCustomer( form ){

	$('.flash_message').hide();

	var btn_text = $('#'+form+'__queue_btn_2').html();

	var prefix = $('#prefix').val();
	var post_data = $('#'+form).serialize();
	var campaign_id = $('#campaign_id').val();
	var task_id = $('#task_id').val();
	var msg_id = $('#task_message_id').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/queue_customer.json?campaign_id='+campaign_id+'&task_id='+task_id+'&message_id='+msg_id;

	//var url = prefix+'/xaja/AjaxService/campaign/campaign_tasks.json?selection_parameter_type='+campaign_id;
	var url = prefix+'/xaja/AjaxService/campaign/campaign_messages.json?selection_parameter_type='+campaign_id;

	$('.wait_message').show().addClass('indicator_1');
	$('#'+form+'__queue_btn_1').html(' Loading... ');
	$('#'+form+'__queue_btn_2').html(' Loading... ');
	$.post(ajaxUrl, post_data, function(data){

			checkSessionExpiry( data );
			var status = '';
			if( data.info == 'success' ){

				status = data.info_msg;

				$('#review_customer__widget').hide().html('');

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#select_customer').addClass('active');
				$('#select_customer__widget').show().html( data.customer_selection );

				$("#collapsable_inner_element_messages_setup").collapse('toggle');
				//$("#collapsable_inner_element_tasks_ajaxify").collapse('toggle');

				$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

				$('#collapse_campaign_ajaxify').addClass('accordion-heading-active');
				$('#collapse_campaign_ajaxify').parent().addClass('accordion-group-active');

//				$('#collapse_tasks_ajaxify').addClass('accordion-heading-active');
//				$('#collapse_tasks_ajaxify').parent().addClass('accordion-group-active');

				$('#collapse_messages_setup').removeClass('accordion-heading-active');
				$('#collapse_messages_setup').parent().removeClass('accordion-group-active');

				//$('.indicator_1').hide();
				//oTable_tasks.fnReloadAjax(url);
				oTable_msg.fnReloadAjax(url);

				$('#select_msg').addClass('active');
				$('#select_sms').addClass('active');
				$('#msg_call').addClass('active');
				$('.flash_message').removeClass('redError').show().html( status );
				
				$('#task_id').val('');
				$('#task_message_id').val('');
				$('#message_id').val('');
				$('#sms_message_id').val('');
			}else{
				status = data.error;
				$('.wait_message').removeClass('indicator_1');
				$('.flash_message').addClass('redError').show().html( status );
			}

			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 15000);
			$('#'+form+'__queue_btn_1').html( btn_text );
			$('#'+form+'__queue_btn_2').html( btn_text );
	},'json');
}

/**
 * It will render the sms for updation
 */
function showSMSForEdit( campaign_id , msg_id ){

	$('.flash_message').hide();

	var btn_text = $('#edit_email_btn_'+campaign_id+'_'+msg_id).html();

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/edit_sms_flow.json?ajax_params_1='+campaign_id+'&ajax_params_2='+msg_id;

	$('.wait_message').show().addClass('indicator_1');
	$('#edit_email_btn_'+campaign_id+'_'+msg_id).html(' Loading... ');
	$.getJSON(ajaxUrl ,
		function(data) {

			checkSessionExpiry( data );
			$('#edit_email_btn_'+campaign_id+'_'+msg_id).html(btn_text);

			$('.indicator_1').hide();
			$('.wait_message').removeClass('indicator_1');

			if( data.error ){

				$('.flash_message').addClass('redError').show().html( data.error );
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
				return false;
			}

			$('#sms_message_id').val( msg_id );
			$('.msg_menu a').each(function(){
				if( $(this).hasClass('active') ){
					$(this).removeClass('active');
				}
			});

			$('#select_sms').addClass('active');
			$('#select_sms__widget').show().html( data.info_sms_msg );

			$("#collapsable_inner_element_messages_setup").collapse('toggle');
			$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

			$('#collapse_messages_setup').addClass('accordion-heading-active');
			$('#collapse_messages_setup').parent().addClass('accordion-group-active');

			$('#collapse_campaign_ajaxify').removeClass('accordion-heading-active');
			$('#collapse_campaign_ajaxify').parent().removeClass('accordion-group-active');

			$('#select_msg').addClass('active');
			$('#select_customer').addClass('active');
			$('#msg_call').addClass('active');
	});
}

/**
 * It will render the customer task for updation
 * @param campaign_id
 * @param task_id
 */
function showCustomerForEdit( campaign_id , task_id , msg_id ){

	$('.flash_message').hide();

	var btn_text = $('#edit_customer_btn_'+campaign_id+'_'+task_id).html();

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/edit_customer_flow.json?ajax_params_1='+campaign_id+'&ajax_params_2='+task_id+'&ajax_params_3='+msg_id;

	$('.wait_message').show().addClass('indicator_1');
	$('#edit_customer_btn_'+campaign_id+'_'+task_id).html(' Loading... ');
	$.getJSON(ajaxUrl ,
		function(data) {

			checkSessionExpiry( data );
			$('#task_id').val( task_id );
			$('#task_message_id').val( msg_id );
			$('.msg_menu a').each(function(){
				if( $(this).hasClass('active') ){
					$(this).removeClass('active');
				}
			});

			$('#select_customer').addClass('active');
			$('#select_customer__widget').show().html( data.info_sms_msg );

			$("#collapsable_inner_element_messages_setup").collapse('toggle');

			$('#collapse_messages_setup').addClass('accordion-heading-active');
			$('#collapse_messages_setup').parent().addClass('accordion-group-active');

			$('#edit_customer_btn_'+campaign_id+'_'+task_id).html(btn_text);

			$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

			$('#collapse_campaign_ajaxify').removeClass('accordion-heading-active');
			$('#collapse_campaign_ajaxify').parent().removeClass('accordion-group-active');

			$('#select_msg').addClass('active');
			$('#select_sms').addClass('active');
			$('#msg_call').addClass('active');
			
			$('.indicator_1').hide();
			$('.wait_message').removeClass('indicator_1');
	});
}

/**
 * It will requeue the msg by id
 */
function reQueueMessages( msg_id , campaign_id ){

	$('.flash_message').hide();

	var btn_text = $('#requeue_btn_'+campaign_id+'_'+msg_id).html();

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/requeue_msgs.json?ajax_params_1='+campaign_id+'&ajax_params_2='+msg_id;
	var url = prefix+'/xaja/AjaxService/campaign/campaign_messages.json?selection_parameter_type='+campaign_id;
	$('.wait_message').show().addClass('indicator_1');
	$('#requeue_btn_'+campaign_id+'_'+msg_id).html(' Processing... ');

	$.getJSON(ajaxUrl ,
		function(data) {

		checkSessionExpiry( data );
		$('#requeue_btn_'+campaign_id+'_'+msg_id).html(btn_text);

		if( data.info != 'success' ){

			$('.flash_message').addClass('redError').show().html( data.error );
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
			$('.indicator_1').hide();
			$('.wait_message').removeClass('indicator_1');
		}else{
			oTable_msg.fnReloadAjax(url);
			$('#requeue_btn_'+campaign_id+'_'+msg_id).hide();
		}
	});
}

/**
 * It will requeue the msg by id
 */
function generateTaskEntries( task_id , campaign_id ){

	$('.flash_message').hide();

	var btn_text = $('#generate_btn_'+campaign_id+'_'+task_id).html();

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/generate_tasks_entries.json?ajax_params_1='+campaign_id+'&ajax_params_2='+task_id;
	var url = prefix+'/xaja/AjaxService/campaign/campaign_tasks.json?selection_parameter_type='+campaign_id;

	$('.wait_message').show().addClass('indicator_1');
	$('#generate_btn_'+campaign_id+'_'+task_id).html(' Generating... ');

	$.getJSON(ajaxUrl ,
		function(data) {

			checkSessionExpiry( data );
			$('.flash_message').removeClass('redError').show().html( data.info_status );
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);

			//$('.indicator_1').hide();
			oTable_tasks.fnReloadAjax(url);

			$('#generate_btn_'+campaign_id+'_'+task_id).html(btn_text);
			$('#generate_btn_'+campaign_id+'_'+task_id).hide();
	});
}

/**
 * It will reload the template list in email template selection page
 */
function refreshTemplateList( btn_id ){

	$('.flash_message').hide();

	var btn_text = $('#generate_btn_'+campaign_id+'_'+task_id).html();

	$('#'+btn_id).addClass( 'loading' );
	$('#'+btn_id).attr( 'onClick', 'return false' );
	$('#'+btn_id).attr( 'rel', 'tooltip' );
	$('#'+btn_id).attr( 'title', 'Refreshing The Template List...' );

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/refresh_template_list.json';

	$.getJSON(ajaxUrl ,
		function(data) {

		checkSessionExpiry( data );
		$('.template_lists').slideDown('slow').html( decodeURIComponent(data.info_temp_list) );

		$('.flash_message').removeClass('redError').html( 'Email template list refreshed successfully' );
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);

		$('#'+btn_id).removeClass( 'loading' );
    	$('#'+btn_id).attr( 'onClick', 'refreshTemplateList(this.id);' );
    	$('#'+btn_id).attr( 'rel', '' );
    	$('#'+btn_id).attr( 'title', '' );

    	$('#category_list').val('All');
    	sortTemplateList();
		$('.clickable-temp').first().trigger('click');
	});
}

/**
 * change the schedulter status
 * @param campaign_id
 * @param msg_id
 * @param state
 */
function schedulerStatus( btn_id , campaign_id , msg_id , state ){

	$('.flash_message').hide();

	var btn_text = $('#'+btn_id).html();

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/scheduler_status.json?ajax_params_1='+campaign_id+'&ajax_params_2='+msg_id+'&ajax_params_3='+state;
	var url = prefix+'/xaja/AjaxService/campaign/campaign_messages.json?selection_parameter_type='+campaign_id;

	$('#'+btn_id).addClass( 'loading' );
	$('#'+btn_id).attr( 'onClick', 'return false' );
	$('#'+btn_id).attr( 'rel', 'tooltip' );
	$('#'+btn_id).attr( 'title', 'Scheduler State Changing...' );

	$.getJSON(ajaxUrl ,
		function(data) {

			checkSessionExpiry( data );
			if( data.info == 'success' ){

				oTable_msg.fnReloadAjax(url);

				$('#'+btn_id).removeClass( 'loading' );
		    	$('#'+btn_id).attr( 'onClick', "schedulerStatus( this.id ,'"+campaign_id+"' , '"+msg_id+"' , '"+state+"' );\"" );
		    	$('#'+btn_id).attr( 'rel', '' );
		    	$('#'+btn_id).attr( 'title', '' );

				$('.flash_message').removeClass('redError').show().html( data.info_status );
			}else{
				$('.flash_message').addClass('redError').show().html( data.error );
			}
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	});
}

/**
 * Getting preview of message by message id.
 * @param preview_div
 * @returns {Boolean}
 */
function getPreview( message_id ){
	
	console.log('message_id:'+message_id);
	
	var prefix = $('#prefix').val();
	if( !message_id ){
		return false;
	}

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/get_message_preview.json?message_id='+message_id;
	$('#model_table_preview').modal();
	$('#preview_table_content').html("<center><img src='/images/ajax-loader.gif'></img></center>");
	$.getJSON(ajaxUrl,function(data){
		$('#preview_table_content').html( decodeURIComponent(data.html) );
	});
	
	return true;
}

function editCampaignDetails(){

	$('#campaign_name_edit').toggle();
	$('#campaign_date_edit').toggle();
	$('#coupon_details').toggle();

	$('#campaign_name_edit_show').toggle();
	$('#campaign_date_edit_show').toggle();

	$('.edit_button_edit').toggle();
	$('#edit_button_edit_show').toggle();
	$('.hide-border').toggle();
	$('#campaign_name').val($('#campaign_name_hidden').html());
	$('#start_date').val($('#start_date_hidden').html());
	$('#end_date').val($('#end_date_hidden').html());
	$('#edit_campaign_details').html('<i class="icon-ok-sign"></i> Save');
	
	if( $('#coupon_details1').hasClass('hide_when_edit1') ){
		$('#coupon_details1').removeClass('hide_when_edit1');
		$('#coupon_details2').removeClass('hide_when_edit2');
		$('#coupon_details3').removeClass('hide_when_edit3');
		$('.div-border').css('height','4.5em');
	}else{
		$('#coupon_details1').addClass('hide_when_edit1');
		$('#coupon_details2').addClass('hide_when_edit2');
		$('#coupon_details3').addClass('hide_when_edit3');
		$('.div-border').css('height','6.5em');
	}
	$('.campaign_nameformError').css('display','none');
	$('.flash_message').css('display','none');
}

/**
 * updating campaing name and date.
 */
function updateCampaignDetails(){

	var c_name = $('#campaign_name').val();
	var c_id = $('#campaign_id').val();
	var prefix = $('#prefix').val();
	var start_date = $('#start_date').val();
	var end_date = $('#end_date').val();
	var org_id = $('#org_id').val();
	
	$('.flash_message').hide().html('');
	$('.flash_message').removeClass('redError');

	if( c_name == '' ){
		$('.flash_message').show().removeClass('hide').addClass('redError').html('campaign name required!');
		return false;
	}
	if( start_date == '' || end_date == '' ){
		$('.flash_message').show().removeClass('hide').addClass('redError').html('campaign date must be valid !');
		return false;
	}

	if( $("#campaign_edit_form").validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){

		var ajaxUrl = prefix+"/xaja/AjaxService/campaign/update_campaign.json?org_id="+org_id;
		$('#edit_campaign_details').html('<i class="icon-ok-sign"></i> Save');
		$('#edit_campaign_details').html('updating....');

		$.getJSON( ajaxUrl , {'campaign_id':c_id ,'start_date':start_date,'end_date':end_date,'c_name':c_name},
				function(data) {

					checkSessionExpiry( data );
					if( data.info == 'SUCCESS' ){
						$('#cmp_name').html(c_name);
						editCampaignDetails();
						$('.flash_message').html('Campaign Updated Successfully' );
						$('.flash_message').css('display','inline');
						updateHiddenVariable(data);
					}else{
						$('#campaign_name').select();
						$('.flash_message').html(data.info);
						$('.flash_message').css('display','inline');
						$('.flash_message').addClass('redError');
						$('#edit_campaign_details').html('<i class="icon-ok-sign"></i> Save');
					}
				});
	}
	setTimeout(function(){ $('#flash_message').hide(); }, 5000);
}

function updateHiddenVariable( data ){

	var new_name = '';
	if( data.campaign_name.length > 18 )
		new_name = data.campaign_name.substring( 0,18 )+'...';
	else
		new_name = data.campaign_name;

	$('#campaign_name_shown').attr('title',data.campaign_name);
	$('#campaign_name_shown').html( new_name );
	$('#campaign_name_hidden').html(data.campaign_name);

	var start = new Date( data.start_date);
	var end = new Date( data.end_date);
	$('#start_date_hidden').html( dateFormat( start ,'yyyy-mm-dd') );
	$('#end_date_hidden').html( dateFormat( end ,'yyyy-mm-dd') );
	$('.campaign-end-date').html(dateFormat(end,'mmm dd,yyyy'));
	$('.campaign-start-date').html(dateFormat(start,'mmm dd,yyyy'));
	$('#start_date_shown .day').html(dateFormat(start , 'dd'));
	$('#start_date_shown .month').html(dateFormat(start , 'mmm'));
	$('#start_date_shown .year').html(dateFormat(start , 'yyyy'));

	$('#end_date_shown .day').html(dateFormat(end , 'dd'));
	$('#end_date_shown .month').html(dateFormat(end , 'mmm'));
	$('#end_date_shown .year').html(dateFormat(end , 'yyyy'));
}
/**
 * removing inline style from body tag causing problem for campaign background color
 */

$(window).load(function() {
	 $('body').attr('style','');
});

$(document).ready(function(){

    $('input[type=text]').each(function(){
    var data = $(this).parent().find('small')
       if( data ){
            var id = $(this).attr('id');
            var pos = $(this).offset();
            var cls = $(this).parent().find('span').attr('class');
            if( cls != 'switch-track' ){
		        $(this).parent().find('small').attr('id','subject_help__'+id);
		        $('#subject_help__'+id).css('display','none');
		        $('#subject_help__'+id).css('font-size','12px');
		        $('#subject_help__'+id).css('width',$(this).width());
		        $('#subject_help__'+id).css('background-color','lightgray');
		        $('#subject_help__'+id).css('border-radius','3px');
		        $('#subject_help__'+id).css('padding','5px');
		        $('#subject_help__'+id).css('margin-top','-8px');
		        $('#subject_help__'+id).css('position','absolute');
            }
       }
    });

     //When element gets focus display help text if available.
	 $('input[type=text]').live('focus',function(){
	       var id = $(this).attr('id');
	       $('#subject_help__'+id).slideDown();
	});

	 //Hide help text when element lost its focus.
	$('input[type=text]').live('focusout',function(){
	       var id = $(this).attr('id');
	       $('#subject_help__'+id).slideUp();
	});	
})

/**
 * Javascript Date format function.
 */
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

function showFilter( campaign_id ){

	var url = "/campaign/audience/AudienceFilter?flash=&campaign_id="+campaign_id+"&list_option=new";

    $('#popupiframe').attr( 'src', url );
    $('#shade').fadeIn(300);
    $('#popup').fadeIn(300);
}
function openSocialModal( link ){

	var html = '';
	var url = '';
	var message = '';
	var id = link.split('__');
	$('.url_error').html('');
	var open_id = $('#recent_open_modal').val();
	if( open_id ){
		$('#logo-and-header__'+open_id).removeClass('show').addClass('hide');
		$('#social-modal__'+open_id).removeClass('show').addClass('hide');
	}
	$('#logo-and-header__'+id).removeClass('hide').addClass('show');
	$('#social-modal__'+id).removeClass('hide').addClass('show');
	$('#recent_open_modal').val(id);
	$('#myModal').modal('show');
}

$('#add-social-button').live('click',function(){

	var open_id = $('#recent_open_modal').val();
	var url = $('#url__'+open_id).val();
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var checkbox = $('#save__'+open_id).val();
    var prefix = $('#prefix').val();
    var ajaxUrl = prefix+"/xaja/AjaxService/campaign/save_social_url.json?myurl="+url+'&platform='+open_id;

    if( url == '' ){
    	$('#url_error__'+open_id).html('Please enter url!');
    }else{
	    if ( pattern.test(url) ) {

	    	if( $('#save__'+open_id).is(':checked') ){

	    		$.getJSON( ajaxUrl  , function(data) {

	    			checkSessionExpiry( data );
	    			if( data.status == 'SUCCESS' ){
	    				$('#url_error__'+open_id).css('color','green');
	    				$('.flash_message').css('display','inline');
	    				$('.flash_message').html('Social URL saved successfully');
	    				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 8000);
	    			}else{
	    				$('.flash_message').addClass('redError').show().html('Error: We Were Unable to process your request please try again later');
	    				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	    			}
	    		});
	    	}
	    	var img = $('#image-url__'+open_id).val();
	    	var html = "<a href='"+url+"' target='_blank'><img src='"+decodeURIComponent( img )+"'></img</a>";
	    	insert( html );
	    	$('#myModal').modal('hide');
	    }else{
	    	$('#url_error__'+open_id).html('Please enter valid url!');
	    }
    }
});

function insert(myValue){
	myValue = myValue.trim();
	//FCKeditorAPI.GetInstance(id).InsertHtml(myValue);
	CKEDITOR.instances.edit_template.insertHtml(myValue);
}

$('.url').live('keyup',function(){
	$('.url_error').html('');
});

function reloadDeliveryGroup( source ){

	$('.flash_message').hide();
	window.parent.$('.flash_message').hide();

	var campaign_id = $('#campaign_id').val();

	var btn_text = $('#reload_group_btn').html();
	var btn_id = 'reload_group_btn';
	if( source == 1 )
		var btn_id = 'call_reload_group_btn';

	$('#'+btn_id).addClass( 'loading' );
	$('#'+btn_id).attr( 'onClick', 'return false' );
	$('#'+btn_id).attr( 'rel', 'tooltip' );
	$('#'+btn_id).attr( 'title', 'Refreshing The Customer List...' );

	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/refresh_customer_list.json?campaign_id='+campaign_id+'&source='+source;

	$.getJSON(ajaxUrl ,
		function(data) {

		$('.flash_message').removeClass('redError').html( 'Customer list refreshed successfully' );
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);

		$('#'+btn_id).removeClass( 'loading' );
		if( source == 1 ){
			$('#call_task_delivery__camp_group').html( decodeURIComponent(data.info_customer_list) );
			$('#call_info_audience').html( decodeURIComponent(data.call_info_customer_count) );
			$('#'+btn_id).attr( 'onClick', 'reloadDeliveryGroup(1);' );
		}
		else{
			$('#delivery__camp_group').html( decodeURIComponent(data.info_customer_list) );
			$('#info_audience').html( decodeURIComponent(data.info_customer_count) );
			$('#'+btn_id).attr( 'onClick', 'reloadDeliveryGroup(0);' );
		}
    	$('#'+btn_id).attr( 'rel', '' );
    	$('#'+btn_id).attr( 'title', '' );
    	$('#delivery__camp_group').trigger('change');
    	$('#call_task_delivery__camp_group').trigger('change');
	});
}

function outboundhome(){
	window.location.href='/campaign/v2/base/OutBoundHome';
}

function bouncebackhome(){
	window.location.href='/campaign/rules/basic_config/CreateNewCampaign';
}
function referralhome(){
	window.location.href='/campaign/v2/referral/ReferralCreation';
}

/**
 * Upload email template content from file.
 */
$('#upload-email-template-file').live('click',function(){

    var file = $("#new_email_template__template_file")[0].files[0];
    var prefix = $('#new_email_template__prefix').val();
    var template_name = $('#new_email_template__tag_template').val();

    if( typeof file == "undefined" ){

    	$('.flash_message').addClass('redError').show().html( 'please select file to upload!' );
        setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	    console.log('file not specified!');
    	return false;
    }

    if ( !file.type.match('html.*') || !file.type.match('htm.*') ) {
    	$('.flash_message').addClass('redError').show().html('Upload only html file');
    	setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	    console.log('file type not supported');
	    $("#new_email_template__template_file").val('');
    	return false;
    }else{
    	
		var reader = new FileReader();
		reader.readAsText(file,'UTF-8');

		reader.onload = (function(theFile) {
			return function(e) {
				var result = e.target.result;
					if( result ){
//						oEditor = FCKeditorAPI.GetInstance('new_email_template__body');
//						var html = CKEDITOR.instances.edit_template.getData();
//						oEditor.Focus();
//						oEditor.InsertHtml(result);
						CKEDITOR.instances.new_email_template__body.insertHtml(result);
						$("#new_email_template__template_file").val('');
						$('.flash_message').removeClass('redError').show().html('File content added successfully');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
					}
			};
		})(file);
    }
    return true;
});

$('#sendtest_email__choose_list').live('click',function(){
	$('#sendtest_email__paste_list').removeAttr('checked');
	$('#sendtest_email__csv_content').attr('readonly','readonly');
	$('#sendtest_email__list').removeAttr('disabled');
	$('#sendtest_email__on_off').parent().css('visibility','hidden');
	$('.on-off-button-visibility').addClass('list-name-visibility');
	$('#sendtest_email__paste_list').val(0);
	$('#sendtest_email__csv_content').val('');
	$('#sendtest_email__group_name').val('');
});

$('#sendtest_email__paste_list').live('click',function(){
	$('#sendtest_email__choose_list').removeAttr('checked');
	$('#sendtest_email__csv_content').removeAttr('readonly');
	$('#sendtest_email__list').attr('disabled','disabled');
	$('#sendtest_email__on_off').parent().css('visibility','visible');
	$('#sendtest_email__paste_list').val(1);
	if( $('.switch').hasClass('active') )
		$('.on-off-button-visibility').removeClass('list-name-visibility');
});
$('#sendtest_email__on_off').live('click',function(){
	$('.on-off-button-visibility').toggleClass('list-name-visibility');
	var on_off = $('input:[id=sendtest_email__on_off]').val();

	if( on_off == 1 ){
		$('#sendtest_email__group_name').addClass('validate[required]');
		$('.formError').show();
	}else{
		$('#sendtest_email__group_name').removeClass('validate[required]');
		$('#sendtest_email__group_name').val('');
		$('.formError').hide();
	}
});

$('#sendtest_sms__choose_list').live('click',function(){
	$('#sendtest_sms__paste_list').removeAttr('checked');
	$('#sendtest_sms__csv_content').attr('readonly','readonly');
	$('#sendtest_sms__list').removeAttr('disabled');
	$('#sendtest_sms__on_off').parent().css('visibility','hidden');
	$('.on-off-button-visibility').addClass('list-name-visibility');
	$('#sendtest_sms__paste_list').val(0);
	$('#sendtest_sms__csv_content').val('');
	$('#sendtest_sms__group_name').val('');
});

$('#sendtest_sms__paste_list').live('click',function(){
	$('#sendtest_sms__choose_list').removeAttr('checked');
	$('#sendtest_sms__csv_content').removeAttr('readonly');
	$('#sendtest_sms__list').attr('disabled','disabled');
	$('#sendtest_sms__on_off').parent().css('visibility','visible');
	$('#sendtest_sms__paste_list').val(1);
	if( $('.switch').hasClass('active') )
		$('.on-off-button-visibility').removeClass('list-name-visibility');
});
$('#sendtest_sms__on_off').live('click',function(){
	$('.on-off-button-visibility').toggleClass('list-name-visibility');
	var on_off = $('input:[id=sendtest_sms__on_off]').val();

	if( on_off == 1 ){
		$('#sendtest_sms__group_name').addClass('validate[required]');
		$('.formError').show();
	}else{
		$('#sendtest_sms__group_name').removeClass('validate[required]');
		$('#sendtest_sms__group_name').val('');
		$('.formError').hide();
	}
});

function testSMSHandling( form_id ){

	$('#'+form_id+'__paste_list').removeAttr('checked');

	var gname = $('#'+form_id+'__group_name').val();
	var on_off = $('input:[id='+form_id+'__on_off]').val();

	if(  gname || on_off == 1 ){
		$('.on-off-button-visibility').removeClass('list-name-visibility');
		$('#'+form_id+'__choose_list').removeAttr('checked');
		$('#'+form_id+'__paste_list').attr('checked','checked');
		$('#'+form_id+'__paste_list').val(1);
		$('#'+form_id+'__csv_content').removeAttr('readonly');
		$('#'+form_id+'__list').attr('disabled','disabled');
		$('#'+form_id+'__on_off').parent().css('visibility','visible');
	}else{
		$('#'+form_id+'__on_off').parent().css('visibility','hidden');

		var content = $('#'+form_id+'__csv_content').val();
		
		if( content ){
			$('#'+form_id+'__paste_list').attr('checked','checked');
			$('#'+form_id+'__paste_list').val(1);
			$('#'+form_id+'__on_off').parent().css('visibility','visible');
			$('#'+form_id+'__csv_content').removeAttr('readonly');
			$('#'+form_id+'__choose_list').removeAttr('checked');
			$('#'+form_id+'__list').attr('disabled','disabled');
		}
	}
	$('#'+form_id+'__list').trigger('change');
	$('#'+form_id+'__message').val(window.parent.$('#review_send__message').val());
	$('#'+form_id+'__subject').val(window.parent.$('#review_send__subject').val());
}

function testAndControlGroups( test_ratio ){
	
	$( '#slider' ).slider({
		range:'min',
		value:test_ratio,
		min: 0,
		max: 100,
		step: 1,
		slide: function( event, ui ) {
			var test = ui.value;
			var control = 100 - test;
			$( '.test-group' ).html( 'Test Group  ' + test + '%');
			$('.control-group').html('Control Group ' + control + '%' );
			$('#test_control__control_group').val(test);
		}
	});

	$('.test_control__list_option').click(function(){
		
		$(".test_control__list_option").each(function() {
			$(this).removeAttr('checked');
		});
		
		if( $(this).val() == 'org_level' ){
			$('.test_slider').show();
			$('#test_control__delete_test_control').parent().parent().show();
		}else{
			$('.test_slider').hide();
			$('#test_control__delete_test_control').parent().parent().hide();
		}
		$(this).attr('checked','checked');
	});
	
	$('#yes').click(function() { 
        // update the block message 
        $('#test_control').get(0).submit();
    });
    
    $('#no').click(function() {
        $.unblockUI(); 
        return false; 
    });
    
    $('#test_control').submit(function(e) {
    	
    	e.preventDefault();
    	var delete_confirmed = $('#test_control input[type=hidden][name=test_control__delete_test_control]').val();
    	if( delete_confirmed == 1 )
    		$.blockUI({ message: $('#question'), css: { width: '390px',padding:'5px' } });
    	else
    		$('#test_control').get(0).submit();
    });
}

function customErrorMsg( msg ){
	$('.flash_message').show().addClass('redError').html(msg);
	setTimeout(function(){ $('.flash_message').fadeOut('fast').removeClass('redError'); }, 5000);
}