/*****************************************
 * compiler                              *
 *****************************************/
/* Compiled by WAXC (Version Jul 15 2022)*/
var compiler;
(function (compiler) {
    /*=== WAX Standard Library BEGIN ===*/
    var w_slice = function (x, i, n) { return x.slice(i, i + n); };
    /*=== WAX Standard Library END   ===*/
    /*=== User Code            BEGIN ===*/
    var token_file = /** @class */ (function () {
        function token_file() {
            this.name = null;
        }
        return token_file;
    }());
    compiler.token_file = token_file;
    ;
    var token = /** @class */ (function () {
        function token() {
            this.type = 0;
            this.value = null;
            this.file = null;
            this.newlines = 0;
            this.linenumber = 0;
        }
        return token;
    }());
    compiler.token = token;
    ;
    function token_new(type, value, file, newlines, linenumber) {
        var t = null;
        t = (new token());
        ((t).type = type);
        ((t).value = value);
        ((t).file = file);
        ((t).newlines = newlines);
        ((t).linenumber = linenumber);
        return t;
    }
    compiler.token_new = token_new;
    ;
    function token_parse(input, filename, comments) {
        var file = null;
        file = (new token_file());
        ((file).name = filename);
        var token = null;
        token = "";
        var tokens = null;
        tokens = [];
        var newlines = 0;
        newlines = 0;
        var linenumber = 0;
        linenumber = 1;
        var in_comment = 0;
        in_comment = 0;
        var in_single_quote = 0;
        in_single_quote = 0;
        var in_double_quote = 0;
        in_double_quote = 0;
        var in_quote = 0;
        in_quote = 0;
        var in_quote_escape = 0;
        in_quote_escape = 0;
        for (var i = (0); Number((i) < ((input).length)); i += (1)) {
            var c = 0;
            c = (input).charCodeAt(i);
            if (in_quote_escape) {
                in_quote_escape = 0;
            }
            else {
                if (((Number(!(in_double_quote))) && (Number((c) == ('\''.charCodeAt(0)))))) {
                    in_single_quote = Number(!(in_single_quote));
                }
                ;
                if (((Number(!(in_single_quote))) && (Number((c) == ('"'.charCodeAt(0)))))) {
                    in_double_quote = Number(!(in_double_quote));
                }
                ;
                in_quote = ((in_single_quote) || (in_double_quote));
                if (in_quote) {
                    if (Number((c) == ('\\'.charCodeAt(0)))) {
                        in_quote_escape = 1;
                    }
                    ;
                }
                ;
                if (Number(!(in_quote))) {
                    if (Number((c) == (';'.charCodeAt(0)))) {
                        in_comment = 1;
                    }
                    ;
                }
                ;
                if (Number((c) == ('\n'.charCodeAt(0)))) {
                    if (in_comment) {
                        if (Number((comments) != (0))) {
                            (tokens).splice((tokens.length), 0, (token_new(2, token, file, newlines, linenumber)));
                            newlines = 0;
                        }
                        ;
                        token = "";
                    }
                    ;
                    in_comment = 0;
                }
                ;
            }
            ;
            var whitespace = 0;
            whitespace = ((((((Number((c) == ('\t'.charCodeAt(0)))) || (Number((c) == (' '.charCodeAt(0)))))) || (Number((c) == ('\n'.charCodeAt(0)))))) || (Number((c) == ('\r'.charCodeAt(0)))));
            var paren = 0;
            paren = ((Number((c) == ('('.charCodeAt(0)))) || (Number((c) == (')'.charCodeAt(0)))));
            if (((((Number(!(in_quote))) && (Number(!(in_comment))))) && (((whitespace) || (paren))))) {
                if (Number(((token).length) > (0))) {
                    (tokens).splice((tokens.length), 0, (token_new(0, token, file, newlines, linenumber)));
                    newlines = 0;
                }
                ;
                if (paren) {
                    token = "";
                    (token) += String.fromCharCode((input).charCodeAt(i));
                    (tokens).splice((tokens.length), 0, (token_new(1, token, file, newlines, linenumber)));
                    newlines = 0;
                }
                ;
                token = "";
            }
            else {
                (token) += String.fromCharCode((input).charCodeAt(i));
            }
            ;
            if (Number((c) == ('\n'.charCodeAt(0)))) {
                newlines = ((newlines) + (1));
                linenumber = ((linenumber) + (1));
            }
            ;
        }
        ;
        return tokens;
    }
    compiler.token_parse = token_parse;
    ;
    function token_write_to_output(tokens) {
        console.log("count:");
        console.log((tokens.length).toString());
        console.log("");
        for (var i = (0); Number((i) < (tokens.length)); i += (1)) {
            console.log(((((tokens)[i])).value));
        }
        ;
    }
    compiler.token_write_to_output = token_write_to_output;
    ;
    function token_to_string(tokens, width) {
        var s = null;
        s = "";
        var line = null;
        line = "";
        for (var i = (0); Number((i) < (tokens.length)); i += (1)) {
            var token_1 = null;
            token_1 = "";
            for (var j = (0); Number((j) < ((((((tokens)[i])).value)).length)); j += (1)) {
                var c = 0;
                c = (((((tokens)[i])).value)).charCodeAt(j);
                var encoded = null;
                encoded = "";
                (encoded) += String.fromCharCode(c);
                if (Number((c) == ('\"'.charCodeAt(0)))) {
                    encoded = "\\\"";
                }
                ;
                if (Number((c) == ('\\'.charCodeAt(0)))) {
                    encoded = "";
                    (encoded) += String.fromCharCode('\\'.charCodeAt(0));
                    (encoded) += String.fromCharCode('\\'.charCodeAt(0));
                }
                ;
                ((token_1) += (encoded));
            }
            ;
            ((line) += (token_1));
            if (Number(((line).length) > (width))) {
                ((s) += ("\""));
                ((s) += (line));
                ((s) += ("\\n\"\n"));
                line = "";
            }
            else {
                if (((Number((token_1) != ("("))) && (Number((token_1) != (")"))))) {
                    ((line) += (" "));
                }
                ;
            }
            ;
        }
        ;
        ((s) += ("\""));
        ((s) += (line));
        ((s) += ("\\n\"\n"));
        return s;
    }
    compiler.token_to_string = token_to_string;
    ;
    var node = /** @class */ (function () {
        function node() {
            this.type = 0;
            this.value = null;
            this.child = null;
            this.token = null;
        }
        return node;
    }());
    compiler.node = node;
    ;
    function node_new(type, value) {
        var node_new = null;
        node_new = (new node());
        ((node_new).type = type);
        ((node_new).value = value);
        ((node_new).child = []);
        ((node_new).token = (new token()));
        return node_new;
    }
    compiler.node_new = node_new;
    ;
    function node_copy(src) {
        var res = null;
        res = (new node());
        ((res).type = ((src).type));
        ((res).value = ((src).value));
        ((res).child = []);
        for (var i = (0); Number((i) < (((src).child).length)); i += (1)) {
            (((res).child)).splice((i), 0, (node_copy(((((src).child))[i]))));
        }
        ;
        ((res).token = ((src).token));
        return res;
    }
    compiler.node_copy = node_copy;
    ;
    function node_type_from_token(token) {
        if (Number(((token).length) > (0))) {
            var c = 0;
            c = (token).charCodeAt(0);
            if (Number((c) == ('@'.charCodeAt(0)))) {
                return 2;
            }
            ;
            if (Number((c) == ('\''.charCodeAt(0)))) {
                return 3;
            }
            ;
            if (Number((c) == ('"'.charCodeAt(0)))) {
                return 5;
            }
            ;
            if (((((Number((c) >= ('0'.charCodeAt(0)))) && (Number((c) <= ('9'.charCodeAt(0)))))) || (Number((c) == ('-'.charCodeAt(0)))))) {
                for (var i = (0); Number((i) < ((token).length)); i += (1)) {
                    c = (token).charCodeAt(i);
                    if (Number((c) == ('.'.charCodeAt(0)))) {
                        return 7;
                    }
                    ;
                }
                ;
                return 6;
            }
            ;
        }
        ;
        return 4;
    }
    compiler.node_type_from_token = node_type_from_token;
    ;
    function node_from_tokens(tokens) {
        var stack = null;
        stack = [];
        (stack).splice((stack.length), 0, (node_new(0, "")));
        var i = 0;
        i = 0;
        while (Number((i) < (tokens.length))) {
            var token_2 = null;
            token_2 = ((((tokens)[i])).value);
            if (Number((((((tokens)[i])).type)) == (2))) {
                var child = null;
                child = node_new(8, token_2);
                ((child).token = ((tokens)[i]));
                var node_1 = null;
                node_1 = ((stack)[((stack.length) - (1))]);
                (((node_1).child)).splice((((node_1).child).length), 0, (child));
            }
            else {
                if (Number((token_2) == ("("))) {
                    var value = null;
                    value = "";
                    var next_token = null;
                    next_token = ((((tokens)[((i) + (1))])).value);
                    if (((Number((next_token) != ("("))) && (Number((next_token) != (")"))))) {
                        value = next_token;
                    }
                    ;
                    var node_2 = null;
                    node_2 = node_new(1, value);
                    ((node_2).token = ((tokens)[i]));
                    if (Number((value) != (""))) {
                        i = ((i) + (1));
                    }
                    ;
                    var parent_1 = null;
                    parent_1 = ((stack)[((stack.length) - (1))]);
                    (((parent_1).child)).splice((((parent_1).child).length), 0, (node_2));
                    (stack).splice((stack.length), 0, (node_2));
                }
                else {
                    if (Number((token_2) == (")"))) {
                        (stack).splice((((stack.length) - (1))), (1));
                    }
                    else {
                        var child = null;
                        child = node_new(node_type_from_token(token_2), token_2);
                        ((child).token = ((tokens)[i]));
                        var node_3 = null;
                        node_3 = ((stack)[((stack.length) - (1))]);
                        (((node_3).child)).splice((((node_3).child).length), 0, (child));
                    }
                    ;
                }
                ;
            }
            ;
            i = ((i) + (1));
        }
        ;
        return ((stack)[0]);
    }
    compiler.node_from_tokens = node_from_tokens;
    ;
    function node_expand(node_org) {
        if (Number((((node_org).child).length) < (2))) {
            return node_org;
        }
        ;
        var expanded = null;
        expanded = node_new(1, ((node_org).value));
        (((expanded).child)).splice((((expanded).child).length), 0, (((((node_org).child))[0])));
        if (Number((((node_org).child).length) == (2))) {
            (((expanded).child)).splice((((expanded).child).length), 0, (((((node_org).child))[1])));
        }
        else {
            var expanded_child = null;
            expanded_child = node_new(1, ((node_org).value));
            for (var i = (1); Number((i) < (((node_org).child).length)); i += (1)) {
                (((expanded_child).child)).splice((((expanded_child).child).length), 0, (((((node_org).child))[i])));
            }
            ;
            (((expanded).child)).splice((((expanded).child).length), 0, (expanded_child));
        }
        ;
        return expanded;
    }
    compiler.node_expand = node_expand;
    ;
    function node_indent_needed(node, child) {
        if (Number((((child).type)) != (1))) {
            return 0;
        }
        ;
        if (((Number((((child).value)) == ("param"))) || (Number((((child).value)) == ("result"))))) {
            return 0;
        }
        ;
        if (((((((((((Number((((node).value)) == (""))) || (Number((((node).value)) == ("func"))))) || (Number((((node).value)) == ("do"))))) || (Number((((node).value)) == ("then"))))) || (Number((((node).value)) == ("else"))))) || (Number((((node).value)) == ("struct"))))) {
            return 1;
        }
        ;
        return 0;
    }
    compiler.node_indent_needed = node_indent_needed;
    ;
    var node_to_wax_indent = 0;
    function node_to_str(depth, node) {
        var s = null;
        s = "";
        if (Number((((node).type)) == (0))) {
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                var child = null;
                child = node_to_str(0, ((((node).child))[i]));
                for (var j = (0); Number((j) < (((((((((node).child))[i])).token)).newlines))); j += (1)) {
                    ((s) += ("\n"));
                }
                ;
                ((s) += (child));
            }
            ;
        }
        ;
        if (Number((((node).type)) == (1))) {
            ((s) += ("("));
            ((s) += (((node).value)));
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                var node_child = null;
                node_child = ((((node).child))[i]);
                var indent_needed = 0;
                indent_needed = Number((((node_child).type)) == (1));
                if (node_to_wax_indent) {
                    indent_needed = node_indent_needed(node, node_child);
                    indent_needed = ((((indent_needed) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))));
                }
                ;
                indent_needed = Number((((((node_child).token)).newlines)) > (0));
                var indent_depth = 0;
                indent_depth = ((indent_needed) ? (depth) : (((depth) - (1))));
                var indent = null;
                indent = "\t";
                if (indent_needed) {
                    for (var i_1 = (0); Number((i_1) < (((((node_child).token)).newlines))); i_1 += (1)) {
                        ((s) += ("\n"));
                    }
                    ;
                    for (var i_2 = (0); Number((i_2) <= (indent_depth)); i_2 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                else {
                    ((s) += (" "));
                }
                ;
                var child = null;
                child = node_to_str(((indent_depth) + (1)), node_child);
                ((s) += (child));
                if (((indent_needed) && (Number((i) == (((((node).child).length) - (1))))))) {
                    ((s) += ("\n"));
                    for (var i_3 = (0); Number((i_3) < (indent_depth)); i_3 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                ;
            }
            ;
            ((s) += (")"));
        }
        ;
        if (Number((((node).type)) != (1))) {
            ((s) += (((node).value)));
        }
        ;
        return s;
    }
    compiler.node_to_str = node_to_str;
    ;
    function node_to_wax(depth, node) {
        node_to_wax_indent = 1;
        return node_to_str(depth, node);
    }
    compiler.node_to_wax = node_to_wax;
    ;
    function error_exit(msg) { throw (msg); }
    function compile_error(module, node, msg) {
        var out_ = null;
        out_ = module;
        ((out_) += (" error: "));
        ((out_) += (((((((node).token)).file)).name)));
        ((out_) += (", line "));
        ((out_) += ((((((node).token)).linenumber)).toString()));
        ((out_) += ("\n  "));
        ((out_) += (msg));
        ((out_) += ("\n\n"));
        error_exit(out_);
    }
    compiler.compile_error = compile_error;
    ;
    var node_symbol = /** @class */ (function () {
        function node_symbol() {
            this.name = null;
            this.node = null;
        }
        return node_symbol;
    }());
    compiler.node_symbol = node_symbol;
    ;
    function dump_symbol(symbol) {
        var s = null;
        s = "";
        for (var i = (0); Number((i) < (symbol.length)); i += (1)) {
            ((s) += (" "));
            ((s) += (((((symbol)[i])).name)));
        }
        ;
        return s;
    }
    compiler.dump_symbol = dump_symbol;
    ;
    function node_symbol_scope_node(symbol, node) {
        var copy_symbol = null;
        copy_symbol = [];
        for (var i = (0); Number((i) < (symbol.length)); i += (1)) {
            var s = null;
            s = (new node_symbol());
            ((s).name = ((((symbol)[i])).name));
            ((s).node = ((((symbol)[i])).node));
            (copy_symbol).splice((copy_symbol.length), 0, (s));
        }
        ;
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            var child = null;
            child = ((((node).child))[i]);
            if (((((((((Number((((child).value)) == ("struct"))) || (Number((((child).value)) == ("func"))))) || (Number((((child).value)) == ("let"))))) || (Number((((child).value)) == ("param"))))) || (Number((((child).value)) == ("for"))))) {
                var s = null;
                s = (new node_symbol());
                ((s).name = ((((((child).child))[0])).value));
                ((s).node = child);
                (copy_symbol).splice((copy_symbol.length), 0, (s));
            }
            ;
        }
        ;
        return copy_symbol;
    }
    compiler.node_symbol_scope_node = node_symbol_scope_node;
    ;
    function node_symbol_get_node(symbol, type, node) {
        for (var i = (((symbol.length) - (1))); Number((i) >= (0)); i += (-1)) {
            if (Number((((((symbol)[i])).name)) == (((node).value)))) {
                if (((Number((type) == (""))) || (Number((type) == (((((((symbol)[i])).node)).value)))))) {
                    return ((((symbol)[i])).node);
                }
                ;
            }
            ;
        }
        ;
        compile_error("Symbol", node, "symbol not found");
        return ((((symbol)[0])).node);
    }
    compiler.node_symbol_get_node = node_symbol_get_node;
    ;
    function node_symbol_node_type_src(symbol, node) {
        if (((((((((((((((Number((((node).type)) == (2))) || (Number((((node).type)) == (5))))) || (Number((((node).type)) == (3))))) || (Number((((node).type)) == (6))))) || (Number((((node).type)) == (7))))) || (Number((((node).value)) == ("str"))))) || (Number((((node).value)) == ("int"))))) || (Number((((node).value)) == ("float"))))) {
            return node;
        }
        ;
        if (Number((((node).type)) == (4))) {
            var symbol_node = null;
            symbol_node = node_symbol_get_node(symbol, "", node);
            if (Number((((symbol_node).value)) == ("func"))) {
                return node;
            }
            ;
            if (((((Number((((symbol_node).value)) == ("let"))) || (Number((((symbol_node).value)) == ("param"))))) || (Number((((symbol_node).value)) == ("for"))))) {
                return node_symbol_node_type_src(symbol, ((((symbol_node).child))[1]));
            }
            ;
        }
        ;
        if (Number((((node).type)) == (1))) {
            if (Number((((node).value)) == ("="))) {
                return node;
            }
            ;
            if (Number((((node).value)) == ("#"))) {
                return node;
            }
            ;
            if (Number((((node).value)) == ("vec"))) {
                return node;
            }
            ;
            if (Number((((node).value)) == ("arr"))) {
                return node;
            }
            ;
            if (Number((((node).value)) == ("struct"))) {
                return node;
            }
            ;
            if (Number((((node).value)) == ("cast"))) {
                return ((((node).child))[1]);
            }
            ;
            if (Number((((node).value)) == ("?"))) {
                return ((((node).child))[1]);
            }
            ;
            if (Number((((node).value)) == ("call"))) {
                var symbol_node = null;
                symbol_node = node_symbol_get_node(symbol, "", ((((node).child))[0]));
                for (var i = (1); Number((i) < (((symbol_node).child).length)); i += (1)) {
                    if (Number((((((((symbol_node).child))[i])).value)) == ("result"))) {
                        return ((((((((symbol_node).child))[i])).child))[0]);
                    }
                    ;
                }
                ;
                compile_error("Symbol", node, "function result not found");
            }
            ;
            if (Number((((node).value)) == ("get"))) {
                var target_node = null;
                if (Number((((((((node).child))[0])).type)) == (4))) {
                    var symbol_node = null;
                    symbol_node = node_symbol_get_node(symbol, "", ((((node).child))[0]));
                    if (((Number((((symbol_node).value)) != ("let"))) && (Number((((symbol_node).value)) != ("param"))))) {
                        compile_error("Symbol", node, "symbol not variable");
                    }
                    ;
                    target_node = ((((symbol_node).child))[1]);
                }
                else {
                    if (Number((((((((node).child))[0])).value)) == ("get"))) {
                        var get_node_type = null;
                        get_node_type = node_symbol_node_type_src(symbol, ((((node).child))[0]));
                        target_node = get_node_type;
                    }
                    else {
                        compile_error("Symbol", node, "bad get expression");
                    }
                    ;
                }
                ;
                for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                    if (Number((((target_node).value)) == ("vec"))) {
                        target_node = ((((target_node).child))[1]);
                    }
                    else {
                        if (Number((((target_node).value)) == ("arr"))) {
                            target_node = ((((target_node).child))[0]);
                        }
                        else {
                            if (Number((((target_node).value)) == ("str"))) {
                                return node_new(2, "");
                            }
                            else {
                                if (Number((((target_node).value)) == ("struct"))) {
                                    var symbol_node = null;
                                    symbol_node = node_symbol_get_node(symbol, "struct", ((((target_node).child))[0]));
                                    var found = 0;
                                    found = 0;
                                    for (var j = (1); Number((j) < (((symbol_node).child).length)); j += (1)) {
                                        if (((Number((((((((symbol_node).child))[j])).value)) == ("let"))) && (Number((((((((((((symbol_node).child))[j])).child))[0])).value)) == (((((((node).child))[i])).value)))))) {
                                            target_node = ((((((((symbol_node).child))[j])).child))[1]);
                                            found = 1;
                                        }
                                        ;
                                    }
                                    ;
                                    if (Number(!(found))) {
                                        compile_error("Symbol", node, "struct member not found");
                                    }
                                    ;
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
                return node_symbol_node_type_src(symbol, target_node);
            }
            ;
            return node_symbol_node_type_src(symbol, ((((node).child))[0]));
        }
        ;
        compile_error("Symbol", node, "source node not established");
        return node;
    }
    compiler.node_symbol_node_type_src = node_symbol_node_type_src;
    ;
    function node_symbol_node_type(symbol, node) {
        var src_node = null;
        src_node = node_symbol_node_type_src(symbol, node);
        if (Number((((src_node).type)) == (2))) {
            return 2;
        }
        ;
        if (Number((((src_node).type)) == (5))) {
            return 1;
        }
        ;
        if (Number((((src_node).type)) == (3))) {
            return 2;
        }
        ;
        if (Number((((src_node).type)) == (6))) {
            return 2;
        }
        ;
        if (Number((((src_node).type)) == (7))) {
            return 3;
        }
        ;
        if (Number((((src_node).value)) == ("="))) {
            return 2;
        }
        ;
        if (Number((((src_node).value)) == ("#"))) {
            return 2;
        }
        ;
        if (Number((((src_node).value)) == ("str"))) {
            return 1;
        }
        ;
        if (Number((((src_node).value)) == ("int"))) {
            return 2;
        }
        ;
        if (Number((((src_node).value)) == ("float"))) {
            return 3;
        }
        ;
        if (Number((((src_node).value)) == ("call"))) {
            return 2;
        }
        ;
        return 0;
    }
    compiler.node_symbol_node_type = node_symbol_node_type;
    ;
    function readfile(filename) { var fs = require('fs'); return fs.readFileSync(filename).toString(); }
    function preprocess_replace_node(node, define) {
        var _a;
        if (Number((((node).type)) == (2))) {
            var k = null;
            k = "";
            for (var i = (1); Number((i) < ((((node).value)).length)); i += (1)) {
                (k) += String.fromCharCode((((node).value)).charCodeAt(i));
            }
            ;
            var replace = null;
            replace = ((((((_a = (define)[k]) !== null && _a !== void 0 ? _a : null)).child))[1]);
            ((node).type = ((replace).type));
            ((node).value = ((replace).value));
        }
        ;
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            preprocess_replace_node(((((node).child))[i]), define);
        }
        ;
    }
    compiler.preprocess_replace_node = preprocess_replace_node;
    ;
    function preprocess_replace(node) {
        var define = null;
        define = {};
        var i = 0;
        i = 0;
        while (Number((i) < (((node).child).length))) {
            if (Number((((((((node).child))[i])).value)) == ("@define"))) {
                ((define)[((((((((((node).child))[i])).child))[0])).value)] = ((((node).child))[i]));
                (((node).child)).splice((i), (1));
            }
            else {
                preprocess_replace_node(((((node).child))[i]), define);
                i = ((i) + (1));
            }
            ;
        }
        ;
        return node;
    }
    compiler.preprocess_replace = preprocess_replace;
    ;
    function preprocess_package_rewrite_identifier(package_, identifier, node) {
        var _a;
        var v = null;
        v = ((node).value);
        if (Number((((node).type)) == (2))) {
            /**remove**/ ;
        }
        ;
        if (Number((((_a = (identifier)[v]) !== null && _a !== void 0 ? _a : 0)) == (1))) {
            var value = null;
            if (Number((((node).type)) == (2))) {
                value = "@";
            }
            ;
            ((value) += ("__"));
            ((value) += (package_));
            ((value) += ("__"));
            ((value) += (v));
            ((node).value = value);
        }
        ;
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            preprocess_package_rewrite_identifier(package_, identifier, ((((node).child))[i]));
        }
        ;
    }
    compiler.preprocess_package_rewrite_identifier = preprocess_package_rewrite_identifier;
    ;
    function preprocess_package_rewrite(package_, node) {
        var identifier = null;
        identifier = {};
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            if (((((Number((((((((node).child))[i])).value)) == ("@define"))) || (Number((((((((node).child))[i])).value)) == ("func"))))) || (Number((((((((node).child))[i])).value)) == ("struct"))))) {
                ((identifier)[((((((((((node).child))[i])).child))[0])).value)] = 1);
            }
            ;
        }
        ;
        preprocess_package_rewrite_identifier(package_, identifier, node);
    }
    compiler.preprocess_package_rewrite = preprocess_package_rewrite;
    ;
    function preprocess_package_from_path(pathprefix, node) {
        var package_ = null;
        package_ = "";
        var filename = null;
        filename = "";
        var basepath = null;
        basepath = "";
        var quotedfilename = null;
        quotedfilename = ((((((node).child))[0])).value);
        if (Number((((node).child).length) == (2))) {
            for (var i = (1); Number((i) < ((((((((((node).child))[0])).value)).length) - (1)))); i += (1)) {
                (package_) += String.fromCharCode((((((((node).child))[0])).value)).charCodeAt(i));
            }
            ;
            quotedfilename = ((((((node).child))[1])).value);
        }
        ;
        var start = 0;
        start = 0;
        var end = 0;
        end = (quotedfilename).length;
        for (var i = (0); Number((i) < ((quotedfilename).length)); i += (1)) {
            if (Number(((quotedfilename).charCodeAt(i)) == ('/'.charCodeAt(0)))) {
                start = ((i) + (1));
            }
            ;
            if (Number(((quotedfilename).charCodeAt(i)) == ('.'.charCodeAt(0)))) {
                end = i;
            }
            ;
        }
        ;
        if (Number((((node).child).length) == (1))) {
            for (var i = (start); Number((i) < (end)); i += (1)) {
                (package_) += String.fromCharCode((quotedfilename).charCodeAt(i));
            }
            ;
        }
        ;
        for (var i = (0); Number((i) < ((pathprefix).length)); i += (1)) {
            (filename) += String.fromCharCode((pathprefix).charCodeAt(i));
        }
        ;
        for (var i = (1); Number((i) < ((((quotedfilename).length) - (1)))); i += (1)) {
            (filename) += String.fromCharCode((quotedfilename).charCodeAt(i));
        }
        ;
        for (var i = (0); Number((i) < ((pathprefix).length)); i += (1)) {
            (basepath) += String.fromCharCode((pathprefix).charCodeAt(i));
        }
        ;
        for (var i = (1); Number((i) < (start)); i += (1)) {
            (basepath) += String.fromCharCode((quotedfilename).charCodeAt(i));
        }
        ;
        return [(package_), (filename), (basepath)];
    }
    compiler.preprocess_package_from_path = preprocess_package_from_path;
    ;
    function preprocess_include_import(basepath, node) {
        var i = 0;
        i = 0;
        while (Number((i) < (((node).child).length))) {
            if (((Number((((((((node).child))[i])).value)) == ("@include"))) || (Number((((((((node).child))[i])).value)) == ("@import"))))) {
                var res = null;
                res = preprocess_package_from_path(basepath, ((((node).child))[i]));
                var package_ = null;
                package_ = ((res)[0]);
                var filename = null;
                filename = ((res)[1]);
                var prefix = null;
                prefix = ((res)[2]);
                var include_str = null;
                include_str = readfile(filename);
                if (Number(((include_str).length) == (0))) {
                    var err = null;
                    err = "Cannot open file: ";
                    ((err) += (filename));
                    compile_error("Preprocess", ((((node).child))[i]), err);
                }
                ;
                var tokens = null;
                tokens = token_parse(include_str, filename, 0);
                var include = null;
                include = node_from_tokens(tokens);
                preprocess_include_import(prefix, include);
                if (Number((((((((node).child))[i])).value)) == ("@import"))) {
                    preprocess_package_rewrite(package_, include);
                }
                ;
                (((node).child)).splice((i), (1));
                for (var j = (0); Number((j) < (((include).child).length)); j += (1)) {
                    (((node).child)).splice((((i) + (j))), 0, (((((include).child))[j])));
                }
                ;
                i = ((i) + (((include).child).length));
            }
            else {
                i = ((i) + (1));
            }
            ;
        }
        ;
    }
    compiler.preprocess_include_import = preprocess_include_import;
    ;
    function preprocess_identifier_rewrite(node) {
        if (Number((((node).type)) == (4))) {
            for (var i = (0); Number((i) < ((((node).value)).length)); i += (1)) {
                if (Number(((((node).value)).charCodeAt(i)) == ('.'.charCodeAt(0)))) {
                    /**remove**/ ;
                    /**insert**/ ;
                    /**insert**/ ;
                    /**insert**/ ;
                    /**insert**/ ;
                }
                ;
            }
            ;
        }
        ;
        if (Number((((node).type)) == (2))) {
            for (var i = (0); Number((i) < ((((node).value)).length)); i += (1)) {
                if (Number(((((node).value)).charCodeAt(i)) == ('.'.charCodeAt(0)))) {
                    /**remove**/ ;
                    /**insert**/ ;
                    /**insert**/ ;
                    /**insert**/ ;
                    /**insert**/ ;
                }
                ;
            }
            ;
        }
        ;
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            preprocess_identifier_rewrite(((((node).child))[i]));
        }
        ;
    }
    compiler.preprocess_identifier_rewrite = preprocess_identifier_rewrite;
    ;
    function preprocess(node) {
        preprocess_include_import("", node);
        preprocess_identifier_rewrite(node);
        return node;
    }
    compiler.preprocess = preprocess;
    ;
    function preprocess_vdom_quote(value) {
        var out_ = null;
        out_ = "";
        ((out_) += ("\""));
        ((out_) += (value));
        ((out_) += ("\""));
        return out_;
    }
    compiler.preprocess_vdom_quote = preprocess_vdom_quote;
    ;
    function preprocess_vdom_isaction(type) {
        if (((((Number((type) == ("do"))) || (Number((type) == ("then"))))) || (Number((type) == ("else"))))) {
            return 1;
        }
        ;
        return 0;
    }
    compiler.preprocess_vdom_isaction = preprocess_vdom_isaction;
    ;
    function preprocess_vdom_reserverd(type) {
        if (((((((((((((((Number((type) == ("let"))) || (Number((type) == ("set"))))) || (Number((type) == ("<<"))))) || (Number((type) == ("if"))))) || (Number((type) == ("else"))))) || (Number((type) == ("for"))))) || (Number((type) == ("while"))))) || (Number((type) == ("do"))))) {
            return 1;
        }
        ;
        return 0;
    }
    compiler.preprocess_vdom_reserverd = preprocess_vdom_reserverd;
    ;
    function preprocess_vdom_element(node) {
        var out_ = null;
        out_ = node_new(1, "call");
        (((out_).child)).splice((0), 0, (node_new(4, "__vdom__element_new")));
        (((out_).child)).splice((1), 0, (node_new(5, preprocess_vdom_quote(((node).value)))));
        return out_;
    }
    compiler.preprocess_vdom_element = preprocess_vdom_element;
    ;
    function preprocess_vdom_element_child(depth, name, node) {
        var out_ = null;
        out_ = [];
        var i = 0;
        i = 0;
        while (Number((i) < (((node).child).length))) {
            var type = null;
            type = "";
            if (Number((((((((node).child))[i])).type)) == (4))) {
                type = "attr";
                if (((Number((((((((node).child))[((i) + (1))])).type)) == (1))) && (Number((((((((node).child))[((i) + (1))])).value)) == ("func"))))) {
                    type = "event";
                }
                ;
            }
            ;
            if (Number((((((((node).child))[i])).type)) == (1))) {
                type = "element";
                if (Number((((((((node).child))[i])).value)) == ("child"))) {
                    type = "child";
                }
                ;
                if (Number((preprocess_vdom_reserverd(((((((node).child))[i])).value))) != (0))) {
                    type = "reserved";
                }
                ;
            }
            ;
            if (((Number((type) == ("attr"))) || (Number((type) == ("event"))))) {
                var attr_set = null;
                attr_set = node_new(1, "set");
                ((((attr_set).token)).newlines = 1);
                (((attr_set).child)).splice((0), 0, (node_new(4, name)));
                (((attr_set).child)).splice((1), 0, (node_new(4, type)));
                (((attr_set).child)).splice((2), 0, (node_new(5, preprocess_vdom_quote(((((((node).child))[i])).value)))));
                if (((Number((type) == ("event"))) || (Number((((((((node).child))[((i) + (1))])).type)) == (5))))) {
                    (((attr_set).child)).splice((3), 0, (((((node).child))[((i) + (1))])));
                }
                else {
                    var value = null;
                    value = node_new(1, "cast");
                    (((value).child)).splice((0), 0, (((((node).child))[((i) + (1))])));
                    (((value).child)).splice((1), 0, (node_new(4, "str")));
                    (((attr_set).child)).splice((3), 0, (value));
                }
                ;
                (out_).splice((out_.length), 0, (attr_set));
                i = ((i) + (1));
            }
            ;
            if (Number((type) == ("reserved"))) {
                var child = null;
                child = ((((((node).child))[i])).child);
                ((((((node).child))[i])).child) = [];
                for (var j = (0); Number((j) < (child.length)); j += (1)) {
                    if (((Number((((((child)[j])).type)) == (1))) && (preprocess_vdom_isaction(((((child)[j])).value))))) {
                        var action_node = null;
                        action_node = node_new(1, ((((child)[j])).value));
                        var element_child = null;
                        element_child = preprocess_vdom_element_child(((depth) + (1)), name, ((child)[j]));
                        for (var k = (0); Number((k) < (element_child.length)); k += (1)) {
                            (((action_node).child)).splice((((action_node).child).length), 0, (((element_child)[k])));
                        }
                        ;
                        (((((((node).child))[i])).child)).splice((((((((node).child))[i])).child).length), 0, (action_node));
                    }
                    else {
                        (((((((node).child))[i])).child)).splice((((((((node).child))[i])).child).length), 0, (((child)[j])));
                    }
                    ;
                }
                ;
                (out_).splice((out_.length), 0, (((((node).child))[i])));
            }
            ;
            if (Number((type) == ("child"))) {
                var element_insert = null;
                element_insert = node_new(1, "insert");
                ((((element_insert).token)).newlines = 1);
                ((((element_insert).token)).newlines = 1);
                var element_insert_get = null;
                element_insert_get = node_new(1, "get");
                (((element_insert_get).child)).splice((0), 0, (node_new(4, name)));
                (((element_insert_get).child)).splice((1), 0, (node_new(4, "child")));
                (((element_insert).child)).splice((0), 0, (element_insert_get));
                var element_insert_count = null;
                element_insert_count = node_new(1, "#");
                var element_insert_count_get = null;
                element_insert_count_get = node_new(1, "get");
                (((element_insert_count_get).child)).splice((0), 0, (node_new(4, name)));
                (((element_insert_count_get).child)).splice((1), 0, (node_new(4, "child")));
                (((element_insert_count).child)).splice((0), 0, (element_insert_count_get));
                (((element_insert).child)).splice((1), 0, (element_insert_count));
                (((element_insert).child)).splice((2), 0, (node_new(4, ((((((((((node).child))[i])).child))[0])).value))));
                (out_).splice((out_.length), 0, (element_insert));
            }
            ;
            if (Number((type) == ("element"))) {
                var block = null;
                block = node_new(1, "");
                if (Number((preprocess_vdom_isaction(((node).value))) != (0))) {
                    ((block).value = ((node).value));
                }
                ;
                ((((block).token)).newlines = 1);
                (out_).splice((out_.length), 0, (block));
                var child_name = null;
                child_name = "_";
                ((child_name) += ((depth).toString()));
                ((child_name) += ("_"));
                ((child_name) += ((i).toString()));
                ((child_name) += ("_"));
                ((child_name) += (((((((node).child))[i])).value)));
                var element = null;
                element = node_new(1, "let");
                ((((element).token)).newlines = 1);
                (((element).child)).splice((0), 0, (node_new(4, child_name)));
                var element_struct = null;
                element_struct = node_new(1, "struct");
                (((element_struct).child)).splice((0), 0, (node_new(4, "__vdom__element")));
                (((element).child)).splice((1), 0, (element_struct));
                (((element).child)).splice((2), 0, (preprocess_vdom_element(((((node).child))[i]))));
                (((block).child)).splice((((block).child).length), 0, (element));
                var element_insert = null;
                element_insert = node_new(1, "insert");
                ((((element_insert).token)).newlines = 1);
                var element_insert_get = null;
                element_insert_get = node_new(1, "get");
                (((element_insert_get).child)).splice((0), 0, (node_new(4, name)));
                (((element_insert_get).child)).splice((1), 0, (node_new(4, "child")));
                (((element_insert).child)).splice((0), 0, (element_insert_get));
                var element_insert_count = null;
                element_insert_count = node_new(1, "#");
                var element_insert_count_get = null;
                element_insert_count_get = node_new(1, "get");
                (((element_insert_count_get).child)).splice((0), 0, (node_new(4, name)));
                (((element_insert_count_get).child)).splice((1), 0, (node_new(4, "child")));
                (((element_insert_count).child)).splice((0), 0, (element_insert_count_get));
                (((element_insert).child)).splice((1), 0, (element_insert_count));
                (((element_insert).child)).splice((2), 0, (node_new(4, child_name)));
                (((block).child)).splice((((block).child).length), 0, (element_insert));
                var element_child = null;
                element_child = preprocess_vdom_element_child(((depth) + (1)), child_name, ((((node).child))[i]));
                for (var j = (0); Number((j) < (element_child.length)); j += (1)) {
                    (((block).child)).splice((((block).child).length), 0, (((element_child)[j])));
                }
                ;
            }
            ;
            i = ((i) + (1));
        }
        ;
        return out_;
    }
    compiler.preprocess_vdom_element_child = preprocess_vdom_element_child;
    ;
    function preprocess_vdom(node) {
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            if (((((((((Number((((((((node).child))[i])).value)) == ("let"))) && (Number((((((((node).child))[i])).child).length) == (3))))) && (Number((((((((((((node).child))[i])).child))[1])).value)) == ("struct"))))) && (((Number((((((((((((((((node).child))[i])).child))[1])).child))[0])).value)) == ("vdom.element"))) || (Number((((((((((((((((node).child))[i])).child))[1])).child))[0])).value)) == ("__vdom__element"))))))) && (((Number((((((((((((node).child))[i])).child))[2])).value)) != ("call"))) && (Number((((((((((((node).child))[i])).child))[2])).value)) != ("alloc"))))))) {
                var element_child = null;
                element_child = preprocess_vdom_element_child(0, ((((((((((node).child))[i])).child))[0])).value), ((((((((node).child))[i])).child))[2]));
                ((((((((node).child))[i])).child))[2]) = preprocess_vdom_element(((((((((node).child))[i])).child))[2]));
                ((((((((((((node).child))[i])).child))[2])).token)).newlines = 0);
                for (var j = (0); Number((j) < (element_child.length)); j += (1)) {
                    i = ((i) + (1));
                    (((node).child)).splice((i), 0, (((element_child)[j])));
                }
                ;
            }
            else {
                ((((node).child))[i]) = preprocess_vdom(((((node).child))[i]));
            }
            ;
        }
        ;
        return node;
    }
    compiler.preprocess_vdom = preprocess_vdom;
    ;
    function validate(node) {
        if (Number((((node).type)) == (1))) {
            if (Number((((node).value)) == ("let"))) {
                if (((Number((((node).child).length) < (2))) || (Number((((node).child).length) > (3))))) {
                    compile_error("Validation", node, "'let' requires 2 or 3 args");
                }
                ;
            }
            ;
        }
        ;
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            var child = null;
            child = node_to_str(0, ((((node).child))[i]));
            validate(((((node).child))[i]));
        }
        ;
    }
    compiler.validate = validate;
    ;
    function node_to_js(depth, node) {
        var s = null;
        s = "";
        depth = ((depth) + (1));
        node = node_copy(node);
        if (Number((((node).type)) == (0))) {
            var has_main = 0;
            has_main = 0;
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                if (((Number((((((((node).child))[i])).value)) == ("func"))) && (Number((((((((((((node).child))[i])).child))[0])).value)) == ("main"))))) {
                    has_main = 1;
                }
                ;
                var child = null;
                child = node_to_js(0, ((((node).child))[i]));
                ((s) += (child));
                ((s) += ("\n"));
            }
            ;
            if (has_main) {
                ((s) += ("(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));\n"));
            }
            ;
        }
        ;
        if (((((Number((((node).value)) == ("+"))) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))))) {
            node = node_expand(node);
        }
        ;
        if (Number((((node).type)) == (1))) {
            var block_start = null;
            block_start = "(";
            ((block_start) += (((node).value)));
            var block_end = null;
            block_end = ")";
            var block_seperator = null;
            block_seperator = " ";
            if (Number((((node).value)) == (""))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("@define"))) {
                block_start = "const ";
                ((block_start) += (((((((node).child))[0])).value)));
                ((block_start) += (" = "));
                ((block_start) += (((((((node).child))[1])).value)));
                ((block_start) += (";"));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("@if"))) {
                block_start = "";
                block_end = "";
                if (Number((((((((node).child))[0])).value)) == ("TARGET_JS"))) {
                    (((node).child)).splice((0), (1));
                    (((node).child)).splice((0), (1));
                }
                else {
                    while (Number((((node).child).length) > (0))) {
                        (((node).child)).splice((0), (1));
                    }
                    ;
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("extern"))) {
                block_start = "";
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("asm"))) {
                var quotedline = null;
                quotedline = ((((((node).child))[0])).value);
                var line = null;
                line = "";
                for (var j = (1); Number((j) < ((((quotedline).length) - (1)))); j += (1)) {
                    (line) += String.fromCharCode((quotedline).charCodeAt(j));
                }
                ;
                block_start = line;
                block_end = "\n";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("struct"))) {
                block_start = "";
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("func"))) {
                block_start = "function ";
                if (Number((((((((node).child))[0])).type)) == (4))) {
                    var fname_node = null;
                    fname_node = ((((node).child))[0]);
                    ((block_start) += (((fname_node).value)));
                    (((node).child)).splice((0), (1));
                }
                ;
                ((block_start) += ("("));
                var param_count = 0;
                param_count = 0;
                var i = 0;
                i = 0;
                while (Number((i) < (((node).child).length))) {
                    var child_node = null;
                    child_node = ((((node).child))[i]);
                    if (Number((((child_node).value)) == ("param"))) {
                        if (Number((((child_node).child).length) == (2))) {
                            var param_node = null;
                            param_node = ((((child_node).child))[0]);
                            if (Number((param_count) > (0))) {
                                ((block_start) += (", "));
                            }
                            ;
                            ((block_start) += (((param_node).value)));
                            param_count = ((param_count) + (1));
                        }
                        ;
                        (((node).child)).splice((i), (1));
                        i = ((i) - (1));
                    }
                    ;
                    if (Number((((child_node).value)) == ("result"))) {
                        (((node).child)).splice((i), (1));
                        i = ((i) - (1));
                    }
                    ;
                    i = ((i) + (1));
                }
                ;
                ((block_start) += (") {"));
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("call"))) {
                var fname_node = null;
                fname_node = ((((node).child))[0]);
                block_start = ((fname_node).value);
                ((block_start) += ("("));
                block_end = ")";
                (((node).child)).splice((0), (1));
                block_seperator = ", ";
            }
            ;
            if (((Number((((node).value)) == ("let"))) || (Number((((node).value)) == ("local"))))) {
                block_start = "let ";
                block_end = "";
                (((node).child)).splice((1), (1));
                if (Number((((node).child).length) == (2))) {
                    (((node).child)).splice((1), 0, (node_new(4, "=")));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("alloc"))) {
                block_start = "";
                block_end = "";
                var child = null;
                child = ((((node).child))[0]);
                if (Number((((child).type)) == (1))) {
                    if (((Number((((((((node).child))[0])).value)) == ("vec"))) && (Number((((node).child).length) == (1))))) {
                        block_start = "new Array(";
                        ((block_start) += (node_to_js(depth, ((((((((node).child))[0])).child))[0]))));
                        ((block_start) += (").fill(0)"));
                    }
                    else {
                        if (((Number((((((((node).child))[0])).value)) == ("arr"))) || (Number((((((((node).child))[0])).value)) == ("vec"))))) {
                            block_start = "[";
                            for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                                ((block_start) += (node_to_js(depth, ((((node).child))[i]))));
                                if (Number((i) < (((((node).child).length) - (1))))) {
                                    ((block_start) += (","));
                                }
                                ;
                            }
                            ;
                            ((block_start) += ("]"));
                        }
                        ;
                    }
                    ;
                    if (((Number((((((((node).child))[0])).value)) == ("map"))) || (Number((((((((node).child))[0])).value)) == ("struct"))))) {
                        block_start = "{}";
                    }
                    ;
                }
                ;
                if (Number((((child).type)) == (4))) {
                    if (Number((((node).child).length) >= (2))) {
                        block_start = node_to_js(depth, ((((node).child))[1]));
                    }
                    else {
                        block_start = "\"\"";
                    }
                    ;
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("free"))) {
                block_start = "/*GC*/";
                block_end = "";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("#"))) {
                block_start = "";
                block_end = ".length";
            }
            ;
            if (Number((((node).value)) == ("insert"))) {
                block_start = node_to_js(depth, ((((node).child))[0]));
                ((block_start) += (".splice("));
                ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                ((block_start) += (",0,"));
                ((block_start) += (node_to_js(depth, ((((node).child))[2]))));
                block_end = ")";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("remove"))) {
                if (Number((((((((node).child))[1])).type)) != (5))) {
                    block_start = node_to_js(depth, ((((node).child))[0]));
                    ((block_start) += (".splice("));
                    ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                    ((block_start) += (","));
                    ((block_start) += (node_to_js(depth, ((((node).child))[2]))));
                    block_end = ")";
                }
                ;
                if (Number((((((((node).child))[1])).type)) == (5))) {
                    block_start = "delete ";
                    ((block_start) += (node_to_js(depth, ((((node).child))[0]))));
                    ((block_start) += ("["));
                    ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                    block_end = "]";
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("slice"))) {
                block_start = node_to_js(depth, ((((node).child))[0]));
                ((block_start) += (".slice("));
                ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                ((block_start) += (",("));
                ((block_start) += (node_to_js(depth, ((((node).child))[2]))));
                ((block_start) += (" + "));
                ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                block_end = "))";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("get"))) {
                block_start = node_to_js(depth, ((((node).child))[0]));
                block_end = "";
                for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                    var child = null;
                    child = ((((node).child))[i]);
                    if (((Number((((child).type)) == (4))) && (Number(((((child).value)).length) > (1))))) {
                        ((block_end) += ("."));
                        ((block_end) += (node_to_js(depth, ((((node).child))[i]))));
                        ((block_end) += (""));
                    }
                    else {
                        ((block_end) += ("["));
                        ((block_end) += (node_to_js(depth, ((((node).child))[i]))));
                        ((block_end) += ("]"));
                    }
                    ;
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("set"))) {
                block_start = node_to_js(depth, ((((node).child))[0]));
                block_end = "";
                var n = 0;
                n = ((((node).child).length) - (1));
                for (var i = (1); Number((i) < (n)); i += (1)) {
                    var child = null;
                    child = ((((node).child))[i]);
                    if (((Number((((child).type)) == (4))) && (Number(((((child).value)).length) > (1))))) {
                        ((block_end) += ("."));
                        ((block_end) += (node_to_js(depth, ((((node).child))[i]))));
                        ((block_end) += (""));
                    }
                    else {
                        ((block_end) += ("["));
                        ((block_end) += (node_to_js(depth, ((((node).child))[i]))));
                        ((block_end) += ("]"));
                    }
                    ;
                }
                ;
                ((block_end) += (" = "));
                ((block_end) += (node_to_js(depth, ((((node).child))[n]))));
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("cast"))) {
                if (Number((((((((node).child))[1])).value)) == ("str"))) {
                    block_start = "\"\"+";
                    block_end = node_to_js(depth, ((((node).child))[0]));
                }
                ;
                if (Number((((((((node).child))[1])).value)) == ("int"))) {
                    block_start = node_to_js(depth, ((((node).child))[0]));
                    block_end = "|0";
                }
                ;
                (((node).child)).splice((0), (1));
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("then"))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("else"))) {
                block_start = "else {";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("for"))) {
                if (Number((((node).child).length) == (5))) {
                    block_start = "for (let ";
                    ((block_start) += (node_to_js(depth, ((((node).child))[0]))));
                    ((block_start) += (" = "));
                    ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                    ((block_start) += ("; "));
                    ((block_start) += (node_to_js(depth, ((((node).child))[2]))));
                    ((block_start) += ("; "));
                    ((block_start) += (node_to_js(depth, ((((node).child))[0]))));
                    ((block_start) += (" += "));
                    ((block_start) += (node_to_js(depth, ((((node).child))[3]))));
                    ((block_start) += (") "));
                    (((node).child)).splice((0), (4));
                    block_end = "";
                }
                ;
                if (Number((((node).child).length) == (4))) {
                    block_start = "for (const [";
                    ((block_start) += (node_to_js(depth, ((((node).child))[0]))));
                    ((block_start) += (","));
                    ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                    ((block_start) += ("] of Object.entries("));
                    ((block_start) += (node_to_js(depth, ((((node).child))[2]))));
                    ((block_start) += ("))"));
                    (((node).child)).splice((0), (3));
                    block_end = "";
                }
                ;
            }
            ;
            if (((Number((((node).value)) == ("if"))) || (Number((((node).value)) == ("while"))))) {
                block_start = ((node).value);
                ((block_start) += (" "));
                var block_simple = 0;
                block_simple = Number((((((((node).child))[0])).type)) != (1));
                if (block_simple) {
                    ((block_start) += ("("));
                }
                ;
                ((block_start) += (node_to_js(depth, ((((node).child))[0]))));
                if (block_simple) {
                    ((block_start) += (")"));
                }
                ;
                ((block_start) += (" "));
                block_end = "";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("do"))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("break"))) {
                block_start = "break";
                block_end = "";
            }
            ;
            if (Number((((node).value)) == ("?"))) {
                block_start = node_to_js(depth, ((((node).child))[0]));
                ((block_start) += (" ? "));
                ((block_start) += (node_to_js(depth, ((((node).child))[1]))));
                ((block_start) += (" : "));
                ((block_start) += (node_to_js(depth, ((((node).child))[2]))));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("print"))) {
                block_start = "console.log(";
            }
            ;
            if (((((((((((((((((((((((((((((((((((((Number((((node).value)) == (">>"))) || (Number((((node).value)) == ("<<"))))) || (Number((((node).value)) == ("="))))) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))))) || (Number((((node).value)) == (">="))))) || (Number((((node).value)) == ("<="))))) || (Number((((node).value)) == ("<>"))))) || (Number((((node).value)) == ("+"))))) || (Number((((node).value)) == ("-"))))) || (Number((((node).value)) == ("*"))))) || (Number((((node).value)) == ("/"))))) || (Number((((node).value)) == ("^"))))) || (Number((((node).value)) == ("%"))))) || (Number((((node).value)) == ("&"))))) || (Number((((node).value)) == ("|"))))) || (Number((((node).value)) == ("~"))))) || (Number((((node).value)) == ("<"))))) || (Number((((node).value)) == (">"))))) {
                block_start = "(";
                block_end = ")";
                if (Number((((node).value)) == ("="))) {
                    ((node).value = "==");
                }
                ;
                if (Number((((node).value)) == ("<>"))) {
                    ((node).value = "!=");
                }
                ;
                if (((Number((((node).value)) == ("<<"))) && (Number((((((((node).child))[0])).type)) == (4))))) {
                    ((node).value = "+=");
                }
                ;
                (((node).child)).splice((1), 0, (node_new(4, ((node).value))));
            }
            ;
            if (Number((((node).value)) == ("return"))) {
                if (Number((((node).child).length) > (0))) {
                    block_start = "return(";
                    block_end = ")";
                }
                else {
                    block_start = "return";
                    block_end = "";
                }
                ;
            }
            ;
            ((s) += (block_start));
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                var node_child = null;
                node_child = ((((node).child))[i]);
                var indent_needed = 0;
                indent_needed = node_indent_needed(node, node_child);
                var indent_depth = 0;
                indent_depth = ((indent_needed) ? (depth) : (((depth) - (1))));
                var indent = null;
                indent = "  ";
                if (indent_needed) {
                    ((s) += ("\n"));
                    for (var i_4 = (0); Number((i_4) < (indent_depth)); i_4 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                else {
                    if (Number((i) > (0))) {
                        ((s) += (block_seperator));
                    }
                    ;
                }
                ;
                var child = null;
                child = node_to_js(indent_depth, node_child);
                ((s) += (child));
                if (((((((((Number((((node).value)) == (""))) || (Number((((node).value)) == ("func"))))) || (Number((((node).value)) == ("do"))))) || (Number((((node).value)) == ("then"))))) || (Number((((node).value)) == ("else"))))) {
                    ((s) += (";"));
                }
                ;
                if (((indent_needed) && (Number((i) == (((((node).child).length) - (1))))))) {
                    ((s) += ("\n"));
                    for (var i_5 = (0); Number((i_5) < (((indent_depth) - (1)))); i_5 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                ;
            }
            ;
            ((s) += (block_end));
        }
        ;
        if (Number((((node).type)) != (1))) {
            var value = null;
            value = ((node).value);
            if (Number((((node).type)) == (2))) {
                value = "";
                for (var i = (1); Number((i) < ((((node).value)).length)); i += (1)) {
                    (value) += String.fromCharCode((((node).value)).charCodeAt(i));
                }
                ;
            }
            ;
            if (Number((((node).type)) == (8))) {
                value = "// ";
                ((value) += (((node).value)));
            }
            ;
            ((s) += (value));
        }
        ;
        return s;
    }
    compiler.node_to_js = node_to_js;
    ;
    function node_to_cpp_preprocess(node) {
        var value = null;
        value = ((node).value);
        if (Number((((node).type)) == (2))) {
            value = "";
            for (var i = (1); Number((i) < ((((node).value)).length)); i += (1)) {
                (value) += String.fromCharCode((((node).value)).charCodeAt(i));
            }
            ;
        }
        ;
        return value;
    }
    compiler.node_to_cpp_preprocess = node_to_cpp_preprocess;
    ;
    function node_to_cpp_type(node) {
        var type = null;
        type = ((node).value);
        if (Number((((node).value)) == ("str"))) {
            type = "std::string";
        }
        ;
        if (Number((((node).value)) == ("vec"))) {
            type = "std::array<";
            ((type) += (node_to_cpp_type(((((node).child))[1]))));
            ((type) += (","));
            ((type) += (node_to_cpp_preprocess(((((node).child))[0]))));
            ((type) += (">"));
        }
        ;
        if (Number((((node).value)) == ("arr"))) {
            type = "std::vector<";
            ((type) += (node_to_cpp_type(((((node).child))[0]))));
            ((type) += (">"));
        }
        ;
        if (Number((((node).value)) == ("struct"))) {
            type = "struct ";
            ((type) += (((((((node).child))[0])).value)));
            ((type) += ("*"));
        }
        ;
        if (Number((type) == ("map"))) {
            type = "std::map<";
            ((type) += (node_to_cpp_type(((((node).child))[0]))));
            ((type) += (","));
            ((type) += (node_to_cpp_type(((((node).child))[1]))));
            ((type) += (">"));
        }
        ;
        if (Number((type) == ("func"))) {
            var return_type = null;
            return_type = "void";
            var params_ = null;
            params_ = "void";
            var i = 0;
            i = 0;
            while (Number((i) < (((node).child).length))) {
                var child_node = null;
                child_node = ((((node).child))[i]);
                if (Number((((child_node).value)) == ("param"))) {
                    if (Number((params_) == ("void"))) {
                        params_ = "";
                    }
                    else {
                        ((params_) += (", "));
                    }
                    ;
                    var type_1 = null;
                    type_1 = "";
                    type_1 = node_to_cpp_type(((((child_node).child))[1]));
                    if (((((Number((((((((child_node).child))[1])).value)) == ("vec"))) || (Number((((((((child_node).child))[1])).value)) == ("arr"))))) || (Number((((((((child_node).child))[1])).value)) == ("map"))))) {
                        ((type_1) += ("&"));
                    }
                    ;
                    ((params_) += (type_1));
                    ((params_) += (" "));
                    ((params_) += (((((((child_node).child))[0])).value)));
                    (((node).child)).splice((i), (1));
                    i = ((i) - (1));
                }
                ;
                if (Number((((child_node).value)) == ("result"))) {
                    return_type = node_to_cpp_type(((((child_node).child))[0]));
                    (((node).child)).splice((i), (1));
                    i = ((i) - (1));
                }
                ;
                i = ((i) + (1));
            }
            ;
            var function_ = null;
            function_ = "";
            if (Number((((node).child).length) > (0))) {
                if (Number((((((((node).child))[0])).type)) == (4))) {
                    var func_name = null;
                    func_name = ((((((node).child))[0])).value);
                    if (Number((func_name) == ("main"))) {
                        func_name = "main_args";
                        params_ = "std::vector<std::string>& args";
                        return_type = "int";
                    }
                    ;
                    ((function_) += (return_type));
                    ((function_) += (" "));
                    ((function_) += (func_name));
                    ((function_) += ("("));
                    ((function_) += (params_));
                    ((function_) += (")"));
                }
                else {
                    ((function_) += ("[=]("));
                    ((function_) += (params_));
                    ((function_) += (")"));
                }
                ;
            }
            else {
                ((function_) += ("std::function<"));
                ((function_) += (return_type));
                ((function_) += (" ("));
                ((function_) += (params_));
                ((function_) += (")>"));
            }
            ;
            type = function_;
        }
        ;
        return type;
    }
    compiler.node_to_cpp_type = node_to_cpp_type;
    ;
    function node_to_cpp(depth, node) {
        var s = null;
        s = "";
        depth = ((depth) + (1));
        node = node_copy(node);
        if (Number((((node).type)) == (0))) {
            ((s) += ("#include <iostream>\n"));
            ((s) += ("#include <sstream>\n"));
            ((s) += ("#include <string>\n"));
            ((s) += ("#include <vector>\n"));
            ((s) += ("#include <array>\n"));
            ((s) += ("#include <map>\n"));
            ((s) += ("#include <functional>\n"));
            ((s) += ("template<typename T> std::string tostring(const T& x) {\n"));
            ((s) += ("  std::stringstream ss;\n"));
            ((s) += ("  ss << x;\n"));
            ((s) += ("  return ss.str();\n"));
            ((s) += ("}\n"));
            ((s) += ("\n\n"));
            var has_main = 0;
            has_main = 0;
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                if (((Number((((((((node).child))[i])).value)) == ("func"))) && (Number((((((((((((node).child))[i])).child))[0])).value)) == ("main"))))) {
                    has_main = 1;
                }
                ;
                var child = null;
                child = node_to_cpp(0, ((((node).child))[i]));
                ((s) += (child));
                if (Number((((((((node).child))[i])).value)) == ("let"))) {
                    ((s) += (";"));
                }
                ;
                ((s) += ("\n"));
            }
            ;
            if (has_main) {
                ((s) += ("int main(int argc, char** argv) {\n"));
                ((s) += ("  std::vector<std::string> args(argv, argv + argc);\n"));
                ((s) += ("  return main_args(args);\n"));
                ((s) += ("};\n"));
            }
            ;
        }
        ;
        if (((((Number((((node).value)) == ("+"))) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))))) {
            node = node_expand(node);
        }
        ;
        if (Number((((node).type)) == (1))) {
            var block_start = null;
            block_start = "(";
            ((block_start) += (((node).value)));
            var block_end = null;
            block_end = ")";
            var block_seperator = null;
            block_seperator = " ";
            if (Number((((node).value)) == (""))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("@define"))) {
                block_start = "#define ";
                ((block_start) += (((((((node).child))[0])).value)));
                ((block_start) += (" "));
                ((block_start) += (((((((node).child))[1])).value)));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("@if"))) {
                block_start = "";
                block_end = "";
                if (Number((((((((node).child))[0])).value)) == ("TARGET_CPP"))) {
                    (((node).child)).splice((0), (1));
                    (((node).child)).splice((0), (1));
                }
                else {
                    while (Number((((node).child).length) > (0))) {
                        (((node).child)).splice((0), (1));
                    }
                    ;
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("extern"))) {
                block_start = "";
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("asm"))) {
                var quotedline = null;
                quotedline = ((((((node).child))[0])).value);
                var line = null;
                line = "";
                for (var j = (1); Number((j) < ((((quotedline).length) - (1)))); j += (1)) {
                    if (Number(((quotedline).charCodeAt(j)) != (92))) {
                        (line) += String.fromCharCode((quotedline).charCodeAt(j));
                    }
                    ;
                }
                ;
                block_start = line;
                block_end = "\n";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("struct"))) {
                block_start = "struct ";
                ((block_start) += (((((((node).child))[0])).value)));
                ((block_start) += (" {"));
                block_end = "};";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("func"))) {
                block_start = node_to_cpp_type(node);
                ((block_start) += (" {"));
                block_end = "}";
                if (Number((((((((node).child))[0])).type)) == (4))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("call"))) {
                var fname_node = null;
                fname_node = ((((node).child))[0]);
                block_start = ((fname_node).value);
                ((block_start) += ("("));
                block_end = ")";
                (((node).child)).splice((0), (1));
                block_seperator = ", ";
            }
            ;
            if (((Number((((node).value)) == ("let"))) || (Number((((node).value)) == ("local"))))) {
                var type = null;
                type = node_to_cpp_type(((((node).child))[1]));
                block_start = type;
                ((block_start) += (" "));
                block_end = "";
                (((node).child)).splice((1), (1));
                if (Number((((node).child).length) == (2))) {
                    (((node).child)).splice((1), 0, (node_new(4, "=")));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("alloc"))) {
                block_start = "";
                block_end = "";
                if (Number((((((((node).child))[0])).value)) == ("str"))) {
                    block_start = "\"\"";
                    if (Number((((node).child).length) > (1))) {
                        block_start = ((((((node).child))[1])).value);
                    }
                    ;
                }
                ;
                if (Number((((((((node).child))[0])).type)) == (1))) {
                    if (((Number((((((((node).child))[0])).value)) == ("vec"))) || (Number((((((((node).child))[0])).value)) == ("arr"))))) {
                        if (Number((((node).child).length) == (1))) {
                            var init = null;
                            init = node_to_cpp_type(((((node).child))[0]));
                            ((init) += ("()"));
                            block_start = init;
                        }
                        else {
                            block_start = "{";
                            for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                                ((block_start) += (node_to_cpp(depth, ((((node).child))[i]))));
                                if (Number((i) < (((((node).child).length) - (1))))) {
                                    ((block_start) += (","));
                                }
                                ;
                            }
                            ;
                            ((block_start) += ("}"));
                        }
                        ;
                    }
                    ;
                    if (Number((((((((node).child))[0])).value)) == ("struct"))) {
                        block_start = "new ";
                        ((block_start) += (((((((((((node).child))[0])).child))[0])).value)));
                        ((block_start) += ("()"));
                    }
                    ;
                    if (Number((((((((node).child))[0])).value)) == ("map"))) {
                        block_start = "{}";
                    }
                    ;
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("free"))) {
                block_start = "/*GC*/";
                block_end = "";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("#"))) {
                block_start = "";
                block_end = ".size()";
            }
            ;
            if (Number((((node).value)) == ("insert"))) {
                var array = null;
                array = node_to_cpp(depth, ((((node).child))[0]));
                var position = null;
                position = node_to_cpp(depth, ((((node).child))[1]));
                var value = null;
                value = node_to_cpp(depth, ((((node).child))[2]));
                block_start = array;
                ((block_start) += (".insert("));
                ((block_start) += (array));
                ((block_start) += (".begin()+"));
                ((block_start) += (position));
                ((block_start) += (","));
                ((block_start) += (value));
                block_end = ")";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("remove"))) {
                if (Number((((node).child).length) == (2))) {
                    block_start = node_to_cpp(depth, ((((node).child))[0]));
                    ((block_start) += (".erase("));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[1]))));
                    block_end = ")";
                }
                else {
                    var array = null;
                    array = node_to_cpp(depth, ((((node).child))[0]));
                    var first = null;
                    first = node_to_cpp(depth, ((((node).child))[1]));
                    var last = null;
                    last = node_to_cpp(depth, ((((node).child))[2]));
                    block_start = array;
                    ((block_start) += (".erase("));
                    ((block_start) += (array));
                    ((block_start) += (".begin()+"));
                    ((block_start) += (first));
                    ((block_start) += (","));
                    ((block_start) += (array));
                    ((block_start) += (".begin()+"));
                    ((block_start) += (first));
                    ((block_start) += ("+"));
                    ((block_start) += (last));
                    block_end = ")";
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("slice"))) {
                block_start = node_to_cpp(depth, ((((node).child))[0]));
                ((block_start) += (".substr("));
                ((block_start) += (node_to_cpp(depth, ((((node).child))[1]))));
                ((block_start) += (","));
                ((block_start) += (node_to_cpp(depth, ((((node).child))[2]))));
                block_end = ")";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("get"))) {
                block_start = node_to_cpp(depth, ((((node).child))[0]));
                block_end = "";
                for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                    var child = null;
                    child = ((((node).child))[i]);
                    if (((Number((((child).type)) == (4))) && (Number(((((child).value)).length) > (1))))) {
                        ((block_end) += ("->"));
                        ((block_end) += (node_to_cpp(depth, ((((node).child))[i]))));
                        ((block_end) += (""));
                    }
                    else {
                        ((block_end) += ("["));
                        ((block_end) += (node_to_cpp(depth, ((((node).child))[i]))));
                        ((block_end) += ("]"));
                    }
                    ;
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("set"))) {
                block_start = node_to_cpp(depth, ((((node).child))[0]));
                block_end = "";
                var n = 0;
                n = ((((node).child).length) - (1));
                for (var i = (1); Number((i) < (n)); i += (1)) {
                    var child = null;
                    child = ((((node).child))[i]);
                    if (((Number((((child).type)) == (4))) && (Number(((((child).value)).length) > (1))))) {
                        ((block_end) += ("->"));
                        ((block_end) += (node_to_cpp(depth, ((((node).child))[i]))));
                        ((block_end) += (""));
                    }
                    else {
                        ((block_end) += ("["));
                        ((block_end) += (node_to_cpp(depth, ((((node).child))[i]))));
                        ((block_end) += ("]"));
                    }
                    ;
                }
                ;
                ((block_end) += (" = "));
                ((block_end) += (node_to_cpp(depth, ((((node).child))[n]))));
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("cast"))) {
                if (Number((((((((node).child))[1])).value)) == ("str"))) {
                    block_start = "tostring(";
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[0]))));
                    block_end = ")";
                }
                ;
                if (Number((((((((node).child))[1])).value)) == ("int"))) {
                    block_start = "(int)";
                    block_end = node_to_cpp(depth, ((((node).child))[0]));
                }
                ;
                (((node).child)).splice((0), (1));
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("then"))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("else"))) {
                block_start = "else {";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("for"))) {
                if (Number((((node).child).length) == (5))) {
                    block_start = "for (int ";
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[0]))));
                    ((block_start) += (" = "));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[1]))));
                    ((block_start) += ("; "));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[2]))));
                    ((block_start) += ("; "));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[0]))));
                    ((block_start) += (" += "));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[3]))));
                    ((block_start) += (") "));
                    (((node).child)).splice((0), (4));
                    block_end = "";
                }
                ;
                if (Number((((node).child).length) == (4))) {
                    block_start = "for (const auto &[";
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[0]))));
                    ((block_start) += (","));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[1]))));
                    ((block_start) += ("] : "));
                    ((block_start) += (node_to_cpp(depth, ((((node).child))[2]))));
                    ((block_start) += (") "));
                    (((node).child)).splice((0), (3));
                    block_end = "";
                }
                ;
            }
            ;
            if (((Number((((node).value)) == ("if"))) || (Number((((node).value)) == ("while"))))) {
                block_start = ((node).value);
                ((block_start) += (" "));
                var block_simple = 0;
                block_simple = Number((((((((node).child))[0])).type)) != (1));
                if (block_simple) {
                    ((block_start) += ("("));
                }
                ;
                ((block_start) += (node_to_cpp(depth, ((((node).child))[0]))));
                if (block_simple) {
                    ((block_start) += (")"));
                }
                ;
                ((block_start) += (" "));
                block_end = "";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("do"))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("break"))) {
                block_start = "break";
                block_end = "";
            }
            ;
            if (Number((((node).value)) == ("?"))) {
                block_start = node_to_cpp(depth, ((((node).child))[0]));
                ((block_start) += (" ? "));
                ((block_start) += (node_to_cpp(depth, ((((node).child))[1]))));
                ((block_start) += (" : "));
                ((block_start) += (node_to_cpp(depth, ((((node).child))[2]))));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("print"))) {
                block_start = "std::cout << ";
                block_end = " << std::endl";
            }
            ;
            if (((((((((((((((((((((((((((((((((((((Number((((node).value)) == (">>"))) || (Number((((node).value)) == ("<<"))))) || (Number((((node).value)) == ("="))))) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))))) || (Number((((node).value)) == (">="))))) || (Number((((node).value)) == ("<="))))) || (Number((((node).value)) == ("<>"))))) || (Number((((node).value)) == ("+"))))) || (Number((((node).value)) == ("-"))))) || (Number((((node).value)) == ("*"))))) || (Number((((node).value)) == ("/"))))) || (Number((((node).value)) == ("^"))))) || (Number((((node).value)) == ("%"))))) || (Number((((node).value)) == ("&"))))) || (Number((((node).value)) == ("|"))))) || (Number((((node).value)) == ("~"))))) || (Number((((node).value)) == ("<"))))) || (Number((((node).value)) == (">"))))) {
                block_start = "(";
                block_end = ")";
                if (Number((((node).value)) == ("="))) {
                    ((node).value = "==");
                }
                ;
                if (Number((((node).value)) == ("<>"))) {
                    ((node).value = "!=");
                }
                ;
                if (((Number((((node).value)) == ("<<"))) && (Number((((((((node).child))[0])).type)) == (4))))) {
                    ((node).value = "+=");
                }
                ;
                (((node).child)).splice((1), 0, (node_new(4, ((node).value))));
            }
            ;
            if (Number((((node).value)) == ("return"))) {
                block_start = "return ";
                block_end = "";
            }
            ;
            ((s) += (block_start));
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                var node_child = null;
                node_child = ((((node).child))[i]);
                var indent_needed = 0;
                indent_needed = node_indent_needed(node, node_child);
                var indent_depth = 0;
                indent_depth = ((indent_needed) ? (depth) : (((depth) - (1))));
                var indent = null;
                indent = "  ";
                if (indent_needed) {
                    ((s) += ("\n"));
                    for (var i_6 = (0); Number((i_6) < (indent_depth)); i_6 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                else {
                    if (Number((i) > (0))) {
                        ((s) += (block_seperator));
                    }
                    ;
                }
                ;
                var child = null;
                child = node_to_cpp(indent_depth, node_child);
                ((s) += (child));
                if (((((((((((Number((((node).value)) == (""))) || (Number((((node).value)) == ("func"))))) || (Number((((node).value)) == ("struct"))))) || (Number((((node).value)) == ("do"))))) || (Number((((node).value)) == ("then"))))) || (Number((((node).value)) == ("else"))))) {
                    ((s) += (";"));
                }
                ;
                if (((indent_needed) && (Number((i) == (((((node).child).length) - (1))))))) {
                    ((s) += ("\n"));
                    for (var i_7 = (0); Number((i_7) < (((indent_depth) - (1)))); i_7 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                ;
            }
            ;
            ((s) += (block_end));
        }
        ;
        if (Number((((node).type)) != (1))) {
            var value = null;
            value = node_to_cpp_preprocess(node);
            if (Number((((node).type)) == (8))) {
                value = "// ";
                ((value) += (((node).value)));
            }
            ;
            ((s) += (value));
        }
        ;
        return s;
    }
    compiler.node_to_cpp = node_to_cpp;
    ;
    function node_to_c_preprocess(node) {
        var value = null;
        value = ((node).value);
        if (Number((((node).type)) == (2))) {
            value = "";
            for (var i = (1); Number((i) < ((((node).value)).length)); i += (1)) {
                (value) += String.fromCharCode((((node).value)).charCodeAt(i));
            }
            ;
        }
        ;
        return value;
    }
    compiler.node_to_c_preprocess = node_to_c_preprocess;
    ;
    function node_to_c_type(name, node, element_only) {
        var type = null;
        type = ((node).value);
        var suffix = null;
        suffix = "";
        if (Number((((node).value)) == ("str"))) {
            type = "char*";
        }
        ;
        if (Number((((node).value)) == ("vec"))) {
            type = node_to_c_type("", ((((node).child))[1]), 0);
            if (Number((name) != (""))) {
                ((suffix) += ("["));
                ((suffix) += (node_to_c_preprocess(((((node).child))[0]))));
                ((suffix) += ("]"));
            }
            else {
                ((type) += ("*"));
            }
            ;
        }
        ;
        if (Number((((node).value)) == ("arr"))) {
            type = node_to_c_type("", ((((node).child))[0]), 0);
            if (Number(!(element_only))) {
                ((type) += ("*"));
            }
            ;
        }
        ;
        if (Number((((node).value)) == ("struct"))) {
            type = "struct ";
            ((type) += (((((((node).child))[0])).value)));
            ((type) += ("*"));
        }
        ;
        if (Number((type) == ("map"))) {
            type = "std::map<";
            ((type) += (node_to_c_type("", ((((node).child))[0]), 0)));
            ((type) += (","));
            ((type) += (node_to_c_type("", ((((node).child))[1]), 0)));
            ((type) += (">"));
        }
        ;
        if (Number((type) == ("func"))) {
            var return_type = null;
            return_type = "void";
            var params_ = null;
            params_ = "void";
            var i = 0;
            i = 0;
            while (Number((i) < (((node).child).length))) {
                var child_node = null;
                child_node = ((((node).child))[i]);
                if (Number((((child_node).value)) == ("param"))) {
                    if (Number((params_) == ("void"))) {
                        params_ = "";
                    }
                    else {
                        ((params_) += (", "));
                    }
                    ;
                    var c_var = null;
                    c_var = "";
                    c_var = node_to_c_type(((((((child_node).child))[0])).value), ((((child_node).child))[1]), 0);
                    ((params_) += (c_var));
                    (((node).child)).splice((i), (1));
                    i = ((i) - (1));
                }
                ;
                if (Number((((child_node).value)) == ("result"))) {
                    return_type = node_to_c_type("", ((((child_node).child))[0]), 0);
                    (((node).child)).splice((i), (1));
                    i = ((i) - (1));
                }
                ;
                i = ((i) + (1));
            }
            ;
            var c_function = null;
            c_function = "";
            if (Number((((node).child).length) > (0))) {
                if (Number((((((((node).child))[0])).type)) == (4))) {
                    var func_name = null;
                    func_name = ((((((node).child))[0])).value);
                    if (Number((func_name) == ("main"))) {
                        func_name = "main_args";
                        params_ = "char **args";
                        return_type = "int";
                    }
                    ;
                    ((c_function) += (return_type));
                    ((c_function) += (" "));
                    ((c_function) += (func_name));
                    ((c_function) += ("("));
                    ((c_function) += (params_));
                    ((c_function) += (")"));
                }
                else {
                    ((c_function) += ("[=]("));
                    ((c_function) += (params_));
                    ((c_function) += (")"));
                }
                ;
            }
            else {
                ((c_function) += (return_type));
                ((c_function) += (" (*"));
                ((c_function) += (name));
                ((c_function) += (")("));
                ((c_function) += (params_));
                ((c_function) += (")"));
                name = "";
            }
            ;
            type = c_function;
        }
        ;
        var out_ = null;
        out_ = type;
        if (Number((name) != (""))) {
            ((out_) += (" "));
            ((out_) += (name));
            ((out_) += (suffix));
        }
        ;
        return out_;
    }
    compiler.node_to_c_type = node_to_c_type;
    ;
    function node_to_c_tostring(symbol, node, castint) {
        var node_type = 0;
        node_type = node_symbol_node_type(symbol, node);
        if (Number((node_type) == (1))) {
            return "tostring_char_p";
        }
        ;
        if (Number((node_type) == (2))) {
            return ((castint) ? ("tostring_int") : ("tostring_char"));
        }
        ;
        if (Number((node_type) == (3))) {
            return "tostring_float";
        }
        ;
        return "tostring_unknown";
    }
    compiler.node_to_c_tostring = node_to_c_tostring;
    ;
    function node_to_c_length(symbol, node) {
        var node_type = 0;
        node_type = node_symbol_node_type(symbol, node);
        if (Number((node_type) == (1))) {
            return "strlen";
        }
        ;
        return "ARRAY_LENGTH";
    }
    compiler.node_to_c_length = node_to_c_length;
    ;
    function node_to_c_has_keyword(node, keyword) {
        if (Number((((node).value)) == (keyword))) {
            return 1;
        }
        ;
        for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
            if (Number((node_to_c_has_keyword(((((node).child))[i]), keyword)) != (0))) {
                return 1;
            }
            ;
        }
        ;
        return 0;
    }
    compiler.node_to_c_has_keyword = node_to_c_has_keyword;
    ;
    function node_to_c(depth, parent_symbol, node) {
        var s = null;
        s = "";
        var symbol = null;
        symbol = node_symbol_scope_node(parent_symbol, node);
        depth = ((depth) + (1));
        node = node_copy(node);
        if (Number((((node).type)) == (0))) {
            var has_main = 0;
            has_main = 0;
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                if (((Number((((((((node).child))[i])).value)) == ("func"))) && (Number((((((((((((node).child))[i])).child))[0])).value)) == ("main"))))) {
                    has_main = 1;
                }
                ;
            }
            ;
            if (Number((node_to_c_has_keyword(node, "print")) != (0))) {
                ((s) += ("#include <stdio.h>\n"));
                ((s) += ("#include <stdlib.h>\n"));
                ((s) += ("#include <string.h>\n"));
                ((s) += ("\n"));
                ((s) += ("char *tostring_char_p(char *value) { return value; }\n"));
                ((s) += ("char *tostring_char(int value) { static char buf[256]; sprintf(buf, \"%c\", value); return buf; }\n"));
                ((s) += ("char *tostring_int(int value) { static char buf[256]; sprintf(buf, \"%d\", value); return buf; }\n"));
                ((s) += ("char *tostring_float(float value) { static char buf[256]; sprintf(buf, \"%g\", value); return buf; }\n"));
                ((s) += ("char *tostring_double(double value) { static char buf[256]; sprintf(buf, \"%g\", value); return buf; }\n"));
                ((s) += ("void *STRING_ALLOC(char *str) {"));
                ((s) += ("  char *data = malloc(strlen(str) + 1);"));
                ((s) += ("  memcpy(data, str, strlen(str) + 1);"));
                ((s) += ("  return data;"));
                ((s) += ("}\n"));
                ((s) += ("char *STRING_APPEND(char *str, char *append) {"));
                ((s) += ("  char *data = realloc(str, strlen(str) + strlen(append) + 1);"));
                ((s) += ("  strcat(data, append);"));
                ((s) += ("  return data;"));
                ((s) += ("}\n"));
            }
            ;
            if (has_main) {
                ((s) += ("struct ARRAY_HEADER {"));
                ((s) += ("    int element_size;"));
                ((s) += ("    int element_count;"));
                ((s) += ("};\n"));
                ((s) += ("void *ARRAY_ALLOC(int element_size, int element_count) {"));
                ((s) += ("  struct ARRAY_HEADER *header = malloc(sizeof(struct ARRAY_HEADER) + (element_size * element_count));"));
                ((s) += ("  header->element_size = element_size;"));
                ((s) += ("  header->element_count = element_count;"));
                ((s) += ("  void *data = ((char *)header) + sizeof(struct ARRAY_HEADER);"));
                ((s) += ("  return data;"));
                ((s) += ("}\n"));
                ((s) += ("void *ARRAY_INSERT(void *data, int index) {"));
                ((s) += ("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
                ((s) += ("  header = realloc(header, sizeof(struct ARRAY_HEADER) + (header->element_size * (header->element_count + 1)));"));
                ((s) += ("  data = ((char *)header) + sizeof(struct ARRAY_HEADER);"));
                ((s) += ("  memmove((char *)data + ((index + 1) * header->element_size), (char *)data + (index * header->element_size), (header->element_count - index) * header->element_size);"));
                ((s) += ("  header->element_count = header->element_count + 1;"));
                ((s) += ("  return data;"));
                ((s) += ("}\n"));
                ((s) += ("void *ARRAY_REMOVE(void *data, int index, int count) {"));
                ((s) += ("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
                ((s) += ("  memmove((char *)data + (index * header->element_size), (char *)data + ((index + count) * header->element_size), (header->element_count - (index + count)) * header->element_size);"));
                ((s) += ("  header->element_count = header->element_count - count;"));
                ((s) += ("  header = realloc(header, sizeof(struct ARRAY_HEADER) + (header->element_size * header->element_count));"));
                ((s) += ("  data = (void *)((char *)header + sizeof(struct ARRAY_HEADER));"));
                ((s) += ("  return data;"));
                ((s) += ("}\n"));
                ((s) += ("void ARRAY_FREE(void *data) {"));
                ((s) += ("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
                ((s) += ("  free(header);"));
                ((s) += ("}\n"));
                ((s) += ("int ARRAY_LENGTH(void *data) {"));
                ((s) += ("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
                ((s) += ("  return header->element_count;"));
                ((s) += ("}\n"));
            }
            ;
            ((s) += ("\n\n"));
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                var child = null;
                child = node_to_c(0, symbol, ((((node).child))[i]));
                ((s) += (child));
                if (Number((((((((node).child))[i])).value)) == ("let"))) {
                    ((s) += (";"));
                }
                ;
                ((s) += ("\n"));
            }
            ;
            if (has_main) {
                ((s) += ("int main(int argc, char** argv) {\n"));
                ((s) += ("  char **args = ARRAY_ALLOC(sizeof(char *),argc);\n"));
                ((s) += ("  for (int i = 0; i < argc; i++) { args[i] = argv[i]; }\n"));
                ((s) += ("  return main_args(args);\n"));
                ((s) += ("};\n"));
            }
            ;
        }
        ;
        if (((((Number((((node).value)) == ("+"))) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))))) {
            node = node_expand(node);
        }
        ;
        if (Number((((node).type)) == (1))) {
            var block_start = null;
            block_start = "(";
            ((block_start) += (((node).value)));
            var block_end = null;
            block_end = ")";
            var block_seperator = null;
            block_seperator = " ";
            if (Number((((node).value)) == (""))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("@define"))) {
                block_start = "#define ";
                ((block_start) += (((((((node).child))[0])).value)));
                ((block_start) += (" "));
                ((block_start) += (((((((node).child))[1])).value)));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("@if"))) {
                block_start = "";
                block_end = "";
                if (Number((((((((node).child))[0])).value)) == ("TARGET_C"))) {
                    (((node).child)).splice((0), (1));
                    (((node).child)).splice((0), (1));
                }
                else {
                    while (Number((((node).child).length) > (0))) {
                        (((node).child)).splice((0), (1));
                    }
                    ;
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("extern"))) {
                block_start = "";
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("asm"))) {
                var quotedline = null;
                quotedline = ((((((node).child))[0])).value);
                var line = null;
                line = "";
                for (var j = (1); Number((j) < ((((quotedline).length) - (1)))); j += (1)) {
                    if (Number(((quotedline).charCodeAt(j)) != (92))) {
                        (line) += String.fromCharCode((quotedline).charCodeAt(j));
                    }
                    ;
                }
                ;
                block_start = line;
                block_end = "\n";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("struct"))) {
                block_start = "struct ";
                ((block_start) += (((((((node).child))[0])).value)));
                ((block_start) += (" {"));
                block_end = "};";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("func"))) {
                block_start = node_to_c_type("", node, 0);
                ((block_start) += (" {"));
                block_end = "}";
                if (Number((((((((node).child))[0])).type)) == (4))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("call"))) {
                var fname_node = null;
                fname_node = ((((node).child))[0]);
                block_start = ((fname_node).value);
                ((block_start) += ("("));
                block_end = ")";
                (((node).child)).splice((0), (1));
                block_seperator = ", ";
            }
            ;
            if (((Number((((node).value)) == ("let"))) || (Number((((node).value)) == ("local"))))) {
                var name_1 = null;
                name_1 = ((((((node).child))[0])).value);
                var type = null;
                type = node_to_c_type(name_1, ((((node).child))[1]), 0);
                block_start = type;
                ((block_start) += (" "));
                block_end = "";
                (((node).child)).splice((0), (1));
                (((node).child)).splice((0), (1));
                if (Number((((node).child).length) == (1))) {
                    (((node).child)).splice((0), 0, (node_new(4, "=")));
                    if (((Number((((((((node).child))[1])).value)) == ("alloc"))) && (Number((((((((((((node).child))[1])).child))[0])).value)) == ("arr"))))) {
                        for (var i = (1); Number((i) < (((((((node).child))[1])).child).length)); i += (1)) {
                            ((block_end) += (";"));
                            ((block_end) += (name_1));
                            ((block_end) += ("["));
                            ((block_end) += ((((i) - (1))).toString()));
                            ((block_end) += ("]="));
                            ((block_end) += (((((((((((node).child))[1])).child))[i])).value)));
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("alloc"))) {
                block_start = "";
                block_end = "";
                if (Number((((((((node).child))[0])).value)) == ("str"))) {
                    var alloc_string = null;
                    alloc_string = "\"\"";
                    if (Number((((node).child).length) > (1))) {
                        alloc_string = ((((((node).child))[1])).value);
                    }
                    ;
                    block_start = "STRING_ALLOC(";
                    ((block_start) += (alloc_string));
                    ((block_start) += (")"));
                }
                ;
                if (Number((((((((node).child))[0])).type)) == (1))) {
                    if (Number((((((((node).child))[0])).value)) == ("arr"))) {
                        block_start = "ARRAY_ALLOC(sizeof(";
                        ((block_start) += (node_to_c_type("", ((((node).child))[0]), 1)));
                        ((block_start) += ("),"));
                        ((block_start) += ((((((node).child).length) - (1))).toString()));
                        ((block_start) += (")"));
                    }
                    ;
                    if (Number((((((((node).child))[0])).value)) == ("vec"))) {
                        block_start = "{";
                        for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                            ((block_start) += (node_to_c(depth, symbol, ((((node).child))[i]))));
                            if (Number((i) < (((((node).child).length) - (1))))) {
                                ((block_start) += (","));
                            }
                            ;
                        }
                        ;
                        ((block_start) += ("}"));
                    }
                    ;
                    if (Number((((((((node).child))[0])).value)) == ("struct"))) {
                        block_start = "ARRAY_ALLOC(sizeof(struct ";
                        ((block_start) += (((((((((((node).child))[0])).child))[0])).value)));
                        ((block_start) += ("),1)"));
                    }
                    ;
                    if (Number((((((((node).child))[0])).value)) == ("map"))) {
                        block_start = "{}";
                    }
                    ;
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("free"))) {
                var array = null;
                array = node_to_c(depth, symbol, ((((node).child))[0]));
                block_start = "ARRAY_FREE(";
                ((block_start) += (array));
                block_end = ")";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("#"))) {
                block_start = node_to_c_length(symbol, ((((node).child))[0]));
                ((block_start) += ("("));
                block_end = ")";
            }
            ;
            if (Number((((node).value)) == ("insert"))) {
                var init = null;
                init = "";
                if (((Number((((((((node).child))[2])).value)) == ("alloc"))) && (Number((((((((((((node).child))[2])).child))[0])).value)) == ("arr"))))) {
                    for (var i = (1); Number((i) < (((((((node).child))[2])).child).length)); i += (1)) {
                        ((init) += (";"));
                        ((init) += (((((((node).child))[0])).value)));
                        ((init) += ("["));
                        ((init) += (((((((node).child))[1])).value)));
                        ((init) += ("]"));
                        ((init) += ("["));
                        ((init) += ((((i) - (1))).toString()));
                        ((init) += ("]="));
                        ((init) += (((((((((((node).child))[2])).child))[i])).value)));
                    }
                    ;
                }
                ;
                var array = null;
                array = node_to_c(depth, symbol, ((((node).child))[0]));
                var position = null;
                position = node_to_c(depth, symbol, ((((node).child))[1]));
                var value = null;
                value = node_to_c(depth, symbol, ((((node).child))[2]));
                block_start = "{int __index__=";
                ((block_start) += (position));
                ((block_start) += (";"));
                ((block_start) += (array));
                ((block_start) += ("=ARRAY_INSERT("));
                ((block_start) += (array));
                ((block_start) += (",__index__);"));
                ((block_start) += (array));
                ((block_start) += ("[__index__]="));
                ((block_start) += (value));
                ((block_start) += (init));
                ((block_start) += (";}"));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("remove"))) {
                var array = null;
                array = node_to_c(depth, symbol, ((((node).child))[0]));
                var first = null;
                first = node_to_c(depth, symbol, ((((node).child))[1]));
                var last = null;
                last = node_to_c(depth, symbol, ((((node).child))[2]));
                block_start = array;
                ((block_start) += ("=ARRAY_REMOVE("));
                ((block_start) += (array));
                ((block_start) += (","));
                ((block_start) += (first));
                ((block_start) += (","));
                ((block_start) += (last));
                block_end = ")";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("slice"))) {
                block_start = node_to_c(depth, symbol, ((((node).child))[0]));
                ((block_start) += (".substr("));
                ((block_start) += (node_to_c(depth, symbol, ((((node).child))[1]))));
                ((block_start) += (","));
                ((block_start) += (node_to_c(depth, symbol, ((((node).child))[2]))));
                block_end = ")";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("get"))) {
                block_start = node_to_c(depth, symbol, ((((node).child))[0]));
                block_end = "";
                for (var i = (1); Number((i) < (((node).child).length)); i += (1)) {
                    var child = null;
                    child = ((((node).child))[i]);
                    if (((Number((((child).type)) == (4))) && (Number(((((child).value)).length) > (1))))) {
                        ((block_end) += ("->"));
                        ((block_end) += (node_to_c(depth, symbol, ((((node).child))[i]))));
                        ((block_end) += (""));
                    }
                    else {
                        ((block_end) += ("["));
                        ((block_end) += (node_to_c(depth, symbol, ((((node).child))[i]))));
                        ((block_end) += ("]"));
                    }
                    ;
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("set"))) {
                block_start = node_to_c(depth, symbol, ((((node).child))[0]));
                block_end = "";
                var n = 0;
                n = ((((node).child).length) - (1));
                for (var i = (1); Number((i) < (n)); i += (1)) {
                    var child = null;
                    child = ((((node).child))[i]);
                    if (((Number((((child).type)) == (4))) && (Number(((((child).value)).length) > (1))))) {
                        ((block_end) += ("->"));
                        ((block_end) += (node_to_c(depth, symbol, ((((node).child))[i]))));
                        ((block_end) += (""));
                    }
                    else {
                        ((block_end) += ("["));
                        ((block_end) += (node_to_c(depth, symbol, ((((node).child))[i]))));
                        ((block_end) += ("]"));
                    }
                    ;
                }
                ;
                ((block_end) += (" = "));
                var node_type = 0;
                node_type = node_symbol_node_type(symbol, ((((node).child))[n]));
                if (Number((node_type) == (1))) {
                    ((block_end) += ("STRING_ALLOC("));
                }
                ;
                ((block_end) += (node_to_c(depth, symbol, ((((node).child))[n]))));
                if (Number((node_type) == (1))) {
                    ((block_end) += (")"));
                }
                ;
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("cast"))) {
                if (Number((((((((node).child))[1])).value)) == ("str"))) {
                    block_start = "tostring_int(";
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[0]))));
                    block_end = ")";
                }
                ;
                if (Number((((((((node).child))[1])).value)) == ("int"))) {
                    block_start = "(int)";
                    block_end = node_to_c(depth, symbol, ((((node).child))[0]));
                }
                ;
                (((node).child)).splice((0), (1));
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("then"))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("else"))) {
                block_start = "else {";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("for"))) {
                if (Number((((node).child).length) == (5))) {
                    block_start = "for (int ";
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[0]))));
                    ((block_start) += (" = "));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[1]))));
                    ((block_start) += ("; "));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[2]))));
                    ((block_start) += ("; "));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[0]))));
                    ((block_start) += (" += "));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[3]))));
                    ((block_start) += (") "));
                    (((node).child)).splice((0), (4));
                    block_end = "";
                }
                ;
                if (Number((((node).child).length) == (4))) {
                    block_start = "for (const auto &[";
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[0]))));
                    ((block_start) += (","));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[1]))));
                    ((block_start) += ("] : "));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[2]))));
                    ((block_start) += (") "));
                    (((node).child)).splice((0), (3));
                    block_end = "";
                }
                ;
            }
            ;
            if (((Number((((node).value)) == ("if"))) || (Number((((node).value)) == ("while"))))) {
                block_start = ((node).value);
                ((block_start) += (" "));
                var block_simple = 0;
                block_simple = Number((((((((node).child))[0])).type)) != (1));
                if (block_simple) {
                    ((block_start) += ("("));
                }
                ;
                ((block_start) += (node_to_c(depth, symbol, ((((node).child))[0]))));
                if (block_simple) {
                    ((block_start) += (")"));
                }
                ;
                ((block_start) += (" "));
                block_end = "";
                (((node).child)).splice((0), (1));
            }
            ;
            if (Number((((node).value)) == ("do"))) {
                block_start = "{";
                block_end = "}";
            }
            ;
            if (Number((((node).value)) == ("break"))) {
                block_start = "break";
                block_end = "";
            }
            ;
            if (Number((((node).value)) == ("?"))) {
                block_start = node_to_c(depth, symbol, ((((node).child))[0]));
                ((block_start) += (" ? "));
                ((block_start) += (node_to_c(depth, symbol, ((((node).child))[1]))));
                ((block_start) += (" : "));
                ((block_start) += (node_to_c(depth, symbol, ((((node).child))[2]))));
                block_end = "";
                while (Number((((node).child).length) > (0))) {
                    (((node).child)).splice((0), (1));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("print"))) {
                block_start = "puts(";
                ((block_start) += (node_to_c_tostring(symbol, ((((node).child))[0]), 1)));
                ((block_start) += ("("));
                block_end = "))";
            }
            ;
            if (((((((((((((((((((((((((((((((((((((Number((((node).value)) == (">>"))) || (Number((((node).value)) == ("<<"))))) || (Number((((node).value)) == ("="))))) || (Number((((node).value)) == ("&&"))))) || (Number((((node).value)) == ("||"))))) || (Number((((node).value)) == (">="))))) || (Number((((node).value)) == ("<="))))) || (Number((((node).value)) == ("<>"))))) || (Number((((node).value)) == ("+"))))) || (Number((((node).value)) == ("-"))))) || (Number((((node).value)) == ("*"))))) || (Number((((node).value)) == ("/"))))) || (Number((((node).value)) == ("^"))))) || (Number((((node).value)) == ("%"))))) || (Number((((node).value)) == ("&"))))) || (Number((((node).value)) == ("|"))))) || (Number((((node).value)) == ("~"))))) || (Number((((node).value)) == ("<"))))) || (Number((((node).value)) == (">"))))) {
                block_start = "(";
                block_end = ")";
                if (Number((((node).value)) == ("="))) {
                    if (((Number((((((((node).child))[0])).type)) == (5))) || (Number((((((((node).child))[1])).type)) == (5))))) {
                        block_start = "(strcmp(";
                        block_end = ") == 0 ? 1 : 0)";
                        ((node).value = ",");
                    }
                    else {
                        ((node).value = "==");
                    }
                    ;
                }
                ;
                if (Number((((node).value)) == ("<>"))) {
                    ((node).value = "!=");
                }
                ;
                if (((Number((((node).value)) == ("<<"))) && (Number((((((((node).child))[0])).type)) == (4))))) {
                    block_start = ((((((node).child))[0])).value);
                    ((block_start) += ("="));
                    ((block_start) += ("STRING_APPEND("));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[0]))));
                    ((block_start) += (","));
                    ((block_start) += (node_to_c_tostring(symbol, ((((node).child))[1]), 0)));
                    ((block_start) += ("("));
                    ((block_start) += (node_to_c(depth, symbol, ((((node).child))[1]))));
                    block_end = "))";
                    while (Number((((node).child).length) > (0))) {
                        (((node).child)).splice((0), (1));
                    }
                    ;
                }
                else {
                    (((node).child)).splice((1), 0, (node_new(4, ((node).value))));
                }
                ;
            }
            ;
            if (Number((((node).value)) == ("return"))) {
                block_start = "return ";
                block_end = "";
            }
            ;
            ((s) += (block_start));
            for (var i = (0); Number((i) < (((node).child).length)); i += (1)) {
                var node_child = null;
                node_child = ((((node).child))[i]);
                var indent_needed = 0;
                indent_needed = node_indent_needed(node, node_child);
                var indent_depth = 0;
                indent_depth = ((indent_needed) ? (depth) : (((depth) - (1))));
                var indent = null;
                indent = "  ";
                if (indent_needed) {
                    ((s) += ("\n"));
                    for (var i_8 = (0); Number((i_8) < (indent_depth)); i_8 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                else {
                    if (Number((i) > (0))) {
                        ((s) += (block_seperator));
                    }
                    ;
                }
                ;
                var child = null;
                child = node_to_c(indent_depth, symbol, node_child);
                ((s) += (child));
                if (((((((((((Number((((node).value)) == (""))) || (Number((((node).value)) == ("func"))))) || (Number((((node).value)) == ("struct"))))) || (Number((((node).value)) == ("do"))))) || (Number((((node).value)) == ("then"))))) || (Number((((node).value)) == ("else"))))) {
                    ((s) += (";"));
                }
                ;
                if (((indent_needed) && (Number((i) == (((((node).child).length) - (1))))))) {
                    ((s) += ("\n"));
                    for (var i_9 = (0); Number((i_9) < (((indent_depth) - (1)))); i_9 += (1)) {
                        ((s) += (indent));
                    }
                    ;
                }
                ;
            }
            ;
            ((s) += (block_end));
        }
        ;
        if (Number((((node).type)) != (1))) {
            var value = null;
            value = node_to_c_preprocess(node);
            if (Number((((node).type)) == (8))) {
                value = "// ";
                ((value) += (((node).value)));
            }
            ;
            ((s) += (value));
        }
        ;
        return s;
    }
    compiler.node_to_c = node_to_c;
    ;
    function compile(target, filename) {
        var prog = null;
        prog = readfile(filename);
        var out_ = null;
        out_ = "";
        var tokens = null;
        tokens = token_parse(prog, filename, 0);
        var root = null;
        root = node_from_tokens(tokens);
        root = preprocess(root);
        root = preprocess_vdom(root);
        if (Number((target) == ("--target=wax"))) {
            out_ = node_to_wax(0, root);
        }
        ;
        if (Number((target) == ("--target=js"))) {
            out_ = node_to_js(0, root);
        }
        ;
        if (Number((target) == ("--target=cpp"))) {
            out_ = node_to_cpp(0, root);
        }
        ;
        if (Number((target) == ("--target=c"))) {
            var symbol = null;
            symbol = [];
            out_ = node_to_c(0, symbol, root);
        }
        ;
        return out_;
    }
    compiler.compile = compile;
    ;
    function format(filename) {
        var prog = null;
        prog = readfile(filename);
        var tokens = null;
        tokens = token_parse(prog, filename, 1);
        var root = null;
        root = node_from_tokens(tokens);
        var out_ = null;
        out_ = node_to_wax(0, root);
        return out_;
    }
    compiler.format = format;
    ;
    function help() {
        var lines = null;
        lines = [("usage: \n\n"), ("  wax <command> [arguments]\n\n"), ("commands: \n\n"), ("  build <--target=wax|--target=js|--target=cpp|--target=c> <filename.wax>\n"), ("  fmt <filename.wax>\n")];
        var help = null;
        help = "";
        for (var i = (0); Number((i) < (lines.length)); i += (1)) {
            ((help) += (((lines)[i])));
        }
        ;
        return help;
    }
    compiler.help = help;
    ;
    function main(args) {
        if (Number((args.length) < (3))) {
            console.log(help());
            return 1;
        }
        ;
        if (((Number((args.length) == (4))) && (Number((((args)[1])) == ("build"))))) {
            var out_ = null;
            out_ = compile(((args)[2]), ((args)[3]));
            console.log(out_);
            return 0;
        }
        ;
        if (((Number((args.length) == (3))) && (Number((((args)[1])) == ("fmt"))))) {
            console.log(format(((args)[2])));
            return 0;
        }
        ;
        console.log(help());
        return 0;
    }
    compiler.main = main;
    ;
    /*=== User Code            END   ===*/
    // @ts-ignore
    (typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));
})(compiler || (compiler = {}));
