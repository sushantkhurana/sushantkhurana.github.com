function removeEmailTemplate( temp_id ){
	
	var prefix = $('#prefix').val();
	var template_id = $('#'+temp_id).attr('file_id');
	
	var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/delete_uploaded_template.json?ajax_params_1='+template_id;
	$('.wait_message').show().addClass('indicator_1');
	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info == 'success' ){
				$('.indicator_1').hide();
				$('#list_'+template_id).remove();
				$('#template_count').val( $('#template_count').val() - 1 );
				$('#prev-iframe').removeClass('show').addClass('hide');
				$('#loading').removeClass('hide').addClass('show');
				$('#template_heading').find('b').html('Preview');
				$('#navigation li').removeClass('selected');
				
				var temp_count = parseInt( $('#template_count').val() );
				if( temp_count < 1 )
					$('#uploaded_list').addClass('hide');
				if( temp_count < 3 )
					$('#email_templates .form-fields-container').show();
				
				return true;
			}else{
				$('.wait_message').removeClass('indicator_1');
				$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
			}
		});
}

function setFeatureValues( id , feature_id ){
	
	var status = '';
	var field_arr = id.split('__');
	var zone_count = $('#master_data_add_zone__count').val();
	
	if(!$('#'+id).hasClass('active')){
		status = 'Disable';
		
		if( zone_count == 0 ){
			$('#master_add_zone').show();
		}
		if( zone_count < 3 && zone_count > 0 ){
			$('#master_add_zone').show();
			$('#display_zone_list').show();
		}
		if( zone_count >= 3 ){
			$('#display_zone_list').show();
		}
	}
	else{
		status = 'Enable';
		$('#master_add_zone').hide();
		$('#display_zone_list').hide();
	}
	
	var prefix = $('#prefix').val();
	
	var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/set_features_values.json?ajax_params_1='+field_arr[1]+'&ajax_params_2='+field_arr[2]+'&ajax_params_3='+field_arr[3]+'&ajax_params_4='+status;
	
	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info == 'success' ){
				return true;
			}else{
				alert( 'Error : '+data.error );
			}
		});
}

function removeDefaultValue( id , form ){
	
	var ele_name = id.split('span_img_');

	var default_arr = $('#'+id).parent().parent().attr('id').split('__');
	var fields_names = $('#'+default_arr[0]+'__'+default_arr[1]+'__'+default_arr[2]+'__default').val().split(',');
	
	fields_names = $.grep(fields_names, function(value) {
		
	    return $('#span_value_'+ele_name[1]).attr( 'span_value_custom_field' ) != value;
	});
	
	if( $('#'+default_arr[0]+'__'+default_arr[1]+'__'+default_arr[2]+'__type').val() == 'datepicker' ){
		$('#'+default_arr[0]+'__'+default_arr[1]+'__'+default_arr[2]+'__custom_container_dtp').show();
		$('.ui-datepicker-trigger').show();
	}else{
		$('#'+default_arr[0]+'__'+default_arr[1]+'__'+default_arr[2]+'__custom_container').show();
	}
	$('#'+default_arr[0]+'__'+default_arr[1]+'__'+default_arr[2]+'__custom_container_btn').show();
	
	$('#'+default_arr[0]+'__'+default_arr[1]+'__'+default_arr[2]+'__default').val( fields_names.toString() );
}

function validateDate(dtValue)
{
	//It will check for yyyy-mm-dd date format
	var dtRegex = new RegExp(/^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/);
	return dtRegex.test(dtValue);
}

function addCustomField( form ){
	
	var prefix = $('#prefix').val();
	var html = "<div id = 'span_value_{cust_value_encode}' class = 'custom_span_value' span_value_custom_field = '{cust_value}' >{cust_value}";
	html += "<img id = 'span_img_{cust_value_encode}' src='"+prefix+"/images/cross_delete.png' style='margin-left:10px' width='17px' height='17px'";
	html += "onClick=\"removeDefaultValue(this.id,this.form);$('#span_value_{cust_value_encode}').remove();\"/>";
	html += "</div><div style='clear:both'></div>";

	var txt_val = '';
	if($('#'+form.id+'__type').val() == 'datepicker' )
	{
		txt_val = $('#'+form.id+'__custom_container_dtp').val();
		if( validateDate( txt_val ) )
		{
			$('#'+form.id+'__custom_container').hide();
			$('#'+form.id+'__custom_container_dtp').hide();
			$('#'+form.id+'__custom_container_btn').hide();
			$('.ui-datepicker-trigger').hide();
		}
	}
	else
	{
		txt_val = $('#'+form.id+'__custom_container').val();
		var RegExp = /^([a-zA-Z0-9\s_.-]+)$/;
		if( !RegExp.test(txt_val) && ( txt_val != '' )){
		
			$('#'+form.id+'__error').show();
			$('#'+form.id+'__error').text('Invalid name for custom value');
			setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
			return false;
		}
	}
	
	if($('#'+form.id+'__type').val() == 'text' )
	{
		$('#'+form.id+'__custom_container').hide();
		$('#'+form.id+'__custom_container_dtp').hide();
		$('#'+form.id+'__custom_container_btn').hide();
	}
	
	if($('#'+form.id+'__type').val() == 'select' || $('#'+form.id+'__type').val() == 'radio')
	{
		$('#'+form.id+'__custom_container').show();
		$('#'+form.id+'__custom_container_btn').show();
	}

	if( txt_val != '' )
	{
		if( ( $('#'+form.id+'__type').val() == 'text' || 
			$('#'+form.id+'__type').val() == 'datepicker') && 
			( $('#'+form.id+'__default').val() != '' ) )
		{
			$('#'+form.id+'__error').show();
			$('#'+form.id+'__error').text('Only one custom value allowed for '+ $('#'+form.id+'__type').val() +' type');
			return false;
		}
		
		var fields_names = $('#'+form.id+'__default').val().split(',');
		//check for duplicate
		if( jQuery.inArray( txt_val , fields_names ) != -1 )
		{
			$('#'+form.id+'__error').show();
			$('#'+form.id+'__error').text('Custom value already added');
			setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
			$('#'+form.id+'__custom_container').focus();
			return true;
		}
		else
		{
			if( $('#'+form.id+'__type').val() == 'datepicker' )
			{
				if( !validateDate( txt_val ) )
				{
					$('#'+form.id+'__error').show();
					$('#'+form.id+'__error').text('Invalid date format');
					return true;
				}
			}
			
			if( fields_names.toString() == '' ){
				$('#'+form.id+'__default').val( txt_val );
			}
			else
			{
				$('#'+form.id+'__default').val( fields_names.toString() + ',' + txt_val );
			}
		}
		
		$('#'+form.id+'__error').hide();
		
		var desired_text = txt_val.replace(/[^\w\s]/gi, '');
		var replaced_without_special_char_html = html.replace(/{cust_value_encode}/gi, desired_text );
		
		var html_str = replaced_without_special_char_html.replace(/{cust_value}/gi, txt_val );
		
		$( html_str ).insertBefore('#custom_span_appender');
		$('#'+form.id+'__custom_container').val('');
	}else{
		
		$('#'+form.id+'__error').show();
		$('#'+form.id+'__error').text('Please give the value to add');
		setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
		$('#'+form.id+'__custom_container_btn').show();
		$('#'+form.id+'__custom_container').focus();
		
		if( $('#'+form.id+'__type').val() == 'text'){
			$('#'+form.id+'__custom_container').show();
		}
	}
}

