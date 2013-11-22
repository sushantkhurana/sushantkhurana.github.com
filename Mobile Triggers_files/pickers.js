var pickers = {};

(function () {
	// pickers are defined in a closure to prevent polluting the global object.
	
	// A useful function for safe regex creation (for string matching).
	
	function makeRegex (str, atBegin, atEnd) {
		try {
			return new RegExp((atBegin?"^":"")+
				str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
				(atEnd?"$":""), "i");
		} catch(e) {
			return null;
		}
	}
	
	// ----- Enum -----
	
	pickers.enum = function (value, type, setValue, onKey) {
		var i, l, menu = $("<div class='calltips'>"),
			tReg = value?makeRegex(value, true):false,
			show = false;
		for(i=0,l=type.values.length; i<l; i+=1) {
			if(!tReg || tReg.test(type.values[i])) {
				show = true;
				$("<a class='calltip'>").html('"'+type.values[i]+'"').appendTo(menu);
			}
		}
		return show?menu:false;
	};
	//
	//pickers.datetime = function(value, type, setValue, onKey) {
	//	
	//	return getCalender();;//$("<div>").addClass("info").html("Date picker will come here.");
	//},
	
	pickers.interval = function(value, type, setValue, onKey) {
		return $("<div>").addClass("info").html("Time interval picker will come here.");
	},
	
	pickers.enumset = function(value, type, setValue, onKey) {
		var list = pickers.enum(value, type.valueType);
		
		return $("<div>").addClass("info").html("Multiselect box with options " + node.getType(type.valueType).values.join(", "));
	},
	
	// ----- Calltips from the current scope -----
	
	pickers.any = function(node, sort) {
		// This populates calltips.
		if( typeof( sort ) === "undefined") 
			sort = false; 
		
		var r = [], calltipDiv,
			scope = node.scope,
			name = node.value, number = 10,
			i, j, m, t, root, prefix="";
		
		// turn the name into a regex for matching.
		try {
			name = node.value?makeRegex(node.value, true): null;
		} catch (e) {
			// Regex syntax errors
			name = null;
		}
		
		calltipDiv = $("<div class='calltips'>");
		
//		while(scope && scope.idents && r.length < number) {
		while(scope && scope.idents) {
			var idents = [];
			for( i in scope.idents )
				idents.push( i.toString() );
			elems = ( sort == true ) ? idents.sort() : idents;
			
			for(i in elems ) {
				if(!name || name.test( elems[i])) {
					if(r.indexOf( elems[i]) !== -1) {
						elems[i] = prefix + elems[i];
					}
					r.push(elems[i]);
					$("<a href='#' class='calltip'>").
						html(elems[i]).
						appendTo(calltipDiv);
				}
//				if(r.length >= number) {
//					return calltipDiv;
//				}
			}
			prefix += "outer.";
			scope = scope.outer;
		}
	
		return (r.length && (r.length>1 || node.text != r[0]))?calltipDiv:false;
	};

}());