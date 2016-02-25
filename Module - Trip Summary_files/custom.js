// Custom JavaScript 



/*function signinSelected() {
	$(a.toggle-trigger).addClass("open");
	$(#signin-pane).addClass("open");
	$(#signin-pane).css({
		visibility:"visible", height:"auto", opacity:"1"
	});
	
	$('html, body').animate({
	        scrollTop: $("#signin-pane").offset().top
	    }, 2000);
}*/

//Function for demoing active card
function activeCardDemo() {
var cardno = $('#demoField').val();

	if (cardno == '4') {
		$('.visa').removeClass("inactive-card");
		$('.mastercard').addClass("inactive-card");
		$('.amex').addClass("inactive-card");
		$('.discover').addClass("inactive-card");
		$('.diners').addClass("inactive-card");
		$('.jcb').addClass("inactive-card");
	} 
		
	if (cardno == '51') {
		$('.visa').addClass("inactive-card");
		$('.mastercard').removeClass("inactive-card");
		$('.amex').addClass("inactive-card");
		$('.discover').addClass("inactive-card");
		$('.diners').addClass("inactive-card");
		$('.jcb').addClass("inactive-card");
	}

	if (cardno == '34') {
		$('.visa').addClass("inactive-card");
		$('.mastercard').addClass("inactive-card");
		$('.amex').removeClass("inactive-card");
		$('.discover').addClass("inactive-card");
		$('.diners').addClass("inactive-card");
		$('.jcb').addClass("inactive-card");
	}

	if (cardno == '6011') {
		$('.visa').addClass("inactive-card");
		$('.mastercard').addClass("inactive-card");
		$('.amex').addClass("inactive-card");
		$('.discover').removeClass("inactive-card");
		$('.diners').addClass("inactive-card");
		$('.jcb').addClass("inactive-card");
	}


	if (cardno == '54') {
		$('.visa').addClass("inactive-card");
		$('.mastercard').addClass("inactive-card");
		$('.amex').addClass("inactive-card");
		$('.discover').addClass("inactive-card");
		$('.diners').removeClass("inactive-card");
		$('.jcb').addClass("inactive-card");
	}

	if (cardno == '3528') {
		$('.visa').addClass("inactive-card");
		$('.mastercard').addClass("inactive-card");
		$('.amex').addClass("inactive-card");
		$('.discover').addClass("inactive-card");
		$('.diners').addClass("inactive-card");
		$('.jcb').removeClass("inactive-card");
	}

	if (cardno == '') {
		$('.visa').removeClass("inactive-card");
		$('.mastercard').removeClass("inactive-card");
		$('.amex').removeClass("inactive-card");
		$('.discover').removeClass("inactive-card");
		$('.diners').removeClass("inactive-card");
		$('.jcb').removeClass("inactive-card");

	}
}



//Function for switching to new card
function editCardStep1() {
	$('.saved-1-card').hide();
	$('.change-1-card-stage-1').show();
}

function editCardStep2() {
	$('.change-1-card-stage-1').hide();
	$('.change-1-card-stage-2').show();
}


//Functions to switch from saved to new card for shared module
function switchToNew() {
	$('#saved-card-pane').hide();
	$('#new-card-pane').show();
}

function switchToSaved() {
	$('#new-card-pane').hide();
	$('#saved-card-pane').show();
}

function toggleDescription() {
	$('.saved-card-description').toggle();
	
}



//Function for switching to saved card
function savedCard() {
	$('.add-card').hide();
	$('.saved').show();
}

//Function for switching between dropdown option for saved card list (saved cards state)
function changeSavedOption() {
var ccchoice = $('#demoCCDropdown1').val();

	if (ccchoice == '5') {
		$('.change-1-card-stage-1').hide();
		$('.change-1-card-stage-2').show();
		$("#demoCCDropdown2").val("5");
	}
}

function changeSavedOption2() {
var ccchoice2 = $('#demoCCDropdown2').val();

	if (ccchoice2 != '5') {
		$('.change-1-card-stage-2').hide();
		$('.change-1-card-stage-1').show();
		$("#demoCCDropdown1").val("ccchoice2");
	}
}

function changeSavedOption_2() {
var ccchoice = $('#demoCCDropdown1_2').val();

	if (ccchoice == '2') {
		$('.change-1-card-stage-1_2').hide();
		$('.change-1-card-stage-2_2').show();
		$("#demoCCDropdown2_2").val("2");
	}
}

