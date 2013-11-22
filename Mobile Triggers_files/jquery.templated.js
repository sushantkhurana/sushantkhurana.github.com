(function($){
	$.fn.templated = function(options) {
		var tagHtml = "<span class='editor_tag' title='%desc%' contenteditable='false'>%name%</span>",
			tagText = "{{%name%}}";
			
	    var settings = $.extend( { 'render'  : 'object' }, options );
	    
	    var words = options.words;
	    
		return this.each(function() {
			var range = null;
			
			var t = $(this);
			var container = $("<div class='editor_container'>");
			var editor = $("<div contenteditable class='editor'>").appendTo(container);
			var panel = $("<div class='editor_panel'>").appendTo(container);
			var filter = $("<input class='editor_filter'>").appendTo(panel);
			var results= $("<ul class='editor_results'>").appendTo(panel);
			var parent_tag = $('li.parent_subitem').unbind('click');
			var child_tag = $('ul.parent_sub_tag').unbind('click'); 
			var parent_tag2 = $('ul.parent_subitem2').unbind('click');
			var child_tag2 = $('ul.parent_sub_tag2').unbind('click');
				
			function escapeRegex(text) {
				return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")
					.replace(/\s/g, "\\s+")
					.replace(/'|"/g,"(?:'|\")");
			}
			
			
			
			editor.html(
				t.val().replace(new RegExp(escapeRegex(tagText).replace("%name%", "(.*?)"), "g"),
					function(str, word, off, s) {
						if(!words[word]) return str;
						return tagHtml.replace(/%name%/g, word).replace(/%desc%/g, words[word].desc);
					}
				)
			);
			
			function saveText(e) {
				
				t.val($("<div>").html(
					editor.html().replace(
						new RegExp(escapeRegex(tagHtml).replace("%name%", "(.*?)").replace(/%.*?%/g, "(?:.*?)"), "g"),
						tagText.replace(/%name%/g, "$1")
					)
					.replace(/\<(p|div|br).*?\>/g, "\n")
					.replace(/\<.*?\>/g, "")
				).text());
			}
			editor.keyup(saveText).change(saveText);
			
			function insert(word,desc) {
				editor.focus();
				//var html = tagHtml.replace("%name%",word).replace("%desc%",words[word].desc);;
				var html = tagHtml.replace("%name%",word).replace("%desc%",desc);;
				if(window.getSelection) { // W3C route
					var tag = $(html)[0];
					range.insertNode(tag);
					range.selectNode(tag);
					range.collapse(false);
					restoreSelection();
				}
				else if(document.selection) { // IE route
					range.pasteHTML(html);
				}
				saveText();
			}
			
			function saveSelection() {
				
				if(window.getSelection) {
					var sel = window.getSelection();
					range = sel.getRangeAt(0);
				}
				else if(document.selection) {
					range = document.selection.createRange();
				}
			}
			
			function restoreSelection() {
				
				if(range) {
					if(window.getSelection) {
						var sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					}
					else if(document.selection) {
						range.select();
					}
				}
			}
			
			function parentHideShow(){
				
				var id = $(this).attr('id');
				$('#'+id+' > ul').toggleClass('hide');
				$('#'+id+' > i').toggleClass('icon-minus');
			}
			
			function childHideShow(){
				
				var id = $(this).attr('id');
				var parent = $(this).parent().attr('id');
				if( !$('#'+id).hasClass('hide') ){
					var s_var = id.split('sub_');
					$('#'+s_var[1]+' > i').toggleClass('icon-minus');
				}
				$('#'+id).toggleClass('hide');
				// $('#'+parent+' > i').toggleClass('icon-minus');
			}
			
			function childHideShow2(){
				
				var id = $(this).attr('id');
				var parent = $(this).parent().attr('id');
				
				if( !$('#'+id).hasClass('hide') ){
					var s_var = id.split('sub2_');
					$('#'+s_var[1]+' > i').toggleClass('icon-minus');
				}
				$('#'+id).toggleClass('hide');
				// $('#'+parent+' > i').toggleClass('icon-minus');
			}
			
			$(editor).click(saveSelection).keyup(saveSelection);
			
			for(var w in words) {
				
				if( words[w].subtags ){
					//It will be used to iterate through the sub tags list
					var divs = $("<li id='holder__"+w+"' >").addClass("parent_subitem").html(words[w].name+"<i class='icon-plus float-right'></i>").appendTo(results);
					var ul_divs = $("<ul id='sub_holder__"+w+"' class='parent_sub_tag hide'>").appendTo(divs);
					
					for(var w1 in words[w]['subtags']) {
						
						if( words[w]['subtags'][w1].subtags2 ){
							
							//It will be used to iterate through the sub tags list
							var divs2 = $("<ul id='holder2__"+w1+"' >").addClass("parent_subitem2").html(words[w]['subtags'][w1].name+"<i class='icon-plus float-right'></i>").appendTo(ul_divs);
							var ul_divs2 = $("<ul id='sub2_holder2__"+w1+"' class='parent_sub_tag2 hide'>").appendTo(divs2);
								
							for(var w2 in words[w]['subtags'][w1].subtags2 ) {
									
								var a = $("<li>").addClass("editor_result")
									.data("word" , " "+words[w]['subtags'][w1]["subtags2"][w2].name.toLowerCase())
									.html(words[w]['subtags'][w1]["subtags2"][w2].name).appendTo(ul_divs2);
							
								(function() {
									var ww = w+'.'+w1+'.'+w2;
									if( settings.render == 'string' )
										ww = w2;
									var desc = words[w]['subtags'][w1]["subtags2"][w2].desc;
									a.click(function() {insert(ww,desc);});
								}());
							}
						}else{
							
							var a = $("<li>").addClass("editor_result")
							.data("word" , " "+words[w]['subtags'][w1].name.toLowerCase())
							.html(words[w]['subtags'][w1].name).appendTo(ul_divs);
					
							(function() {
								var ww = w+'.'+w1;
								if( settings.render == 'string' )
									ww = w1;
								var desc = words[w]['subtags'][w1].desc;
								a.click(function() {insert(ww,desc);});
							}());
						}
					}
				}else{
					
					var a = $("<li>").addClass("editor_result")
								.data("word", " "+words[w].name.toLowerCase())
								.html(words[w].name).appendTo(results);
					(function() {
						var ww = w;
						var desc = words[w].desc;
						a.click(function() {insert(ww,desc);});
					}());
				}
			}
			
			container.height(t.height()).width(t.width());
			parent_tag.bind( 'click' , parentHideShow );
			child_tag.bind( 'click' , childHideShow );			
			parent_tag2.bind( 'click' , parentHideShow );
			child_tag2.bind( 'click' , childHideShow2 );
			
			filter.keyup(function() {
				var f = new RegExp("\\b" + filter.val().toLowerCase());
				results.children().each(function() {
					
					if(f.test($(this).data("word"))) {
						$(this).slideDown(200);
					}
					else {
						
						if( $(this).data("word") === undefined ){
							
							$('.parent_sub_tag').children().each(function() {
								
								if(f.test($(this).data("word"))) {
									$(this).slideDown(200);
									var id = $(this).parent().attr('id');
									if( !$('#'+id).hasClass('hide') ){
										var s_var = id.split('sub_');
										$('#'+s_var[1]+' > i').addClass('icon-minus');
										$('#'+s_var[1]+' > ul').addClass('hide');
									}
									$('#'+id).toggleClass('hide');
								}else{
									
									if( $(this).data("word") === undefined ){
										
										$('.parent_sub_tag2').children().each(function() {
											
											if(f.test($(this).data("word"))) {
												$(this).slideDown(200);
												var id = $(this).parent().attr('id');
												if( !$('#'+id).hasClass('hide') ){
													var s_var = id.split('sub2_');
													$('#'+s_var[1]+' > i').addClass('icon-minus');
													$('#'+s_var[1]+' > ul').addClass('hide');
												}
												$('#'+id).toggleClass('hide');
											}
										});
									}else{
										$(this).slideUp(200);
										$('.parent_sub_tag').children().each(function() {$(this).hide();});
										$('.parent_sub_tag2').children().each(function() {$(this).hide();});
									}
								}
							});
						}else{
							$(this).slideUp(200);
							$('.parent_sub_tag').children().each(function() {$(this).hide();});
							$('.parent_sub_tag2').children().each(function() {$(this).hide();});
						}
					}
					
					if( filter.val() == '' ){
						
						$(this).slideDown(200);
						$('.parent_sub_tag').children().each(function() {$(this).show();});
						$('.parent_sub_tag2').children().each(function() {$(this).show();});
					}
				});
			});
			
			t.hide();
			container.insertAfter(t);
			
			parent_tag.bind('click').live( 'click' , parentHideShow );
			child_tag.bind('click').live( 'click' , childHideShow );			
			parent_tag2.bind('click').live( 'click' , parentHideShow );
			child_tag2.bind('click').live( 'click' , childHideShow2 );
		});
	};
}(jQuery));