function processCustomForm( form ){

	$('.flash_message').hide();
	var form_name = form.id;
	var res = form_name.split('__');
	
	var prefix = $('#prefix').val();
	var fields_names = $('#custom_fields_val').val().split(',');
	var custom_values = $('#custom_fields_val').val();
	var custom_count = $('#custom_fields_count').val();
	var new_name = $('#'+form_name+'__name').val();
	var prop_value = $('#'+form_name+'__label').val();
	var html = '';
	var old_label = $('#'+form_name+'__custom_old_field').val();
	var cust_fields_names = $('#custom_fields_nam').val().split(',');
	
	var RegExp = /^([a-zA-Z0-9\s_-]+)$/;
	if( !RegExp.test(prop_value)){
	
		$('#'+form.id+'__error').show();
		$('#'+form.id+'__error').text('Invalid name for custom field');
		setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
		return false;
	}
	prop_value = prop_value.replace(/\s{2,}/g,' ');
	prop_value = prop_value.replace(/\s[_]+\s/g,'_');
	prop_value = prop_value.replace(/\s[-]+\s/g,'-');
	prop_value = prop_value.replace(/^\s+|\s+$/g,'');
	prop_value = prop_value.replace(/[^a-zA-Z0-9\s_-]/gi,'');
	$('#'+form_name+'__label').val(prop_value);
	if(prop_value == ''){
	
		$('#'+form.id+'__error').show();
		$('#'+form.id+'__error').text('Please give the name for custom field');
		setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
		return false;
	}
	if(old_label.toLowerCase() != prop_value.toLowerCase()){
		for( var i in fields_names){
			if( prop_value.toLowerCase() == fields_names[i].toLowerCase()){
					$('#'+form.id+'__error').show();
					$('#'+form.id+'__error').text('Custom field already present');
					setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
					return false;
			}
			prop_value = prop_value.replace(/\s/g,'_');
			if( prop_value.toLowerCase() == cust_fields_names[i]){
				$('#'+form.id+'__error').show();
				$('#'+form.id+'__error').text('Custom field already present with label "'+fields_names[i]+' "');
				setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
				return false;
			}
		}
	}
			
	if( $('#setup_custom_fields__'+res[1]+'__'+res[2]).hasClass('active')){
		
		html += '<div id="parent_custom__{custom_tag_1}" class="alert alert-success">{custom_tag}';
		html += '<a id="setup_custom_fields__{custom_tag_1}" prop_value_custom_field="{custom_tag}" class="switch switch-success active"'; 
		html += 'data-toggle="switch" data-on="Enabled" data-off="Disabled" style="float:right;" onClick="setConfigurations(this.id,{cnt});" >'; 
	}
	if(!$('#setup_custom_fields__'+res[1]+'__'+res[2]).hasClass('active') && $('#setup_custom_fields__'+res[1]+'__'+res[2]).hasClass('switch')){
		
		html += '<div id="parent_custom__{custom_tag_1}" class="alert alert-danger">{custom_tag}';
		html += '<a id="setup_custom_fields__{custom_tag_1}" prop_value_custom_field="{custom_tag}" class="switch switch-success"'; 
		html += 'data-toggle="switch" data-on="Enabled" data-off="Disabled" style="float:right;" onClick="setConfigurations(this.id,{cnt});" >';
	}
	if(! $('#setup_custom_fields__'+res[1]+'__'+res[2]).hasClass('switch')){
		//by default i.e., for new field
		html += '<div id="parent_custom__{custom_tag_1}" class="alert alert-success">{custom_tag}';
		html += '<a id="setup_custom_fields__{custom_tag_1}" prop_value_custom_field="{custom_tag}" class="switch switch-success active"'; 
		html += 'data-toggle="switch" data-on="Enabled" data-off="Disabled" style="float:right;" onClick="setConfigurations(this.id,{cnt});" >';
	}       
	
	html += '<a id="prop_custom_fields__{custom_tag_1}" class="btn1 btn-info btn-mini properties btn-setover" prop_value_custom_field="{custom_tag}"';
	html += 'onClick="setProperties(this.id,{cnt});"><i class=icon-pencil></i> Edit</a> </div>';
	
	prop_value = encodeURIComponent(prop_value);
			//check for text type and values
			if( ( $('#'+form_name+'__type').val() == 'text' || 
				$('#'+form_name+'__type').val() == 'datepicker' ||
				$('#'+form_name+'__type').val() == 'textarea' )&& 
				( $('#'+form.id+'__default').val() != '' ) ){
		
				var fields_n = $('#'+form_name+'__default').val().split(',');
			
				if( fields_n.length > 1 ){
					$('#'+form.id+'__error').show();
					$('#'+form.id+'__error').text('Only one custom value allowed for '+ $('#'+form_name+'__type').val() +' type');
					return false;
				}
			}
			
			var form_data = $("#"+form_name).serialize();
			
			if( form_data ){
				var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/process_custom.json?ajax_params_1='+form_name+'&prop_value='+prop_value;
				
				$('.wait_message').show().addClass('indicator_1');
				$('#custom_div_container').show();
				
				$.post( ajaxUrl , form_data ,
						function(data) {
							
							if( data.info != 'fail' || data.info != 'error' ){
								
								$('.indicator_1').hide();
								var new_label = $('#'+form_name+'__label').val();
								var new_uglify_name = new_label.replace(/\s/g, '_').toLowerCase();
								var old_label = $('#'+form_name+'__custom_old_field').val();
								var html_str = '';
								if( res[2] > custom_count ){
									
								//	var desired_text = new_uglify_name.replace(/[^a-zA-Z0-9\s_-]/gi, '');
								//	var element = html.replace(/{custom_tag_1}/gi, desired_text+'__'+res[2]);
									var element = html.replace(/{custom_tag_1}/gi, new_uglify_name+'__'+res[2]);
									var final_html = element.replace(/{custom_tag}/gi, new_label );
									$('#custom_fields_val').val( custom_values +','+new_label );
									$('#custom_fields_count').val( ++custom_count );
									html_str = final_html.replace(/{cnt}/gi, custom_count );
									$( html_str ).insertBefore('#prop_text');
								}else{
									$('.wait_message').removeClass('indicator_1');
									var element = html.replace(/{custom_tag_1}/gi, res[1]+'__'+res[2]);
									var final_html = element.replace(/{custom_tag}/gi, new_label );
									
									html_str = final_html.replace(/{cnt}/gi, res[2] );
									$("#parent_custom__"+res[1]+"__"+res[2]).replaceWith( html_str );
									
									if( new_label != old_label ){
										
										var old_uglify = old_label.replace(/\s/g, '_').toLowerCase();
										//removeSessionValue( old_uglify );
										fields_names = $.grep(fields_names, function(value) {
										    return old_label != value;
										});
										
										if( fields_names.length == 0 )
											$('#custom_fields_val').val( new_label );
										else
											$('#custom_fields_val').val( fields_names.toString() +','+new_label );
									}
								}
								
							    $('[data-toggle="switch"]').each(function () {
								      var $switch = $(this);
								      $switch.switchbtn($switch.data());
							    });
								
								$('#custom_div_container').hide();
							}else{
								$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
							}
						}, 'json' );
		}
}

function removeSessionValue( field_name ){
	
	var prefix = $('#prefix').val();
	
	var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/remove_session.json?ajax_params_1='+field_name;
	
	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info == 'success' ){
				return true;
			}else{
				alert( 'Error : '+data.error );
			}
		});
}

function createNewField( id ){
	var create_id = 'prop_text';
	var value = $('#prop_text').val();
	popupProperties( create_id , value );
}

