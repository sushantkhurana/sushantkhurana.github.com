String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

/** AutoSuggest Packed JS **/
if (typeof(bsn) == "undefined") _b = bsn = {};
if (typeof(_b.Autosuggest) == "undefined") _b.Autosuggest = {};
else alert("Autosuggest is already set!");

_b.AutoSuggest = function(id, param) {
	if (!document.getElementById) return 0;
	this.fld = _b.DOM.gE(id);
	if (!this.fld) return 0;
	this.sInp = "";
	this.nInpC = 0;
	this.aSug = [];
	this.iHigh = 0;
	this.oP = param ? param: {};
	var k, def = {
		minchars: 1,
		meth: "get",
		varname: "/",
		className: "autosuggest",
		timeout: 2500,
		delay: 500,
		offsety: -5,
		shownoresults: true,
		noresults: "No results!",
		maxheight: 250,
		cache: true,
		maxentries: 25,
		maxresults: 10,
		comma: false
	};
	for (k in def) {
		if (typeof(this.oP[k]) != typeof(def[k])) this.oP[k] = def[k]
	}
	var p = this;
	this.fld.onkeypress = function(ev) {
		return p.onKeyPress(ev)
	};
	this.fld.onkeyup = function(ev) {
		return p.onKeyUp(ev)
	};
	this.fld.setAttribute("autocomplete", "off")
};
_b.AutoSuggest.prototype.onKeyPress = function(ev) {
	var key = (window.event) ? window.event.keyCode: ev.keyCode;
	var RETURN = 13;
	var TAB = 9;
	var ESC = 27;
	var bubble = 1;
	switch (key) {
	case RETURN:
		this.setHighlightedValue();
		return false;	
		break;
	case ESC:
		this.clearSuggestions();
		break
	}
	return bubble
};
_b.AutoSuggest.prototype.onKeyUp = function(ev) {
	var key = (window.event) ? window.event.keyCode: ev.keyCode;
	var ARRUP = 38;
	var ARRDN = 40;
	var ENTERKEY = 13
	var bubble = 1;
	switch (key) {
	case ARRUP:
		this.changeHighlight(key);
		bubble = 0;
		break;
	case ARRDN:
		this.changeHighlight(key);
		bubble = 0;
		break;
	case ENTERKEY:
		return false;
		break;
	default:
		this.getSuggestions(this.fld.value)
	}
	return bubble
};

