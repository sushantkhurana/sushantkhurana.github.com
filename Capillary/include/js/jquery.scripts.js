// JavaScript Document

$(document).ready(function () {});

$(window).resize(function () {
	$('.popup_login').hide();
	$('.row_popup').hide();
});
$(window).scroll(function () {
	$('.popup_login').hide();
	$('.row_popup').hide();
});
//  Login popup Start
$('.sign_in_hover').live('mouseover', function () {
	$('.popup_login').show();
	$('.row_popup').hide();
});
$('.popup_login').live('mouseover', function () {
	$('.popup_login').show();
	$('.row_popup').hide();
}).live('mouseout', function () {
	$('.popup_login').hide();
});
//  Login popup End
//  Right popup Start
var fmi = 'row_popup';
$('.menu_file').live('mouseover', function (e) {
	$('.row_popup').show();
	$('.popup_login').hide();
	var offset = $(this).offset();
	var x = (offset.left);
	var y = (offset.top);
	var windowHeight = $(window).height();
	var menuHeight = $('.row_popup').height();
	var totalHeight = menuHeight + y;

	if (windowHeight < totalHeight) {
		$('.' + fmi).css({
			left : x - 105,
			top : y + 28,
			display : 'block'
		});
	} else {
		$('.' + fmi).css({
			left : x - 105,
			top : y + 28,
			display : 'block'
		});
	}

	$('.row_popup').live('mouseover', function (e) {
		$('.row_popup').show();
		$('.popup_login').hide();
	}).live('mouseleave', function (r) {
		$('.row_popup').hide();
	});
})
//  Right popup Start