function popupProperties( id , prop_value ){
	
	$('#custom_div_container').hide();
	$('.ui-datepicker-trigger').hide();
	
	if( prop_value == '' ){
		$('#dup_custom').text('Please enter custom field name');
		$('#dup_custom').show();
		setTimeout(function(){ $('#dup_custom').fadeOut('fast'); }, 5000);
		return true;
	}
		
	var RegExp = /^([a-zA-Z0-9\s_-]+)$/;
	
	if( !RegExp.test(prop_value)){
	
		$('#dup_custom').text('Invalid name for custom field');
		$('#dup_custom').show();
		setTimeout(function(){ $('#dup_custom').fadeOut('fast'); }, 5000);
		return false;
	}
	
	var flag=0,i=0;
	var fields_values = $('#custom_fields_val').val().split(',');
	var fields_names = $('#custom_fields_nam').val().split(',');
	var req_value;
	
	for(i in fields_values){
		
		var cust_val = fields_values[i].toLowerCase();
		
		if(prop_value.toLowerCase() == cust_val){
			flag = 1;
			break;
		}
		
		var cust_name = fields_names[i];
		req_value = prop_value.replace(/\s{2,}/g,' ');
		req_value = req_value.replace(/\s{0,}[_]+\s{0,}/g,'_');
		req_value = req_value.replace(/\s{0,}[-]+\s{0,}/g,'-');
		req_value = req_value.replace(/^\s+|\s+$/g,'');
		req_value = req_value.replace(/\s/g,'_');
		
		if(req_value.toLowerCase() == cust_name){
			$('#dup_custom').text('Custom Field "'+prop_value+'" already present with label "'+fields_values[i]+' "');
			$('#dup_custom').show();
			setTimeout(function(){ $('#dup_custom').fadeOut('fast'); }, 5000);
			return false;
		}
	}
		//if( $.inArray( prop_value.toLowerCase() , fields_names ) == -1 ){
	if( flag == 0 ){
		
		var custom_count = $('#custom_fields_count').val();
		prop_value = prop_value.replace(/\s{2,}/g,' ');
		prop_value = prop_value.replace(/\s{0,}[_]+\s{0,}/g,'_');
		prop_value = prop_value.replace(/\s{0,}[-]+\s{0,}/g,'-');
		prop_value = prop_value.replace(/^\s+|\s+$/g,'');
		
		var desired_form_id = prop_value.replace(/[^a-zA-Z0-9\s_-]/gi,'');
		var form_id = 'prop_custom_fields__'+desired_form_id;
		$('#'+id).val('');
		setProperties(form_id,++custom_count,prop_value);
		$('#dup_custom').hide();
	
	}else{
		
		$('#dup_custom').text('Duplicate custom field name found.');
		$('#dup_custom').show();
		setTimeout(function(){ $('#dup_custom').fadeOut('fast'); }, 5000);
	}
	
	return true;
}

function setProperties( form_id , cnt , prop_value ){
	
	var result = form_id.split('__');
	var prefix = $('#prefix').val();
	var custom_id = cnt;
	if( prop_value == null ){
		var new_form_id = result[1].replace(/[^a-zA-Z0-9\s_-]/gi,'');
		var prop_value = result[1];
		var custom_name = new_form_id;
	}else{
		var custom_name = result[1].replace(/[^a-zA-Z0-9\s_-]/gi,'');
	}
	
	prop_value = encodeURIComponent(prop_value);
	custom_name = encodeURIComponent(custom_name);

	var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/render_custom.json?ajax_params_1='+custom_name+'&ajax_params_2='+custom_id+'&prop_value='+prop_value;
	$('.wait_message').show().addClass('indicator_1');
	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info_html ){
				$('#custom_div_container').show().html( unescape(data.info_html) ).addClass('indicator_2');
				$('.indicator_1').hide();
			}else{
				alert( 'Error : '+data.error );
				$('.wait_message').removeClass('indicator_1');
			}
		});
}

function redirectUrl( url , step_name, from_points_engine ){

	if( step_name == "engagement" && from_points_engine ){
		window.location.href=url;
	}
	
	else if( step_name == "engagement" || step_name == "notification" ){
		
		var prefix = $('#prefix').val();
		var attrs = "";
		var ajaxUrl = "";
		if(step_name == "engagement"){
			attrs = "";
			ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/processFormData.json?ajax_params_1=engagement_plans_form&attrs='+attrs;
		}
		else if( step_name == "notification"){
			var data = {};
			data ['welcome_msg'] = "";
			data ['transaction_msg'] = "";
			data ['welcome_email_subject'] = "";
			data ['welcome_email_body'] = "";
			data ['transaction_email_subject'] = "";
			data ['transaction_email_body'] = "";
			attrs = JSON.stringify( data );
			ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/processFormData.json?ajax_params_1=customer_notification_form&attrs='+attrs;
		}
		
		$('.wait_message').show().addClass('indicator_1');
		
		$.post( ajaxUrl , '' ,
			function(data) {
					if( data.info == 'success'){
						$('.indicator_1').hide();
						window.location.href=url;
					}else{
						$('.wait_message').removeClass('indicator_1');
						$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
					}
				}, "json" );
	}else	
		window.location.href = url;
}