_b.AutoSuggest.prototype.getSuggestions = function(val) {
	if (val == this.sInp) return 0;
	_b.DOM.remE(this.idAs);
	this.sInp = val;
	if (val.length < this.oP.minchars) {
		this.aSug = [];
		this.nInpC = val.length;
		return 0
	}
	var ol = this.nInpC;
	this.nInpC = val.length ? val.length: 0;
	var l = this.aSug.length;
	if (this.nInpC > ol && l && l < this.oP.maxentries && this.oP.cache) {
		var arr = [];
		for (var i = 0; i < l; i++) {
			if (this.aSug[i].value.substr(0, val.length).toLowerCase() == val.toLowerCase() || this.aSug[i].info == 'as_header') arr.push(this.aSug[i])
		}
		this.aSug = arr;
		this.createList(this.aSug);
		return false
	} else {
		var pointer = this;
		var input = this.sInp;
		clearTimeout(this.ajID);
		this.ajID = setTimeout(function() {
			pointer.doAjaxRequest(input)
		},
		this.oP.delay)
	}
	return false
};
_b.AutoSuggest.prototype.doAjaxRequest = function(input) {
	if (input != this.fld.value) return false;
	var pointer = this;
	var inputData = this.sInp;
	var tokens = inputData.split(",");
	var input = new String(tokens[tokens.length - 1]);
	var input = input.trim();
	input = input.replace(/[\%|\;|\?]/g,"");
	if (typeof(this.oP.script) == "function") var url = this.oP.script(encodeURIComponent(input));
	else var url = this.oP.script + this.oP.varname + encodeURIComponent(input) + this.oP.varname + this.oP.maxresults;
	if (!url) return false;
	url = url+"/.json";
	var meth = this.oP.meth;
	var input = this.sInp;
	var onSuccessFunc = function(data, textStatus) {
		pointer.setSuggestions(data, input);
		delegateCustomFeatures();
	};
	var onErrorFunc = function(status) {
		alert("AJAX error: " + status)
	};
	
	$.getJSON	(url, meth, onSuccessFunc)
};
_b.AutoSuggest.prototype.setSuggestions = function(jsondata, input) {
	if (input != this.fld.value) return false;
	this.aSug = [];
	for (var i = 0; i < jsondata.results.length; i++) {
		this.aSug.push({
			'id': jsondata.results[i].id,
			'value': jsondata.results[i].value,
			'info': jsondata.results[i].info
		})
	}

	this.idAs = "as_" + this.fld.id;
	this.createList(this.aSug)
};
_b.AutoSuggest.prototype.createList = function(arr) {
	var pointer = this;
	_b.DOM.remE(this.idAs);
	this.killTimeout();
	if (arr.length == 0 && !this.oP.shownoresults) return false;
	var div = _b.DOM.cE("div", {
		id: this.idAs,
		className: this.oP.className
	});
	var hcorner = _b.DOM.cE("div", {
		className: "as_corner"
	});
	var hbar = _b.DOM.cE("div", {
		className: "as_bar"
	});
	var header = _b.DOM.cE("div", {
		className: "as_header"
	});
	header.appendChild(hcorner);
	header.appendChild(hbar);
	div.appendChild(header);
	var ul = _b.DOM.cE("ul", {
		id: "as_ul"
	});
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].info == "plugin_header") {
			var li = _b.DOM.cE("li", {
				className: "as_header"
			},
			arr[i].value);
			ul.appendChild(li);
			i++
		}
		var val = arr[i].value;
		var st = val.toLowerCase().indexOf(this.sInp.toLowerCase());
		var output = val.substring(0, st) + "<em>" + val.substring(st, st + this.sInp.length) + "</em>" + val.substring(st + this.sInp.length);
		var span = _b.DOM.cE("span", {},
		output, true);
		if (arr[i].info != "") {
			var br = _b.DOM.cE("br", {});
			span.appendChild(br);
			var small = _b.DOM.cE("small", {},
			arr[i].info);
			span.appendChild(small)
		}
		var a = _b.DOM.cE("a", {
			href: "#"
		});
		var tl = _b.DOM.cE("span", {
			className: "tl"
		},
		" ");
		var tr = _b.DOM.cE("span", {
			className: "tr"
		},
		" ");
		a.appendChild(tl);
		a.appendChild(tr);
		a.appendChild(span);
		a.name = i + 1;
		a.onclick = function() {
			pointer.setHighlightedValue();
			return false
		};
		a.onmouseover = function() {
			pointer.setHighlight(this.name)
		};
		var li = _b.DOM.cE("li", {},
		a);
		ul.appendChild(li)
	}
	if (arr.length == 0 && this.oP.shownoresults) {
		var li = _b.DOM.cE("li", {
			className: "as_warning"
		},
		this.oP.noresults);
		ul.appendChild(li)
	}
	div.appendChild(ul);
	var fcorner = _b.DOM.cE("div", {
		className: "as_corner"
	});
	var fbar = _b.DOM.cE("div", {
		className: "as_bar"
	});
	var footer = _b.DOM.cE("div", {
		className: "as_footer"
	});
	footer.appendChild(fcorner);
	footer.appendChild(fbar);
	div.appendChild(footer);
	var pos = _b.DOM.getPos(this.fld);
	div.style.left = pos.x + "px";
	div.style.top = (pos.y + this.fld.offsetHeight + this.oP.offsety) + "px";
	div.style.width = this.fld.offsetWidth + "px";
	div.onmouseover = function() {
		pointer.killTimeout()
	};
	div.onmouseout = function() {
		pointer.resetTimeout()
	};
	document.getElementsByTagName("body")[0].appendChild(div);
	this.iHigh = 0;
	var pointer = this;
	this.toID = setTimeout(function() {
		pointer.clearSuggestions()
	},
	this.oP.timeout)
};
_b.AutoSuggest.prototype.changeHighlight = function(key) {
	var list = _b.DOM.gE("as_ul");
	if (!list) return false;
	var n;
	if (key == 40) n = this.iHigh + 1;
	else if (key == 38) n = this.iHigh - 1;
	if (n > list.childNodes.length) n = list.childNodes.length;
	if (n < 1) n = 1;
	this.setHighlight(n)
};
_b.AutoSuggest.prototype.setHighlight = function(n) {
	var list = _b.DOM.gE("as_ul");
	if (!list) return false;
	if (this.iHigh > 0) this.clearHighlight();
	this.iHigh = Number(n);
	if (list.childNodes[this.iHigh - 1].className != "as_header") list.childNodes[this.iHigh - 1].className = "as_highlight";
	this.killTimeout()
};
_b.AutoSuggest.prototype.clearHighlight = function() {
	var list = _b.DOM.gE("as_ul");
	if (!list) return false;
	if (this.iHigh > 0) {
		if (list.childNodes[this.iHigh - 1].className != "as_header") list.childNodes[this.iHigh - 1].className = "";
		this.iHigh = 0
	}
};
_b.AutoSuggest.prototype.setHighlightedValue = function() {
	if (this.iHigh) {
		if (this.oP.comma) {
			var olddata = this.fld.value;
			var listArray = olddata.split(",");
			for (var i = 0; i < listArray.length; i++)
			listArray[i] = new String(listArray[i]).trim();
			listArray.pop();
			if (this.aSug[this.iHigh - 1].value != "") listArray.push(this.aSug[this.iHigh - 1].value);
			listArray.push("");
			var cleanedText = listArray.join(", ");
			this.sInp = this.fld.value = cleanedText;
			this.aSug[this.iHigh - 1].value = "";
		}
		else {
			this.sInp = this.fld.value = this.aSug[this.iHigh - 1].value;
		}
		this.fld.focus();
		if (this.fld.selectionStart) this.fld.setSelectionRange(this.sInp.length, this.sInp.length);
		this.clearSuggestions();
		if (typeof(this.oP.callback) == "function") this.oP.callback(this.aSug[this.iHigh - 1])
	}
};
_b.AutoSuggest.prototype.killTimeout = function() {
	clearTimeout(this.toID)
};
_b.AutoSuggest.prototype.resetTimeout = function() {
	clearTimeout(this.toID);
	var pointer = this;
	this.toID = setTimeout(function() {
		pointer.clearSuggestions()
	},
	1000)
};
_b.AutoSuggest.prototype.clearSuggestions = function() {
	this.killTimeout();
	var ele = _b.DOM.gE(this.idAs);
	var pointer = this;
	if (ele) {
		var fade = new _b.Fader(ele, 1, 0, 250,
		function() {
			_b.DOM.remE(pointer.idAs)
		})
	}
};


