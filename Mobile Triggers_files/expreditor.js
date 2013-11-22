$.fn.expredit = function (grammar, options) {
	"use strict";


// tokenize.js
// Tokenizer for Java-like expressions, written in JavaScript.
// Aravind R S, Capillary Technologies, 2012-02-09

var tokenize = function (str) {
	"use strict";
	var rex = {
		space: /^\s+/,
		number: /^[0-9]+(?:\.[0-9]*)?/,
		datetime: /^\"\#\d\d\d\d(-\d\d){0,2}(T\d\d(:\d\d){0,2})?\#\"/,
		string: /^(?:(\"\")|\".*?(?:(?:[^\\])(?:\\\\)*(\")))/,
		name: /^[a-zA-Z0-9_]+\b/,
		operator: /^(\&\&|\|\||==|!=|<=|>=|\S)/
	};
	var tokens = [], tok, pos=0, r;

	while(str != "") {
		tok = null;
		for(r in rex) {
			str = str.replace(rex[r], function(m){
				var len = m.length, val;
				if(r == "space") {
					pos += len;
					return "";
				} else if(r == "number") {
					val = parseFloat(m);
				} else if(r == "date") {
					val = new Date(m.substring(2, m.length-2));
				}
				else if(r == "name") switch(m) {
					case "true": val=true; r="boolean"; break;
					case "false": val=false; r="boolean"; break;
					default: val = m;
				} else if(r == "string") {
					val = m.substr(1, len-2);
				} else {
					val = m;
				}
				
				tok = {value: val, arity: r, text:m, pos:pos, len:len};
				
				pos += len;
				return "";
			});
			if(tok) break;
		}
		if(tok) tokens.push(tok);
	}
	return tokens;
}
// parse.js
// Parser for Java-like expressions, written in JavaScript.
// Aravind R S, Capillary Technologies, 2012-02-09
// based on
//   parse.js
//   Parser for Simplified JavaScript written in Simplified JavaScript
//   From Top Down Operator Precedence
//   http://javascript.crockford.com/tdop/index.html
//   Douglas Crockford
//   2010-06-26

var protonode = {};

var parse = (function () {
	"use strict";
    var symbol_table = {},
		token, tokens, token_nr,
		terminators = ["(end)"],
		has_errors;
	
    var itself = function () {
        return this;
    };
	
	var nothing = function() {
		return;
	}

    var advance = function (id) {
        var a, o, t, v, e, type;
        if (id && token.id !== id) {
            e = "Expected '" + id + "'";
        }
        if (token_nr >= tokens.length) {
            token = symbol_table["(end)"];
            t = tokens[tokens.length-1];
            token.pos = t?(t.pos+t.len):0;     
            token.len = 0;
            return token;
        }
        t = tokens[token_nr];
        token_nr += 1;
        v = t.value;
        a = t.arity;
        if (a === "name") {
            o = symbol_table["(name)"];
        } else if (a === "operator") {
            o = symbol_table[v];
            if (!o) {
                e = "Unknown operator.";
            }
        } else if (a === "string" || a ===  "number" || a === "boolean" || a === "datetime") {
            o = symbol_table["(literal)"];
			type = a;
			a = "literal";
        } else {
            e = "Unexpected token.";
        }
        if(o) {
	        token = Object.create(o);
	    } else {
	    	token = missing();
			a = "missing";
	    }
        token.value = v;
        token.arity = a;
		token.type = type;
        token.text = t.text || "";
        token.pos = t.pos;
        token.len = t.len;
        
        if(e) {
			token.error(e);
		}
        return token;
    };
	
    var expression = function (rbp) {
        var left;
        var t;
		var term = terminators.lastIndexOf(token.id);
		if(term != -1) {
			term = term||1;
			terminators = terminators.slice(0, term);
			return missing();
		}
		t = token;
		advance();
        left = t.nud();
        while (rbp < token.lbp) {
            t = token;
            advance();
            left = t.led(left);
        }
        return left;
    };
	
	protonode.nud = function () {
		this.arity = "missing";
		this.error("Unknown operator.");
		return this;
	};
	
	protonode.led = function (left) {
		var n = missing();
		this.arity = "group";
		this.error("Unknown operator.");
		n.children = [left, this];
		return n;
	};
	
    var symbol = function (id, bp) {
        var s = symbol_table[id];
        bp = bp || 0;
        if (s) {
            if (bp >= s.lbp) {
                s.lbp = bp;
            }
        } else {
            s = Object.create(protonode);
            s.id = s.value = id;
            s.lbp = bp;
            symbol_table[id] = s;
        }
        return s;
    };

	var group = function (e) {
		var g = Object.create(protonode);
		g.value=undefined;
		g.arity="group";
		g.children=[];
		if(e) g.error(e);
		return g;
	};
    
	var missing = function (e) {
		var m = Object.create(protonode);
		m.value=undefined;
		m.arity="missing";
		if(e) {
			m.error(e);
		} else if(e !== false) {
			m.error("Missing value.");
		}
		return m;
	};
	
	var pos_missing = function (node, pos) {
		if(node.arity !== "missing") return node;
		if(typeof node.pos === "undefined") node.pos = pos;
		if(typeof node.len === "undefined") node.len = node.text?node.text.length:1;
		return node;
	};

    var infix = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            this.children = [left, expression(bp)];
            pos_missing(this.children[0], this.pos);
            pos_missing(this.children[1], this.pos + this.len);
            this.arity = "binary_operation";
            return this;
        };
        return s;
    };

    var infixr = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            this.children = [left, expression(bp - 1)];
            pos_missing(this.children[0], this.pos);
            pos_missing(this.children[1], this.pos + this.len);
            this.arity = "binary_operation";
            return this;
        };
        return s;
    };
    
    var prefix = function (id, nud) {
        var s = symbol(id);
        s.nud = nud || function () {
            this.children = [expression(70)];
            pos_missing(this.children[0], this.pos + this.len);
            this.arity = "unary_operation";
            return this;
        };
        return s;
    };

    symbol("(end)").nud = nothing;
    symbol("(name)").nud = itself;
    symbol(")");
//    symbol("]");
	symbol(":");
    symbol(",");
    symbol("(literal)").nud = itself;

    infix("?", 20, function (left) {
    	var s_tok;
        this.children = [left];
        pos_missing(this.children[0], this.pos);
		terminators.push(":");
		this.children[1] = expression(0);
        pos_missing(this.children[1], this.pos + this.len);
        s_tok = token;
		if(terminators[terminators.length-1]==":") terminators.pop();
        advance(":");
        this.children[2] = expression(0);
        pos_missing(this.children[2], s_tok.pos + s_tok.len);
        this.arity = "ternary_operation";
        return this;
    });

    infixr("&&", 30);
    infixr("||", 30);

    infixr("==", 40);
    infixr("!=", 40);
    infixr("<", 40);
    infixr("<=", 40);
    infixr(">", 40);
    infixr(">=", 40);

    infix("+", 50);
    infix("-", 50);

    infix("*", 60);
    infix("/", 60);

    infix(".", 80, function (left) {
		var n;
        this.children = [left];
		this.arity = "object_dereference";
		this.value = undefined;
        if (token.arity === "name") {
			this.children[1] = token;
			advance();
        } else if(token.id === "(literal)") {
			token.arity = "missing";
			token.error("Expected a property name.");
			this.children[1] = token;
			advance();
		} else {
			this.children[1] = missing("Expected a property name.");
		}
		
        pos_missing(this.children[0], this.pos);
        pos_missing(this.children[1], this.pos + this.len);
        return this;
    });

/*    infix("[", 80, function (left) {
		var g, n, e;
		if(left.id === "(literal)") {
			left.error("Expected a collection.");
		}
		terminators.push("]");
        this.children = [left];
        pos_missing(this.children[0], this.pos);
		
		n = expression(0);
		
		e = [n];
		while(token.id !== "]" && token.id !== "(end)") {
			e.push(expression(0));
		}
		if(e.length > 1) {
			g = group();
			g.paren = false;
			g.children = e;
			this.children.push(g);
		} else {
			this.children.push(n);
		}
		
        pos_missing(this.children[1], this.pos + this.len);
        this.arity = "array_lookup";
        this.value = undefined;
		if(terminators[terminators.length-1]=="]") terminators.pop();
        advance("]");
        return this;
    });*/

    infix("(", 80, function (left) {
        var g, n, e;
        if (left.arity === "object_dereference") {
            this.arity = "method_call";
            this.value = undefined;
            this.children = left.children;
            if (left.children[1].arity !== "name") {
                left.children[1].error("Expected a method name.");
            }
        } else {
            this.arity = "function_call";
            this.value = undefined;
            this.children = [left];
            if (left.arity !== "name") {
                left.error("Expected a function name.");
            }
        }
		
		terminators.push(")");
		n = missing(false);
		pos_missing(n, token.pos);
		while (token.id !== ")" && token.id !== "(end)") {
			if(token.id === ",") {
				n = missing();
			} else {
				n = expression(0);
			}
			
			pos_missing(n, token.pos);
			
			e = [n];
			
			// Gather any malformed tokens from here to the next ) or ,
			while(token.id !== "," && token.id !== ")" && token.id !== "(end)") {
				e.push(expression(0));
			}
			if(e.length > 1) {
				g = group();
				g.paren = false;
				g.children = e;
				this.children.push(g);
			} else {
				this.children.push(n);
			}
			
			n = null;
			
			if(token.id === ",") {
				n = missing();
				pos_missing(n, token.pos+token.len);
				advance(",");
			}
		}
		if(n) {
			this.children.push(n);
		}
		if(terminators[terminators.length-1]==")") terminators.pop();
        advance(")");
        return this;
    });

    prefix("!");
    prefix("-");
    prefix("+");

    prefix("(", function () {
		var e;
		this.arity="group";
		this.value=undefined;
		this.text="";
		this.children=[];
		terminators.push(")");
		if(token.id === ")" || token.id === "(end)") {
			e = missing();
			pos_missing(e, token.pos);
			this.children.push(e);
		} else {
			while(token.id !== ")" && token.id !== "(end)") {
				e = expression(0);
				pos_missing(e, token.pos);
				if(this.children.length > 0) {
					e.error("Expected operator or ')'");
				}
				this.children.push(e);
			}
		}
		if(terminators[terminators.length-1]==")") terminators.pop();
        advance(")");
        return this;
    });

	protonode.error = function(e) {
		if(!this.err) {
			this.err = [];
		}
		this.err.push(e);
		has_errors = true;
    }

    return function (tks) {
    	var selNode, trees=[], tree;
		has_errors = false;
        tokens = tks;
        token_nr = 0;
        advance();
		do {
			terminators = ["(end)"];
			tree = expression(0);
			if(token.id !== "(end)") {
				token.error("Expected an operator.");
			}
			if(!(
				tree.arity == "missing" && (
					tree.value == ")" ||
					tree.value == ']'
				)
			)) {
				trees.push(tree);
			}
		} while (token.id !== "(end)");
		
		if(trees.length == 1) {
			tree = trees[0];
		} else {
			tree = group();
			tree.paren = false;
			tree.children = trees;
		}
		
		tree.has_errors = has_errors;
        return tree.crosslink(null);
    };
}());