function processData( id , url, from_points_engine ){
	
	var form_name = id.split('btn_parent_');
	
	var prefix = $('#prefix').val();
	
	if( form_name[1] != 'container_test' && form_name[1] != 'summary_form' ){
		
		if( $("#"+form_name[1]).validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
			
			var form_data = $("#"+form_name[1]).serialize();
			if( $('#'+form_name[1]+'__country').val() == -1){
				$('.flash_message').addClass('redError').show().html('Error: Please select the country.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return;
			}
		
			//TODO Removed as no validation required at registration time.
//			if( $('#'+form_name[1]+'__mobile_validated').val() == 0 ){
//				$('.flash_message').addClass('redError').show().html('Error: Mobile number not validated.');
//				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
//				return;
//			}
//			if($('#'+form_name[1]+'__email_validated').val()==0){
//				$('.flash_message').addClass('redError').show().html('Error: Email id not validated.');
//				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
//				return;
//			}
					
			var attrs = ''; 
			if( form_name[1] == 'custom_fields_form' ){
				attrs = $('#custom_fields_val').val();
			}
			
			if( form_name[1] == 'campaigns_form' ){
				attrs = getCampaignsFormData();
				if(!attrs) return;
			}

			if( form_name[1] == 'customer_notification_form' ){
				if($('#notification_is_valid').val() == 1){
					var data = {};
					data ['welcome_email_subject'] = $('#welcome_email_subject').val();
					data ['welcome_email_body'] =  $('#welcome_email_body').val();
					data ['transaction_email_subject'] = $('#transaction_email_subject').val();
					data ['transaction_email_body'] = $('#transaction_email_body').val();
					data ['welcome_msg'] = $('#welcome_msg').val();
					data ['transaction_msg'] = $('#transaction_msg').val();
					
					if( ($('#welcome_email_subject').val() == "" && $('#welcome_email_body').val() != "") ||
							($('#welcome_email_subject').val() != "" && $('#welcome_email_body').val() == "") ){
								
								$('.flash_message').addClass('redError').show().html('Email Subject and Body Cannot be empty');
								setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
								return;
								
					}
					if( ($('#transaction_email_subject').val() == "" && $('#transaction_email_body').val() != "") ||
							($('#transaction_email_subject').val() != "" && $('#transaction_email_body').val() == "") ){
								
								$('.flash_message').addClass('redError').show().html('Email Subject and Body Cannot be empty');
								setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
								return;
								
					}
					
					attrs = JSON.stringify( data );
					
				}
				else{
					$('.flash_message').addClass('redError').show().html('Invalid Tags');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
					return;
				}
			}
			
			if( form_name[1] == 'engagement_plans_form' ){
				
				if( $('#configure_loyalty_slabs').length == 0 ){ /** This case occurs if program already exists*/
					attrs = "";
				}
				else{
					var tier_count = $("#tier_count").val();
					var is_valid = true;
					for( var i = 1 ; i <= tier_count;  i++){
						$("#loyalty-tier").find("div[id^=tier]").hide();
						$("#loyalty-tier").find("div#tier" + i ).show();
						is_valid = is_valid && $("form#form_tier_"+i).validationEngine({promptPosition : "centerRight",returnIsValid:true})
						if( !is_valid ){
							$("#loyalty-tier").find("input#tiersRadios" +i).attr({
								"checked"	: "checked"
							});
							return;
						}
					}
					
					is_valid = is_valid && $("form#additional_info").validationEngine({promptPosition : "centerRight",returnIsValid:true})
					
					if( is_valid ){
						
						var slab_infos = {};
						var tier_name_prev = "";
						var upgrade_tier_value_prev = -9999;
						
						for( var i = 1 ; i <= tier_count ; i++){
							
							var tier_name = $("#tier_name_"+i).val();
							var issue_points = $("#issue_points_on_"+i).val();
							var tier_desc = $("#tier_desc_"+i).val();
							if( i != 1)
								var upgrade_tier_value = $("#upgrade_tier_value_"+i).val();
							else
								var upgrade_tier_value = -1;
							
							tier_name_prev = tier_name;
							upgrade_tier_value_prev = upgrade_tier_value;
							
							var slab_info = { 'tier_name' : tier_name, 	
									  'tier_desc' : tier_desc,
									  'upgrade_tier_value' : upgrade_tier_value,
									  'issue_points' : issue_points
									};
							slab_infos[i] = slab_info;
						}
						
						/**
						 * validation
						 * - unique tier name 
						 * - upgrade tier on value should be greater than previous
						 */
						
						for( var i = 1 ; i <= tier_count ; i++){
							for( var j = i+1; j <= tier_count; j++ ){
								if( $('#tier_name_'+i).val() == $('#tier_name_'+j).val() ){
									$('.flash_message').addClass('redError').show().html('Tier names should be unique');
									setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
									return;
								}
								
								if( parseInt($('#upgrade_tier_value_'+i).val() ) >= parseInt($('#upgrade_tier_value_'+j).val()) ){
									$('.flash_message').addClass('redError').show().html('Error in Upgrade Tier on value');
									setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
									return;
								}
								
							}
						}
						
						var data = {};
						data ['slab_infos'] = slab_infos;
						data ['tier_count'] = tier_count;
						data [ 'points_expire_limit'] = $("#points_expire_limit").val(); 
						data ['points_for_redemption'] = $("#points_for_redemption").val();
						attrs = JSON.stringify( data );
					}
					else
						return;
				}
			} // -----
			
			var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/processFormData.json?ajax_params_1='+form_name[1]+'&attrs='+attrs;
			$('.wait_message').show().addClass('indicator_1');
			
			$.post( ajaxUrl , form_data ,
				function(data) {
						if( data.info == 'success'){
							$('.indicator_1').hide();
							if( form_name[1] == 'engagement_plans_form' && from_points_engine )
								window.parent.location.href=url;
							else
								window.location.href=url;
						}else{
							$('.wait_message').removeClass('indicator_1');
							$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
							setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						}
					}, "json" );
		}
	}else{
		window.location.href = url;
	}
}

function setConfigurations( id , cnt ){
	
	var status = '';
	var field_arr = id.split('__');
	
	if(! $('#'+id).hasClass('active') ){
		status = 'Disable';
		$('#'+id).parent().addClass("alert-success");
		$('#'+id).parent().removeClass("alert-danger");
	}
	else{
		status = 'Enable';
		$('#'+id).parent().addClass("alert-danger");
		$('#'+id).parent().removeClass("alert-success");
	}
	
	var prefix = $('#prefix').val();
	var prop_value = $('#'+id).attr('prop_value_custom_field');
	prop_value = field_arr[1];
	
	var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/custom_field_status.json?ajax_params_1='+prop_value+'&ajax_params_2='+status;
	
	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info == 'success' ){
				return true;
			}else{
				alert( 'Error : '+data.error );
			}
		});
}

function onCustomFieldTypeChange( form ){

	$(".custom_span_value").remove();
	$('#'+form.id+'__default').val("");
	$('#'+form.id+'__error').hide();
	$('#'+form.id+'__custom_container_btn').show();
	
	if($('#'+form.id+'__type').val() == 'datepicker' ){
		
		$('#'+form.id+'__custom_container').hide();
		$('.ui-datepicker-trigger').show();
		$('#'+form.id+'__custom_container_dtp').show();
	}else{
		$('#'+form.id+'__custom_container').show();
		$('.ui-datepicker-trigger').hide();
		$('#'+form.id+'__custom_container_dtp').hide();
	}
}

function verifyMobile( form ){
	
	var num = $('#'+form.id+'__mobile').val();
	var default_num = $('#'+form.id+'__default_mobile').val();
	
	if( num == default_num ){
		$('#'+form.id+'__mobile_validated').val('1');
		return true;
	}
	var sent_mobile = $('#'+form.id+'__sent_setup_mobile').val();
	if( sent_mobile == num && num != '' ){
		if( $('#'+form.id+'__mobile_validated').val() == 0 ){
			$('#'+form.id+'__mobile_pin').css('display','inline');
			$('#'+form.id+'__confirm_mobile').removeClass('hide').addClass('show');
		}
		return true;
	}else{
		$('#'+form.id+'__mobile_validated').val('0');
		$('#'+form.id+'__mobile_pin').css('display','none');
		$('#'+form.id+'__confirm_mobile').removeClass('show').addClass('hide');
		$('#error_msg_mobile_no').remove();
		$('#verify-msg').remove();
		
		var reg = new RegExp('^[0-9]+$');
		var prefix = $('#prefix').val();
		
		if( reg.test(num) ){
			
			var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/mobile_availability.json?ajax_params_1='+num;
			$('.wait_message').show().addClass('indicator_1');
			
			$.post( ajaxUrl , 
					function(data) {
							if( data.info == 'success'){
								$('.indicator_1').hide();
								$('#'+form.id+'__verify_mobile').removeClass('hide').addClass('show');
							}else{
								$('.wait_message').removeClass('indicator_1');
								$('#'+form.id+'__verify_mobile').before('<span id="error_msg_mobile_no" class="error_msg_register">'+data.error+'</span>');
							}
						}, "json" );
		}
	}
}

function verifyEmailAddr( form ){
	
	var default_email = $('#'+form.id+'__default_email').val();
	var email = $('#'+form.id+'__email').val();
	
	if( email == default_email ){
		$('#'+form.id+'__email_validated').val('1');
		return true;
	}
	var sent_email = $('#'+form.id+'__sent_setup_email').val();
	if( sent_email == email && email != '' ){
		if( $('#'+form.id+'__email_validated').val() == 0 ){
			$('#'+form.id+'__email_pin').css('display','inline');
			$('#'+form.id+'__cnf_email').removeClass('hide').addClass('show');
		}
		return true;
	}else{
		$('#'+form.id+'__email_validated').val('0');
		$('#'+form.id+'__email_pin').css('display','none');
		$('#'+form.id+'__cnf_email').removeClass('show').addClass('hide');
		$('#error_msg_email').remove();
		$('#verify-email').remove();
		
		var prefix = $('#prefix').val();
		
		var reg = /^([a-zA-Z0-9-_+.])+@([a-zA-Z0-9-_.])+\.([a-zA-Z]{2,})$/;
	
		if( reg.test(email) == true ){
			
			var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/email_availability.json?ajax_params_1='+email;
			$('.wait_message').show().addClass('indicator_1');
			
			$.post( ajaxUrl , 
					function(data) {
							if( data.info == 'success'){
								$('.indicator_1').hide();	
								$('#'+form.id+'__verify_email').removeClass('hide').addClass('show');
							}else{
								$('.wait_message').removeClass('indicator_1');
								$('#'+form.id+'__verify_email').before('<span id="error_msg_email" class="error_msg_register">'+data.error+'</span>');
							}
						}, "json" );
		}
	}
}