function changeSavedOption2_2() {
var ccchoice2 = $('#demoCCDropdown2_2').val();

	if (ccchoice2 != '2') {
		$('.change-1-card-stage-2_2').hide();
		$('.change-1-card-stage-1_2').show();
		$("#demoCCDropdown1_2").val("ccchoice2_2");
	}
}

function changeSavedOption_3() {
var ccchoice = $('#demoCCDropdown1_3').val();

	if (ccchoice == '3') {
		$('.change-1-card-stage-1_3').hide();
		$('.change-1-card-stage-2_3').show();
		$("#demoCCDropdown2_3").val("3");
	}
}

function changeSavedOption2_3() {
var ccchoice2 = $('#demoCCDropdown2_3').val();

	if (ccchoice2 != '3') {
		$('.change-1-card-stage-2_3').hide();
		$('.change-1-card-stage-1_3').show();
		$("#demoCCDropdown1_3").val("ccchoice2_3");
	}
}



function signIn() {
	$('.site-content').fadeTo(250, 0.3, function() {
		$('.notification').fadeToggle().delay(500);
		$('.notification').fadeToggle(function ()
		{
			$('.notsignedin').fadeToggle();
			$('#traveler-guest').fadeToggle(function()
			{
				$('.signedin').fadeToggle();
				$('#traveler-signedin').fadeToggle(function()
				{
						$('.site-content').fadeTo(250, 1);
				});
			});
		});
	});
}

function selectInsurance() {
	$('.site-content').fadeTo(250, 0.3, function() {
		$('.notification').fadeToggle().delay(500);
		$('.notification').fadeToggle(function () {
			$('.site-content').fadeTo(250, 1);
		});
		
	});
}


function selectInsurancecollapse() {
	$('.notadded').animate({ opacity:'0'}, 400, function() {
		$('.added').fadeToggle(25, function() {
			$('.notadded').slideUp();
		});
	});
}


// Accordion functions
function editHotel() {
	$('.incompletehotel').show();
	$('.completehotel').hide();
}

function submitHotel() {
	$('.completehotel').show();
	$('.incompletehotel').hide();
}

function editCar() {
	$('.incompletecar').show();
	$('.completecar').hide();
}

function submitCar() {
	$('.completecar').show();
	$('.incompletecar').hide();
}

function insuranceProtected() {
	$('.protected').show();
	$('.insfields').hide();
}

function insuranceUnprotected() {
	$('.unprotected').show();
	$('.insfields').hide();
}

function editInsurance() {
	$('.insfields').show();
	$('.protected').hide();
	$('.unprotected').hide();
}

function flightInsuranceProtected() {
	$('.flightprotected').show();
	$('.flightinsfields').hide();
}

function flightInsuranceUnprotected() {
	$('.flightunprotected').show();
	$('.flightinsfields').hide();
}

function editFlightInsurance() {
	$('.flightinsfields').show();
	$('.flightprotected').hide();
	$('.flightunprotected').hide();
}

function submitPaymentInfo1() {
	$('.submittedpayment').show();
	$('.paymentinfo').hide();
	document.getElementById('complete-booking').disabled = false;
}

function submitPaymentInfo2() {
	$('.submittedpayment').show();
	$('.paymentinfo').hide();
	document.getElementById('complete-booking').hidden = false;
}

function editPaymentInfo() {
	$('.paymentinfo').show();
	$('.submittedpayment').hide();
}

// MI adding traveler
function addTraveler() {
	$('#new-traveler-pane').fadeToggle();
}

// MI adding traveler
function addTraveler2() {
	$('#new-traveler-pane2').fadeToggle();
}

function addTraveler3() {
	$('#new-traveler-pane3').fadeToggle();
}

// MI adding traveler
function addTraveler4() {
	$('#new-traveler-pane4').fadeToggle();
}

function testFunction() {
	document.getElementById('selectList-example-1').disabled = false;
}