/*
 *	Crosslink creates the operands[] and parent crosslinks between nodes
 *	which help in traversal for type relationship evaluation.
 */
protonode.crosslink = function (parent) {
	var i, l, subtree;
	
	if(this.arity === "group" && this.children && this.children.length === 1) {
		this.operands = this.children;
		return this.children[0].crosslink(parent);
	}
	
	this.parent = parent;
	if(this.children && this.children.length>0) {
		this.operands = [];
		for(i=0,l=this.children.length; i<l; i+=1) {
			this.operands[i] = this.children[i].crosslink(this);
		}
	}
	return this;
};
// type.js
// Type checker for Java-like expressions, written in JavaScript.
// Aravind R S, Capillary Technologies, 2012-02-09

var typify = (function() {

// this is the prototype of the primitive types

	var primitive = {
		ancestry: "primitive",
		prepared: true,
		is: function(type) {
			
			if(!type) { return false; }
			
			if(type.ancestry && !/\banonymous\b/.test(type.ancestry)) {
				type = type.ancestry;
			}
			
			if(typeof type === "string") {
				if(this.ancestry) {
					return new RegExp("\\b"+type+"\\b").test(this.ancestry);
				} else {
					return false;
				}
			} else {
				return this === type;
			}
		}
	};
	
	/* This function replaces JsonPath */
	
	var traverse = function(root, path) {
		var res;
		path = path.replace(/\$/g, "this");
		try {
			res = (new Function("return " + path)).call(root);
		} catch (e) {}
		return res;
	};
	
	protonode.getScope = (function () {
		var base_scope = {
			find: function (name) {
				var r;
				r = this.idents[name];
				if(!r && this.outer) {
					r = this.outer.find(name);
				}
				return r;
			}
		};
		return function (idents, currentScope) {
			var scope = Object.create(base_scope);
			var i, j;
			scope.idents = {};
			scope.root = this;
			for(i in idents) {
				scope.idents[i] = idents[i];
			}
			
			if(currentScope && currentScope.idents) {
				scope.idents.outer = {
					type: this.getType({
						form: "object",
						memberScope: currentScope,
						members: currentScope.idents
					})
				};
				scope.outer = currentScope;
			}
			
			return scope;
		};
	}());
	
	protonode.getOperator = function () {
		var i, l, j, m, op, t, merged={
			symbol: this.value, count: 0,
			type: null, operandTypes: []
		};
		for(i=0,l=grammar.operators.length; i<l; i+=1) {
			op = grammar.operators[i];
			m = op.operandTypes.length;
			if(op.symbol === merged.symbol && m === this.operands.length) {
				for(j=0; j<m; j+=1) {
					t = this.operands[j].getType();
					if(t !== null && !t.is(this.getType(op.operandTypes[j]))) {
						break;
					}
				}
				if(j===m) {
					t = this.getType(op.type);
					if(merged.type === false) {
						// already in conflict; do nothing
					} else if(!merged.type || merged.type.is(t)) {
						merged.type = t;
					} else if(t.is(merged.type)) {
						// supertype already chosen; do nothing
					} else {
						merged.type = false;
					}
					
					for(j=0; j<m; j+=1) {
						t = this.getType(op.operandTypes[j]);
						//console.log(t);
						if(!merged.operandTypes[j]) {
							merged.operandTypes[j] = [];
						}
						merged.operandTypes[j].push(t);
					}
					merged.count += 1;
				}
			}
		}
		return merged;
	};
	
	protonode.getType = function (p) {
		var type, t, typeName, i, pp, inherit, scope;
		
		if(p === "any") {
			return primitive;
		}
		
		if(typeof p === "undefined") p = this.type;
		
		if(typeof p === "string") {
			
			if(p.indexOf("$") === -1) {
				type = grammar.types[p];
				
				if(!type) {
					if(type !== false) {
						// We have already tried to load this.
						loadType(p);
					}
					type=p;
				}
				typeName = p;
			} else {
				pp = traverse(this, p);
				scope = this.scope;
				
				if(!pp && scope && scope.root) {
					pp = traverse(scope.root, p);
				}
				
				if(pp) {
					type = this.getType(pp);
					typeName = "anonymous";
				}
			}
		} else {
			type = p;
			typeName = "anonymous";
		}
		
		if(!type) {
			return null;
		} else if(type.ancestry) {
			return type;
		}
		
		// We found a type, but it's not "prepared", i.e. its inheritance hierarchy
		// is not yet resolved.
		
		inherit = function (oldObj, props) {
			var i, newObj = Object.create(oldObj);
			
			for(i in props) {
				if(
					typeof oldObj[i] === "object" &&
					typeof props[i] === "object" &&
					oldObj[i] !== null && props[i] !== null
				) {
					newObj[i] = inherit(oldObj[i], props[i]);
				} else {
					newObj[i] = props[i];
				}
			}
			return newObj;
		}
		
		if(type.form === "primitive") {
			t = inherit(primitive, type);
		} else {
			p = this.getType(type.form);
			if(p) {
				t = inherit(p, type);
			}
			else {
				throw "Couldn't find supertype " + type.form;
			}
		}
		
		t.ancestry = typeName + ":" + t.ancestry;
		t.prepared = true;
		
		return t;
	};
	
	protonode.setType = function (scope) {
		var i, l, op, e;
		
		var setParamTypes = function (node, offset, scope) {
			var fnType, paramScope, opNode, paramType,
				i, l = node.operands.length-offset;
			fnType = node.operands[offset-1].type;
			if(!fnType || !fnType.is("function")) {
				return;
			}
			node.type = fnType.type;
			if(fnType.params && fnType.params.length !== l) {
				//Handling wherever the function doesnt have parameters.Not an error.
				if(fnType.params.length != 0)
					node.error("Expected " + fnType.params.length + " arguments.");
				l = Math.min(l, fnType.params.length);
			}
			
			for(i=0; i<l; i+=1) {
				opNode = node.operands[i+offset];
				if(fnType.params[i].closureParams) {
					paramScope = opNode.getScope(fnType.params[i].closureParams, scope);
				} else {
					paramScope = scope;
				}
				opNode.setType(paramScope);
				opNode.param = fnType.params[i];
				opNode.setExpectedTypes([fnType.params[i].type]);
			}
		};
		
		this.scope = scope;
		
		switch(this.arity) {
			case "literal":
				break;
			case "missing":
				break;
			case "name":
				while(scope) {
					this.ident = scope.find(this.value);
					if(this.ident) break;
					scope = scope.outer;
				}
				if(this.ident) {
					this.type = this.ident.type;
					this.scope = scope;
				} else {
					this.error("Unknown identifier.");
				}
				break;
			case "unary_operation":
			case "binary_operation":
			case "ternary_operation":
				for(i=0,l=this.operands.length; i<l; i+=1) {
					this.operands[i].setType(scope);
				}
				op = this.getOperator();
				if(op.count) {
					this.type = op.type;
					
					for(i=0,l=this.operands.length; i<l; i+=1) {
						this.operands[i].setExpectedTypes(op.operandTypes[i]);
					}
				} else {
					e = [];
					
					for(i=0,l=this.operands.length; i<l; i+=1) {
						e.push(getTypeName(this.operands[i]));
					}
					
					this.error("Invalid " + this.value + " between " + e.join(", "));
				}
				break;
			case "object_dereference":
				this.operands[0].setType(scope);
				if(this.operands[0].type) {
					this.operands[1].setType(
						this.operands[0].type.memberScope ||
						this.getScope(this.operands[0].type.members, null)
					);
				}
				this.type = this.operands[1].type;
				
				this.operands[0].setExpectedTypes(["object"]);
				break;
			case "function_call":
				this.operands[0].setType(scope);
				setParamTypes(this, 1, scope);
				this.operands[0].setExpectedTypes(["function"]);
				break;
			case "method_call":
				//TODO : auto braces with number of arguments 
				//might have to make some changes here for inserting braces automatically
				//console.log(this);
				this.operands[0].setType(scope);
				if(this.operands[0].type) {
					this.operands[1].setType(
						this.operands[0].type.memberScope ||
						this.getScope(this.operands[0].type.members, null)
					);
				}
				setParamTypes(this, 2, scope);
				
				this.operands[0].setExpectedTypes(["object"]);
				this.operands[1].setExpectedTypes(["function"]);
				
				//Handling wherever the function doesnt have parameters. Remove the last node.
				if(this.operands[1].type.params == 0)
				{
					this.operands[2]=null;
					this.operands.length=2;
				}
				
				break;
			case "array_lookup":
				this.operands[0].setType(scope);
				this.operands[1].setType(scope);
				if(this.operands[0].type) {
					this.type = this.operands[0].type.valueType;
					this.operands[1].setExpectedTypes([this.operands[0].type.keyType]);
				}
		}
		this.type = this.getType();
	
	};
	
	protonode.setExpectedTypes = function (types) {
		var i, j, l, expectedType, unique=[], typeNames=[], e;
		
		l=types?types.length:0;
	
		/*	First, get rid of types that aren't resolvable. */
		for(i=0; i<l; i+=1) {
			expectedType = this.getType(types[i]);
			if(expectedType) {
				unique.push(expectedType);
			}
		}
		types = unique;
		l = types.length;
		
		/*	Remove duplicates and subtypes (when supertypes are also there) */
		if(l>1) {
			unique = [];
			for(i=0; i<l; i++) {
				for(j=0; j<l; j++) {
					if(
						i !== j && types[j] && types[i].is(types[j]) &&
						(!types[j].is(types[i]) || i<j)
						/*	Don't push types[i] if it is a proper subtype
							of types[j]; However if both are the same type,
							push one of them (the last one). */
					) {
						break;
					}
				}
				if(j==l) unique.push(types[i]);
			}
			types = unique;
			l = types.length;
		}
		
		// No remaining expected types? nothing to do.
		if(!l) {
			return;
		}
		this.expectedTypes = types;
		
		for(i=0; i<l; i+=1) {
			typeNames[i] = types[i].ancestry.split(":")[0];
		}
		
		// Check if the current type is one of the expected ones.
		if(this.type) {
			for(i=0; i<l; i+=1) {
				expectedType = types[i];
				if(this.arity === "literal") {
					//brackets are a must!
					console.log(expectedType, this.type);
				}
				if(this.type.is(expectedType)) {
					break;
				}
				if(this.arity === "literal" && expectedType.is(this.type)) {
					// Auto-cast literals to subtypes.
					// This is done to handle enums, etc.
					this.type = expectedType;
					break;
				}
			}
		}
		
		// Put type mismatch errors
		if(i===l) {
			e = "Expected: " + typeNames.join("/");
			if(this.type && this.type.ancestry) {
				e += ", not " + this.type.ancestry.split(":")[0];
			}
			this.error(e);
		}
	};
	
	
	/*
	*  Type annotates nodes with "type" and "expectedType" attributes
	*  and adds error messages if needed.
	*/
	var loadType;
	
	return function (tree, expected, loader) {
	
		loadType = loader;
		tree.setType(tree.getScope(grammar.identifiers));
		if(expected) tree.setExpectedTypes(expected);
		return tree;
	};

}());
var io = {
	charOffset: function (node, pos) {
		var i, l, n, t;
		if(rangy.dom.isCharacterDataNode(node)) {
			return {node: node, pos: pos};
		}
		
		t = node.textContent || node.innerText || "";
		
		if(pos>t.length) {
			pos=t.length;
		}
		
		for(i=0,l=node.childNodes.length; i<l; i+=1) {
			n = node.childNodes[i];
			t = n.textContent || n.innerText || "";
			if(t.length < pos) {
				pos -= t.length;
			} else {
				return io.charOffset(n, pos);
			}
		}
		return {node: node, pos: pos};
	},
	
	getCursor: function (editor) {
		"use strict";
		var range = rangy.createRange(),
			select = rangy.getSelection(),
			reverse = select.isBackwards(),
			start, end;
			
		select = select.getRangeAt(0);
		range.setStart(editor, 0);
		range.setEnd(select.startContainer, select.startOffset);
		start = range.toString().length;
		end = start + select.toString().length;
		return {start: start, end: end, reverse: reverse};
	},
	
	putCursor: function (start, end, reverse) {
		"use strict";
		var range = rangy.createRange(),
			select = rangy.getSelection();
		range.setStart(start.node, start.pos);
		range.setEnd(end.node, end.pos);
		select.removeAllRanges();
		select.addRange(range, reverse);
	},
	
	expr: function (d) {
		"use strict";
		var t = $(d);
		t.find("br").remove();
		return t.text();
	},
	
	balloon: function (node) {
		"use strict";
		var popup = $(".balloon"), editor, t, i, l, j, m, expected, picker,
			calltips = [], show = false, calltipDiv, calltipEls;
		
		if(node.dom.hasClass("selected")) return;
		
		editor = node.dom.closest(".expredit").eq(0);
		if(!editor.is(":focus")) return;
		
		if(popup.size()) { io.removeBalloon(); }
		
		editor.find(".selected").removeClass("selected");
		node.dom.addClass("selected");
		var offset = node.dom.offset();
			offset.top += node.dom.height() + 8;
		popup = $("<div>").addClass("balloon").data("node", node).
			css(offset);
			
		var setValue = function(value) {
			var range;
			node.dom.html(value);
			range = rangy.createRange();
			range.collapseAfter(node.dom[0]);
			rangy.getSelection().setSingleRange(range);
			node.dom.keyup();
		};
		
		var calltipHover = function (e) {
			if($(this).hasClass("sel")) {
				return;
			}
			$(".calltip.sel").removeClass("sel");
			$(this).addClass("sel");
		};
		
		var calltipClick = function (e) {
			setValue($(this).html());	
			e.preventDefault();
		};
		
		var calltipKey = function (e) {
			var UP=38, DOWN=40, ENTER=13, ESC=27, selection, numTips;
			if(e.which === UP || e.which === DOWN || e.which === ENTER || e.which === ESC) {
				
				selection = $(".calltip.sel");
				var callTipDiv = $(".calltips");
				numTips = calltipEls.size();
				if(selection.size()) {
					if(e.which === UP) {
						$(".balloon").removeClass('hide');
						selection = calltipEls.eq(
							(calltipEls.index(selection)+numTips-1)%numTips
						);
						callTipDiv.animate({ scrollTop: calltipEls.index(selection) * selection.outerHeight() }, 100);
						
					} else if(e.which === DOWN) {
						$(".balloon").removeClass('hide');
						selection = calltipEls.eq(
							(calltipEls.index(selection)+1)%numTips
						);
						callTipDiv.animate({ scrollTop: calltipEls.index(selection) * selection.outerHeight() }, 100);
						
					} else if(e.which === ENTER) {
						//console.log(grammar);
						setValue(selection.html());
						
					} else if (e.which === ESC) {
						$(".balloon").addClass('hide');
						
					}
					
				} else {
					if(e.which === UP) {
						selection = calltipEls.eq(-1);
					} else if(e.which === DOWN) {
						selection = calltipEls.eq(0);
					}
				}
				if(selection.size()) {
					$(".calltip.sel").removeClass("sel");
					selection.addClass("sel");
				}
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			return true;
		};
		
		/* Add error messages */
		if(node.err) {
			popup.append($("<div>").addClass("error").html(node.err.join("<br />")));
			show = true;
		}
		
		/* Add info messages */
		var info = "", expDescs = [], expinfo = "";
		if(node.param && node.param.desc) {
			expinfo += "argument: "+node.param.desc + " ";
		}
		if(node.expectedTypes) {
			for(i=0,l=node.expectedTypes.length; i<l; i+=1) {
				if(node.expectedTypes[i].desc) {
					expDescs.push(node.expectedTypes[i].desc);
				}
			}
			expinfo += (expDescs.length?
				(expinfo?"(":"") +
				expDescs.join(", ") +
				(expinfo?")":""):"");
		}
		if(node.ident && node.ident.desc) {
			info += node.ident.desc + " ";
		}
		if(node.type && node.type.desc) {
			info += (info?"(":"Found: ") + node.type.desc + (info?")":"");
		}
		if(expinfo) {
			popup.append($("<div>").addClass('info').html("Expected " + expinfo));
			show = true;
		}
		if(info) {
			popup.append($("<div>").addClass('info').html(info));
			show = true;
		}
		
		/* Add pickers */
		if(node.expectedTypes && (m=node.expectedTypes.length)) {
			for(j=0; j<m; j+=1) {
				expected = node.getType(node.expectedTypes[j]);
				if(expected && expected.ancestry) {
					t = expected.ancestry.split(":");
					for(i=0,l=t.length; i<l; i+=1) {
						if(pickers[t[i]]) {
							picker = pickers[t[i]](node.value, expected, setValue);
							if(picker) {
								popup.append(picker.addClass('picker').addClass(t[i]));
								show = true;
								break;
							}
						}
					}
				}
			}
		}
		
		/* Add calltips */
		picker = pickers.any(node, true);
		if(picker) {
			popup.append(picker);
			show = true;
		}
		
		
		if(show) {
			popup.data("editor", editor);
			editor.on("keydown.balloon", calltipKey);
			popup.mousedown(function () {
				editor.focus();
				ignoreBlur = true;
			}).appendTo(document.body);
			$(".calltip").mousemove(calltipHover).click(calltipClick);
		}
		calltipEls = $(".calltip");
		calltipEls.eq(0).addClass("sel");
	},
	
	removeBalloon: function() {
		var editor;
		editor = $(".balloon").data("editor");
		if(editor) {
			editor.off("keydown.balloon");
		}
		$(".balloon").remove();
		$(".selected").removeClass("selected");
	}
};

/*
	selectNode could be rewritten as protonode.findSelectedLeaf(cursor)
*/

var selectNode = function (tree, cursor) {
	"use strict";
	var selDist = 99999, selNode, t;

	var affinity = function (node) {
		switch(node.arity) {
			case "missing": return 2;
			case "literal":
			case "name": return 1;
			default: return 0;
		}
	};
	
	function testSel(node) { // recursively tests nodes for cursor intersection
		if(!node) return;
		
		var dist = Math.max(node.pos-cursor, cursor-node.pos-node.len), i, l;
		
		if(dist<=0 && (dist < selDist || (dist == selDist && affinity(node) > affinity(selNode)))) {
			selNode = node; selDist = dist;
		}
		
		if(node.children) {
			for(i=0, l=node.children.length; i<l; i+=1) {
				testSel(node.children[i]);
			}
		}
	}
	
	testSel(tree);
	
	if(selNode) {
		if(selNode.dom) {
			t = selNode.dom[0];
			t = (t.textContent || t.innerText || "").length;
		}
		return { node: selNode, pos: Math.min(t, cursor - selNode.pos) };
	} else if(tree.arity === "missing"){
		return { node: tree, pos: 0 };
	} else {
		return null;
	}
};

var getTypeName = function (node, full) {
	var type = node.type;
	if(type) {
		if(typeof type === "string") {
			if(full) {
				return node.getType(type).ancestry;
			}
			return type;
		}
		if(type.ancestry) {
			if(full) {
				return type.ancestry;
			}
			return type.ancestry.replace(/anonymous\:/g, "").split(":")[0];
		}
	}
	
	return "unknown";
};

protonode.toJson = function (prefix, indent) {
	"use strict";
	var i, l, str, delim;
	
	str = prefix+'{';
	str += prefix+indent+'"arity":"'+this.arity+'"';
	if(typeof this.value !== 'undefined') {
		str += ',' + prefix+indent+'"value":"';
		str += (''+this.value).replace(/[\\'"\0]/g, '\\$&')+'"';
	}
	if(this.type) {
		str += ',' + prefix+indent+'"type":"';
		str += getTypeName(this, true)+'"';
	}
	
	if(this.operands) {
		str += ',' + prefix+indent+'"operands":[';
		delim='';
		for(i=0,l=this.operands.length; i<l; i+=1) {
			str += delim+this.operands[i].toJson(prefix+indent+indent, indent);
			delim=',';
		}
		str += prefix+indent+']';
	}
	
	str += prefix + '}';
	return str;
};

protonode.toDom = function (pos) {
	"use strict";
	var i, l, el, className = "node", node = this, typeName;
	pos = pos || 0;
	
	var addChildren = function (node, startIndex, delim) {
		var i, l, d=null;
		if(!node.children || node.children.length <= startIndex) {
			return;
		}
		for(i=startIndex, l=node.children.length; i<l; i+=1) {
			if(d) node.dom.append(d);
			node.dom.append(node.children[i].toDom(pos));
			if(delim) d = delim.clone(false);
		}
	}
	
	this.dom = el = $("<span>");
	className += " " + this.arity;
	className += this.err? " has_errors":"";
	typeName = "expredit_"+getTypeName(this, true);
	className += typeName?" " + typeName.replace(/anonymous/g, "").replace(/\:+/g, ' '):"";

	el.addClass(className);
	
	switch(this.arity) {
		case "binary_operation":
		case "object_dereference":
			addChildren(this, 0, $("<span class='operator'>" + this.text + "</span>"));
			break;
		case "unary_operation":
			el.append($("<span class='operator'>" + this.text + "</span>"));
			el.append(this.children[0].toDom(pos));
			break;
		case "ternary_operation":
			el.append(this.children[0].toDom(pos));
			el.append($("<span class='operator'>?</span>"));
			el.append(this.children[1].toDom(pos));
			el.append($("<span class='operator'>:</span>"));
			el.append(this.children[2].toDom(pos));
			break;
		case "method_call":
			el.append(this.children[0].toDom(pos));
			el.append($("<span class='operator'>.</span>"));
			el.append(this.children[1].toDom(pos));
			el.append($("<span class='operator paren'>(</span>"));
			addChildren(this, 2, $("<span class='operator'>,</span>"));
			el.append($("<span class='operator paren'>)</span>"));
			break;
		case "function_call":
			el.append(this.children[0].toDom(pos));
			el.append($("<span class='operator paren'>(</span>"));
			addChildren(this, 1, $("<span class='operator'>,</span>"));
			el.append($("<span class='operator paren'>)</span>"));
			break;
		case "array_lookup":
			el.append(this.children[0].toDom(pos));
			el.append($("<span class='operator paren'>[</span>"));
			addChildren(this, 1, $("<span class='operator'> </span>"));
			el.append($("<span class='operator paren'>]</span>"));
			break;
		case "group":
			if(this.paren !== false) {
				el.append($("<span class='operator paren'>(</span>"));
			}
			addChildren(this, 0, null);
			if(this.paren !== false) {
				el.append($("<span class='operator paren'>)</span>"));
			}
			break;
		case "missing":
			if(this.text) {
				el.html(this.text);
			} else {
				el.html("&nbsp;");
			}
			break;
		default:
			el.html(this.text||"");
			break;
	}
	
	el.mousemove(function(e) {
		io.balloon(node);
		e.stopPropagation();
	});
	
	return el;
	
};
return this.each(function () {
	var tree, selectedNode;
	var initVal = this.value;
	var input = $(this);
	var cursor, onMissing = false, missingPos;
	
	var loadType = function(typeName) {
		if(!options.typeSource) return;
		
		var notif = $("<div>").addClass("notification").insertAfter(xedit).
			html("Loading " + typeName + "...").fadeIn(200);
			
		$.getJSON(options.typeSource, {t: typeName}).
			done(function(data) {
				notif.fadeOut(500);
				grammar.types[typeName] = data;
				io.removeBalloon();
				//Do the same as in key up function but force to reload the balloon
				if(!options.offline)
					cursor = io.getCursor(xedit[0]);
				handleText(true);
				if(!options.offline)
					handleCursor();
			}).
			fail(function () {
				//console.log(this);
				notif.html("Error loading " + typeName);
				grammar.types[typeName] = false;
				setTimeout(function() {notif.fadeOut(500)}, 1000);
			});
	};
	
	var handleText = function (force) {
		var expr = io.expr(xedit);
		if(force || expr !== input.val()) {
			tree = parse(tokenize(expr));
			typify(tree, options.expected, loadType);
			xedit.empty().append(tree.toDom());
			//console.log(tree);
			input.val(io.expr(xedit)).
				data("json", tree.toJson("\n", "  ")).change();
		}
	};
	
	var handleCursor = function () {
		var reverse = cursor.reverse;
		var node_s = selectNode(tree, cursor.start);
		var node_e = selectNode(tree, cursor.end);
		
		var cur_s = node_s && node_s.node.arity==="missing"?
			io.charOffset(node_s.node.dom[0], node_s.pos):
			io.charOffset(xedit[0], cursor.start);
		var cur_e = node_e && node_e.node.arity==="missing"?
			io.charOffset(node_e.node.dom[0], node_e.pos):
			io.charOffset(xedit[0], cursor.end);
		
		onMissing = false;
		if(node_e && node_s && node_e.node === node_s.node) {
			selectedNode = node_s.node;
			if(selectedNode.arity === "missing" && !selectedNode.text) {
				cur_s.pos = 0;
				cur_e.pos = 1;
				missingPos = node_s.pos;
				reverse = !missingPos;
				onMissing = true;
			}
			io.balloon(selectedNode);
		}
		io.putCursor(cur_s, cur_e, reverse);
	};
	
	var handleBlur = function () {
		
//		console.log(xedit.is(":focus"));
		setTimeout(function() {
			if(ignoreBlur){
				//console.log("stop ignoring");
				ignoreBlur = false;
			} else {
				io.removeBalloon();
			}
		}, 200);
	};
	
	$(document.body).attr({spellcheck: false});
	
	var xedit = $("<div>").
		attr({
			contenteditable: true,
			spellcheck: false,
			"class": "expredit " + input[0].className,
			style: input.attr("style")
		}).
		css({
			"width": input.width(),
			"height": "auto",
			"display": input.is(":visible")?"inline-block":"none",
		}).
		keyup(function (e) {
			if(
				onMissing && selectedNode != tree &&
				(e.which == 8 || e.which == 46 ||
				e.which == 37 && missingPos==0 ||
				e.which == 39 && missingPos==1) 
			) {
				onMissing = false;
				return;
			}
			if(!options.offline)
				cursor = io.getCursor(xedit[0]);
			handleText();
			if(!options.offline)
				handleCursor();
		}).
		mouseup(function () {
			if(!options.offline)
			{
				cursor = io.getCursor(xedit[0]);
				handleCursor();
			}
		}).
		blur(handleBlur).
		insertAfter(input);
	
	//TODO: Do it in a better way. Escaping the special characters.
	var initVal1=initVal.replace(/</g,"&lt;");
	initVal1=initVal1.replace(/>/g,"&gt;");
	initVal1=initVal1.replace(/&&/g,"&amp;&amp;");
	initVal1=initVal1.replace(/'/g,"&quot;");
	
	xedit.html(initVal1);
	input.hide();
		
	handleText(true);
});
}
var ignoreBlur = false;