/**
 * Process the selected template for the edit message step
 */
function processTaskSelectMessage(){

	$('.flash_message').hide();

	var btn_text = $('#msg_call_btn').html();
	var prefix = $('#prefix').val();
	var campaign_id = $('#campaign_id').val();
	var message_id = $('#call_task_message_id').val();
	var post_data = $('#call_task_message').serialize();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_select_call_msg.json?campaign_id='+campaign_id+'&message_id='+message_id;

	if( $("#call_task_message").validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){

		var msg = $('#call_task_message__message').val();
		if( msg == '' ){
			$('.flash_message').addClass('redError').show().html( 'Message should not be empty' );
			setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
			$('#call_task_message__message').focus();
			return false;
		}
		
		$('#msg_call_btn').html(' Loading... ');
		$('.wait_message').show().addClass('indicator_1');
		$.post(ajaxUrl ,post_data,
			function(data){
				if( data.info ){

					checkSessionExpiry( data );
					if( message_id != '' ){

						$('#group_call__widget').html('');
						$('#review_call__widget').html('');
					}

					$('#msg_call__widget').hide();

					$('.msg_menu a').each(function(){
						if( $(this).hasClass('active') ){
							$(this).removeClass('active');
						}
					});

					$('#group_call').addClass('active');
					$('#group_call__widget').show().html( decodeURIComponent(data.group_html) );
					$('.indicator_1').hide();
					$('#call_task_delivery__camp_group').trigger('change');
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.flash_message').addClass('redError').show().html(data.error);
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}
				$('#msg_call_btn').html(btn_text);
			},'json');
	}
}

function processGroupReviewProceed(){

	//var id = $('#call_task_delivery__camp_group').val();

	$('#checkListModal').modal('hide');
	$('.flash_message').hide();

	var btn_text = $('#call_task_delivery__review_send_btn').html();

	var prefix = $('#prefix').val();
	var post_data = $('#call_task_delivery').serialize();

	var campaign_id = $('#campaign_id').val();
	var message_id = $('#call_task_message_id').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/process_group_call.json?campaign_id='+campaign_id+'&message_id='+message_id;
	
	if( $("#call_task_delivery").validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
		
		$('.wait_message').show().addClass('indicator_1');
		$('#call_task_delivery__review_send_btn').html(' Loading... ');
		$.post(ajaxUrl, post_data , function(data){
	
				checkSessionExpiry( data );
				if( data.info ){
	
					$('#group_call__widget').hide();
	
					$('.msg_menu a').each(function(){
						if( $(this).hasClass('active') ){
							$(this).removeClass('active');
						}
					});
	
					$('#review_sms__widget').hide().html('');
					$('#review_customer__widget').hide().html('');
					$('#review_msg__widget').hide().html('');
	
					$('#select_customer').addClass('active');
					$('#select_customer__widget').show();
					
					$('#select_msg').addClass('active');
					$('#select_msg__widget').show();
	
					$('#select_sms').addClass('active');
					$('#select_sms__widget').show();
	
					$('#review_call').addClass('active');
					$('#review_call__widget').show().html( decodeURIComponent(data.review_send) );
					$('.indicator_1').hide();
				}else{
					$('.flash_message').addClass('redError').show().html( data.error );
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 7000);
					$('.wait_message').removeClass('indicator_1');
				}
				$('#call_task_delivery__review_send_btn').html( btn_text );
		},'json');
	}
}

function queueCallTask(){

	$('.flash_message').hide();

	var btn_text = $('#review_send__queue_btn_2').html();

	var prefix = $('#prefix').val();
	var post_data = $('#review_send').serialize();
	var campaign_id = $('#campaign_id').val();
	var message_id = $('#call_task_message_id').val();
	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/queue_call_task.json?campaign_id='+campaign_id+'&message_id='+message_id;

	var url = prefix+'/xaja/AjaxService/campaign/campaign_messages.json?selection_parameter_type='+campaign_id;
	$('.wait_message').show().addClass('indicator_1');
	$('#review_send__queue_btn_1').html(' Loading... ');
	$('#review_send__queue_btn_2').html(' Loading... ');
	
	$.post(ajaxUrl, post_data, function(data){

			checkSessionExpiry( data );
			var status = '';
			if( data.info == 'success' ){

				status = data.info_msg;

				$('#review_call__widget').hide().html('');
				$('#group_call__widget').hide().html('');

				$('.msg_menu a').each(function(){
					if( $(this).hasClass('active') ){
						$(this).removeClass('active');
					}
				});

				$('#msg_call').addClass('active');
				$('#msg_call__widget').show().html( data.message_selection );

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
				$('#select_sms').addClass('active');

				$('.flash_message').removeClass('redError').show().html( status );
				
				$('#task_id').val('');
				$('#task_message_id').val('');
				$('#call_task_message_id').val('');
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

function showCallTaskForEdit( campaign_id , msg_id ){

	$('.flash_message').hide();

	var btn_text = $('#edit_email_btn_'+campaign_id+'_'+msg_id).html();
	
	var prefix = $('#prefix').val();

	var ajaxUrl = prefix+'/xaja/AjaxService/campaign/edit_call_task_flow.json?ajax_params_1='+campaign_id+'&ajax_params_2='+msg_id;

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
			$('#call_task_message_id').val( msg_id );

			$('.msg_menu a').each(function(){
				if( $(this).hasClass('active') ){
					$(this).removeClass('active');
				}
			});

			$('#group_call__widget').hide().html(data.info_delivery);

			$('#msg_call').addClass('active');
			$('#msg_call__widget').show().html(data.info_edit_msg);

			$("#collapsable_inner_element_messages_setup").collapse('toggle');
			$("#collapsable_inner_element_campaign_ajaxify").collapse('toggle');

			$('#collapse_messages_setup').addClass('accordion-heading-active');
			$('#collapse_messages_setup').parent().addClass('accordion-group-active');

			$('#collapse_campaign_ajaxify').removeClass('accordion-heading-active');
			$('#collapse_campaign_ajaxify').parent().removeClass('accordion-group-active');

			$('#call_task_delivery__camp_group').trigger('change');

			$('#select_customer').addClass('active');
			$('#select_sms').addClass('active');
			$('#select_msg').addClass('active');
	});
}
$(document).ready(function(){

	$('.msg_tags_edit_store').live('click', function(){
		var id = $(this).attr('id');
		myValue = id.split('__');
		var tag = myValue[1].trim();
		var start = $('#current_position').val();
		var subject = $('#call_task_message__subject').val();
		var message = $('#call_task_message__message').val();
		
		var last_focused = $('#current_position').attr('last_focused');
		if( last_focused == 'subject' ){
			var from = subject.substr(0,start);
			var to = subject.substr(start,subject.length);
			var final_str = from+' '+tag+' '+to;
			$('#call_task_message__subject').val(final_str);
		}else{
			var from = message.substr(0,start);
			var to = message.substr(start,message.length);
			var final_str = from+' '+tag+' '+to;
			$('#call_task_message__message').val(final_str);
		}
	});
	$('#call_task_message__message').live('click keyup',function() {
		var pos = getCursorPos( this );
		$('#current_position').val(pos.start);
		$('#current_position').attr('last_focused','message');
	});
	$('#call_task_message__subject').live('click keyup',function() {
		var pos = getCursorPos( this );
		$('#current_position').val(pos.start);
		$('#current_position').attr('last_focused','subject');
	});
});