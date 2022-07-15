const TOKEN_CHAR_TAB = '\t';
const TOKEN_CHAR_NL = '\n';
const TOKEN_CHAR_CR = '\r';
const TOKEN_CHAR_SPACE = ' ';
const TOKEN_CHAR_DOUBLE_QUOTE = '"';
const TOKEN_CHAR_SINGLE_QUOTE = '\'';
const TOKEN_CHAR_PAREN_OPEN = '(';
const TOKEN_CHAR_PAREN_CLOSE = ')';
const TOKEN_CHAR_SEMICOLON = ';';
const TOKEN_CHAR_BACKSLASH = '\\';
const TOKEN_TYPE_NORMAL = 0;
const TOKEN_TYPE_PAREN = 1;
const TOKEN_TYPE_COMMENT = 2;


function token_new(type, value, file, newlines, linenumber) {
  let t = {};
  t.type = type;
  t.value = value;
  t.file = file;
  t.newlines = newlines;
  t.linenumber = linenumber;
  return(t);
}
function token_parse(input, filename, comments) {
  let file = {};
  file.name = filename;
  let token = "";
  let tokens = [];
  let newlines = 0;
  let linenumber = 1;
  let in_comment = 0;
  let in_single_quote = 0;
  let in_double_quote = 0;
  let in_quote = 0;
  let in_quote_escape = 0;
  for (let i = 0; (i < input.length); i += 1) {
    let c = input[i];
    if (in_quote_escape) {
      in_quote_escape = 0;
    } else {
      if ((!in_double_quote) && (c == TOKEN_CHAR_SINGLE_QUOTE)) {
        in_single_quote = (!in_single_quote);
      };
      if ((!in_single_quote) && (c == TOKEN_CHAR_DOUBLE_QUOTE)) {
        in_double_quote = (!in_double_quote);
      };
      in_quote = (in_single_quote || in_double_quote);
      if (in_quote) {
        if (c == TOKEN_CHAR_BACKSLASH) {
          in_quote_escape = 1;
        };
      };
      if (!in_quote) {
        if (c == TOKEN_CHAR_SEMICOLON) {
          in_comment = 1;
        };
      };
      if (c == TOKEN_CHAR_NL) {
        if (in_comment) {
          if (comments != 0) {
            tokens.splice(tokens.length,0,token_new(TOKEN_TYPE_COMMENT, token, file, newlines, linenumber));
            newlines = 0;
          };
          token = "";
        };
        in_comment = 0;
      };
    };
    let whitespace = ((c == TOKEN_CHAR_TAB) || ((c == TOKEN_CHAR_SPACE) || ((c == TOKEN_CHAR_NL) || (c == TOKEN_CHAR_CR))));
    let paren = ((c == TOKEN_CHAR_PAREN_OPEN) || (c == TOKEN_CHAR_PAREN_CLOSE));
    if ((!in_quote) && ((!in_comment) && (whitespace || paren))) {
      if (token.length > 0) {
        tokens.splice(tokens.length,0,token_new(TOKEN_TYPE_NORMAL, token, file, newlines, linenumber));
        newlines = 0;
      };
      if (paren) {
        token = "";
        (token += input[i]);
        tokens.splice(tokens.length,0,token_new(TOKEN_TYPE_PAREN, token, file, newlines, linenumber));
        newlines = 0;
      };
      token = "";
    } else {
      (token += input[i]);
    };
    if (c == TOKEN_CHAR_NL) {
      newlines = (newlines + 1);
      linenumber = (linenumber + 1);
    };
  };
  return(tokens);
}
function token_write_to_output(tokens) {
  console.log("count:");
  console.log(tokens.length);
  console.log("");
  for (let i = 0; (i < tokens.length); i += 1) {
    console.log(tokens[i].value);
  };
}
function token_to_string(tokens, width) {
  let s = "";
  let line = "";
  for (let i = 0; (i < tokens.length); i += 1) {
    let token = "";
    for (let j = 0; (j < tokens[i].value.length); j += 1) {
      let c = tokens[i].value[j];
      let encoded = "";
      (encoded += c);
      if (c == '\"') {
        encoded = "\\\"";
      };
      if (c == '\\') {
        encoded = "";
        (encoded += '\\');
        (encoded += '\\');
      };
      (token += encoded);
    };
    (line += token);
    if (line.length > width) {
      (s += "\"");
      (s += line);
      (s += "\\n\"\n");
      line = "";
    } else {
      if ((token != "(") && (token != ")")) {
        (line += " ");
      };
    };
  };
  (s += "\"");
  (s += line);
  (s += "\\n\"\n");
  return(s);
}
const NODE_ROOT = 0;
const NODE_EXPR = 1;
const NODE_PREPROCESS = 2;
const NODE_CHAR = 3;
const NODE_STR = 4;
const NODE_STR_QUOTE = 5;
const NODE_INT = 6;
const NODE_FLOAT = 7;
const NODE_COMMENT = 8;

