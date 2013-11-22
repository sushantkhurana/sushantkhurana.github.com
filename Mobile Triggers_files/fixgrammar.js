/*
    Please use this fix function.

    IMPORTANT NOTE: I've covered every position where an TypeSpec may be legally placed, except two:

    1) The "form" attribute of another TypeSpec
    2) The "operandTypes" attribute of OperatorSpecs

    The reason is that it really only makes sense to use named types in these locations; I
    can think of no use case in which an anonymous TypeSpec here can make sense. Removing these
    (esp. form) greatly reduces the depth of recursion.
*/

var fix = function (grammar) {
    var i;

    var fixType = function (type) {
        var i;

        if('object' !== typeof type) return type;

        if(type.properties || type.methods) {
            type.members = {};
            for(i in type.properties)
                type.members[i] = fixIdent(type.properties[i]);

            for(i in type.methods)
                type.members[i] = fixIdent(type.methods[i]);
           
            delete type.properties;
            delete type.methods;
        }

        if(type.keyType) {
            type.keyType = fixType(type.keyType);
        }

        if(type.valueType) {
            type.valueType = fixType(type.valueType);
        }

        if(type.returnType) {
            type.type = fixType(type.returnType);
            delete type.returnType;
        }

        if(type.params) {
            for(i = type.params.length-1; i>=0; i--)
                type.params[i] = fixIdent(type.params[i]);
        }

        return type;
    };

    var fixIdent = function (ident) {
        var i;

        if('object' !== typeof ident) return ident;

        ident.type = fixType(ident.returnType || ident.def || ident.type);

        delete ident.returnType;
        delete ident.def;

        if(ident.closureParams) {
            for(i in ident.closureParams)
                ident.closureParams[i] = fixIdent(ident.closureParams[i]);
        }

        return ident;
    };

// Fix types,
    for(i in grammar.types) {
        grammar.types[i] = fixType(grammar.types[i]);
    }

// operators,
    for(i in grammar.operators) {
        grammar.operators[i].type = fixType(grammar.operators[i].type || grammar.operators[i].returnType);
        delete grammar.operators[i].returnType;
        // in case you decide to change type to returnType in operatorSpecs someday.
    }

// and identifiers
    for(i in grammar.identifiers) {
        grammar.identifiers[i] = fixIdent(grammar.identifiers[i]);
    }

    return grammar;
}