function verifyMobileNumber( form ){
	
	var num = $('#'+form.id+'__mobile').val();
	var prefix = $('#prefix').val();
	var sent_mobile = $('#'+form.id+'__sent_setup_mobile').val();
	if( sent_mobile == num ){
		$('#'+form.id+'__verify_mobile').removeClass('show').addClass('hide');
		$('#'+form.id+'__mobile_pin').css('display','inline');
		$('#'+form.id+'__confirm_mobile').removeClass('hide').addClass('show');
		return true;
	}else{
		var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/process_mobile.json?ajax_params_1='+num;
		$('.wait_message').show().addClass('indicator_1');
		$.getJSON( ajaxUrl,
			function(data) {
				if( data.info == 'success' ){
					$('.indicator_1').hide();
					$('#'+form.id+'__verify_mobile').removeClass('show').addClass('hide');
					$('#'+form.id+'__mobile_pin').css('display','inline');
					$('#'+form.id+'__confirm_mobile').removeClass('hide').addClass('show');
					$('#'+form.id+'__sent_setup_mobile').val(num);
					return true;
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}
			});
	}
}

function displayMessageMobile( form ){

	var pin = $('#'+form.id+'__mobile_pin').val();
	if(pin == ''){
		
		$('.flash_message').addClass('redError').show().html('Error: Please enter verification code.');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	}else{
		
		var mobile = $("#"+form.id+'__mobile').val();
		var prefix = $('#prefix').val();
		
		var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/confirm_mobile.json?ajax_params_1='+pin+'&ajax_params_2='+mobile;
		$('.wait_message').show().addClass('indicator_1');
	
		$.getJSON( ajaxUrl,
				function(data) {
					if( data.info == 'success' ){
						$('.indicator_1').hide();
						$('#'+form.id+'__mobile').after('<span id="verify-msg" class="verify-msg">Mobile number verified.</span>');
						$('#'+form.id+'__mobile_pin').val('');
						$('#'+form.id+'__mobile_pin').css('display','none');
						$('#'+form.id+'__confirm_mobile').removeClass('show').addClass('hide');
						$('#'+form.id+'__mobile_validated').val('1');
						$('#'+form.id+'__default_mobile').val(mobile);
						return true;
					}else{
						$('.wait_message').removeClass('indicator_1');
						$('.flash_message').addClass('redError').show().html('Error: Mobile could not be verified.');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						$('#'+form.id+'__mobile_pin').val('');
					}
				});
	}
}

function verifyEmail( form ){
	
	var email = $('#'+form.id+'__email').val();
	var prefix = $('#prefix').val();
	var sent_email = $('#'+form.id+'__sent_pin_email').val();
	if( sent_email == email ){
		$('#'+form.id+'__verify_email').removeClass('show').addClass('hide');
		$('#'+form.id+'__email_pin').css('display','inline');
		$('#'+form.id+'__cnf_email').removeClass('hide').addClass('show');
		return true;
	}else{
		var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/process_email.json?ajax_params_1='+email;
		$('.wait_message').show().addClass('indicator_1');
		$.getJSON( ajaxUrl,
			function(data) {
				if( data.info == 'success' ){
					$('.indicator_1').hide();
					$('#'+form.id+'__verify_email').removeClass('show').addClass('hide');
					$('#'+form.id+'__email_pin').css('display','inline');
					$('#'+form.id+'__cnf_email').removeClass('hide').addClass('show');
					$('#'+form.id+'__sent_setup_email').val(email);
					return true;
				}else{
					$('.wait_message').removeClass('indicator_1');
					$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				}
			});
	}
}

function displayMessageEmail( form ){
	
	var pin = $('#'+form.id+'__email_pin').val();
	if(pin == ''){
		
		$('.flash_message').addClass('redError').show().html('Error: Please enter verification code.');
		setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
	}else{
		var email = $('#'+form.id+'__email').val();
		var prefix = $('#prefix').val();
		
		var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/confirm_email.json?ajax_params_1='+pin+'&ajax_params_2='+email;
		$('.wait_message').show().addClass('indicator_1');
		
		$.getJSON( ajaxUrl,
				function(data) {
					if( data.info == 'success' ){
						$('.indicator_1').hide();
						$('#'+form.id+'__email').after('<span id="verify-email" class="verify-email">Email id verified.</span>');
						$('#'+form.id+'__email_pin').css('display','none');
						$('#'+form.id+'__email_pin').val('');
						$('#'+form.id+'__cnf_email').removeClass('show').addClass('hide');
						$('#'+form.id+'__email_validated').val('1');
						$('#'+form.id+'__default_email').val(email);
						return true;
					}else{
						$('.wait_message').removeClass('indicator_1');
						$('.flash_message').addClass('redError').show().html('Error: Email could not be verified.');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						$('#'+form.id+'__email_pin').val('');
					}
				});
	}
}