// Multiple forms of payment with radio buttons
/*function switchToELV() {
	$('#elv-pane').show();
	$('#cc-pane').hide();
	$('#ibp-pane').hide();
	$('#paypal-pane').hide();
	$('#bitcoin-pane').hide();
}

function switchToCC() {
	$('#elv-pane').hide();
	$('#cc-pane').show();
	$('#ibp-pane').hide();
	$('#paypal-pane').hide();
	$('#bitcoin-pane').hide();
}

function switchToIBP() {
	$('#elv-pane').hide();
	$('#cc-pane').hide();
	$('#ibp-pane').show();
	$('#paypal-pane').hide();
	$('#bitcoin-pane').hide();
}

function switchToPayPal() {
	$('#elv-pane').hide();
	$('#cc-pane').hide();
	$('#ibp-pane').hide();
	$('#paypal-pane').show();
	$('#bitcoin-pane').hide();
}

function switchToBitcoin() {
	$('#elv-pane').hide();
	$('#cc-pane').hide();
	$('#ibp-pane').hide();
	$('#paypal-pane').hide();
	$('#bitcoin-pane').show();
}

// Multiple forms of payment with radio buttons V2
function switchToELV2() {
	$('#elv-pane2').show();
	$('#cc-pane2').hide();
	$('#ibp-pane2').hide();
	$('#paypal-pane2').hide();
	$('#bitcoin-pane2').hide();
}

function switchToCC2() {
	$('#elv-pane2').hide();
	$('#cc-pane2').show();
	$('#ibp-pane2').hide();
	$('#paypal-pane2').hide();
	$('#bitcoin-pane2').hide();
}

function switchToIBP2() {
	$('#elv-pane2').hide();
	$('#cc-pane2').hide();
	$('#ibp-pane2').show();
	$('#paypal-pane2').hide();
	$('#bitcoin-pane2').hide();
}

function switchToPayPal2() {
	$('#elv-pane2').hide();
	$('#cc-pane2').hide();
	$('#ibp-pane2').hide();
	$('#paypal-pane2').show();
	$('#bitcoin-pane2').hide();
}

function switchToBitcoin2() {
	$('#elv-pane2').hide();
	$('#cc-pane2').hide();
	$('#ibp-pane2').hide();
	$('#paypal-pane2').hide();
	$('#bitcoin-pane2').show();
}

// Multiple forms of payment with radio buttons V3
function switchToELV3() {
	$('#elv-pane3').show();
	$('#cc-pane3').hide();
	$('#ibp-pane3').hide();
	$('#paypal-pane3').hide();
	$('#bitcoin-pane3').hide();
}

function switchToCC3() {
	$('#elv-pane3').hide();
	$('#cc-pane3').show();
	$('#ibp-pane3').hide();
	$('#paypal-pane3').hide();
	$('#bitcoin-pane3').hide();
}

function switchToIBP3() {
	$('#elv-pane3').hide();
	$('#cc-pane3').hide();
	$('#ibp-pane3').show();
	$('#paypal-pane3').hide();
	$('#bitcoin-pane3').hide();
}

function switchToPayPal3() {
	$('#elv-pane3').hide();
	$('#cc-pane3').hide();
	$('#ibp-pane3').hide();
	$('#paypal-pane3').show();
	$('#bitcoin-pane3').hide();
}

function switchToBitcoin3() {
	$('#elv-pane3').hide();
	$('#cc-pane3').hide();
	$('#ibp-pane3').hide();
	$('#paypal-pane3').hide();
	$('#bitcoin-pane3').show();
}*/

// Multiple forms of payment with drop down 
function updatePaymentMethod() {
	var paymentmethod = $('#payment-methods').val();
	if(paymentmethod == "2") {
		$('#elv-pane').hide();
		$('#cc-pane').show();
		$('#ibp-pane').hide();
		$('#paypal-pane').hide();
		$('#bitcoin-pane').hide();
	}
	else if(paymentmethod == "3") {
		$('#elv-pane').hide();
		$('#cc-pane').hide();
		$('#ibp-pane').show();
		$('#paypal-pane').hide();
		$('#bitcoin-pane').hide();
	}
	else if(paymentmethod == "4") {
		$('#elv-pane').hide();
		$('#cc-pane').hide();
		$('#ibp-pane').hide();
		$('#paypal-pane').show();
		$('#bitcoin-pane').hide();
	}
	else if(paymentmethod == "5") {
		$('#elv-pane').hide();
		$('#cc-pane').hide();
		$('#ibp-pane').hide();
		$('#paypal-pane').hide();
		$('#bitcoin-pane').show();
	}
	else {
		$('#elv-pane').show();
		$('#cc-pane').hide();
		$('#ibp-pane').hide();
		$('#paypal-pane').hide();
		$('#bitcoin-pane').hide();
	}
}