function node_new(type, value) {
  let node_new = {};
  node_new.type = type;
  node_new.value = value;
  node_new.child = [];
  node_new.token = {};
  return(node_new);
}
function node_copy(src) {
  let res = {};
  res.type = src.type;
  res.value = src.value;
  res.child = [];
  for (let i = 0; (i < src.child.length); i += 1) {
    res.child.splice(i,0,node_copy(src.child[i]));
  };
  res.token = src.token;
  return(res);
}
const NODE_CHAR_DOUBLE_QUOTE = '"';
const NODE_CHAR_SINGLE_QUOTE = '\'';
const NODE_CHAR_MINUS = '-';
const NODE_CHAR_DECIMAL = '.';
const NODE_CHAR_ZERO = '0';
const NODE_CHAR_NINE = '9';
const NODE_CHAR_AT = '@';
function node_type_from_token(token) {
  if (token.length > 0) {
    let c = token[0];
    if (c == NODE_CHAR_AT) {
      return(NODE_PREPROCESS);
    };
    if (c == NODE_CHAR_SINGLE_QUOTE) {
      return(NODE_CHAR);
    };
    if (c == NODE_CHAR_DOUBLE_QUOTE) {
      return(NODE_STR_QUOTE);
    };
    if (((c >= NODE_CHAR_ZERO) && (c <= NODE_CHAR_NINE)) || (c == NODE_CHAR_MINUS)) {
      for (let i = 0; (i < token.length); i += 1) {
        c = token[i];
        if (c == NODE_CHAR_DECIMAL) {
          return(NODE_FLOAT);
        };
      };
      return(NODE_INT);
    };
  };
  return(NODE_STR);
}
function node_from_tokens(tokens) {
  let stack = [];
  stack.splice(stack.length,0,node_new(NODE_ROOT, ""));
  let i = 0;
  while (i < tokens.length) {
    let token = tokens[i].value;
    if (tokens[i].type == TOKEN_TYPE_COMMENT) {
      let child = node_new(NODE_COMMENT, token);
      child.token = tokens[i];
      let node = stack[(stack.length - 1)];
      node.child.splice(node.child.length,0,child);
    } else {
      if (token == "(") {
        let value = "";
        let next_token = tokens[(i + 1)].value;
        if ((next_token != "(") && (next_token != ")")) {
          value = next_token;
        };
        let node = node_new(NODE_EXPR, value);
        node.token = tokens[i];
        if (value != "") {
          i = (i + 1);
        };
        let parent = stack[(stack.length - 1)];
        parent.child.splice(parent.child.length,0,node);
        stack.splice(stack.length,0,node);
      } else {
        if (token == ")") {
          stack.splice((stack.length - 1),1);
        } else {
          let child = node_new(node_type_from_token(token), token);
          child.token = tokens[i];
          let node = stack[(stack.length - 1)];
          node.child.splice(node.child.length,0,child);
        };
      };
    };
    i = (i + 1);
  };
  return(stack[0]);
}
function node_expand(node_org) {
  if (node_org.child.length < 2) {
    return(node_org);
  };
  let expanded = node_new(NODE_EXPR, node_org.value);
  expanded.child.splice(expanded.child.length,0,node_org.child[0]);
  if (node_org.child.length == 2) {
    expanded.child.splice(expanded.child.length,0,node_org.child[1]);
  } else {
    let expanded_child = node_new(NODE_EXPR, node_org.value);
    for (let i = 1; (i < node_org.child.length); i += 1) {
      expanded_child.child.splice(expanded_child.child.length,0,node_org.child[i]);
    };
    expanded.child.splice(expanded.child.length,0,expanded_child);
  };
  return(expanded);
}
function node_indent_needed(node, child) {
  if (child.type != NODE_EXPR) {
    return(0);
  };
  if ((child.value == "param") || (child.value == "result")) {
    return(0);
  };
  if ((node.value == "") || ((node.value == "func") || ((node.value == "do") || ((node.value == "then") || ((node.value == "else") || (node.value == "struct")))))) {
    return(1);
  };
  return(0);
}
let node_to_wax_indent = 0
function node_to_str(depth, node) {
  let s = "";
  if (node.type == NODE_ROOT) {
    for (let i = 0; (i < node.child.length); i += 1) {
      let child = node_to_str(0, node.child[i]);
      for (let j = 0; (j < node.child[i].token.newlines); j += 1) {
        (s += "\n");
      };
      (s += child);
    };
  };
  if (node.type == NODE_EXPR) {
    (s += "(");
    (s += node.value);
    for (let i = 0; (i < node.child.length); i += 1) {
      let node_child = node.child[i];
      let indent_needed = (node_child.type == NODE_EXPR);
      if (node_to_wax_indent) {
        indent_needed = node_indent_needed(node, node_child);
        indent_needed = (indent_needed || ((node.value == "&&") || (node.value == "||")));
      };
      indent_needed = (node_child.token.newlines > 0);
      let indent_depth = indent_needed ? depth : (depth - 1);
      let indent = "\t";
      if (indent_needed) {
        for (let i = 0; (i < node_child.token.newlines); i += 1) {
          (s += "\n");
        };
        for (let i = 0; (i <= indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        (s += " ");
      };
      let child = node_to_str((indent_depth + 1), node_child);
      (s += child);
      if (indent_needed && (i == (node.child.length - 1))) {
        (s += "\n");
        for (let i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      };
    };
    (s += ")");
  };
  if (node.type != NODE_EXPR) {
    (s += node.value);
  };
  return(s);
}
function node_to_wax(depth, node) {
  node_to_wax_indent = 1;
  return(node_to_str(depth, node));
}


function error_exit(msg) { throw(msg) }



function compile_error(module, node, msg) {
  let out = module;
  (out += " error: ");
  (out += node.token.file.name);
  (out += ", line ");
  (out += ""+node.token.linenumber);
  (out += "\n  ");
  (out += msg);
  (out += "\n\n");
  error_exit(out);
}
const MODULE_SYMBOL = "Symbol";

function dump_symbol(symbol) {
  let s = "";
  for (let i = 0; (i < symbol.length); i += 1) {
    (s += " ");
    (s += symbol[i].name);
  };
  return(s);
}
function node_symbol_scope_node(symbol, node) {
  let copy_symbol = [];
  for (let i = 0; (i < symbol.length); i += 1) {
    let s = {};
    s.name = symbol[i].name;
    s.node = symbol[i].node;
    copy_symbol.splice(copy_symbol.length,0,s);
  };
  for (let i = 0; (i < node.child.length); i += 1) {
    let child = node.child[i];
    if ((child.value == "struct") || ((child.value == "func") || ((child.value == "let") || ((child.value == "param") || (child.value == "for"))))) {
      let s = {};
      s.name = child.child[0].value;
      s.node = child;
      copy_symbol.splice(copy_symbol.length,0,s);
    };
  };
  return(copy_symbol);
}
function node_symbol_get_node(symbol, type, node) {
  for (let i = (symbol.length - 1); (i >= 0); i += -1) {
    if (symbol[i].name == node.value) {
      if ((type == "") || (type == symbol[i].node.value)) {
        return(symbol[i].node);
      };
    };
  };
  compile_error(MODULE_SYMBOL, node, "symbol not found");
  return(symbol[0].node);
}
const NODE_TYPE_NONE = 0;
const NODE_TYPE_STR = 1;
const NODE_TYPE_INT = 2;
const NODE_TYPE_FLOAT = 3;
const NODE_TYPE_VEC = 4;
const NODE_TYPE_ARRAY = 5;
function node_symbol_node_type_src(symbol, node) {
  if ((node.type == NODE_PREPROCESS) || ((node.type == NODE_STR_QUOTE) || ((node.type == NODE_CHAR) || ((node.type == NODE_INT) || ((node.type == NODE_FLOAT) || ((node.value == "str") || ((node.value == "int") || (node.value == "float")))))))) {
    return(node);
  };
  if (node.type == NODE_STR) {
    let symbol_node = node_symbol_get_node(symbol, "", node);
    if (symbol_node.value == "func") {
      return(node);
    };
    if ((symbol_node.value == "let") || ((symbol_node.value == "param") || (symbol_node.value == "for"))) {
      return(node_symbol_node_type_src(symbol, symbol_node.child[1]));
    };
  };
  if (node.type == NODE_EXPR) {
    if (node.value == "=") {
      return(node);
    };
    if (node.value == "#") {
      return(node);
    };
    if (node.value == "vec") {
      return(node);
    };
    if (node.value == "arr") {
      return(node);
    };
    if (node.value == "struct") {
      return(node);
    };
    if (node.value == "cast") {
      return(node.child[1]);
    };
    if (node.value == "?") {
      return(node.child[1]);
    };
    if (node.value == "call") {
      let symbol_node = node_symbol_get_node(symbol, "", node.child[0]);
      for (let i = 1; (i < symbol_node.child.length); i += 1) {
        if (symbol_node.child[i].value == "result") {
          return(symbol_node.child[i].child[0]);
        };
      };
      compile_error(MODULE_SYMBOL, node, "function result not found");
    };
    if (node.value == "get") {
      let target_node;
      if (node.child[0].type == NODE_STR) {
        let symbol_node = node_symbol_get_node(symbol, "", node.child[0]);
        if ((symbol_node.value != "let") && (symbol_node.value != "param")) {
          compile_error(MODULE_SYMBOL, node, "symbol not variable");
        };
        target_node = symbol_node.child[1];
      } else {
        if (node.child[0].value == "get") {
          let get_node_type = node_symbol_node_type_src(symbol, node.child[0]);
          target_node = get_node_type;
        } else {
          compile_error(MODULE_SYMBOL, node, "bad get expression");
        };
      };
      for (let i = 1; (i < node.child.length); i += 1) {
        if (target_node.value == "vec") {
          target_node = target_node.child[1];
        } else {
          if (target_node.value == "arr") {
            target_node = target_node.child[0];
          } else {
            if (target_node.value == "str") {
              return(node_new(NODE_TYPE_INT, ""));
            } else {
              if (target_node.value == "struct") {
                let symbol_node = node_symbol_get_node(symbol, "struct", target_node.child[0]);
                let found = 0;
                for (let j = 1; (j < symbol_node.child.length); j += 1) {
                  if ((symbol_node.child[j].value == "let") && (symbol_node.child[j].child[0].value == node.child[i].value)) {
                    target_node = symbol_node.child[j].child[1];
                    found = 1;
                  };
                };
                if (!found) {
                  compile_error(MODULE_SYMBOL, node, "struct member not found");
                };
              };
            };
          };
        };
      };
      return(node_symbol_node_type_src(symbol, target_node));
    };
    return(node_symbol_node_type_src(symbol, node.child[0]));
  };
  compile_error(MODULE_SYMBOL, node, "source node not established");
  return(node);
}
function node_symbol_node_type(symbol, node) {
  let src_node = node_symbol_node_type_src(symbol, node);
  if (src_node.type == NODE_PREPROCESS) {
    return(NODE_PREPROCESS);
  };
  if (src_node.type == NODE_STR_QUOTE) {
    return(NODE_TYPE_STR);
  };
  if (src_node.type == NODE_CHAR) {
    return(NODE_TYPE_INT);
  };
  if (src_node.type == NODE_INT) {
    return(NODE_TYPE_INT);
  };
  if (src_node.type == NODE_FLOAT) {
    return(NODE_TYPE_FLOAT);
  };
  if (src_node.value == "=") {
    return(NODE_TYPE_INT);
  };
  if (src_node.value == "#") {
    return(NODE_TYPE_INT);
  };
  if (src_node.value == "str") {
    return(NODE_TYPE_STR);
  };
  if (src_node.value == "int") {
    return(NODE_TYPE_INT);
  };
  if (src_node.value == "float") {
    return(NODE_TYPE_FLOAT);
  };
  if (src_node.value == "call") {
    return(NODE_TYPE_INT);
  };
  return(NODE_TYPE_NONE);
}


function readfile(filename) {
   let fs=require('fs');
   return fs.readFileSync(filename).toString();
 }




const MODULE_PREPROCESS = "Preprocess";
const PREPROCESS_CHAR_STOP = '.';
const PREPROCESS_CHAR_SLASH = '/';
const PREPROCESS_CHAR_UNDERSCORE = '_';
function preprocess_replace_node(node, define) {
  if (node.type == NODE_PREPROCESS) {
    let k = "";
    for (let i = 1; (i < node.value.length); i += 1) {
      (k += node.value[i]);
    };
    let replace = define[k].child[1];
    node.type = replace.type;
    node.value = replace.value;
  };
  for (let i = 0; (i < node.child.length); i += 1) {
    preprocess_replace_node(node.child[i], define);
  };
}
function preprocess_replace(node) {
  let define = {};
  let i = 0;
  while (i < node.child.length) {
    if (node.child[i].value == "@define") {
      define[node.child[i].child[0].value] = node.child[i];
      node.child.splice(i,1);
    } else {
      preprocess_replace_node(node.child[i], define);
      i = (i + 1);
    };
  };
  return(node);
}
function preprocess_package_rewrite_identifier(package, identifier, node) {
  let v = node.value;
  if (node.type == NODE_PREPROCESS) {
    v.splice(0,1);
  };
  if (identifier[v] == 1) {
    let value;
    if (node.type == NODE_PREPROCESS) {
      value = "@";
    };
    (value += "__");
    (value += package);
    (value += "__");
    (value += v);
    node.value = value;
  };
  for (let i = 0; (i < node.child.length); i += 1) {
    preprocess_package_rewrite_identifier(package, identifier, node.child[i]);
  };
}
function preprocess_package_rewrite(package, node) {
  let identifier = {};
  for (let i = 0; (i < node.child.length); i += 1) {
    if ((node.child[i].value == "@define") || ((node.child[i].value == "func") || (node.child[i].value == "struct"))) {
      identifier[node.child[i].child[0].value] = 1;
    };
  };
  preprocess_package_rewrite_identifier(package, identifier, node);
}
function preprocess_package_from_path(pathprefix, node) {
  let package = "";
  let filename = "";
  let basepath = "";
  let quotedfilename = node.child[0].value;
  if (node.child.length == 2) {
    for (let i = 1; (i < (node.child[0].value.length - 1)); i += 1) {
      (package += node.child[0].value[i]);
    };
    quotedfilename = node.child[1].value;
  };
  let start = 0;
  let end = quotedfilename.length;
  for (let i = 0; (i < quotedfilename.length); i += 1) {
    if (quotedfilename[i] == PREPROCESS_CHAR_SLASH) {
      start = (i + 1);
    };
    if (quotedfilename[i] == PREPROCESS_CHAR_STOP) {
      end = i;
    };
  };
  if (node.child.length == 1) {
    for (let i = start; (i < end); i += 1) {
      (package += quotedfilename[i]);
    };
  };
  for (let i = 0; (i < pathprefix.length); i += 1) {
    (filename += pathprefix[i]);
  };
  for (let i = 1; (i < (quotedfilename.length - 1)); i += 1) {
    (filename += quotedfilename[i]);
  };
  for (let i = 0; (i < pathprefix.length); i += 1) {
    (basepath += pathprefix[i]);
  };
  for (let i = 1; (i < start); i += 1) {
    (basepath += quotedfilename[i]);
  };
  return([package,filename,basepath]);
}
function preprocess_include_import(basepath, node) {
  let i = 0;
  while (i < node.child.length) {
    if ((node.child[i].value == "@include") || (node.child[i].value == "@import")) {
      let res = preprocess_package_from_path(basepath, node.child[i]);
      let package = res[0];
      let filename = res[1];
      let prefix = res[2];
      let include_str = readfile(filename);
      if (include_str.length == 0) {
        let err = "Cannot open file: ";
        (err += filename);
        compile_error(MODULE_PREPROCESS, node.child[i], err);
      };
      let tokens = token_parse(include_str, filename, 0);
      let include = node_from_tokens(tokens);
      preprocess_include_import(prefix, include);
      if (node.child[i].value == "@import") {
        preprocess_package_rewrite(package, include);
      };
      node.child.splice(i,1);
      for (let j = 0; (j < include.child.length); j += 1) {
        node.child.splice((i + j),0,include.child[j]);
      };
      i = (i + include.child.length);
    } else {
      i = (i + 1);
    };
  };
}
function preprocess_identifier_rewrite(node) {
  if (node.type == NODE_STR) {
    for (let i = 0; (i < node.value.length); i += 1) {
      if (node.value[i] == PREPROCESS_CHAR_STOP) {
        node.value.splice(i,1);
        node.value.splice(i,0,PREPROCESS_CHAR_UNDERSCORE);
        node.value.splice(i,0,PREPROCESS_CHAR_UNDERSCORE);
        node.value.splice(0,0,PREPROCESS_CHAR_UNDERSCORE);
        node.value.splice(0,0,PREPROCESS_CHAR_UNDERSCORE);
      };
    };
  };
  if (node.type == NODE_PREPROCESS) {
    for (let i = 0; (i < node.value.length); i += 1) {
      if (node.value[i] == PREPROCESS_CHAR_STOP) {
        node.value.splice(i,1);
        node.value.splice(i,0,PREPROCESS_CHAR_UNDERSCORE);
        node.value.splice(i,0,PREPROCESS_CHAR_UNDERSCORE);
        node.value.splice(1,0,PREPROCESS_CHAR_UNDERSCORE);
        node.value.splice(1,0,PREPROCESS_CHAR_UNDERSCORE);
      };
    };
  };
  for (let i = 0; (i < node.child.length); i += 1) {
    preprocess_identifier_rewrite(node.child[i]);
  };
}
function preprocess(node) {
  preprocess_include_import("", node);
  preprocess_identifier_rewrite(node);
  return(node);
}
function preprocess_vdom_quote(value) {
  let out = "";
  (out += "\"");
  (out += value);
  (out += "\"");
  return(out);
}
function preprocess_vdom_isaction(type) {
  if ((type == "do") || ((type == "then") || (type == "else"))) {
    return(1);
  };
  return(0);
}
function preprocess_vdom_reserverd(type) {
  if ((type == "let") || ((type == "set") || ((type == "<<") || ((type == "if") || ((type == "else") || ((type == "for") || ((type == "while") || (type == "do")))))))) {
    return(1);
  };
  return(0);
}
function preprocess_vdom_element(node) {
  let out = node_new(NODE_EXPR, "call");
  out.child.splice(0,0,node_new(NODE_STR, "__vdom__element_new"));
  out.child.splice(1,0,node_new(NODE_STR_QUOTE, preprocess_vdom_quote(node.value)));
  return(out);
}
function preprocess_vdom_element_child(depth, name, node) {
  let out = [];
  let i = 0;
  while (i < node.child.length) {
    let type = "";
    if (node.child[i].type == NODE_STR) {
      type = "attr";
      if ((node.child[(i + 1)].type == NODE_EXPR) && (node.child[(i + 1)].value == "func")) {
        type = "event";
      };
    };
    if (node.child[i].type == NODE_EXPR) {
      type = "element";
      if (node.child[i].value == "child") {
        type = "child";
      };
      if (preprocess_vdom_reserverd(node.child[i].value) != 0) {
        type = "reserved";
      };
    };
    if ((type == "attr") || (type == "event")) {
      let attr_set = node_new(NODE_EXPR, "set");
      attr_set.token.newlines = 1;
      attr_set.child.splice(0,0,node_new(NODE_STR, name));
      attr_set.child.splice(1,0,node_new(NODE_STR, type));
      attr_set.child.splice(2,0,node_new(NODE_STR_QUOTE, preprocess_vdom_quote(node.child[i].value)));
      if ((type == "event") || (node.child[(i + 1)].type == NODE_STR_QUOTE)) {
        attr_set.child.splice(3,0,node.child[(i + 1)]);
      } else {
        let value = node_new(NODE_EXPR, "cast");
        value.child.splice(0,0,node.child[(i + 1)]);
        value.child.splice(1,0,node_new(NODE_STR, "str"));
        attr_set.child.splice(3,0,value);
      };
      out.splice(out.length,0,attr_set);
      i = (i + 1);
    };
    if (type == "reserved") {
      let child = node.child[i].child;
      node.child[i].child = [];
      for (let j = 0; (j < child.length); j += 1) {
        if ((child[j].type == NODE_EXPR) && preprocess_vdom_isaction(child[j].value)) {
          let action_node = node_new(NODE_EXPR, child[j].value);
          let element_child = preprocess_vdom_element_child((depth + 1), name, child[j]);
          for (let k = 0; (k < element_child.length); k += 1) {
            action_node.child.splice(action_node.child.length,0,element_child[k]);
          };
          node.child[i].child.splice(node.child[i].child.length,0,action_node);
        } else {
          node.child[i].child.splice(node.child[i].child.length,0,child[j]);
        };
      };
      out.splice(out.length,0,node.child[i]);
    };
    if (type == "child") {
      let element_insert = node_new(NODE_EXPR, "insert");
      element_insert.token.newlines = 1;
      element_insert.token.newlines = 1;
      let element_insert_get = node_new(NODE_EXPR, "get");
      element_insert_get.child.splice(0,0,node_new(NODE_STR, name));
      element_insert_get.child.splice(1,0,node_new(NODE_STR, "child"));
      element_insert.child.splice(0,0,element_insert_get);
      let element_insert_count = node_new(NODE_EXPR, "#");
      let element_insert_count_get = node_new(NODE_EXPR, "get");
      element_insert_count_get.child.splice(0,0,node_new(NODE_STR, name));
      element_insert_count_get.child.splice(1,0,node_new(NODE_STR, "child"));
      element_insert_count.child.splice(0,0,element_insert_count_get);
      element_insert.child.splice(1,0,element_insert_count);
      element_insert.child.splice(2,0,node_new(NODE_STR, node.child[i].child[0].value));
      out.splice(out.length,0,element_insert);
    };
    if (type == "element") {
      let block = node_new(NODE_EXPR, "");
      if (preprocess_vdom_isaction(node.value) != 0) {
        block.value = node.value;
      };
      block.token.newlines = 1;
      out.splice(out.length,0,block);
      let child_name = "_";
      (child_name += ""+depth);
      (child_name += "_");
      (child_name += ""+i);
      (child_name += "_");
      (child_name += node.child[i].value);
      let element = node_new(NODE_EXPR, "let");
      element.token.newlines = 1;
      element.child.splice(0,0,node_new(NODE_STR, child_name));
      let element_struct = node_new(NODE_EXPR, "struct");
      element_struct.child.splice(0,0,node_new(NODE_STR, "__vdom__element"));
      element.child.splice(1,0,element_struct);
      element.child.splice(2,0,preprocess_vdom_element(node.child[i]));
      block.child.splice(block.child.length,0,element);
      let element_insert = node_new(NODE_EXPR, "insert");
      element_insert.token.newlines = 1;
      let element_insert_get = node_new(NODE_EXPR, "get");
      element_insert_get.child.splice(0,0,node_new(NODE_STR, name));
      element_insert_get.child.splice(1,0,node_new(NODE_STR, "child"));
      element_insert.child.splice(0,0,element_insert_get);
      let element_insert_count = node_new(NODE_EXPR, "#");
      let element_insert_count_get = node_new(NODE_EXPR, "get");
      element_insert_count_get.child.splice(0,0,node_new(NODE_STR, name));
      element_insert_count_get.child.splice(1,0,node_new(NODE_STR, "child"));
      element_insert_count.child.splice(0,0,element_insert_count_get);
      element_insert.child.splice(1,0,element_insert_count);
      element_insert.child.splice(2,0,node_new(NODE_STR, child_name));
      block.child.splice(block.child.length,0,element_insert);
      let element_child = preprocess_vdom_element_child((depth + 1), child_name, node.child[i]);
      for (let j = 0; (j < element_child.length); j += 1) {
        block.child.splice(block.child.length,0,element_child[j]);
      };
    };
    i = (i + 1);
  };
  return(out);
}
function preprocess_vdom(node) {
  for (let i = 0; (i < node.child.length); i += 1) {
    if ((node.child[i].value == "let") && ((node.child[i].child.length == 3) && ((node.child[i].child[1].value == "struct") && (((node.child[i].child[1].child[0].value == "vdom.element") || (node.child[i].child[1].child[0].value == "__vdom__element")) && ((node.child[i].child[2].value != "call") && (node.child[i].child[2].value != "alloc")))))) {
      let element_child = preprocess_vdom_element_child(0, node.child[i].child[0].value, node.child[i].child[2]);
      node.child[i].child[2] = preprocess_vdom_element(node.child[i].child[2]);
      node.child[i].child[2].token.newlines = 0;
      for (let j = 0; (j < element_child.length); j += 1) {
        i = (i + 1);
        node.child.splice(i,0,element_child[j]);
      };
    } else {
      node.child[i] = preprocess_vdom(node.child[i]);
    };
  };
  return(node);
}
const MODULE_VALIDATION = "Validation";
function validate(node) {
  if (node.type == NODE_EXPR) {
    if (node.value == "let") {
      if ((node.child.length < 2) || (node.child.length > 3)) {
        compile_error(MODULE_VALIDATION, node, "'let' requires 2 or 3 args");
      };
    };
  };
  for (let i = 0; (i < node.child.length); i += 1) {
    let child = node_to_str(0, node.child[i]);
    validate(node.child[i]);
  };
}
function node_to_js(depth, node) {
  let s = "";
  depth = (depth + 1);
  node = node_copy(node);
  if (node.type == NODE_ROOT) {
    let has_main = 0;
    for (let i = 0; (i < node.child.length); i += 1) {
      if ((node.child[i].value == "func") && (node.child[i].child[0].value == "main")) {
        has_main = 1;
      };
      let child = node_to_js(0, node.child[i]);
      (s += child);
      (s += "\n");
    };
    if (has_main) {
      (s += "(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));\n");
    };
  };
  if ((node.value == "+") || ((node.value == "&&") || (node.value == "||"))) {
    node = node_expand(node);
  };
  if (node.type == NODE_EXPR) {
    let block_start = "(";
    (block_start += node.value);
    let block_end = ")";
    let block_seperator = " ";
    if (node.value == "") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "@define") {
      block_start = "const ";
      (block_start += node.child[0].value);
      (block_start += " = ");
      (block_start += node.child[1].value);
      (block_start += ";");
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "@if") {
      block_start = "";
      block_end = "";
      if (node.child[0].value == "TARGET_JS") {
        node.child.splice(0,1);
        node.child.splice(0,1);
      } else {
        while (node.child.length > 0) {
          node.child.splice(0,1);
        };
      };
    };
    if (node.value == "extern") {
      block_start = "";
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "asm") {
      let quotedline = node.child[0].value;
      let line = "";
      for (let j = 1; (j < (quotedline.length - 1)); j += 1) {
        (line += quotedline[j]);
      };
      block_start = line;
      block_end = "\n";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "struct") {
      block_start = "";
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "func") {
      block_start = "function ";
      if (node.child[0].type == NODE_STR) {
        let fname_node = node.child[0];
        (block_start += fname_node.value);
        node.child.splice(0,1);
      };
      (block_start += "(");
      let param_count = 0;
      let i = 0;
      while (i < node.child.length) {
        let child_node = node.child[i];
        if (child_node.value == "param") {
          if (child_node.child.length == 2) {
            let param_node = child_node.child[0];
            if (param_count > 0) {
              (block_start += ", ");
            };
            (block_start += param_node.value);
            param_count = (param_count + 1);
          };
          node.child.splice(i,1);
          i = (i - 1);
        };
        if (child_node.value == "result") {
          node.child.splice(i,1);
          i = (i - 1);
        };
        i = (i + 1);
      };
      (block_start += ") {");
      block_end = "}";
    };
    if (node.value == "call") {
      let fname_node = node.child[0];
      block_start = fname_node.value;
      (block_start += "(");
      block_end = ")";
      node.child.splice(0,1);
      block_seperator = ", ";
    };
    if ((node.value == "let") || (node.value == "local")) {
      block_start = "let ";
      block_end = "";
      node.child.splice(1,1);
      if (node.child.length == 2) {
        node.child.splice(1,0,node_new(NODE_STR, "="));
      };
    };
    if (node.value == "alloc") {
      block_start = "";
      block_end = "";
      let child = node.child[0];
      if (child.type == NODE_EXPR) {
        if ((node.child[0].value == "vec") && (node.child.length == 1)) {
          block_start = "new Array(";
          (block_start += node_to_js(depth, node.child[0].child[0]));
          (block_start += ").fill(0)");
        } else {
          if ((node.child[0].value == "arr") || (node.child[0].value == "vec")) {
            block_start = "[";
            for (let i = 1; (i < node.child.length); i += 1) {
              (block_start += node_to_js(depth, node.child[i]));
              if (i < (node.child.length - 1)) {
                (block_start += ",");
              };
            };
            (block_start += "]");
          };
        };
        if ((node.child[0].value == "map") || (node.child[0].value == "struct")) {
          block_start = "{}";
        };
      };
      if (child.type == NODE_STR) {
        if (node.child.length >= 2) {
          block_start = node_to_js(depth, node.child[1]);
        } else {
          block_start = "\"\"";
        };
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "free") {
      block_start = "/*GC*/";
      block_end = "";
      node.child.splice(0,1);
    };
    if (node.value == "#") {
      block_start = "";
      block_end = ".length";
    };
    if (node.value == "insert") {
      block_start = node_to_js(depth, node.child[0]);
      (block_start += ".splice(");
      (block_start += node_to_js(depth, node.child[1]));
      (block_start += ",0,");
      (block_start += node_to_js(depth, node.child[2]));
      block_end = ")";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "remove") {
      if (node.child[1].type != NODE_STR_QUOTE) {
        block_start = node_to_js(depth, node.child[0]);
        (block_start += ".splice(");
        (block_start += node_to_js(depth, node.child[1]));
        (block_start += ",");
        (block_start += node_to_js(depth, node.child[2]));
        block_end = ")";
      };
      if (node.child[1].type == NODE_STR_QUOTE) {
        block_start = "delete ";
        (block_start += node_to_js(depth, node.child[0]));
        (block_start += "[");
        (block_start += node_to_js(depth, node.child[1]));
        block_end = "]";
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "slice") {
      block_start = node_to_js(depth, node.child[0]);
      (block_start += ".slice(");
      (block_start += node_to_js(depth, node.child[1]));
      (block_start += ",(");
      (block_start += node_to_js(depth, node.child[2]));
      (block_start += " + ");
      (block_start += node_to_js(depth, node.child[1]));
      block_end = "))";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "get") {
      block_start = node_to_js(depth, node.child[0]);
      block_end = "";
      for (let i = 1; (i < node.child.length); i += 1) {
        let child = node.child[i];
        if ((child.type == NODE_STR) && (child.value.length > 1)) {
          (block_end += ".");
          (block_end += node_to_js(depth, node.child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_js(depth, node.child[i]));
          (block_end += "]");
        };
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "set") {
      block_start = node_to_js(depth, node.child[0]);
      block_end = "";
      let n = (node.child.length - 1);
      for (let i = 1; (i < n); i += 1) {
        let child = node.child[i];
        if ((child.type == NODE_STR) && (child.value.length > 1)) {
          (block_end += ".");
          (block_end += node_to_js(depth, node.child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_js(depth, node.child[i]));
          (block_end += "]");
        };
      };
      (block_end += " = ");
      (block_end += node_to_js(depth, node.child[n]));
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "cast") {
      if (node.child[1].value == "str") {
        block_start = "\"\"+";
        block_end = node_to_js(depth, node.child[0]);
      };
      if (node.child[1].value == "int") {
        block_start = node_to_js(depth, node.child[0]);
        block_end = "|0";
      };
      node.child.splice(0,1);
      node.child.splice(0,1);
    };
    if (node.value == "then") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "else") {
      block_start = "else {";
      block_end = "}";
    };
    if (node.value == "for") {
      if (node.child.length == 5) {
        block_start = "for (let ";
        (block_start += node_to_js(depth, node.child[0]));
        (block_start += " = ");
        (block_start += node_to_js(depth, node.child[1]));
        (block_start += "; ");
        (block_start += node_to_js(depth, node.child[2]));
        (block_start += "; ");
        (block_start += node_to_js(depth, node.child[0]));
        (block_start += " += ");
        (block_start += node_to_js(depth, node.child[3]));
        (block_start += ") ");
        node.child.splice(0,4);
        block_end = "";
      };
      if (node.child.length == 4) {
        block_start = "for (const [";
        (block_start += node_to_js(depth, node.child[0]));
        (block_start += ",");
        (block_start += node_to_js(depth, node.child[1]));
        (block_start += "] of Object.entries(");
        (block_start += node_to_js(depth, node.child[2]));
        (block_start += "))");
        node.child.splice(0,3);
        block_end = "";
      };
    };
    if ((node.value == "if") || (node.value == "while")) {
      block_start = node.value;
      (block_start += " ");
      let block_simple = (node.child[0].type != NODE_EXPR);
      if (block_simple) {
        (block_start += "(");
      };
      (block_start += node_to_js(depth, node.child[0]));
      if (block_simple) {
        (block_start += ")");
      };
      (block_start += " ");
      block_end = "";
      node.child.splice(0,1);
    };
    if (node.value == "do") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "break") {
      block_start = "break";
      block_end = "";
    };
    if (node.value == "?") {
      block_start = node_to_js(depth, node.child[0]);
      (block_start += " ? ");
      (block_start += node_to_js(depth, node.child[1]));
      (block_start += " : ");
      (block_start += node_to_js(depth, node.child[2]));
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "print") {
      block_start = "console.log(";
    };
    if ((node.value == ">>") || ((node.value == "<<") || ((node.value == "=") || ((node.value == "&&") || ((node.value == "||") || ((node.value == ">=") || ((node.value == "<=") || ((node.value == "<>") || ((node.value == "+") || ((node.value == "-") || ((node.value == "*") || ((node.value == "/") || ((node.value == "^") || ((node.value == "%") || ((node.value == "&") || ((node.value == "|") || ((node.value == "~") || ((node.value == "<") || (node.value == ">"))))))))))))))))))) {
      block_start = "(";
      block_end = ")";
      if (node.value == "=") {
        node.value = "==";
      };
      if (node.value == "<>") {
        node.value = "!=";
      };
      if ((node.value == "<<") && (node.child[0].type == NODE_STR)) {
        node.value = "+=";
      };
      node.child.splice(1,0,node_new(NODE_STR, node.value));
    };
    if (node.value == "return") {
      if (node.child.length > 0) {
        block_start = "return(";
        block_end = ")";
      } else {
        block_start = "return";
        block_end = "";
      };
    };
    (s += block_start);
    for (let i = 0; (i < node.child.length); i += 1) {
      let node_child = node.child[i];
      let indent_needed = node_indent_needed(node, node_child);
      let indent_depth = indent_needed ? depth : (depth - 1);
      let indent = "  ";
      if (indent_needed) {
        (s += "\n");
        for (let i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        if (i > 0) {
          (s += block_seperator);
        };
      };
      let child = node_to_js(indent_depth, node_child);
      (s += child);
      if ((node.value == "") || ((node.value == "func") || ((node.value == "do") || ((node.value == "then") || (node.value == "else"))))) {
        (s += ";");
      };
      if (indent_needed && (i == (node.child.length - 1))) {
        (s += "\n");
        for (let i = 0; (i < (indent_depth - 1)); i += 1) {
          (s += indent);
        };
      };
    };
    (s += block_end);
  };
  if (node.type != NODE_EXPR) {
    let value = node.value;
    if (node.type == NODE_PREPROCESS) {
      value = "";
      for (let i = 1; (i < node.value.length); i += 1) {
        (value += node.value[i]);
      };
    };
    if (node.type == NODE_COMMENT) {
      value = "// ";
      (value += node.value);
    };
    (s += value);
  };
  return(s);
}
function node_to_cpp_preprocess(node) {
  let value = node.value;
  if (node.type == NODE_PREPROCESS) {
    value = "";
    for (let i = 1; (i < node.value.length); i += 1) {
      (value += node.value[i]);
    };
  };
  return(value);
}
function node_to_cpp_type(node) {
  let type = node.value;
  if (node.value == "str") {
    type = "std::string";
  };
  if (node.value == "vec") {
    type = "std::array<";
    (type += node_to_cpp_type(node.child[1]));
    (type += ",");
    (type += node_to_cpp_preprocess(node.child[0]));
    (type += ">");
  };
  if (node.value == "arr") {
    type = "std::vector<";
    (type += node_to_cpp_type(node.child[0]));
    (type += ">");
  };
  if (node.value == "struct") {
    type = "struct ";
    (type += node.child[0].value);
    (type += "*");
  };
  if (type == "map") {
    type = "std::map<";
    (type += node_to_cpp_type(node.child[0]));
    (type += ",");
    (type += node_to_cpp_type(node.child[1]));
    (type += ">");
  };
  if (type == "func") {
    let return_type = "void";
    let params = "void";
    let i = 0;
    while (i < node.child.length) {
      let child_node = node.child[i];
      if (child_node.value == "param") {
        if (params == "void") {
          params = "";
        } else {
          (params += ", ");
        };
        let type = "";
        type = node_to_cpp_type(child_node.child[1]);
        if ((child_node.child[1].value == "vec") || ((child_node.child[1].value == "arr") || (child_node.child[1].value == "map"))) {
          (type += "&");
        };
        (params += type);
        (params += " ");
        (params += child_node.child[0].value);
        node.child.splice(i,1);
        i = (i - 1);
      };
      if (child_node.value == "result") {
        return_type = node_to_cpp_type(child_node.child[0]);
        node.child.splice(i,1);
        i = (i - 1);
      };
      i = (i + 1);
    };
    let function = "";
    if (node.child.length > 0) {
      if (node.child[0].type == NODE_STR) {
        let func_name = node.child[0].value;
        if (func_name == "main") {
          func_name = "main_args";
          params = "std::vector<std::string>& args";
          return_type = "int";
        };
        (function += return_type);
        (function += " ");
        (function += func_name);
        (function += "(");
        (function += params);
        (function += ")");
      } else {
        (function += "[=](");
        (function += params);
        (function += ")");
      };
    } else {
      (function += "std::function<");
      (function += return_type);
      (function += " (");
      (function += params);
      (function += ")>");
    };
    type = function;
  };
  return(type);
}
function node_to_cpp(depth, node) {
  let s = "";
  depth = (depth + 1);
  node = node_copy(node);
  if (node.type == NODE_ROOT) {
    (s += "#include <iostream>\n");
    (s += "#include <sstream>\n");
    (s += "#include <string>\n");
    (s += "#include <vector>\n");
    (s += "#include <array>\n");
    (s += "#include <map>\n");
    (s += "#include <functional>\n");
    (s += "template<typename T> std::string tostring(const T& x) {\n");
    (s += "  std::stringstream ss;\n");
    (s += "  ss << x;\n");
    (s += "  return ss.str();\n");
    (s += "}\n");
    (s += "\n\n");
    let has_main = 0;
    for (let i = 0; (i < node.child.length); i += 1) {
      if ((node.child[i].value == "func") && (node.child[i].child[0].value == "main")) {
        has_main = 1;
      };
      let child = node_to_cpp(0, node.child[i]);
      (s += child);
      if (node.child[i].value == "let") {
        (s += ";");
      };
      (s += "\n");
    };
    if (has_main) {
      (s += "int main(int argc, char** argv) {\n");
      (s += "  std::vector<std::string> args(argv, argv + argc);\n");
      (s += "  return main_args(args);\n");
      (s += "};\n");
    };
  };
  if ((node.value == "+") || ((node.value == "&&") || (node.value == "||"))) {
    node = node_expand(node);
  };
  if (node.type == NODE_EXPR) {
    let block_start = "(";
    (block_start += node.value);
    let block_end = ")";
    let block_seperator = " ";
    if (node.value == "") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "@define") {
      block_start = "#define ";
      (block_start += node.child[0].value);
      (block_start += " ");
      (block_start += node.child[1].value);
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "@if") {
      block_start = "";
      block_end = "";
      if (node.child[0].value == "TARGET_CPP") {
        node.child.splice(0,1);
        node.child.splice(0,1);
      } else {
        while (node.child.length > 0) {
          node.child.splice(0,1);
        };
      };
    };
    if (node.value == "extern") {
      block_start = "";
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "asm") {
      let quotedline = node.child[0].value;
      let line = "";
      for (let j = 1; (j < (quotedline.length - 1)); j += 1) {
        if (quotedline[j] != 92) {
          (line += quotedline[j]);
        };
      };
      block_start = line;
      block_end = "\n";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "struct") {
      block_start = "struct ";
      (block_start += node.child[0].value);
      (block_start += " {");
      block_end = "};";
      node.child.splice(0,1);
    };
    if (node.value == "func") {
      block_start = node_to_cpp_type(node);
      (block_start += " {");
      block_end = "}";
      if (node.child[0].type == NODE_STR) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "call") {
      let fname_node = node.child[0];
      block_start = fname_node.value;
      (block_start += "(");
      block_end = ")";
      node.child.splice(0,1);
      block_seperator = ", ";
    };
    if ((node.value == "let") || (node.value == "local")) {
      let type = node_to_cpp_type(node.child[1]);
      block_start = type;
      (block_start += " ");
      block_end = "";
      node.child.splice(1,1);
      if (node.child.length == 2) {
        node.child.splice(1,0,node_new(NODE_STR, "="));
      };
    };
    if (node.value == "alloc") {
      block_start = "";
      block_end = "";
      if (node.child[0].value == "str") {
        block_start = "\"\"";
        if (node.child.length > 1) {
          block_start = node.child[1].value;
        };
      };
      if (node.child[0].type == NODE_EXPR) {
        if ((node.child[0].value == "vec") || (node.child[0].value == "arr")) {
          if (node.child.length == 1) {
            let init = node_to_cpp_type(node.child[0]);
            (init += "()");
            block_start = init;
          } else {
            block_start = "{";
            for (let i = 1; (i < node.child.length); i += 1) {
              (block_start += node_to_cpp(depth, node.child[i]));
              if (i < (node.child.length - 1)) {
                (block_start += ",");
              };
            };
            (block_start += "}");
          };
        };
        if (node.child[0].value == "struct") {
          block_start = "new ";
          (block_start += node.child[0].child[0].value);
          (block_start += "()");
        };
        if (node.child[0].value == "map") {
          block_start = "{}";
        };
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "free") {
      block_start = "/*GC*/";
      block_end = "";
      node.child.splice(0,1);
    };
    if (node.value == "#") {
      block_start = "";
      block_end = ".size()";
    };
    if (node.value == "insert") {
      let array = node_to_cpp(depth, node.child[0]);
      let position = node_to_cpp(depth, node.child[1]);
      let value = node_to_cpp(depth, node.child[2]);
      block_start = array;
      (block_start += ".insert(");
      (block_start += array);
      (block_start += ".begin()+");
      (block_start += position);
      (block_start += ",");
      (block_start += value);
      block_end = ")";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "remove") {
      if (node.child.length == 2) {
        block_start = node_to_cpp(depth, node.child[0]);
        (block_start += ".erase(");
        (block_start += node_to_cpp(depth, node.child[1]));
        block_end = ")";
      } else {
        let array = node_to_cpp(depth, node.child[0]);
        let first = node_to_cpp(depth, node.child[1]);
        let last = node_to_cpp(depth, node.child[2]);
        block_start = array;
        (block_start += ".erase(");
        (block_start += array);
        (block_start += ".begin()+");
        (block_start += first);
        (block_start += ",");
        (block_start += array);
        (block_start += ".begin()+");
        (block_start += first);
        (block_start += "+");
        (block_start += last);
        block_end = ")";
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "slice") {
      block_start = node_to_cpp(depth, node.child[0]);
      (block_start += ".substr(");
      (block_start += node_to_cpp(depth, node.child[1]));
      (block_start += ",");
      (block_start += node_to_cpp(depth, node.child[2]));
      block_end = ")";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "get") {
      block_start = node_to_cpp(depth, node.child[0]);
      block_end = "";
      for (let i = 1; (i < node.child.length); i += 1) {
        let child = node.child[i];
        if ((child.type == NODE_STR) && (child.value.length > 1)) {
          (block_end += "->");
          (block_end += node_to_cpp(depth, node.child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_cpp(depth, node.child[i]));
          (block_end += "]");
        };
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "set") {
      block_start = node_to_cpp(depth, node.child[0]);
      block_end = "";
      let n = (node.child.length - 1);
      for (let i = 1; (i < n); i += 1) {
        let child = node.child[i];
        if ((child.type == NODE_STR) && (child.value.length > 1)) {
          (block_end += "->");
          (block_end += node_to_cpp(depth, node.child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_cpp(depth, node.child[i]));
          (block_end += "]");
        };
      };
      (block_end += " = ");
      (block_end += node_to_cpp(depth, node.child[n]));
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "cast") {
      if (node.child[1].value == "str") {
        block_start = "tostring(";
        (block_start += node_to_cpp(depth, node.child[0]));
        block_end = ")";
      };
      if (node.child[1].value == "int") {
        block_start = "(int)";
        block_end = node_to_cpp(depth, node.child[0]);
      };
      node.child.splice(0,1);
      node.child.splice(0,1);
    };
    if (node.value == "then") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "else") {
      block_start = "else {";
      block_end = "}";
    };
    if (node.value == "for") {
      if (node.child.length == 5) {
        block_start = "for (int ";
        (block_start += node_to_cpp(depth, node.child[0]));
        (block_start += " = ");
        (block_start += node_to_cpp(depth, node.child[1]));
        (block_start += "; ");
        (block_start += node_to_cpp(depth, node.child[2]));
        (block_start += "; ");
        (block_start += node_to_cpp(depth, node.child[0]));
        (block_start += " += ");
        (block_start += node_to_cpp(depth, node.child[3]));
        (block_start += ") ");
        node.child.splice(0,4);
        block_end = "";
      };
      if (node.child.length == 4) {
        block_start = "for (const auto &[";
        (block_start += node_to_cpp(depth, node.child[0]));
        (block_start += ",");
        (block_start += node_to_cpp(depth, node.child[1]));
        (block_start += "] : ");
        (block_start += node_to_cpp(depth, node.child[2]));
        (block_start += ") ");
        node.child.splice(0,3);
        block_end = "";
      };
    };
    if ((node.value == "if") || (node.value == "while")) {
      block_start = node.value;
      (block_start += " ");
      let block_simple = (node.child[0].type != NODE_EXPR);
      if (block_simple) {
        (block_start += "(");
      };
      (block_start += node_to_cpp(depth, node.child[0]));
      if (block_simple) {
        (block_start += ")");
      };
      (block_start += " ");
      block_end = "";
      node.child.splice(0,1);
    };
    if (node.value == "do") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "break") {
      block_start = "break";
      block_end = "";
    };
    if (node.value == "?") {
      block_start = node_to_cpp(depth, node.child[0]);
      (block_start += " ? ");
      (block_start += node_to_cpp(depth, node.child[1]));
      (block_start += " : ");
      (block_start += node_to_cpp(depth, node.child[2]));
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "print") {
      block_start = "std::cout << ";
      block_end = " << std::endl";
    };
    if ((node.value == ">>") || ((node.value == "<<") || ((node.value == "=") || ((node.value == "&&") || ((node.value == "||") || ((node.value == ">=") || ((node.value == "<=") || ((node.value == "<>") || ((node.value == "+") || ((node.value == "-") || ((node.value == "*") || ((node.value == "/") || ((node.value == "^") || ((node.value == "%") || ((node.value == "&") || ((node.value == "|") || ((node.value == "~") || ((node.value == "<") || (node.value == ">"))))))))))))))))))) {
      block_start = "(";
      block_end = ")";
      if (node.value == "=") {
        node.value = "==";
      };
      if (node.value == "<>") {
        node.value = "!=";
      };
      if ((node.value == "<<") && (node.child[0].type == NODE_STR)) {
        node.value = "+=";
      };
      node.child.splice(1,0,node_new(NODE_STR, node.value));
    };
    if (node.value == "return") {
      block_start = "return ";
      block_end = "";
    };
    (s += block_start);
    for (let i = 0; (i < node.child.length); i += 1) {
      let node_child = node.child[i];
      let indent_needed = node_indent_needed(node, node_child);
      let indent_depth = indent_needed ? depth : (depth - 1);
      let indent = "  ";
      if (indent_needed) {
        (s += "\n");
        for (let i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        if (i > 0) {
          (s += block_seperator);
        };
      };
      let child = node_to_cpp(indent_depth, node_child);
      (s += child);
      if ((node.value == "") || ((node.value == "func") || ((node.value == "struct") || ((node.value == "do") || ((node.value == "then") || (node.value == "else")))))) {
        (s += ";");
      };
      if (indent_needed && (i == (node.child.length - 1))) {
        (s += "\n");
        for (let i = 0; (i < (indent_depth - 1)); i += 1) {
          (s += indent);
        };
      };
    };
    (s += block_end);
  };
  if (node.type != NODE_EXPR) {
    let value = node_to_cpp_preprocess(node);
    if (node.type == NODE_COMMENT) {
      value = "// ";
      (value += node.value);
    };
    (s += value);
  };
  return(s);
}
function node_to_c_preprocess(node) {
  let value = node.value;
  if (node.type == NODE_PREPROCESS) {
    value = "";
    for (let i = 1; (i < node.value.length); i += 1) {
      (value += node.value[i]);
    };
  };
  return(value);
}
function node_to_c_type(name, node, element_only) {
  let type = node.value;
  let suffix = "";
  if (node.value == "str") {
    type = "char*";
  };
  if (node.value == "vec") {
    type = node_to_c_type("", node.child[1], 0);
    if (name != "") {
      (suffix += "[");
      (suffix += node_to_c_preprocess(node.child[0]));
      (suffix += "]");
    } else {
      (type += "*");
    };
  };
  if (node.value == "arr") {
    type = node_to_c_type("", node.child[0], 0);
    if (!element_only) {
      (type += "*");
    };
  };
  if (node.value == "struct") {
    type = "struct ";
    (type += node.child[0].value);
    (type += "*");
  };
  if (type == "map") {
    type = "std::map<";
    (type += node_to_c_type("", node.child[0], 0));
    (type += ",");
    (type += node_to_c_type("", node.child[1], 0));
    (type += ">");
  };
  if (type == "func") {
    let return_type = "void";
    let params = "void";
    let i = 0;
    while (i < node.child.length) {
      let child_node = node.child[i];
      if (child_node.value == "param") {
        if (params == "void") {
          params = "";
        } else {
          (params += ", ");
        };
        let c_var = "";
        c_var = node_to_c_type(child_node.child[0].value, child_node.child[1], 0);
        (params += c_var);
        node.child.splice(i,1);
        i = (i - 1);
      };
      if (child_node.value == "result") {
        return_type = node_to_c_type("", child_node.child[0], 0);
        node.child.splice(i,1);
        i = (i - 1);
      };
      i = (i + 1);
    };
    let c_function = "";
    if (node.child.length > 0) {
      if (node.child[0].type == NODE_STR) {
        let func_name = node.child[0].value;
        if (func_name == "main") {
          func_name = "main_args";
          params = "char **args";
          return_type = "int";
        };
        (c_function += return_type);
        (c_function += " ");
        (c_function += func_name);
        (c_function += "(");
        (c_function += params);
        (c_function += ")");
      } else {
        (c_function += "[=](");
        (c_function += params);
        (c_function += ")");
      };
    } else {
      (c_function += return_type);
      (c_function += " (*");
      (c_function += name);
      (c_function += ")(");
      (c_function += params);
      (c_function += ")");
      name = "";
    };
    type = c_function;
  };
  let out = type;
  if (name != "") {
    (out += " ");
    (out += name);
    (out += suffix);
  };
  return(out);
}
function node_to_c_tostring(symbol, node, castint) {
  let node_type = node_symbol_node_type(symbol, node);
  if (node_type == NODE_TYPE_STR) {
    return("tostring_char_p");
  };
  if (node_type == NODE_TYPE_INT) {
    return(castint ? "tostring_int" : "tostring_char");
  };
  if (node_type == NODE_TYPE_FLOAT) {
    return("tostring_float");
  };
  return("tostring_unknown");
}
function node_to_c_length(symbol, node) {
  let node_type = node_symbol_node_type(symbol, node);
  if (node_type == NODE_TYPE_STR) {
    return("strlen");
  };
  return("ARRAY_LENGTH");
}
function node_to_c_has_keyword(node, keyword) {
  if (node.value == keyword) {
    return(1);
  };
  for (let i = 0; (i < node.child.length); i += 1) {
    if (node_to_c_has_keyword(node.child[i], keyword) != 0) {
      return(1);
    };
  };
  return(0);
}
function node_to_c(depth, parent_symbol, node) {
  let s = "";
  let symbol = node_symbol_scope_node(parent_symbol, node);
  depth = (depth + 1);
  node = node_copy(node);
  if (node.type == NODE_ROOT) {
    let has_main = 0;
    for (let i = 0; (i < node.child.length); i += 1) {
      if ((node.child[i].value == "func") && (node.child[i].child[0].value == "main")) {
        has_main = 1;
      };
    };
    if (node_to_c_has_keyword(node, "print") != 0) {
      (s += "#include <stdio.h>\n");
      (s += "#include <stdlib.h>\n");
      (s += "#include <string.h>\n");
      (s += "\n");
      (s += "char *tostring_char_p(char *value) { return value; }\n");
      (s += "char *tostring_char(int value) { static char buf[256]; sprintf(buf, \"%c\", value); return buf; }\n");
      (s += "char *tostring_int(int value) { static char buf[256]; sprintf(buf, \"%d\", value); return buf; }\n");
      (s += "char *tostring_float(float value) { static char buf[256]; sprintf(buf, \"%g\", value); return buf; }\n");
      (s += "char *tostring_double(double value) { static char buf[256]; sprintf(buf, \"%g\", value); return buf; }\n");
      (s += "void *STRING_ALLOC(char *str) {");
      (s += "  char *data = malloc(strlen(str) + 1);");
      (s += "  memcpy(data, str, strlen(str) + 1);");
      (s += "  return data;");
      (s += "}\n");
      (s += "char *STRING_APPEND(char *str, char *append) {");
      (s += "  char *data = realloc(str, strlen(str) + strlen(append) + 1);");
      (s += "  strcat(data, append);");
      (s += "  return data;");
      (s += "}\n");
    };
    if (has_main) {
      (s += "struct ARRAY_HEADER {");
      (s += "    int element_size;");
      (s += "    int element_count;");
      (s += "};\n");
      (s += "void *ARRAY_ALLOC(int element_size, int element_count) {");
      (s += "  struct ARRAY_HEADER *header = malloc(sizeof(struct ARRAY_HEADER) + (element_size * element_count));");
      (s += "  header->element_size = element_size;");
      (s += "  header->element_count = element_count;");
      (s += "  void *data = ((char *)header) + sizeof(struct ARRAY_HEADER);");
      (s += "  return data;");
      (s += "}\n");
      (s += "void *ARRAY_INSERT(void *data, int index) {");
      (s += "  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));");
      (s += "  header = realloc(header, sizeof(struct ARRAY_HEADER) + (header->element_size * (header->element_count + 1)));");
      (s += "  data = ((char *)header) + sizeof(struct ARRAY_HEADER);");
      (s += "  memmove((char *)data + ((index + 1) * header->element_size), (char *)data + (index * header->element_size), (header->element_count - index) * header->element_size);");
      (s += "  header->element_count = header->element_count + 1;");
      (s += "  return data;");
      (s += "}\n");
      (s += "void *ARRAY_REMOVE(void *data, int index, int count) {");
      (s += "  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));");
      (s += "  memmove((char *)data + (index * header->element_size), (char *)data + ((index + count) * header->element_size), (header->element_count - (index + count)) * header->element_size);");
      (s += "  header->element_count = header->element_count - count;");
      (s += "  header = realloc(header, sizeof(struct ARRAY_HEADER) + (header->element_size * header->element_count));");
      (s += "  data = (void *)((char *)header + sizeof(struct ARRAY_HEADER));");
      (s += "  return data;");
      (s += "}\n");
      (s += "void ARRAY_FREE(void *data) {");
      (s += "  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));");
      (s += "  free(header);");
      (s += "}\n");
      (s += "int ARRAY_LENGTH(void *data) {");
      (s += "  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));");
      (s += "  return header->element_count;");
      (s += "}\n");
    };
    (s += "\n\n");
    for (let i = 0; (i < node.child.length); i += 1) {
      let child = node_to_c(0, symbol, node.child[i]);
      (s += child);
      if (node.child[i].value == "let") {
        (s += ";");
      };
      (s += "\n");
    };
    if (has_main) {
      (s += "int main(int argc, char** argv) {\n");
      (s += "  char **args = ARRAY_ALLOC(sizeof(char *),argc);\n");
      (s += "  for (int i = 0; i < argc; i++) { args[i] = argv[i]; }\n");
      (s += "  return main_args(args);\n");
      (s += "};\n");
    };
  };
  if ((node.value == "+") || ((node.value == "&&") || (node.value == "||"))) {
    node = node_expand(node);
  };
  if (node.type == NODE_EXPR) {
    let block_start = "(";
    (block_start += node.value);
    let block_end = ")";
    let block_seperator = " ";
    if (node.value == "") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "@define") {
      block_start = "#define ";
      (block_start += node.child[0].value);
      (block_start += " ");
      (block_start += node.child[1].value);
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "@if") {
      block_start = "";
      block_end = "";
      if (node.child[0].value == "TARGET_C") {
        node.child.splice(0,1);
        node.child.splice(0,1);
      } else {
        while (node.child.length > 0) {
          node.child.splice(0,1);
        };
      };
    };
    if (node.value == "extern") {
      block_start = "";
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "asm") {
      let quotedline = node.child[0].value;
      let line = "";
      for (let j = 1; (j < (quotedline.length - 1)); j += 1) {
        if (quotedline[j] != 92) {
          (line += quotedline[j]);
        };
      };
      block_start = line;
      block_end = "\n";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "struct") {
      block_start = "struct ";
      (block_start += node.child[0].value);
      (block_start += " {");
      block_end = "};";
      node.child.splice(0,1);
    };
    if (node.value == "func") {
      block_start = node_to_c_type("", node, 0);
      (block_start += " {");
      block_end = "}";
      if (node.child[0].type == NODE_STR) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "call") {
      let fname_node = node.child[0];
      block_start = fname_node.value;
      (block_start += "(");
      block_end = ")";
      node.child.splice(0,1);
      block_seperator = ", ";
    };
    if ((node.value == "let") || (node.value == "local")) {
      let name = node.child[0].value;
      let type = node_to_c_type(name, node.child[1], 0);
      block_start = type;
      (block_start += " ");
      block_end = "";
      node.child.splice(0,1);
      node.child.splice(0,1);
      if (node.child.length == 1) {
        node.child.splice(0,0,node_new(NODE_STR, "="));
        if ((node.child[1].value == "alloc") && (node.child[1].child[0].value == "arr")) {
          for (let i = 1; (i < node.child[1].child.length); i += 1) {
            (block_end += ";");
            (block_end += name);
            (block_end += "[");
            (block_end += ""+(i - 1));
            (block_end += "]=");
            (block_end += node.child[1].child[i].value);
          };
        };
      };
    };
    if (node.value == "alloc") {
      block_start = "";
      block_end = "";
      if (node.child[0].value == "str") {
        let alloc_string = "\"\"";
        if (node.child.length > 1) {
          alloc_string = node.child[1].value;
        };
        block_start = "STRING_ALLOC(";
        (block_start += alloc_string);
        (block_start += ")");
      };
      if (node.child[0].type == NODE_EXPR) {
        if (node.child[0].value == "arr") {
          block_start = "ARRAY_ALLOC(sizeof(";
          (block_start += node_to_c_type("", node.child[0], 1));
          (block_start += "),");
          (block_start += ""+(node.child.length - 1));
          (block_start += ")");
        };
        if (node.child[0].value == "vec") {
          block_start = "{";
          for (let i = 1; (i < node.child.length); i += 1) {
            (block_start += node_to_c(depth, symbol, node.child[i]));
            if (i < (node.child.length - 1)) {
              (block_start += ",");
            };
          };
          (block_start += "}");
        };
        if (node.child[0].value == "struct") {
          block_start = "ARRAY_ALLOC(sizeof(struct ";
          (block_start += node.child[0].child[0].value);
          (block_start += "),1)");
        };
        if (node.child[0].value == "map") {
          block_start = "{}";
        };
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "free") {
      let array = node_to_c(depth, symbol, node.child[0]);
      block_start = "ARRAY_FREE(";
      (block_start += array);
      block_end = ")";
      node.child.splice(0,1);
    };
    if (node.value == "#") {
      block_start = node_to_c_length(symbol, node.child[0]);
      (block_start += "(");
      block_end = ")";
    };
    if (node.value == "insert") {
      let init = "";
      if ((node.child[2].value == "alloc") && (node.child[2].child[0].value == "arr")) {
        for (let i = 1; (i < node.child[2].child.length); i += 1) {
          (init += ";");
          (init += node.child[0].value);
          (init += "[");
          (init += node.child[1].value);
          (init += "]");
          (init += "[");
          (init += ""+(i - 1));
          (init += "]=");
          (init += node.child[2].child[i].value);
        };
      };
      let array = node_to_c(depth, symbol, node.child[0]);
      let position = node_to_c(depth, symbol, node.child[1]);
      let value = node_to_c(depth, symbol, node.child[2]);
      block_start = "{int __index__=";
      (block_start += position);
      (block_start += ";");
      (block_start += array);
      (block_start += "=ARRAY_INSERT(");
      (block_start += array);
      (block_start += ",__index__);");
      (block_start += array);
      (block_start += "[__index__]=");
      (block_start += value);
      (block_start += init);
      (block_start += ";}");
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "remove") {
      let array = node_to_c(depth, symbol, node.child[0]);
      let first = node_to_c(depth, symbol, node.child[1]);
      let last = node_to_c(depth, symbol, node.child[2]);
      block_start = array;
      (block_start += "=ARRAY_REMOVE(");
      (block_start += array);
      (block_start += ",");
      (block_start += first);
      (block_start += ",");
      (block_start += last);
      block_end = ")";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "slice") {
      block_start = node_to_c(depth, symbol, node.child[0]);
      (block_start += ".substr(");
      (block_start += node_to_c(depth, symbol, node.child[1]));
      (block_start += ",");
      (block_start += node_to_c(depth, symbol, node.child[2]));
      block_end = ")";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "get") {
      block_start = node_to_c(depth, symbol, node.child[0]);
      block_end = "";
      for (let i = 1; (i < node.child.length); i += 1) {
        let child = node.child[i];
        if ((child.type == NODE_STR) && (child.value.length > 1)) {
          (block_end += "->");
          (block_end += node_to_c(depth, symbol, node.child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_c(depth, symbol, node.child[i]));
          (block_end += "]");
        };
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "set") {
      block_start = node_to_c(depth, symbol, node.child[0]);
      block_end = "";
      let n = (node.child.length - 1);
      for (let i = 1; (i < n); i += 1) {
        let child = node.child[i];
        if ((child.type == NODE_STR) && (child.value.length > 1)) {
          (block_end += "->");
          (block_end += node_to_c(depth, symbol, node.child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_c(depth, symbol, node.child[i]));
          (block_end += "]");
        };
      };
      (block_end += " = ");
      let node_type = node_symbol_node_type(symbol, node.child[n]);
      if (node_type == NODE_TYPE_STR) {
        (block_end += "STRING_ALLOC(");
      };
      (block_end += node_to_c(depth, symbol, node.child[n]));
      if (node_type == NODE_TYPE_STR) {
        (block_end += ")");
      };
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "cast") {
      if (node.child[1].value == "str") {
        block_start = "tostring_int(";
        (block_start += node_to_c(depth, symbol, node.child[0]));
        block_end = ")";
      };
      if (node.child[1].value == "int") {
        block_start = "(int)";
        block_end = node_to_c(depth, symbol, node.child[0]);
      };
      node.child.splice(0,1);
      node.child.splice(0,1);
    };
    if (node.value == "then") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "else") {
      block_start = "else {";
      block_end = "}";
    };
    if (node.value == "for") {
      if (node.child.length == 5) {
        block_start = "for (int ";
        (block_start += node_to_c(depth, symbol, node.child[0]));
        (block_start += " = ");
        (block_start += node_to_c(depth, symbol, node.child[1]));
        (block_start += "; ");
        (block_start += node_to_c(depth, symbol, node.child[2]));
        (block_start += "; ");
        (block_start += node_to_c(depth, symbol, node.child[0]));
        (block_start += " += ");
        (block_start += node_to_c(depth, symbol, node.child[3]));
        (block_start += ") ");
        node.child.splice(0,4);
        block_end = "";
      };
      if (node.child.length == 4) {
        block_start = "for (const auto &[";
        (block_start += node_to_c(depth, symbol, node.child[0]));
        (block_start += ",");
        (block_start += node_to_c(depth, symbol, node.child[1]));
        (block_start += "] : ");
        (block_start += node_to_c(depth, symbol, node.child[2]));
        (block_start += ") ");
        node.child.splice(0,3);
        block_end = "";
      };
    };
    if ((node.value == "if") || (node.value == "while")) {
      block_start = node.value;
      (block_start += " ");
      let block_simple = (node.child[0].type != NODE_EXPR);
      if (block_simple) {
        (block_start += "(");
      };
      (block_start += node_to_c(depth, symbol, node.child[0]));
      if (block_simple) {
        (block_start += ")");
      };
      (block_start += " ");
      block_end = "";
      node.child.splice(0,1);
    };
    if (node.value == "do") {
      block_start = "{";
      block_end = "}";
    };
    if (node.value == "break") {
      block_start = "break";
      block_end = "";
    };
    if (node.value == "?") {
      block_start = node_to_c(depth, symbol, node.child[0]);
      (block_start += " ? ");
      (block_start += node_to_c(depth, symbol, node.child[1]));
      (block_start += " : ");
      (block_start += node_to_c(depth, symbol, node.child[2]));
      block_end = "";
      while (node.child.length > 0) {
        node.child.splice(0,1);
      };
    };
    if (node.value == "print") {
      block_start = "puts(";
      (block_start += node_to_c_tostring(symbol, node.child[0], 1));
      (block_start += "(");
      block_end = "))";
    };
    if ((node.value == ">>") || ((node.value == "<<") || ((node.value == "=") || ((node.value == "&&") || ((node.value == "||") || ((node.value == ">=") || ((node.value == "<=") || ((node.value == "<>") || ((node.value == "+") || ((node.value == "-") || ((node.value == "*") || ((node.value == "/") || ((node.value == "^") || ((node.value == "%") || ((node.value == "&") || ((node.value == "|") || ((node.value == "~") || ((node.value == "<") || (node.value == ">"))))))))))))))))))) {
      block_start = "(";
      block_end = ")";
      if (node.value == "=") {
        if ((node.child[0].type == NODE_STR_QUOTE) || (node.child[1].type == NODE_STR_QUOTE)) {
          block_start = "(strcmp(";
          block_end = ") == 0 ? 1 : 0)";
          node.value = ",";
        } else {
          node.value = "==";
        };
      };
      if (node.value == "<>") {
        node.value = "!=";
      };
      if ((node.value == "<<") && (node.child[0].type == NODE_STR)) {
        block_start = node.child[0].value;
        (block_start += "=");
        (block_start += "STRING_APPEND(");
        (block_start += node_to_c(depth, symbol, node.child[0]));
        (block_start += ",");
        (block_start += node_to_c_tostring(symbol, node.child[1], 0));
        (block_start += "(");
        (block_start += node_to_c(depth, symbol, node.child[1]));
        block_end = "))";
        while (node.child.length > 0) {
          node.child.splice(0,1);
        };
      } else {
        node.child.splice(1,0,node_new(NODE_STR, node.value));
      };
    };
    if (node.value == "return") {
      block_start = "return ";
      block_end = "";
    };
    (s += block_start);
    for (let i = 0; (i < node.child.length); i += 1) {
      let node_child = node.child[i];
      let indent_needed = node_indent_needed(node, node_child);
      let indent_depth = indent_needed ? depth : (depth - 1);
      let indent = "  ";
      if (indent_needed) {
        (s += "\n");
        for (let i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        if (i > 0) {
          (s += block_seperator);
        };
      };
      let child = node_to_c(indent_depth, symbol, node_child);
      (s += child);
      if ((node.value == "") || ((node.value == "func") || ((node.value == "struct") || ((node.value == "do") || ((node.value == "then") || (node.value == "else")))))) {
        (s += ";");
      };
      if (indent_needed && (i == (node.child.length - 1))) {
        (s += "\n");
        for (let i = 0; (i < (indent_depth - 1)); i += 1) {
          (s += indent);
        };
      };
    };
    (s += block_end);
  };
  if (node.type != NODE_EXPR) {
    let value = node_to_c_preprocess(node);
    if (node.type == NODE_COMMENT) {
      value = "// ";
      (value += node.value);
    };
    (s += value);
  };
  return(s);
}
function compile(target, filename) {
  let prog = readfile(filename);
  let out = "";
  let tokens = token_parse(prog, filename, 0);
  let root = node_from_tokens(tokens);
  root = preprocess(root);
  root = preprocess_vdom(root);
  if (target == "--target=wax") {
    out = node_to_wax(0, root);
  };
  if (target == "--target=js") {
    out = node_to_js(0, root);
  };
  if (target == "--target=cpp") {
    out = node_to_cpp(0, root);
  };
  if (target == "--target=c") {
    let symbol = [];
    out = node_to_c(0, symbol, root);
  };
  return(out);
}
function format(filename) {
  let prog = readfile(filename);
  let tokens = token_parse(prog, filename, 1);
  let root = node_from_tokens(tokens);
  let out = node_to_wax(0, root);
  return(out);
}
function help() {
  let lines = ["usage: \n\n","  wax <command> [arguments]\n\n","commands: \n\n","  build <--target=wax|--target=js|--target=cpp|--target=c> <filename.wax>\n","  fmt <filename.wax>\n"];
  let help = "";
  for (let i = 0; (i < lines.length); i += 1) {
    (help += lines[i]);
  };
  return(help);
}
function main(args) {
  if (args.length < 3) {
    console.log(help());
    return(1);
  };
  if ((args.length == 4) && (args[1] == "build")) {
    let out = compile(args[2], args[3]);
    console.log(out);
    return(0);
  };
  if ((args.length == 3) && (args[1] == "fmt")) {
    console.log(format(args[2]));
    return(0);
  };
  console.log(help());
  return(0);
}
(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));