$(document).ready(function(){
	tierNo = 1;
	$(window).scroll(function(){
		
		if  ($(window).scrollTop() >= 100 ){
	         $('.indicator_2')
			.stop()
			.animate({'marginTop': ($(window).scrollTop() - 100 ) + 'px'}, 'slow' );
	    }
	});
	if( $('#feature__MASTER__zone__1').hasClass('active')){
		$('#master_add_zone').show();
	}
	else{
		$('#master_add_zone').hide();
	}

	// store id and cursor position in hidden variable
	$('#welcome_email_body, #transaction_email_body,#welcome_email_subject, #transaction_email_subject, #welcome_msg, #transaction_msg' ).unbind('focus keyup click');
	$('#welcome_email_body, #welcome_email_subject, #welcome_msg, #transaction_email_body, #transaction_email_subject, #transaction_msg').on('focus keyup click' ,
		function(){
			var pos = getCursorPos(this);
			$('#focused_id').val( this.id );
			$('#cursor_position').val( pos.start )
			
			var tags = new Array();
			var id = this.id.toString();
			
			if( id.indexOf("welcome") !=-1) 
				tags = ["full_name", "store_name"];   // supported tags for registration events
			else if( id.indexOf("transaction") !=-1)
				tags = ["full_name", "store_name", "slab_name", 
				        "current_points", "cumulative_purchases", 
				        "cumulative_points","bill_number", 
				        "bill_amount", "bill_discount", 
				        "bill_gross_amount", "bill_date", 
				        "bill_notes"]; 		//supported tags for transaction events
			 	
			var x = []; 
			
			// Get all tags which enclosed between {{ and }}
			x = this.value.match(/{{([^}{]*)}}/g);
			var y = [];
			y = ( x == null ) ? "" : x.toString()
									  .replace(/{/g,"")
									  .replace(/}/g,"|")
									  .replace(/,/g,'')
									  .split("||");
			
			// compare with supported tags
			for( var i = 0; i < y.length-1 ; i++){
				var flag = 0;
				for( var j = 0; j < tags.length; j++ ){
					if( y [i] == tags[j] )
						flag = 1;
				}
				// if not supported display error msg
				if( flag != 1 ){
					$('#notification_is_valid').val(0);
					$('.flash_message').addClass('redError').show().html('Invalid Tags');
					setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
					return;
				}
				$('#notification_is_valid').val(1);
			}
	});
	
	// message and email editor
	// on double click of tags
	$('.msg_tags_edit').unbind("click");
	$('.msg_tags_edit').on('click', function(){
		var id = $(this).attr('id');
		myValue = id.split('__');
		var focused_id = $("#focused_id").val();
		var cursor_position = $('#cursor_position').val();
		var text = $("#" + focused_id ).val();
		var edited_text = text.substring ( 0, cursor_position ) + myValue[1] + text.substring (cursor_position, text.length); 
		$("#" + focused_id ).focus();
		$("#" + focused_id ).val( edited_text );
		var start =  parseInt( cursor_position ) + parseInt( myValue[1].length );
		setCursorPos( $("#" + $("#focused_id").val() )[0] , start, start );
		$('#cursor_position').val( start );
	});
	
	//allow only numerics for input type = number
	$('input[type="number"]').unbind('keypress').on('keypress',function (e) {
	     //if the letter is not digit then don't type anything
	     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	        return false;
	    }
	   });
	
	// On keyup, update the tier collection
	$('#tier_name_1').unbind("keyup").on("keyup", function(){
		
		var tier_count = $("#tier_count").val();
		// check for uniqueness of tier name
		if ( $("form#form_tier_1" ).validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
		
			var valid = true;
			for( var i = 1 ; i <= tier_count ; i++){
				for( var j = i+1; j <= tier_count; j++ ){
					if( $('#tier_name_'+i).val() == $('#tier_name_'+j).val() ){
						$('.flash_message').addClass('redError').show().html('Tier names should be unique');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						valid = false;
					}
				}
			}	
			if( valid == true ){
				$("#tiersRadios1" ).find('.dynamic-tier-number').remove();
				$("#tiersRadios1" ).next().attr("title",$('#tier_name_1').val() == "" ? "Tier 1" : $('#tier_name_1').val() );
				var dispayable_tier_name = $('#tier_name_1').val() == "" ? "Tier 1" : 
					( $('#tier_name_1').val().length <= 10 ? $('#tier_name_1').val() : $('#tier_name_1').val().substr(0,10)+"..")   ;
				$("#tiersRadios1" ).next().html( dispayable_tier_name );
			}
			
			$('.formErrorContent').each ( function(){
				$(this).parent().remove();
			});
		}
		else{
			$("#tiersRadios1" ).find('.dynamic-tier-number').remove();
			$("#tiersRadios1" ).next().html("Tier 1");
		}
	});
	
	$("#add-tier").unbind("click").click(function() {
		
		//unbinding because Click event was being fired multiple times.
		var currentTier			= "#tier"+ tierNo,
			nextTierNumber		= tierNo + 1,
			nextTier			= "tier"+ nextTierNumber,
			greaterTierLevel	= $(".clonable").clone(),
			radioClone			= $(".radio-clonable").clone(),
			$tierCollection		= $("#tier-collection");

		//hide the current tier level
		//$(currentTier).hide();
		$('div[id^=tier]').hide();
		
		//append the cloned element to the dom
		$(currentTier).after(greaterTierLevel);
		
		//finding the cloned element and doing *stuff* with it
		var $clonedElement = $(currentTier).siblings().closest(".clonable").first();
		$clonedElement.removeClass("clonable").attr("id", nextTier).show();
		$clonedElement.find(".dynamic-tier-number").html(nextTierNumber);
		
		//another interesting way to do the *stuff*. No finding the recently appended element
		// $('something to append').appendTo('somebody').doStuff();
		radioClone.appendTo($tierCollection)
					.removeClass("radio-clonable hide")
					.find("label#radio-tier").attr("id", "radio-tier" + nextTierNumber)
					.find("input#tiersRadios").attr({
						"id"		: "tiersRadios" + nextTierNumber,
						"value"		: "tier" + nextTierNumber,
						"checked"	: "checked"
					})
					.next().html( "Tier " + nextTierNumber );
		
		//finally increase the tier Number
		tierNo++;
		
		//append tier no to ids 
		
		$("#tier"+nextTierNumber).find("form,input,textarea").each( function(){
			this.id = this.id + nextTierNumber;
			this.name = this.name + nextTierNumber;
		})
		
		// On keyup, update the tier collection
		$('#tier_name_' + nextTierNumber ).unbind("keyup").on("keyup", function() {
			if ( $("form#form_tier_" + nextTierNumber ).validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
				
				var tier_count = $("#tier_count").val();
				// check for uniqueness of tier name
				
				var valid = true;
				for( var i = 1 ; i <= tier_count ; i++){
					for( var j = i+1; j <= tier_count; j++ ){
						if( $('#tier_name_'+i).val() == $('#tier_name_'+j).val() ){
							$('.flash_message').addClass('redError').show().html('Tier names should be unique');
							setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
							valid = false;
						}
					}
				}	
				if( valid == true ){
					$("#tiersRadios" + nextTierNumber ).find('.dynamic-tier-number').remove();
					$("#tiersRadios" + nextTierNumber ).next().attr("title", $('#tier_name_' + nextTierNumber ).val() === "" ? " Tier " 
																		+ nextTierNumber : $('#tier_name_' + nextTierNumber ).val() );
					
					var dispayable_tier_name = $('#tier_name_' + nextTierNumber ).val() === "" ? " Tier " + nextTierNumber : 
								( $('#tier_name_' + nextTierNumber ).val().length <= 10 ? $('#tier_name_' + nextTierNumber ).val() :
									$('#tier_name_' + nextTierNumber ).val().substr(0,10) + ".." ) ;
					
					$("#tiersRadios" + nextTierNumber ).next().html( dispayable_tier_name );
				
				}
				
				$('.formErrorContent').each ( function(){
					$(this).parent().remove();
				});
			}
			else{
				$("#tiersRadios" + nextTierNumber ).find('.dynamic-tier-number').remove();
				$("#tiersRadios" + nextTierNumber ).next().html( " Tier " + nextTierNumber );
			}
		});
		
		$('#upgrade_tier_value_' + nextTierNumber ).unbind("keyup").on("keyup", function() {
			
			var tier_count = $('#tier_count').val();
			var valid = true;
			for( var i = 1 ; i <= tier_count ; i++){
				for( var j = i+1; j <= tier_count; j++ ){
					if( parseInt($('#upgrade_tier_value_'+i).val()) >= parseInt($('#upgrade_tier_value_'+j).val()) ){
						$('.flash_message').addClass('redError').show().html('Error in Upgrade Tier on value');
						setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						valid = false;
					}
				}
			}
			
			if( valid == true ){
				$('.flash_message').each( function(){
					$(this).hide();
				});
			}
		});
	
		$("#delete-tier").show();
		//Limiting the number of tiers to 3
	    $("#tier_count").val( tierNo );
		/*if(tierNo === 3) {
			$("#add-tier").hide();
		}*/
		
		$('input[type="number"]').unbind('keypress').on('keypress',function (e) {
		     //if the letter is not digit then don't type anything
		     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
		        return false;
		    }
		   });
		
	});
	
	$("#delete-tier").unbind("click").on("click" , function(){
		
		$("#add-tier").show();
		$("div#tier"+tierNo).remove();
		$("label#radio-tier"+tierNo).parent().remove();
		tierNo--;
		$("#loyalty-tier").find("div[id^=tier]").hide();
		$("#loyalty-tier").find("div#tier" + tierNo).show();
		$("#loyalty-tier").find("input#tiersRadios" +tierNo).attr({
								"checked"	: "checked"
						});
		$("#tier_count").val( tierNo );
		if( tierNo === 1 )
			$("#delete-tier").hide();
		else
			$("#delete-tier").show();
	});
	
	$("#tier-collection input[name='tiersRadios']").live('change', function(){
		var index = $(this).attr("id").charAt($(this).attr("id").length -1);
		$("#loyalty-tier").find("div[id^=tier]").hide();
		$("#loyalty-tier").find("div#tier" + index).show();
	});

	
	$('#text_messages_tab').unbind('click').on('click', function(){
		$('#welcome_msg_btn').trigger('click');
	});
	
	$('#emailers_tab').unbind('click').on('click',function(){
		$('#welcome_email_btn').trigger('click');
	});
	
	$('#transaction_msg_btn, #div_transaction_msg').click(function(){
		$('#transaction_msg').focus();
		$('#transaction_msg').trigger('focus');
		$('#welcome_msg_div, #transaction_msg_btn_div, #welcome_msg_template, #change_welcome_message').hide();
		$('#transaction_msg_div, #welcome_msg_btn_div, #transaction_msg_template, #change_transaction_message').show();
		$('#div_welcome_msg').find('span').removeClass('active_notification');
		$('#div_transaction_msg').find('span').addClass('active_notification');
	});
	
	$('#welcome_msg_btn, #div_welcome_msg').click(function(){
		$('#welcome_msg').focus();
		$('#welcome_msg').trigger('focus');
		$('#transaction_msg_div, #welcome_msg_btn_div,  #transaction_msg_template, #change_transaction_message').hide();
		$('#welcome_msg_div, #transaction_msg_btn_div,  #welcome_msg_template, #change_welcome_message').show();
		$('#div_transaction_msg').find('span').removeClass('active_notification');
		$('#div_welcome_msg').find('span').addClass('active_notification');
	});
	
	$('#transaction_email_btn, #div_transaction_email').click(function(){
		$('#transaction_email_subject').focus();
		$('#transaction_email_subject').trigger('focus');
		$('#welcome_email, #transaction_email_btn_div, #welcome_email_template, #change_welcome_email').hide();
		$('#transaction_email, #welcome_email_btn_div, #transaction_email_template, #change_transaction_email').show();
		$('#div_welcome_email').find('span').removeClass('active_notification');
		$('#div_transaction_email').find('span').addClass('active_notification');
	});

	$('#welcome_email_btn, #div_welcome_email').click(function(){
		$('#welcome_email_subject').focus();
		$('#welcome_email_subject').trigger('focus');
		$('#transaction_email, #welcome_email_btn_div, #transaction_email_template, #change_transaction_email').hide();
		$('#welcome_email, #transaction_email_btn_div, #welcome_email_template, #change_welcome_email').show();
		$('#div_transaction_email').find('span').removeClass('active_notification');
		$('#div_welcome_email').find('span').addClass('active_notification');
	});
});