if (typeof(_b.Ajax) == "undefined") _b.Ajax = {};
_b.Ajax = $.ajax;


if (typeof(_b.DOM) == "undefined") _b.DOM = {};
_b.DOM.cE = function(type, attr, cont, html) {
	var ne = document.createElement(type);
	if (!ne) return 0;
	for (var a in attr) ne[a] = attr[a];
	var t = typeof(cont);
	if (t == "string" && !html) ne.appendChild(document.createTextNode(cont));
	else if (t == "string" && html) ne.innerHTML = cont;
	else if (t == "object") ne.appendChild(cont);
	return ne
};
_b.DOM.gE = function(e) {
	var t = typeof(e);
	if (t == "undefined") return 0;
	else if (t == "string") {
		var re = document.getElementById(e);
		if (!re) return 0;
		else if (typeof(re.appendChild) != "undefined") return re;
		else return 0
	} else if (typeof(e.appendChild) != "undefined") return e;
	else return 0
};
_b.DOM.remE = function(ele) {
	var e = this.gE(ele);
	if (!e) return 0;
	else if (e.parentNode.removeChild(e)) return true;
	else return 0
};
_b.DOM.getPos = function(e) {
	var e = this.gE(e);
	var obj = e;
	var curleft = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curleft += obj.offsetLeft;
			obj = obj.offsetParent
		}
	} else if (obj.x) curleft += obj.x;
	var obj = e;
	var curtop = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop;
			obj = obj.offsetParent
		}
	} else if (obj.y) curtop += obj.y;
	return {
		x: curleft,
		y: curtop
	}
};
if (typeof(_b.Fader) == "undefined") _b.Fader = {};
_b.Fader = function(ele, from, to, fadetime, callback) {
	if (!ele) return 0;
	this.e = ele;
	this.from = from;
	this.to = to;
	this.cb = callback;
	this.nDur = fadetime;
	this.nInt = 50;
	this.nTime = 0;
	var p = this;
	this.nID = setInterval(function() {
		p._fade()
	},
	this.nInt)
};
_b.Fader.prototype._fade = function() {
	this.nTime += this.nInt;
	var ieop = Math.round(this._tween(this.nTime, this.from, this.to, this.nDur) * 100);
	var op = ieop / 100;
	if (this.e.filters) {
		try {
			this.e.filters.item("DXImageTransform.Microsoft.Alpha").opacity = ieop
		} catch(e) {
			this.e.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + ieop + ')'
		}
	} else {
		this.e.style.opacity = op
	}
	if (this.nTime == this.nDur) {
		clearInterval(this.nID);
		if (this.cb != undefined) this.cb()
	}
};
_b.Fader.prototype._tween = function(t, b, c, d) {
	return b + ((c - b) * (t / d))
};

function delegateCustomFeatures(){
	
	if( $('#search_customer').length > 0 )
		$('#search_customer').trigger('keyup');
}
