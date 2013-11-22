$(document).ready(function() {
	setTimeout(function() {
		
		// Slide
		$('#resource_action > li > a.expanded + ul').slideToggle('medium');
		$('#resource_action > li > a').click(function() {
			$(this).toggleClass('expanded').toggleClass('collapsed').parent().find('> ul').slideToggle('medium');
		});
		$('#side_pain_list .expand_all').click(function() {
			$('#menu1 > li > a.collapsed').addClass('expanded').removeClass('collapsed').parent().find('> ul').slideDown('medium');
		});
		$('#side_pain_list .collapse_all').click(function() {
			$('#resource_action > li > a.expanded').addClass('collapsed').removeClass('expanded').parent().find('> ul').slideUp('medium');
		});
	}, 250);
});