function removeAddedZone( id ){

	var prefix = $('#prefix').val();
	var current_zones = $('#master_data_add_zone__default').val().split(',');
	var current_desc = $('#master_data_add_zone__default_desc').val().split(':::');
	var ele_name = id.split('master_delete_zone__');
	
	current_zones = $.grep(current_zones, function(value) {
		
	    return $('#master_zone__'+ele_name[1]).attr( 'span_value_zone' ) != value;
	});
	
	var left_desc = '';
	$.each( current_desc , function() {
		if( $('#master_zone__'+ele_name[1]).attr( 'prop_desc' ) != this ){
			left_desc += this+':::';
		}
	});
	left_desc =  left_desc.slice( 0 , left_desc.length - 3 );
	
	var zone_count = $('#master_data_add_zone__count').val() - 1;
	$('#master_data_add_zone__count').val(zone_count);
	$('#master_data_add_zone__default').val( current_zones.toString() );
	$('#master_data_add_zone__default_desc').val( left_desc );
	
	if( zone_count < 3 ){
		
		$('#add_form_heading').show();
		$('#master_data_add_zone').show();
	}
	
	if( zone_count == 0 ){
		
		$('#display_zone_list').hide();
	}

	var ajaxUrl = prefix + '/xaja/AjaxService/setup_assistant/delete_zone_master.json?ajax_params_1='+ele_name[1]+'&ajax_params_2='+zone_count;

	$.getJSON( ajaxUrl,
		function(data) {
			if( data.info == 'success' ){
				return true;
			}else{
				alert( 'Error : '+data.error );
			}
		});
}