function updatePaymentMethod3() {
	var paymentmethod = $('#payment-methods3').val();
	if(paymentmethod == "2") {
		$('#elv-pane3').hide();
		$('#cc-pane3').show();
		$('#ibp-pane3').hide();
		$('#paypal-pane3').hide();
		$('#bitcoin-pane3').hide();
	}
	else if(paymentmethod == "3") {
		$('#elv-pane3').hide();
		$('#cc-pane3').hide();
		$('#ibp-pane3').show();
		$('#paypal-pane3').hide();
		$('#bitcoin-pane3').hide();
	}
	else if(paymentmethod == "4") {
		$('#elv-pane3').hide();
		$('#cc-pane3').hide();
		$('#ibp-pane3').hide();
		$('#paypal-pane3').show();
		$('#bitcoin-pane3').hide();
	}
	else if(paymentmethod == "5") {
		$('#elv-pane3').hide();
		$('#cc-pane3').hide();
		$('#ibp-pane3').hide();
		$('#paypal-pane3').hide();
		$('#bitcoin-pane3').show();
	}
	else {
		$('#elv-pane3').show();
		$('#cc-pane3').hide();
		$('#ibp-pane3').hide();
		$('#paypal-pane3').hide();
		$('#bitcoin-pane3').hide();
	}
}

function updatePaymentMethod2() {
	var paymentmethod = $('#payment-methods2').val();
	if(paymentmethod == "2") {
		$('#elv-pane2').hide();
		$('#cc-pane2').show();
		$('#ibp-pane2').hide();
		$('#paypal-pane2').hide();
		$('#bitcoin-pane2').hide();
	}
	else if(paymentmethod == "3") {
		$('#elv-pane2').hide();
		$('#cc-pane2').hide();
		$('#ibp-pane2').show();
		$('#paypal-pane2').hide();
		$('#bitcoin-pane2').hide();
	}
	else if(paymentmethod == "4") {
		$('#elv-pane2').hide();
		$('#cc-pane2').hide();
		$('#ibp-pane2').hide();
		$('#paypal-pane2').show();
		$('#bitcoin-pane2').hide();
	}
	else if(paymentmethod == "5") {
		$('#elv-pane2').hide();
		$('#cc-pane2').hide();
		$('#ibp-pane2').hide();
		$('#paypal-pane2').hide();
		$('#bitcoin-pane2').show();
	}
	else {
		$('#elv-pane2').show();
		$('#cc-pane2').hide();
		$('#ibp-pane2').hide();
		$('#paypal-pane2').hide();
		$('#bitcoin-pane2').hide();
	}
}

function updatePaymentMethod4() {
	var paymentmethod = $('#payment-methods4').val();
	if(paymentmethod == "2") {
		$('#elv-pane4').hide();
		$('#cc-pane4').show();
		$('#ibp-pane4').hide();
		$('#paypal-pane4').hide();
		$('#bitcoin-pane4').hide();
	}
	else if(paymentmethod == "3") {
		$('#elv-pane4').hide();
		$('#cc-pane4').hide();
		$('#ibp-pane4').show();
		$('#paypal-pane4').hide();
		$('#bitcoin-pane4').hide();
	}
	else if(paymentmethod == "4") {
		$('#elv-pane4').hide();
		$('#cc-pane4').hide();
		$('#ibp-pane4').hide();
		$('#paypal-pane4').show();
		$('#bitcoin-pane4').hide();
	}
	else if(paymentmethod == "5") {
		$('#elv-pane4').hide();
		$('#cc-pane4').hide();
		$('#ibp-pane4').hide();
		$('#paypal-pane4').hide();
		$('#bitcoin-pane4').show();
	}
	else {
		$('#elv-pane4').show();
		$('#cc-pane4').hide();
		$('#ibp-pane4').hide();
		$('#paypal-pane4').hide();
		$('#bitcoin-pane4').hide();
	}
}

function updatePaymentMethodBRMX() {
	var paymentmethod = $('#payment-methodsBRMX').val();
	if(paymentmethod == "2") {
		$('#cc-paneBRMX').hide();
		$('#paypal-paneBRMX').show();
	}
	else {
		$('#cc-paneBRMX').show();
		$('#paypal-paneBRMX').hide();
	}
}

function useStoredELV() {
	$('#saved-elv-pane').show();
	$('#new-elv-pane').hide();
}

function useNewELV() {
	$('#new-elv-pane').show();
	$('#saved-elv-pane').hide();
}

function useStoredCC() {
	$('#saved-cc-pane').show();
	$('#new-cc-pane').hide();
}

function useNewCC() {
	$('#new-cc-pane').show();
	$('#saved-cc-pane').hide();
}