function addZoneForOrg( form ){

	var form_name = form.id;
	var prefix = $('#prefix').val();
	var added_zone_count = $('#'+form.id+'__count').val();
	
	var txt_val = '';
	var txt_desc = '';
	txt_val = $('#'+form.id+'__name').val();
	txt_desc = $('#'+form.id+'__description').val();
	
	var html = "<ul class='l-h-list' id='master_zone__{zone_name_encode}' span_value_zone = '{zone_name_encode}' prop_desc ='"+txt_desc+"'>";
	
		html += "<li class='item'>{zone_name}&nbsp;&nbsp;&nbsp;</li>";
		
		html += "<li id = 'span_img_{zone_name_encode}' class='item'>";
		
		html += "<a class='text-error' id='master_delete_zone__{zone_name_encode}' ";
		
		html += "onClick=\"removeAddedZone('master_delete_zone__{zone_name_encode}');$('#master_zone__{zone_name_encode}').remove();\">";
		
		html += "<i class='icon-trash' style='font-size:18px;cursor:pointer;'></i></a></li></ul>";
	
	if( txt_val != '' )
	{
		var fields_names = $('#'+form.id+'__default').val().split(',');
		var fields_desc = $('#'+form.id+'__default_desc').val();
		//check for duplicate
		var flag = false;
		$.each( fields_names , function() {

			check_txt = txt_val.toLowerCase().replace(/\s/g,'_');
			field_txt = this.toLowerCase().replace(/\s/g,'_');
			
			if( check_txt == field_txt )
			{
				$('.flash_message').addClass('redError').show().html('Error: Zone already added.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				flag = true;
			}
		});
		
		if( flag ) return true;
		
		var desired_text = txt_val.replace(/\s{2,}/g,' ');
		desired_text = desired_text.replace(/^\s+|\s+$/g,'');
		desired_text = desired_text.replace(/\s/g,'_');

		if( fields_names.toString() == '' ){
			$('#'+form.id+'__default').val( txt_val );
			$('#'+form.id+'__default_desc').val(txt_desc);
		}
		else
		{
			$('#'+form.id+'__default').val( fields_names.toString() + ',' + desired_text );
			$('#'+form.id+'__default_desc').val( fields_desc + ':::' + txt_desc );
		}
	}else{
		
		$('#'+form.id+'__error').show();
		$('#'+form.id+'__error').text('Please enter zone name');
		setTimeout(function(){ $('#'+form.id+'__error').fadeOut('fast'); }, 5000);
		return true;
	}
	
	var modified_html = html.replace(/{zone_name_encode}/gi, desired_text );
	
	var html_str = modified_html.replace(/{zone_name}/gi, txt_val );
	
	$( html_str ).insertBefore('#master_data_add_zone__appender');
	
	$('#'+form.id+'__name').val('');
	$('#'+form.id+'__description').val('');
	$('#'+form.id+'__count').val(++added_zone_count);
	
	if( added_zone_count >= 3 ){
		
		$('#add_form_heading').hide();
		$('#'+form.id).hide();
	}
	
	var form_data = $("#"+form_name).serialize();
	
	if( form_data ){
		var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/add_zone_master.json?ajax_params_1='+txt_val+'&ajax_params_2='+txt_desc+'&ajax_params_3='+added_zone_count;
		
		$('.wait_message').show().addClass('indicator_1');
		
		$.post( ajaxUrl , form_data ,
				function(data) {
						if( data.info == 'success'){
							$('.indicator_1').hide();
							$('#display_zone_list').show();
						}else{
							$('.wait_message').removeClass('indicator_1');
							$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
							setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
						}
					}, "json" );
	}
}

function hideAllCheckMobile( form ){
	
	$('#error_msg_mobile_no').remove();
	$('#'+form.id+'__verify_mobile').removeClass('show').addClass('hide');
}

function hideAllCheckEmail( form ){
	
	$('#error_msg_email').remove();
	$('#'+form.id+'__verify_email').removeClass('show').addClass('hide');
}

function getCampaignsFormData(){
	
	if( $("#email_configurations").parent().hasClass('active') ){
		if( $("#email_configurations").validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
			var sender = $('#sender_label').val();
			var s_id = $('#sender_id').val();
			var reply_to = $('#reply_to').val();
			var gsm_sender = $('#gsm_sender').val();
			var cdma_sender = $('#cdma_sender').val();
			var from_hrs = $('#from_hours').val();
			var to_hrs = $('#to_hours').val();
			
			var reg = new RegExp('^[0-9]{10,13}$');
			
			if( gsm_sender == '' ){
				$('.flash_message').addClass('redError').show().html('Error: Please enter GSM sender id.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( cdma_sender == '' ){
				$('.flash_message').addClass('redError').show().html('Error: Please enter CDMA sender id.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( !reg.test(cdma_sender) ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid CDMA sender id.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( parseInt(from_hrs) < 0 || parseInt(from_hrs) > 23 || parseInt(to_hrs) < 0 || parseInt(to_hrs) > 23 ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid blackout time.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( parseInt(from_hrs) >= parseInt(to_hrs) ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid SMS sending time.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			
			var attr = '{"sender_label":"'+sender+'","sender_id":"'+s_id+'","reply_to":"'+reply_to+'","gsm_sender":"'+gsm_sender+'","cdma_sender":"'+cdma_sender+'","min_hrs":"'+from_hrs+'","max_hrs":"'+to_hrs+'"}';
			return attr;
		}
	}
	
	if( $("#msg_configurations").parent().hasClass('active') ){
		if( $("#msg_configurations").validationEngine({promptPosition : "centerRight",returnIsValid:true}) ){
			var sender = $('#sender_label').val();
			var s_id = $('#sender_id').val();
			var reply_to = $('#reply_to').val();
			var gsm_sender = $('#gsm_sender').val();
			var cdma_sender = $('#cdma_sender').val();
			var from_hrs = $('#from_hours').val();
			var to_hrs = $('#to_hours').val();
			
			var reg = new RegExp('^[a-zA-Z0-9-_+.]+@[a-zA-Z0-9-_.]+\.([a-zA-Z]{2,})$');
			var alpha_num = new RegExp('^[a-zA-Z0-9]+$');
			var reg_mob = new RegExp('^[0-9]{10,13}$');
			
			if( !alpha_num.test(sender) ){
				$('.flash_message').addClass('redError').show().html('Error: Sender label must be alphanumeric.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( s_id == '' ){
				$('.flash_message').addClass('redError').show().html('Error: Please enter email sender id.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( !reg.test(s_id) ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid sender id email.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( reply_to == '' ){
				$('.flash_message').addClass('redError').show().html('Error: Please enter reply_to email.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( !reg.test(reply_to) ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid reply-to email id.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( !reg_mob.test(cdma_sender) ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid CDMA sender id.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( parseInt(from_hrs) < 0 || parseInt(from_hrs) > 23 || parseInt(to_hrs) < 0 || parseInt(to_hrs) > 23 ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid blackout time.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}
			if( parseInt(from_hrs) >= parseInt(to_hrs) ){
				$('.flash_message').addClass('redError').show().html('Error: Invalid SMS sending time.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
			}

			var attr = '{"sender_label":"'+sender+'","sender_id":"'+s_id+'","reply_to":"'+reply_to+'","gsm_sender":"'+gsm_sender+'","cdma_sender":"'+cdma_sender+'","min_hrs":"'+from_hrs+'","max_hrs":"'+to_hrs+'"}';
			return attr;
		}
	}
}

function getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
    	return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len }; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}

function setCursorPos(input, start, end) {
	
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
        setTimeout(function() {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    }
    else if (input.createTextRange) {
        var rng = input.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        rng.select();
    }
}

///////// copied from ruleset_render.js

function setScopeBlock(){
	
	var ajaxUrl = prefix + '/xaja/AjaxService/points/scope_form.json?ajax_params_1='+value+'&program_id='+program_id+'&ruleset_count='+ruleset_counter+'&scope_count='+scope_count;
		
		$.getJSON( ajaxUrl,
		function(data) {
			if( data.info != null ){
				alert();
			}else{
				alert( 'Error : '+data.truncate );
			}
			$('#scope_type_'+ruleset_counter).removeAttr('disabled');
		});
}

$(document).ready(function(){

	$('#template_name').keypress(function (e) {                                       
	       if (e.which == 13) {
	            e.preventDefault();
	       }
	});
	
	$('#choose_template').unbind('change').change(function(e) {
			
		var template_name = $('#template_name').val();
	    	if( template_name == '' ){
	    		$('#choose_template').val('');
	    		$('.flash_message').addClass('redError').show().html('Error: Please first enter template name.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
				return false;
	    	}
	    	
		    if(typeof FileReader == "undefined") return true;
	
		    var file = this.files[0];
		    var prefix = $('#prefix').val();
	
		    if ( file.type.match('html.*') ) {
		    	
			    var reader = new FileReader();
			    reader.readAsText(file,'UTF-8');
			    reader.onload = (function(theFile) {
		            return function(e) {
		                var result = e.target.result;
		
		                if( result ){
		                	
		            		var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/upload_email_template.json';
		            		
		            	var html = '<li id="list_{file_id}" class="temp-list border-thin"><ul class="l-h-list nostyle m-b-5">';
		            		html += '<li class="item temp_name" file_id="{file_id}"><span class="pull-left">'+template_name+'</span></li><li class="item pull-right">';
		            		html += '<a id="delete_{file_id}" file_id="{file_id}" onclick="removeEmailTemplate(this.id);">';
							html += '<i class="icon-trash upload-itag"></i></a></li></ul></li>';
		            		
						$('.wait_message').show().addClass('indicator_1');
		            	$.post( ajaxUrl,{'data':encodeURIComponent(result),'template_name':template_name},
		            	   		function(data) {
		            	   			if( data.info == 'success' ){
		            	   				
		            	   				$('.indicator_1').hide();
		            	   				$('#uploaded_list').removeClass('hide');
		            	   				$('#template_name').val('');
		            	   				$('#choose_template').val('');
		            	   				var html_str = html.replace(/{file_id}/gi, data.val );
		            	   				$( html_str ).insertAfter('#template_appender');
		            	   				var cnt = parseInt( $('#template_count').val() );
		            	   				$('#template_count').val( cnt + 1 );
		            	   				$('#choose_template').attr('disabled','disabled');
		            	   				if( parseInt( cnt + 1 )  >= 3 ){
		            	   					$('#email_templates .form-fields-container').hide();
		            	   				}
		            	   			}else{
		            	   				
		            	   				$('.wait_message').removeClass('indicator_1');
		            	   				$('#template_name').val('');
		            	   				$('#choose_template').val('');
		            	   				$('.flash_message').addClass('redError').show().html('Error: '+data.error+'');
										setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
		            	 			}
		            		},'json');
		                }
		            };
		        })(file);
		    }else{
		    	$('#template_name').val('');
				$('#choose_template').val('');
		    	$('.flash_message').addClass('redError').show().html('Error: Selected file is not a html file.');
				setTimeout(function(){ $('.flash_message').fadeOut('fast'); }, 5000);
		    }
	});
	
	$('#template_name').keyup( function(){
		var template_name = $('#template_name').val();
		if( template_name.length > 0 )
			$('#choose_template').attr('disabled',false);
		else
			$('#choose_template').attr('disabled','disabled');
	});
	
	$('.temp_name').unbind('click').live('click', function(){
		
		var file_id = $(this).attr('file_id');
		if( $('#list_'+file_id).hasClass('selected') ){
			return false;
		}
		
		$('#navigation li').removeClass('selected');
		$('#list_'+file_id).addClass('selected');
	    
		var prefix = $('#prefix').val();
		var template_name = $(this).find('span').text();
		
		var ajaxUrl = prefix+'/xaja/AjaxService/setup_assistant/template_preview.json?ajax_params_1='+file_id;
		$('.wait_message').show().addClass('indicator_1');
		
		$.getJSON(ajaxUrl,function(data){
				if( data.info ){
		
					$('.indicator_1').hide();
					$('#loading').removeClass('show').addClass('hide');
					$('#prev-iframe').removeClass('hide').addClass('show');
					$('#prev-iframe').contents().find('html').html( data.info );
					$('#template_heading').find('b').html('Preview');
					$('#template_heading').find('b').append(': '+template_name);
					$(this).removeClass('email_span_name');
				}
				else{
					$('.wait_message').removeClass('indicator_1');
					$('#loading').removeClass('hide').addClass('show');
					$('#campaign_preview').html('Content not available');
				}
		});
	});
});
