#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <array>
#include <map>
#include <functional>
template<typename T> std::string tostring(const T& x) {
  std::stringstream ss;
  ss << x;
  return ss.str();
}


#define TOKEN_CHAR_TAB '\t'
#define TOKEN_CHAR_NL '\n'
#define TOKEN_CHAR_CR '\r'
#define TOKEN_CHAR_SPACE ' '
#define TOKEN_CHAR_DOUBLE_QUOTE '"'
#define TOKEN_CHAR_SINGLE_QUOTE '\''
#define TOKEN_CHAR_PAREN_OPEN '('
#define TOKEN_CHAR_PAREN_CLOSE ')'
#define TOKEN_CHAR_SEMICOLON ';'
#define TOKEN_CHAR_BACKSLASH '\\'
#define TOKEN_TYPE_NORMAL 0
#define TOKEN_TYPE_PAREN 1
#define TOKEN_TYPE_COMMENT 2
struct token_file {
  std::string name;
};
struct token {
  int type;
  std::string value;
  struct token_file* file;
  int newlines;
  int linenumber;
};
struct token* token_new(int type, std::string value, struct token_file* file, int newlines, int linenumber) {
  struct token* t = new token();
  t->type = type;
  t->value = value;
  t->file = file;
  t->newlines = newlines;
  t->linenumber = linenumber;
  return t;
}
std::vector<struct token*> token_parse(std::string input, std::string filename, int comments) {
  struct token_file* file = new token_file();
  file->name = filename;
  std::string token = "";
  std::vector<struct token*> tokens = std::vector<struct token*>();
  int newlines = 0;
  int linenumber = 1;
  int in_comment = 0;
  int in_single_quote = 0;
  int in_double_quote = 0;
  int in_quote = 0;
  int in_quote_escape = 0;
  for (int i = 0; (i < input.size()); i += 1) {
    int c = input[i];
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
            tokens.insert(tokens.begin()+tokens.size(),token_new(TOKEN_TYPE_COMMENT, token, file, newlines, linenumber));
            newlines = 0;
          };
          token = "";
        };
        in_comment = 0;
      };
    };
    int whitespace = ((c == TOKEN_CHAR_TAB) || ((c == TOKEN_CHAR_SPACE) || ((c == TOKEN_CHAR_NL) || (c == TOKEN_CHAR_CR))));
    int paren = ((c == TOKEN_CHAR_PAREN_OPEN) || (c == TOKEN_CHAR_PAREN_CLOSE));
    if ((!in_quote) && ((!in_comment) && (whitespace || paren))) {
      if (token.size() > 0) {
        tokens.insert(tokens.begin()+tokens.size(),token_new(TOKEN_TYPE_NORMAL, token, file, newlines, linenumber));
        newlines = 0;
      };
      if (paren) {
        token = "";
        (token += input[i]);
        tokens.insert(tokens.begin()+tokens.size(),token_new(TOKEN_TYPE_PAREN, token, file, newlines, linenumber));
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
  return tokens;
}
void token_write_to_output(std::vector<struct token*>& tokens) {
  std::cout << "count:" << std::endl;
  std::cout << tokens.size() << std::endl;
  std::cout << "" << std::endl;
  for (int i = 0; (i < tokens.size()); i += 1) {
    std::cout << tokens[i]->value << std::endl;
  };
}
std::string token_to_string(std::vector<struct token*>& tokens, int width) {
  std::string s = "";
  std::string line = "";
  for (int i = 0; (i < tokens.size()); i += 1) {
    std::string token = "";
    for (int j = 0; (j < tokens[i]->value.size()); j += 1) {
      int c = tokens[i]->value[j];
      std::string encoded = "";
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
    if (line.size() > width) {
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
  return s;
}
#define NODE_ROOT 0
#define NODE_EXPR 1
#define NODE_PREPROCESS 2
#define NODE_CHAR 3
#define NODE_STR 4
#define NODE_STR_QUOTE 5
#define NODE_INT 6
#define NODE_FLOAT 7
#define NODE_COMMENT 8
struct node {
  int type;
  std::string value;
  std::vector<struct node*> child;
  struct token* token;
};
struct node* node_new(int type, std::string value) {
  struct node* node_new = new node();
  node_new->type = type;
  node_new->value = value;
  node_new->child = std::vector<struct node*>();
  node_new->token = new token();
  return node_new;
}
struct node* node_copy(struct node* src) {
  struct node* res = new node();
  res->type = src->type;
  res->value = src->value;
  res->child = std::vector<struct node*>();
  for (int i = 0; (i < src->child.size()); i += 1) {
    res->child.insert(res->child.begin()+i,node_copy(src->child[i]));
  };
  res->token = src->token;
  return res;
}
#define NODE_CHAR_DOUBLE_QUOTE '"'
#define NODE_CHAR_SINGLE_QUOTE '\''
#define NODE_CHAR_MINUS '-'
#define NODE_CHAR_DECIMAL '.'
#define NODE_CHAR_ZERO '0'
#define NODE_CHAR_NINE '9'
#define NODE_CHAR_AT '@'
int node_type_from_token(std::string token) {
  if (token.size() > 0) {
    int c = token[0];
    if (c == NODE_CHAR_AT) {
      return NODE_PREPROCESS;
    };
    if (c == NODE_CHAR_SINGLE_QUOTE) {
      return NODE_CHAR;
    };
    if (c == NODE_CHAR_DOUBLE_QUOTE) {
      return NODE_STR_QUOTE;
    };
    if (((c >= NODE_CHAR_ZERO) && (c <= NODE_CHAR_NINE)) || (c == NODE_CHAR_MINUS)) {
      for (int i = 0; (i < token.size()); i += 1) {
        c = token[i];
        if (c == NODE_CHAR_DECIMAL) {
          return NODE_FLOAT;
        };
      };
      return NODE_INT;
    };
  };
  return NODE_STR;
}
struct node* node_from_tokens(std::vector<struct token*>& tokens) {
  std::vector<struct node*> stack = std::vector<struct node*>();
  stack.insert(stack.begin()+stack.size(),node_new(NODE_ROOT, ""));
  int i = 0;
  while (i < tokens.size()) {
    std::string token = tokens[i]->value;
    if (tokens[i]->type == TOKEN_TYPE_COMMENT) {
      struct node* child = node_new(NODE_COMMENT, token);
      child->token = tokens[i];
      struct node* node = stack[(stack.size() - 1)];
      node->child.insert(node->child.begin()+node->child.size(),child);
    } else {
      if (token == "(") {
        std::string value = "";
        std::string next_token = tokens[(i + 1)]->value;
        if ((next_token != "(") && (next_token != ")")) {
          value = next_token;
        };
        struct node* node = node_new(NODE_EXPR, value);
        node->token = tokens[i];
        if (value != "") {
          i = (i + 1);
        };
        struct node* parent = stack[(stack.size() - 1)];
        parent->child.insert(parent->child.begin()+parent->child.size(),node);
        stack.insert(stack.begin()+stack.size(),node);
      } else {
        if (token == ")") {
          stack.erase(stack.begin()+(stack.size() - 1),stack.begin()+(stack.size() - 1)+1);
        } else {
          struct node* child = node_new(node_type_from_token(token), token);
          child->token = tokens[i];
          struct node* node = stack[(stack.size() - 1)];
          node->child.insert(node->child.begin()+node->child.size(),child);
        };
      };
    };
    i = (i + 1);
  };
  return stack[0];
}
struct node* node_expand(struct node* node_org) {
  if (node_org->child.size() < 2) {
    return node_org;
  };
  struct node* expanded = node_new(NODE_EXPR, node_org->value);
  expanded->child.insert(expanded->child.begin()+expanded->child.size(),node_org->child[0]);
  if (node_org->child.size() == 2) {
    expanded->child.insert(expanded->child.begin()+expanded->child.size(),node_org->child[1]);
  } else {
    struct node* expanded_child = node_new(NODE_EXPR, node_org->value);
    for (int i = 1; (i < node_org->child.size()); i += 1) {
      expanded_child->child.insert(expanded_child->child.begin()+expanded_child->child.size(),node_org->child[i]);
    };
    expanded->child.insert(expanded->child.begin()+expanded->child.size(),expanded_child);
  };
  return expanded;
}
int node_indent_needed(struct node* node, struct node* child) {
  if (child->type != NODE_EXPR) {
    return 0;
  };
  if ((child->value == "param") || (child->value == "result")) {
    return 0;
  };
  if ((node->value == "") || ((node->value == "func") || ((node->value == "do") || ((node->value == "then") || ((node->value == "else") || (node->value == "struct")))))) {
    return 1;
  };
  return 0;
}
int node_to_wax_indent = 0;
std::string node_to_str(int depth, struct node* node) {
  std::string s = "";
  if (node->type == NODE_ROOT) {
    for (int i = 0; (i < node->child.size()); i += 1) {
      std::string child = node_to_str(0, node->child[i]);
      for (int j = 0; (j < node->child[i]->token->newlines); j += 1) {
        (s += "\n");
      };
      (s += child);
    };
  };
  if (node->type == NODE_EXPR) {
    (s += "(");
    (s += node->value);
    for (int i = 0; (i < node->child.size()); i += 1) {
      struct node* node_child = node->child[i];
      int indent_needed = (node_child->type == NODE_EXPR);
      if (node_to_wax_indent) {
        indent_needed = node_indent_needed(node, node_child);
        indent_needed = (indent_needed || ((node->value == "&&") || (node->value == "||")));
      };
      indent_needed = (node_child->token->newlines > 0);
      int indent_depth = indent_needed ? depth : (depth - 1);
      std::string indent = "\t";
      if (indent_needed) {
        for (int i = 0; (i < node_child->token->newlines); i += 1) {
          (s += "\n");
        };
        for (int i = 0; (i <= indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        (s += " ");
      };
      std::string child = node_to_str((indent_depth + 1), node_child);
      (s += child);
      if (indent_needed && (i == (node->child.size() - 1))) {
        (s += "\n");
        for (int i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      };
    };
    (s += ")");
  };
  if (node->type != NODE_EXPR) {
    (s += node->value);
  };
  return s;
}
std::string node_to_wax(int depth, struct node* node) {
  node_to_wax_indent = 1;
  return node_to_str(depth, node);
}



void error_exit(std::string msg) { std::cerr << msg; exit(1); }


void compile_error(std::string module, struct node* node, std::string msg) {
  std::string out = module;
  (out += " error: ");
  (out += node->token->file->name);
  (out += ", line ");
  (out += tostring(node->token->linenumber));
  (out += "\n  ");
  (out += msg);
  (out += "\n\n");
  error_exit(out);
}
#define MODULE_SYMBOL "Symbol"
struct node_symbol {
  std::string name;
  struct node* node;
};
std::string dump_symbol(std::vector<struct node_symbol*>& symbol) {
  std::string s = "";
  for (int i = 0; (i < symbol.size()); i += 1) {
    (s += " ");
    (s += symbol[i]->name);
  };
  return s;
}
std::vector<struct node_symbol*> node_symbol_scope_node(std::vector<struct node_symbol*>& symbol, struct node* node) {
  std::vector<struct node_symbol*> copy_symbol = std::vector<struct node_symbol*>();
  for (int i = 0; (i < symbol.size()); i += 1) {
    struct node_symbol* s = new node_symbol();
    s->name = symbol[i]->name;
    s->node = symbol[i]->node;
    copy_symbol.insert(copy_symbol.begin()+copy_symbol.size(),s);
  };
  for (int i = 0; (i < node->child.size()); i += 1) {
    struct node* child = node->child[i];
    if ((child->value == "struct") || ((child->value == "func") || ((child->value == "let") || ((child->value == "param") || (child->value == "for"))))) {
      struct node_symbol* s = new node_symbol();
      s->name = child->child[0]->value;
      s->node = child;
      copy_symbol.insert(copy_symbol.begin()+copy_symbol.size(),s);
    };
  };
  return copy_symbol;
}
struct node* node_symbol_get_node(std::vector<struct node_symbol*>& symbol, std::string type, struct node* node) {
  for (int i = (symbol.size() - 1); (i >= 0); i += -1) {
    if (symbol[i]->name == node->value) {
      if ((type == "") || (type == symbol[i]->node->value)) {
        return symbol[i]->node;
      };
    };
  };
  compile_error(MODULE_SYMBOL, node, "symbol not found");
  return symbol[0]->node;
}
#define NODE_TYPE_NONE 0
#define NODE_TYPE_STR 1
#define NODE_TYPE_INT 2
#define NODE_TYPE_FLOAT 3
#define NODE_TYPE_VEC 4
#define NODE_TYPE_ARRAY 5
struct node* node_symbol_node_type_src(std::vector<struct node_symbol*>& symbol, struct node* node) {
  if ((node->type == NODE_PREPROCESS) || ((node->type == NODE_STR_QUOTE) || ((node->type == NODE_CHAR) || ((node->type == NODE_INT) || ((node->type == NODE_FLOAT) || ((node->value == "str") || ((node->value == "int") || (node->value == "float")))))))) {
    return node;
  };
  if (node->type == NODE_STR) {
    struct node* symbol_node = node_symbol_get_node(symbol, "", node);
    if (symbol_node->value == "func") {
      return node;
    };
    if ((symbol_node->value == "let") || ((symbol_node->value == "param") || (symbol_node->value == "for"))) {
      return node_symbol_node_type_src(symbol, symbol_node->child[1]);
    };
  };
  if (node->type == NODE_EXPR) {
    if (node->value == "=") {
      return node;
    };
    if (node->value == "#") {
      return node;
    };
    if (node->value == "vec") {
      return node;
    };
    if (node->value == "arr") {
      return node;
    };
    if (node->value == "struct") {
      return node;
    };
    if (node->value == "cast") {
      return node->child[1];
    };
    if (node->value == "?") {
      return node->child[1];
    };
    if (node->value == "call") {
      struct node* symbol_node = node_symbol_get_node(symbol, "", node->child[0]);
      for (int i = 1; (i < symbol_node->child.size()); i += 1) {
        if (symbol_node->child[i]->value == "result") {
          return symbol_node->child[i]->child[0];
        };
      };
      compile_error(MODULE_SYMBOL, node, "function result not found");
    };
    if (node->value == "get") {
      struct node* target_node;
      if (node->child[0]->type == NODE_STR) {
        struct node* symbol_node = node_symbol_get_node(symbol, "", node->child[0]);
        if ((symbol_node->value != "let") && (symbol_node->value != "param")) {
          compile_error(MODULE_SYMBOL, node, "symbol not variable");
        };
        target_node = symbol_node->child[1];
      } else {
        if (node->child[0]->value == "get") {
          struct node* get_node_type = node_symbol_node_type_src(symbol, node->child[0]);
          target_node = get_node_type;
        } else {
          compile_error(MODULE_SYMBOL, node, "bad get expression");
        };
      };
      for (int i = 1; (i < node->child.size()); i += 1) {
        if (target_node->value == "vec") {
          target_node = target_node->child[1];
        } else {
          if (target_node->value == "arr") {
            target_node = target_node->child[0];
          } else {
            if (target_node->value == "str") {
              return node_new(NODE_TYPE_INT, "");
            } else {
              if (target_node->value == "struct") {
                struct node* symbol_node = node_symbol_get_node(symbol, "struct", target_node->child[0]);
                int found = 0;
                for (int j = 1; (j < symbol_node->child.size()); j += 1) {
                  if ((symbol_node->child[j]->value == "let") && (symbol_node->child[j]->child[0]->value == node->child[i]->value)) {
                    target_node = symbol_node->child[j]->child[1];
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
      return node_symbol_node_type_src(symbol, target_node);
    };
    return node_symbol_node_type_src(symbol, node->child[0]);
  };
  compile_error(MODULE_SYMBOL, node, "source node not established");
  return node;
}
int node_symbol_node_type(std::vector<struct node_symbol*>& symbol, struct node* node) {
  struct node* src_node = node_symbol_node_type_src(symbol, node);
  if (src_node->type == NODE_PREPROCESS) {
    return NODE_PREPROCESS;
  };
  if (src_node->type == NODE_STR_QUOTE) {
    return NODE_TYPE_STR;
  };
  if (src_node->type == NODE_CHAR) {
    return NODE_TYPE_INT;
  };
  if (src_node->type == NODE_INT) {
    return NODE_TYPE_INT;
  };
  if (src_node->type == NODE_FLOAT) {
    return NODE_TYPE_FLOAT;
  };
  if (src_node->value == "=") {
    return NODE_TYPE_INT;
  };
  if (src_node->value == "#") {
    return NODE_TYPE_INT;
  };
  if (src_node->value == "str") {
    return NODE_TYPE_STR;
  };
  if (src_node->value == "int") {
    return NODE_TYPE_INT;
  };
  if (src_node->value == "float") {
    return NODE_TYPE_FLOAT;
  };
  if (src_node->value == "call") {
    return NODE_TYPE_INT;
  };
  return NODE_TYPE_NONE;
}



#include <fstream>
 #include <streambuf>
 std::string readfile(std::string filename) {
   std::ifstream t(filename);
   std::string str((std::istreambuf_iterator<char>(t)), std::istreambuf_iterator<char>());
   return str;
 }



#define MODULE_PREPROCESS "Preprocess"
#define PREPROCESS_CHAR_STOP '.'
#define PREPROCESS_CHAR_SLASH '/'
#define PREPROCESS_CHAR_UNDERSCORE '_'
void preprocess_replace_node(struct node* node, std::map<std::string,struct node*>& define) {
  if (node->type == NODE_PREPROCESS) {
    std::string k = "";
    for (int i = 1; (i < node->value.size()); i += 1) {
      (k += node->value[i]);
    };
    struct node* replace = define[k]->child[1];
    node->type = replace->type;
    node->value = replace->value;
  };
  for (int i = 0; (i < node->child.size()); i += 1) {
    preprocess_replace_node(node->child[i], define);
  };
}
struct node* preprocess_replace(struct node* node) {
  std::map<std::string,struct node*> define = {};
  int i = 0;
  while (i < node->child.size()) {
    if (node->child[i]->value == "@define") {
      define[node->child[i]->child[0]->value] = node->child[i];
      node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
    } else {
      preprocess_replace_node(node->child[i], define);
      i = (i + 1);
    };
  };
  return node;
}
void preprocess_package_rewrite_identifier(std::string package, std::map<std::string,int>& identifier, struct node* node) {
  std::string v = node->value;
  if (node->type == NODE_PREPROCESS) {
    v.erase(v.begin()+0,v.begin()+0+1);
  };
  if (identifier[v] == 1) {
    std::string value;
    if (node->type == NODE_PREPROCESS) {
      value = "@";
    };
    (value += "__");
    (value += package);
    (value += "__");
    (value += v);
    node->value = value;
  };
  for (int i = 0; (i < node->child.size()); i += 1) {
    preprocess_package_rewrite_identifier(package, identifier, node->child[i]);
  };
}
void preprocess_package_rewrite(std::string package, struct node* node) {
  std::map<std::string,int> identifier = {};
  for (int i = 0; (i < node->child.size()); i += 1) {
    if ((node->child[i]->value == "@define") || ((node->child[i]->value == "func") || (node->child[i]->value == "struct"))) {
      identifier[node->child[i]->child[0]->value] = 1;
    };
  };
  preprocess_package_rewrite_identifier(package, identifier, node);
}
std::array<std::string,3> preprocess_package_from_path(std::string pathprefix, struct node* node) {
  std::string package = "";
  std::string filename = "";
  std::string basepath = "";
  std::string quotedfilename = node->child[0]->value;
  if (node->child.size() == 2) {
    for (int i = 1; (i < (node->child[0]->value.size() - 1)); i += 1) {
      (package += node->child[0]->value[i]);
    };
    quotedfilename = node->child[1]->value;
  };
  int start = 0;
  int end = quotedfilename.size();
  for (int i = 0; (i < quotedfilename.size()); i += 1) {
    if (quotedfilename[i] == PREPROCESS_CHAR_SLASH) {
      start = (i + 1);
    };
    if (quotedfilename[i] == PREPROCESS_CHAR_STOP) {
      end = i;
    };
  };
  if (node->child.size() == 1) {
    for (int i = start; (i < end); i += 1) {
      (package += quotedfilename[i]);
    };
  };
  for (int i = 0; (i < pathprefix.size()); i += 1) {
    (filename += pathprefix[i]);
  };
  for (int i = 1; (i < (quotedfilename.size() - 1)); i += 1) {
    (filename += quotedfilename[i]);
  };
  for (int i = 0; (i < pathprefix.size()); i += 1) {
    (basepath += pathprefix[i]);
  };
  for (int i = 1; (i < start); i += 1) {
    (basepath += quotedfilename[i]);
  };
  return {package,filename,basepath};
}
void preprocess_include_import(std::string basepath, struct node* node) {
  int i = 0;
  while (i < node->child.size()) {
    if ((node->child[i]->value == "@include") || (node->child[i]->value == "@import")) {
      std::array<std::string,3> res = preprocess_package_from_path(basepath, node->child[i]);
      std::string package = res[0];
      std::string filename = res[1];
      std::string prefix = res[2];
      std::string include_str = readfile(filename);
      if (include_str.size() == 0) {
        std::string err = "Cannot open file: ";
        (err += filename);
        compile_error(MODULE_PREPROCESS, node->child[i], err);
      };
      std::vector<struct token*> tokens = token_parse(include_str, filename, 0);
      struct node* include = node_from_tokens(tokens);
      preprocess_include_import(prefix, include);
      if (node->child[i]->value == "@import") {
        preprocess_package_rewrite(package, include);
      };
      node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
      for (int j = 0; (j < include->child.size()); j += 1) {
        node->child.insert(node->child.begin()+(i + j),include->child[j]);
      };
      i = (i + include->child.size());
    } else {
      i = (i + 1);
    };
  };
}
void preprocess_identifier_rewrite(struct node* node) {
  if (node->type == NODE_STR) {
    for (int i = 0; (i < node->value.size()); i += 1) {
      if (node->value[i] == PREPROCESS_CHAR_STOP) {
        node->value.erase(node->value.begin()+i,node->value.begin()+i+1);
        node->value.insert(node->value.begin()+i,PREPROCESS_CHAR_UNDERSCORE);
        node->value.insert(node->value.begin()+i,PREPROCESS_CHAR_UNDERSCORE);
        node->value.insert(node->value.begin()+0,PREPROCESS_CHAR_UNDERSCORE);
        node->value.insert(node->value.begin()+0,PREPROCESS_CHAR_UNDERSCORE);
      };
    };
  };
  if (node->type == NODE_PREPROCESS) {
    for (int i = 0; (i < node->value.size()); i += 1) {
      if (node->value[i] == PREPROCESS_CHAR_STOP) {
        node->value.erase(node->value.begin()+i,node->value.begin()+i+1);
        node->value.insert(node->value.begin()+i,PREPROCESS_CHAR_UNDERSCORE);
        node->value.insert(node->value.begin()+i,PREPROCESS_CHAR_UNDERSCORE);
        node->value.insert(node->value.begin()+1,PREPROCESS_CHAR_UNDERSCORE);
        node->value.insert(node->value.begin()+1,PREPROCESS_CHAR_UNDERSCORE);
      };
    };
  };
  for (int i = 0; (i < node->child.size()); i += 1) {
    preprocess_identifier_rewrite(node->child[i]);
  };
}
struct node* preprocess(struct node* node) {
  preprocess_include_import("", node);
  preprocess_identifier_rewrite(node);
  return node;
}
std::string preprocess_vdom_quote(std::string value) {
  std::string out = "";
  (out += "\"");
  (out += value);
  (out += "\"");
  return out;
}
int preprocess_vdom_isaction(std::string type) {
  if ((type == "do") || ((type == "then") || (type == "else"))) {
    return 1;
  };
  return 0;
}
int preprocess_vdom_reserverd(std::string type) {
  if ((type == "let") || ((type == "set") || ((type == "<<") || ((type == "if") || ((type == "else") || ((type == "for") || ((type == "while") || (type == "do")))))))) {
    return 1;
  };
  return 0;
}
struct node* preprocess_vdom_element(struct node* node) {
  struct node* out = node_new(NODE_EXPR, "call");
  out->child.insert(out->child.begin()+0,node_new(NODE_STR, "__vdom__element_new"));
  out->child.insert(out->child.begin()+1,node_new(NODE_STR_QUOTE, preprocess_vdom_quote(node->value)));
  return out;
}
std::vector<struct node*> preprocess_vdom_element_child(int depth, std::string name, struct node* node) {
  std::vector<struct node*> out = std::vector<struct node*>();
  int i = 0;
  while (i < node->child.size()) {
    std::string type = "";
    if (node->child[i]->type == NODE_STR) {
      type = "attr";
      if ((node->child[(i + 1)]->type == NODE_EXPR) && (node->child[(i + 1)]->value == "func")) {
        type = "event";
      };
    };
    if (node->child[i]->type == NODE_EXPR) {
      type = "element";
      if (node->child[i]->value == "child") {
        type = "child";
      };
      if (preprocess_vdom_reserverd(node->child[i]->value) != 0) {
        type = "reserved";
      };
    };
    if ((type == "attr") || (type == "event")) {
      struct node* attr_set = node_new(NODE_EXPR, "set");
      attr_set->token->newlines = 1;
      attr_set->child.insert(attr_set->child.begin()+0,node_new(NODE_STR, name));
      attr_set->child.insert(attr_set->child.begin()+1,node_new(NODE_STR, type));
      attr_set->child.insert(attr_set->child.begin()+2,node_new(NODE_STR_QUOTE, preprocess_vdom_quote(node->child[i]->value)));
      if ((type == "event") || (node->child[(i + 1)]->type == NODE_STR_QUOTE)) {
        attr_set->child.insert(attr_set->child.begin()+3,node->child[(i + 1)]);
      } else {
        struct node* value = node_new(NODE_EXPR, "cast");
        value->child.insert(value->child.begin()+0,node->child[(i + 1)]);
        value->child.insert(value->child.begin()+1,node_new(NODE_STR, "str"));
        attr_set->child.insert(attr_set->child.begin()+3,value);
      };
      out.insert(out.begin()+out.size(),attr_set);
      i = (i + 1);
    };
    if (type == "reserved") {
      std::vector<struct node*> child = node->child[i]->child;
      node->child[i]->child = std::vector<struct node*>();
      for (int j = 0; (j < child.size()); j += 1) {
        if ((child[j]->type == NODE_EXPR) && preprocess_vdom_isaction(child[j]->value)) {
          struct node* action_node = node_new(NODE_EXPR, child[j]->value);
          std::vector<struct node*> element_child = preprocess_vdom_element_child((depth + 1), name, child[j]);
          for (int k = 0; (k < element_child.size()); k += 1) {
            action_node->child.insert(action_node->child.begin()+action_node->child.size(),element_child[k]);
          };
          node->child[i]->child.insert(node->child[i]->child.begin()+node->child[i]->child.size(),action_node);
        } else {
          node->child[i]->child.insert(node->child[i]->child.begin()+node->child[i]->child.size(),child[j]);
        };
      };
      out.insert(out.begin()+out.size(),node->child[i]);
    };
    if (type == "child") {
      struct node* element_insert = node_new(NODE_EXPR, "insert");
      element_insert->token->newlines = 1;
      element_insert->token->newlines = 1;
      struct node* element_insert_get = node_new(NODE_EXPR, "get");
      element_insert_get->child.insert(element_insert_get->child.begin()+0,node_new(NODE_STR, name));
      element_insert_get->child.insert(element_insert_get->child.begin()+1,node_new(NODE_STR, "child"));
      element_insert->child.insert(element_insert->child.begin()+0,element_insert_get);
      struct node* element_insert_count = node_new(NODE_EXPR, "#");
      struct node* element_insert_count_get = node_new(NODE_EXPR, "get");
      element_insert_count_get->child.insert(element_insert_count_get->child.begin()+0,node_new(NODE_STR, name));
      element_insert_count_get->child.insert(element_insert_count_get->child.begin()+1,node_new(NODE_STR, "child"));
      element_insert_count->child.insert(element_insert_count->child.begin()+0,element_insert_count_get);
      element_insert->child.insert(element_insert->child.begin()+1,element_insert_count);
      element_insert->child.insert(element_insert->child.begin()+2,node_new(NODE_STR, node->child[i]->child[0]->value));
      out.insert(out.begin()+out.size(),element_insert);
    };
    if (type == "element") {
      struct node* block = node_new(NODE_EXPR, "");
      if (preprocess_vdom_isaction(node->value) != 0) {
        block->value = node->value;
      };
      block->token->newlines = 1;
      out.insert(out.begin()+out.size(),block);
      std::string child_name = "_";
      (child_name += tostring(depth));
      (child_name += "_");
      (child_name += tostring(i));
      (child_name += "_");
      (child_name += node->child[i]->value);
      struct node* element = node_new(NODE_EXPR, "let");
      element->token->newlines = 1;
      element->child.insert(element->child.begin()+0,node_new(NODE_STR, child_name));
      struct node* element_struct = node_new(NODE_EXPR, "struct");
      element_struct->child.insert(element_struct->child.begin()+0,node_new(NODE_STR, "__vdom__element"));
      element->child.insert(element->child.begin()+1,element_struct);
      element->child.insert(element->child.begin()+2,preprocess_vdom_element(node->child[i]));
      block->child.insert(block->child.begin()+block->child.size(),element);
      struct node* element_insert = node_new(NODE_EXPR, "insert");
      element_insert->token->newlines = 1;
      struct node* element_insert_get = node_new(NODE_EXPR, "get");
      element_insert_get->child.insert(element_insert_get->child.begin()+0,node_new(NODE_STR, name));
      element_insert_get->child.insert(element_insert_get->child.begin()+1,node_new(NODE_STR, "child"));
      element_insert->child.insert(element_insert->child.begin()+0,element_insert_get);
      struct node* element_insert_count = node_new(NODE_EXPR, "#");
      struct node* element_insert_count_get = node_new(NODE_EXPR, "get");
      element_insert_count_get->child.insert(element_insert_count_get->child.begin()+0,node_new(NODE_STR, name));
      element_insert_count_get->child.insert(element_insert_count_get->child.begin()+1,node_new(NODE_STR, "child"));
      element_insert_count->child.insert(element_insert_count->child.begin()+0,element_insert_count_get);
      element_insert->child.insert(element_insert->child.begin()+1,element_insert_count);
      element_insert->child.insert(element_insert->child.begin()+2,node_new(NODE_STR, child_name));
      block->child.insert(block->child.begin()+block->child.size(),element_insert);
      std::vector<struct node*> element_child = preprocess_vdom_element_child((depth + 1), child_name, node->child[i]);
      for (int j = 0; (j < element_child.size()); j += 1) {
        block->child.insert(block->child.begin()+block->child.size(),element_child[j]);
      };
    };
    i = (i + 1);
  };
  return out;
}
struct node* preprocess_vdom(struct node* node) {
  for (int i = 0; (i < node->child.size()); i += 1) {
    if ((node->child[i]->value == "let") && ((node->child[i]->child.size() == 3) && ((node->child[i]->child[1]->value == "struct") && (((node->child[i]->child[1]->child[0]->value == "vdom.element") || (node->child[i]->child[1]->child[0]->value == "__vdom__element")) && ((node->child[i]->child[2]->value != "call") && (node->child[i]->child[2]->value != "alloc")))))) {
      std::vector<struct node*> element_child = preprocess_vdom_element_child(0, node->child[i]->child[0]->value, node->child[i]->child[2]);
      node->child[i]->child[2] = preprocess_vdom_element(node->child[i]->child[2]);
      node->child[i]->child[2]->token->newlines = 0;
      for (int j = 0; (j < element_child.size()); j += 1) {
        i = (i + 1);
        node->child.insert(node->child.begin()+i,element_child[j]);
      };
    } else {
      node->child[i] = preprocess_vdom(node->child[i]);
    };
  };
  return node;
}
#define MODULE_VALIDATION "Validation"
void validate(struct node* node) {
  if (node->type == NODE_EXPR) {
    if (node->value == "let") {
      if ((node->child.size() < 2) || (node->child.size() > 3)) {
        compile_error(MODULE_VALIDATION, node, "'let' requires 2 or 3 args");
      };
    };
  };
  for (int i = 0; (i < node->child.size()); i += 1) {
    std::string child = node_to_str(0, node->child[i]);
    validate(node->child[i]);
  };
}
std::string node_to_js(int depth, struct node* node) {
  std::string s = "";
  depth = (depth + 1);
  node = node_copy(node);
  if (node->type == NODE_ROOT) {
    int has_main = 0;
    for (int i = 0; (i < node->child.size()); i += 1) {
      if ((node->child[i]->value == "func") && (node->child[i]->child[0]->value == "main")) {
        has_main = 1;
      };
      std::string child = node_to_js(0, node->child[i]);
      (s += child);
      (s += "\n");
    };
    if (has_main) {
      (s += "(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));\n");
    };
  };
  if ((node->value == "+") || ((node->value == "&&") || (node->value == "||"))) {
    node = node_expand(node);
  };
  if (node->type == NODE_EXPR) {
    std::string block_start = "(";
    (block_start += node->value);
    std::string block_end = ")";
    std::string block_seperator = " ";
    if (node->value == "") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "@define") {
      block_start = "const ";
      (block_start += node->child[0]->value);
      (block_start += " = ");
      (block_start += node->child[1]->value);
      (block_start += ";");
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "@if") {
      block_start = "";
      block_end = "";
      if (node->child[0]->value == "TARGET_JS") {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      } else {
        while (node->child.size() > 0) {
          node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        };
      };
    };
    if (node->value == "extern") {
      block_start = "";
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "asm") {
      std::string quotedline = node->child[0]->value;
      std::string line = "";
      for (int j = 1; (j < (quotedline.size() - 1)); j += 1) {
        (line += quotedline[j]);
      };
      block_start = line;
      block_end = "\n";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "struct") {
      block_start = "";
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "func") {
      block_start = "function ";
      if (node->child[0]->type == NODE_STR) {
        struct node* fname_node = node->child[0];
        (block_start += fname_node->value);
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
      (block_start += "(");
      int param_count = 0;
      int i = 0;
      while (i < node->child.size()) {
        struct node* child_node = node->child[i];
        if (child_node->value == "param") {
          if (child_node->child.size() == 2) {
            struct node* param_node = child_node->child[0];
            if (param_count > 0) {
              (block_start += ", ");
            };
            (block_start += param_node->value);
            param_count = (param_count + 1);
          };
          node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
          i = (i - 1);
        };
        if (child_node->value == "result") {
          node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
          i = (i - 1);
        };
        i = (i + 1);
      };
      (block_start += ") {");
      block_end = "}";
    };
    if (node->value == "call") {
      struct node* fname_node = node->child[0];
      block_start = fname_node->value;
      (block_start += "(");
      block_end = ")";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      block_seperator = ", ";
    };
    if ((node->value == "let") || (node->value == "local")) {
      block_start = "let ";
      block_end = "";
      node->child.erase(node->child.begin()+1,node->child.begin()+1+1);
      if (node->child.size() == 2) {
        node->child.insert(node->child.begin()+1,node_new(NODE_STR, "="));
      };
    };
    if (node->value == "alloc") {
      block_start = "";
      block_end = "";
      struct node* child = node->child[0];
      if (child->type == NODE_EXPR) {
        if ((node->child[0]->value == "vec") && (node->child.size() == 1)) {
          block_start = "new Array(";
          (block_start += node_to_js(depth, node->child[0]->child[0]));
          (block_start += ").fill(0)");
        } else {
          if ((node->child[0]->value == "arr") || (node->child[0]->value == "vec")) {
            block_start = "[";
            for (int i = 1; (i < node->child.size()); i += 1) {
              (block_start += node_to_js(depth, node->child[i]));
              if (i < (node->child.size() - 1)) {
                (block_start += ",");
              };
            };
            (block_start += "]");
          };
        };
        if ((node->child[0]->value == "map") || (node->child[0]->value == "struct")) {
          block_start = "{}";
        };
      };
      if (child->type == NODE_STR) {
        if (node->child.size() >= 2) {
          block_start = node_to_js(depth, node->child[1]);
        } else {
          block_start = "\"\"";
        };
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "free") {
      block_start = "/*GC*/";
      block_end = "";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "#") {
      block_start = "";
      block_end = ".length";
    };
    if (node->value == "insert") {
      block_start = node_to_js(depth, node->child[0]);
      (block_start += ".splice(");
      (block_start += node_to_js(depth, node->child[1]));
      (block_start += ",0,");
      (block_start += node_to_js(depth, node->child[2]));
      block_end = ")";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "remove") {
      if (node->child[1]->type != NODE_STR_QUOTE) {
        block_start = node_to_js(depth, node->child[0]);
        (block_start += ".splice(");
        (block_start += node_to_js(depth, node->child[1]));
        (block_start += ",");
        (block_start += node_to_js(depth, node->child[2]));
        block_end = ")";
      };
      if (node->child[1]->type == NODE_STR_QUOTE) {
        block_start = "delete ";
        (block_start += node_to_js(depth, node->child[0]));
        (block_start += "[");
        (block_start += node_to_js(depth, node->child[1]));
        block_end = "]";
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "slice") {
      block_start = node_to_js(depth, node->child[0]);
      (block_start += ".slice(");
      (block_start += node_to_js(depth, node->child[1]));
      (block_start += ",(");
      (block_start += node_to_js(depth, node->child[2]));
      (block_start += " + ");
      (block_start += node_to_js(depth, node->child[1]));
      block_end = "))";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "get") {
      block_start = node_to_js(depth, node->child[0]);
      block_end = "";
      for (int i = 1; (i < node->child.size()); i += 1) {
        struct node* child = node->child[i];
        if ((child->type == NODE_STR) && (child->value.size() > 1)) {
          (block_end += ".");
          (block_end += node_to_js(depth, node->child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_js(depth, node->child[i]));
          (block_end += "]");
        };
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "set") {
      block_start = node_to_js(depth, node->child[0]);
      block_end = "";
      int n = (node->child.size() - 1);
      for (int i = 1; (i < n); i += 1) {
        struct node* child = node->child[i];
        if ((child->type == NODE_STR) && (child->value.size() > 1)) {
          (block_end += ".");
          (block_end += node_to_js(depth, node->child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_js(depth, node->child[i]));
          (block_end += "]");
        };
      };
      (block_end += " = ");
      (block_end += node_to_js(depth, node->child[n]));
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "cast") {
      if (node->child[1]->value == "str") {
        block_start = "\"\"+";
        block_end = node_to_js(depth, node->child[0]);
      };
      if (node->child[1]->value == "int") {
        block_start = node_to_js(depth, node->child[0]);
        block_end = "|0";
      };
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "then") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "else") {
      block_start = "else {";
      block_end = "}";
    };
    if (node->value == "for") {
      if (node->child.size() == 5) {
        block_start = "for (let ";
        (block_start += node_to_js(depth, node->child[0]));
        (block_start += " = ");
        (block_start += node_to_js(depth, node->child[1]));
        (block_start += "; ");
        (block_start += node_to_js(depth, node->child[2]));
        (block_start += "; ");
        (block_start += node_to_js(depth, node->child[0]));
        (block_start += " += ");
        (block_start += node_to_js(depth, node->child[3]));
        (block_start += ") ");
        node->child.erase(node->child.begin()+0,node->child.begin()+0+4);
        block_end = "";
      };
      if (node->child.size() == 4) {
        block_start = "for (const [";
        (block_start += node_to_js(depth, node->child[0]));
        (block_start += ",");
        (block_start += node_to_js(depth, node->child[1]));
        (block_start += "] of Object.entries(");
        (block_start += node_to_js(depth, node->child[2]));
        (block_start += "))");
        node->child.erase(node->child.begin()+0,node->child.begin()+0+3);
        block_end = "";
      };
    };
    if ((node->value == "if") || (node->value == "while")) {
      block_start = node->value;
      (block_start += " ");
      int block_simple = (node->child[0]->type != NODE_EXPR);
      if (block_simple) {
        (block_start += "(");
      };
      (block_start += node_to_js(depth, node->child[0]));
      if (block_simple) {
        (block_start += ")");
      };
      (block_start += " ");
      block_end = "";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "do") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "break") {
      block_start = "break";
      block_end = "";
    };
    if (node->value == "?") {
      block_start = node_to_js(depth, node->child[0]);
      (block_start += " ? ");
      (block_start += node_to_js(depth, node->child[1]));
      (block_start += " : ");
      (block_start += node_to_js(depth, node->child[2]));
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "print") {
      block_start = "console.log(";
    };
    if ((node->value == ">>") || ((node->value == "<<") || ((node->value == "=") || ((node->value == "&&") || ((node->value == "||") || ((node->value == ">=") || ((node->value == "<=") || ((node->value == "<>") || ((node->value == "+") || ((node->value == "-") || ((node->value == "*") || ((node->value == "/") || ((node->value == "^") || ((node->value == "%") || ((node->value == "&") || ((node->value == "|") || ((node->value == "~") || ((node->value == "<") || (node->value == ">"))))))))))))))))))) {
      block_start = "(";
      block_end = ")";
      if (node->value == "=") {
        node->value = "==";
      };
      if (node->value == "<>") {
        node->value = "!=";
      };
      if ((node->value == "<<") && (node->child[0]->type == NODE_STR)) {
        node->value = "+=";
      };
      node->child.insert(node->child.begin()+1,node_new(NODE_STR, node->value));
    };
    if (node->value == "return") {
      if (node->child.size() > 0) {
        block_start = "return(";
        block_end = ")";
      } else {
        block_start = "return";
        block_end = "";
      };
    };
    (s += block_start);
    for (int i = 0; (i < node->child.size()); i += 1) {
      struct node* node_child = node->child[i];
      int indent_needed = node_indent_needed(node, node_child);
      int indent_depth = indent_needed ? depth : (depth - 1);
      std::string indent = "  ";
      if (indent_needed) {
        (s += "\n");
        for (int i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        if (i > 0) {
          (s += block_seperator);
        };
      };
      std::string child = node_to_js(indent_depth, node_child);
      (s += child);
      if ((node->value == "") || ((node->value == "func") || ((node->value == "do") || ((node->value == "then") || (node->value == "else"))))) {
        (s += ";");
      };
      if (indent_needed && (i == (node->child.size() - 1))) {
        (s += "\n");
        for (int i = 0; (i < (indent_depth - 1)); i += 1) {
          (s += indent);
        };
      };
    };
    (s += block_end);
  };
  if (node->type != NODE_EXPR) {
    std::string value = node->value;
    if (node->type == NODE_PREPROCESS) {
      value = "";
      for (int i = 1; (i < node->value.size()); i += 1) {
        (value += node->value[i]);
      };
    };
    if (node->type == NODE_COMMENT) {
      value = "// ";
      (value += node->value);
    };
    (s += value);
  };
  return s;
}
std::string node_to_cpp_preprocess(struct node* node) {
  std::string value = node->value;
  if (node->type == NODE_PREPROCESS) {
    value = "";
    for (int i = 1; (i < node->value.size()); i += 1) {
      (value += node->value[i]);
    };
  };
  return value;
}
std::string node_to_cpp_type(struct node* node) {
  std::string type = node->value;
  if (node->value == "str") {
    type = "std::string";
  };
  if (node->value == "vec") {
    type = "std::array<";
    (type += node_to_cpp_type(node->child[1]));
    (type += ",");
    (type += node_to_cpp_preprocess(node->child[0]));
    (type += ">");
  };
  if (node->value == "arr") {
    type = "std::vector<";
    (type += node_to_cpp_type(node->child[0]));
    (type += ">");
  };
  if (node->value == "struct") {
    type = "struct ";
    (type += node->child[0]->value);
    (type += "*");
  };
  if (type == "map") {
    type = "std::map<";
    (type += node_to_cpp_type(node->child[0]));
    (type += ",");
    (type += node_to_cpp_type(node->child[1]));
    (type += ">");
  };
  if (type == "func") {
    std::string return_type = "void";
    std::string params = "void";
    int i = 0;
    while (i < node->child.size()) {
      struct node* child_node = node->child[i];
      if (child_node->value == "param") {
        if (params == "void") {
          params = "";
        } else {
          (params += ", ");
        };
        std::string type = "";
        type = node_to_cpp_type(child_node->child[1]);
        if ((child_node->child[1]->value == "vec") || ((child_node->child[1]->value == "arr") || (child_node->child[1]->value == "map"))) {
          (type += "&");
        };
        (params += type);
        (params += " ");
        (params += child_node->child[0]->value);
        node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
        i = (i - 1);
      };
      if (child_node->value == "result") {
        return_type = node_to_cpp_type(child_node->child[0]);
        node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
        i = (i - 1);
      };
      i = (i + 1);
    };
    std::string function = "";
    if (node->child.size() > 0) {
      if (node->child[0]->type == NODE_STR) {
        std::string func_name = node->child[0]->value;
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
  return type;
}
std::string node_to_cpp(int depth, struct node* node) {
  std::string s = "";
  depth = (depth + 1);
  node = node_copy(node);
  if (node->type == NODE_ROOT) {
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
    int has_main = 0;
    for (int i = 0; (i < node->child.size()); i += 1) {
      if ((node->child[i]->value == "func") && (node->child[i]->child[0]->value == "main")) {
        has_main = 1;
      };
      std::string child = node_to_cpp(0, node->child[i]);
      (s += child);
      if (node->child[i]->value == "let") {
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
  if ((node->value == "+") || ((node->value == "&&") || (node->value == "||"))) {
    node = node_expand(node);
  };
  if (node->type == NODE_EXPR) {
    std::string block_start = "(";
    (block_start += node->value);
    std::string block_end = ")";
    std::string block_seperator = " ";
    if (node->value == "") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "@define") {
      block_start = "#define ";
      (block_start += node->child[0]->value);
      (block_start += " ");
      (block_start += node->child[1]->value);
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "@if") {
      block_start = "";
      block_end = "";
      if (node->child[0]->value == "TARGET_CPP") {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      } else {
        while (node->child.size() > 0) {
          node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        };
      };
    };
    if (node->value == "extern") {
      block_start = "";
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "asm") {
      std::string quotedline = node->child[0]->value;
      std::string line = "";
      for (int j = 1; (j < (quotedline.size() - 1)); j += 1) {
        if (quotedline[j] != 92) {
          (line += quotedline[j]);
        };
      };
      block_start = line;
      block_end = "\n";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "struct") {
      block_start = "struct ";
      (block_start += node->child[0]->value);
      (block_start += " {");
      block_end = "};";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "func") {
      block_start = node_to_cpp_type(node);
      (block_start += " {");
      block_end = "}";
      if (node->child[0]->type == NODE_STR) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "call") {
      struct node* fname_node = node->child[0];
      block_start = fname_node->value;
      (block_start += "(");
      block_end = ")";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      block_seperator = ", ";
    };
    if ((node->value == "let") || (node->value == "local")) {
      std::string type = node_to_cpp_type(node->child[1]);
      block_start = type;
      (block_start += " ");
      block_end = "";
      node->child.erase(node->child.begin()+1,node->child.begin()+1+1);
      if (node->child.size() == 2) {
        node->child.insert(node->child.begin()+1,node_new(NODE_STR, "="));
      };
    };
    if (node->value == "alloc") {
      block_start = "";
      block_end = "";
      if (node->child[0]->value == "str") {
        block_start = "\"\"";
        if (node->child.size() > 1) {
          block_start = node->child[1]->value;
        };
      };
      if (node->child[0]->type == NODE_EXPR) {
        if ((node->child[0]->value == "vec") || (node->child[0]->value == "arr")) {
          if (node->child.size() == 1) {
            std::string init = node_to_cpp_type(node->child[0]);
            (init += "()");
            block_start = init;
          } else {
            block_start = "{";
            for (int i = 1; (i < node->child.size()); i += 1) {
              (block_start += node_to_cpp(depth, node->child[i]));
              if (i < (node->child.size() - 1)) {
                (block_start += ",");
              };
            };
            (block_start += "}");
          };
        };
        if (node->child[0]->value == "struct") {
          block_start = "new ";
          (block_start += node->child[0]->child[0]->value);
          (block_start += "()");
        };
        if (node->child[0]->value == "map") {
          block_start = "{}";
        };
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "free") {
      block_start = "/*GC*/";
      block_end = "";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "#") {
      block_start = "";
      block_end = ".size()";
    };
    if (node->value == "insert") {
      std::string array = node_to_cpp(depth, node->child[0]);
      std::string position = node_to_cpp(depth, node->child[1]);
      std::string value = node_to_cpp(depth, node->child[2]);
      block_start = array;
      (block_start += ".insert(");
      (block_start += array);
      (block_start += ".begin()+");
      (block_start += position);
      (block_start += ",");
      (block_start += value);
      block_end = ")";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "remove") {
      if (node->child.size() == 2) {
        block_start = node_to_cpp(depth, node->child[0]);
        (block_start += ".erase(");
        (block_start += node_to_cpp(depth, node->child[1]));
        block_end = ")";
      } else {
        std::string array = node_to_cpp(depth, node->child[0]);
        std::string first = node_to_cpp(depth, node->child[1]);
        std::string last = node_to_cpp(depth, node->child[2]);
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
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "slice") {
      block_start = node_to_cpp(depth, node->child[0]);
      (block_start += ".substr(");
      (block_start += node_to_cpp(depth, node->child[1]));
      (block_start += ",");
      (block_start += node_to_cpp(depth, node->child[2]));
      block_end = ")";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "get") {
      block_start = node_to_cpp(depth, node->child[0]);
      block_end = "";
      for (int i = 1; (i < node->child.size()); i += 1) {
        struct node* child = node->child[i];
        if ((child->type == NODE_STR) && (child->value.size() > 1)) {
          (block_end += "->");
          (block_end += node_to_cpp(depth, node->child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_cpp(depth, node->child[i]));
          (block_end += "]");
        };
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "set") {
      block_start = node_to_cpp(depth, node->child[0]);
      block_end = "";
      int n = (node->child.size() - 1);
      for (int i = 1; (i < n); i += 1) {
        struct node* child = node->child[i];
        if ((child->type == NODE_STR) && (child->value.size() > 1)) {
          (block_end += "->");
          (block_end += node_to_cpp(depth, node->child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_cpp(depth, node->child[i]));
          (block_end += "]");
        };
      };
      (block_end += " = ");
      (block_end += node_to_cpp(depth, node->child[n]));
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "cast") {
      if (node->child[1]->value == "str") {
        block_start = "tostring(";
        (block_start += node_to_cpp(depth, node->child[0]));
        block_end = ")";
      };
      if (node->child[1]->value == "int") {
        block_start = "(int)";
        block_end = node_to_cpp(depth, node->child[0]);
      };
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "then") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "else") {
      block_start = "else {";
      block_end = "}";
    };
    if (node->value == "for") {
      if (node->child.size() == 5) {
        block_start = "for (int ";
        (block_start += node_to_cpp(depth, node->child[0]));
        (block_start += " = ");
        (block_start += node_to_cpp(depth, node->child[1]));
        (block_start += "; ");
        (block_start += node_to_cpp(depth, node->child[2]));
        (block_start += "; ");
        (block_start += node_to_cpp(depth, node->child[0]));
        (block_start += " += ");
        (block_start += node_to_cpp(depth, node->child[3]));
        (block_start += ") ");
        node->child.erase(node->child.begin()+0,node->child.begin()+0+4);
        block_end = "";
      };
      if (node->child.size() == 4) {
        block_start = "for (const auto &[";
        (block_start += node_to_cpp(depth, node->child[0]));
        (block_start += ",");
        (block_start += node_to_cpp(depth, node->child[1]));
        (block_start += "] : ");
        (block_start += node_to_cpp(depth, node->child[2]));
        (block_start += ") ");
        node->child.erase(node->child.begin()+0,node->child.begin()+0+3);
        block_end = "";
      };
    };
    if ((node->value == "if") || (node->value == "while")) {
      block_start = node->value;
      (block_start += " ");
      int block_simple = (node->child[0]->type != NODE_EXPR);
      if (block_simple) {
        (block_start += "(");
      };
      (block_start += node_to_cpp(depth, node->child[0]));
      if (block_simple) {
        (block_start += ")");
      };
      (block_start += " ");
      block_end = "";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "do") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "break") {
      block_start = "break";
      block_end = "";
    };
    if (node->value == "?") {
      block_start = node_to_cpp(depth, node->child[0]);
      (block_start += " ? ");
      (block_start += node_to_cpp(depth, node->child[1]));
      (block_start += " : ");
      (block_start += node_to_cpp(depth, node->child[2]));
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "print") {
      block_start = "std::cout << ";
      block_end = " << std::endl";
    };
    if ((node->value == ">>") || ((node->value == "<<") || ((node->value == "=") || ((node->value == "&&") || ((node->value == "||") || ((node->value == ">=") || ((node->value == "<=") || ((node->value == "<>") || ((node->value == "+") || ((node->value == "-") || ((node->value == "*") || ((node->value == "/") || ((node->value == "^") || ((node->value == "%") || ((node->value == "&") || ((node->value == "|") || ((node->value == "~") || ((node->value == "<") || (node->value == ">"))))))))))))))))))) {
      block_start = "(";
      block_end = ")";
      if (node->value == "=") {
        node->value = "==";
      };
      if (node->value == "<>") {
        node->value = "!=";
      };
      if ((node->value == "<<") && (node->child[0]->type == NODE_STR)) {
        node->value = "+=";
      };
      node->child.insert(node->child.begin()+1,node_new(NODE_STR, node->value));
    };
    if (node->value == "return") {
      block_start = "return ";
      block_end = "";
    };
    (s += block_start);
    for (int i = 0; (i < node->child.size()); i += 1) {
      struct node* node_child = node->child[i];
      int indent_needed = node_indent_needed(node, node_child);
      int indent_depth = indent_needed ? depth : (depth - 1);
      std::string indent = "  ";
      if (indent_needed) {
        (s += "\n");
        for (int i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        if (i > 0) {
          (s += block_seperator);
        };
      };
      std::string child = node_to_cpp(indent_depth, node_child);
      (s += child);
      if ((node->value == "") || ((node->value == "func") || ((node->value == "struct") || ((node->value == "do") || ((node->value == "then") || (node->value == "else")))))) {
        (s += ";");
      };
      if (indent_needed && (i == (node->child.size() - 1))) {
        (s += "\n");
        for (int i = 0; (i < (indent_depth - 1)); i += 1) {
          (s += indent);
        };
      };
    };
    (s += block_end);
  };
  if (node->type != NODE_EXPR) {
    std::string value = node_to_cpp_preprocess(node);
    if (node->type == NODE_COMMENT) {
      value = "// ";
      (value += node->value);
    };
    (s += value);
  };
  return s;
}
std::string node_to_c_preprocess(struct node* node) {
  std::string value = node->value;
  if (node->type == NODE_PREPROCESS) {
    value = "";
    for (int i = 1; (i < node->value.size()); i += 1) {
      (value += node->value[i]);
    };
  };
  return value;
}
std::string node_to_c_type(std::string name, struct node* node, int element_only) {
  std::string type = node->value;
  std::string suffix = "";
  if (node->value == "str") {
    type = "char*";
  };
  if (node->value == "vec") {
    type = node_to_c_type("", node->child[1], 0);
    if (name != "") {
      (suffix += "[");
      (suffix += node_to_c_preprocess(node->child[0]));
      (suffix += "]");
    } else {
      (type += "*");
    };
  };
  if (node->value == "arr") {
    type = node_to_c_type("", node->child[0], 0);
    if (!element_only) {
      (type += "*");
    };
  };
  if (node->value == "struct") {
    type = "struct ";
    (type += node->child[0]->value);
    (type += "*");
  };
  if (type == "map") {
    type = "std::map<";
    (type += node_to_c_type("", node->child[0], 0));
    (type += ",");
    (type += node_to_c_type("", node->child[1], 0));
    (type += ">");
  };
  if (type == "func") {
    std::string return_type = "void";
    std::string params = "void";
    int i = 0;
    while (i < node->child.size()) {
      struct node* child_node = node->child[i];
      if (child_node->value == "param") {
        if (params == "void") {
          params = "";
        } else {
          (params += ", ");
        };
        std::string c_var = "";
        c_var = node_to_c_type(child_node->child[0]->value, child_node->child[1], 0);
        (params += c_var);
        node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
        i = (i - 1);
      };
      if (child_node->value == "result") {
        return_type = node_to_c_type("", child_node->child[0], 0);
        node->child.erase(node->child.begin()+i,node->child.begin()+i+1);
        i = (i - 1);
      };
      i = (i + 1);
    };
    std::string c_function = "";
    if (node->child.size() > 0) {
      if (node->child[0]->type == NODE_STR) {
        std::string func_name = node->child[0]->value;
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
  std::string out = type;
  if (name != "") {
    (out += " ");
    (out += name);
    (out += suffix);
  };
  return out;
}
std::string node_to_c_tostring(std::vector<struct node_symbol*>& symbol, struct node* node, int castint) {
  int node_type = node_symbol_node_type(symbol, node);
  if (node_type == NODE_TYPE_STR) {
    return "tostring_char_p";
  };
  if (node_type == NODE_TYPE_INT) {
    return castint ? "tostring_int" : "tostring_char";
  };
  if (node_type == NODE_TYPE_FLOAT) {
    return "tostring_float";
  };
  return "tostring_unknown";
}
std::string node_to_c_length(std::vector<struct node_symbol*>& symbol, struct node* node) {
  int node_type = node_symbol_node_type(symbol, node);
  if (node_type == NODE_TYPE_STR) {
    return "strlen";
  };
  return "ARRAY_LENGTH";
}
int node_to_c_has_keyword(struct node* node, std::string keyword) {
  if (node->value == keyword) {
    return 1;
  };
  for (int i = 0; (i < node->child.size()); i += 1) {
    if (node_to_c_has_keyword(node->child[i], keyword) != 0) {
      return 1;
    };
  };
  return 0;
}
std::string node_to_c(int depth, std::vector<struct node_symbol*>& parent_symbol, struct node* node) {
  std::string s = "";
  std::vector<struct node_symbol*> symbol = node_symbol_scope_node(parent_symbol, node);
  depth = (depth + 1);
  node = node_copy(node);
  if (node->type == NODE_ROOT) {
    int has_main = 0;
    for (int i = 0; (i < node->child.size()); i += 1) {
      if ((node->child[i]->value == "func") && (node->child[i]->child[0]->value == "main")) {
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
    for (int i = 0; (i < node->child.size()); i += 1) {
      std::string child = node_to_c(0, symbol, node->child[i]);
      (s += child);
      if (node->child[i]->value == "let") {
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
  if ((node->value == "+") || ((node->value == "&&") || (node->value == "||"))) {
    node = node_expand(node);
  };
  if (node->type == NODE_EXPR) {
    std::string block_start = "(";
    (block_start += node->value);
    std::string block_end = ")";
    std::string block_seperator = " ";
    if (node->value == "") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "@define") {
      block_start = "#define ";
      (block_start += node->child[0]->value);
      (block_start += " ");
      (block_start += node->child[1]->value);
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "@if") {
      block_start = "";
      block_end = "";
      if (node->child[0]->value == "TARGET_C") {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      } else {
        while (node->child.size() > 0) {
          node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        };
      };
    };
    if (node->value == "extern") {
      block_start = "";
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "asm") {
      std::string quotedline = node->child[0]->value;
      std::string line = "";
      for (int j = 1; (j < (quotedline.size() - 1)); j += 1) {
        if (quotedline[j] != 92) {
          (line += quotedline[j]);
        };
      };
      block_start = line;
      block_end = "\n";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "struct") {
      block_start = "struct ";
      (block_start += node->child[0]->value);
      (block_start += " {");
      block_end = "};";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "func") {
      block_start = node_to_c_type("", node, 0);
      (block_start += " {");
      block_end = "}";
      if (node->child[0]->type == NODE_STR) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "call") {
      struct node* fname_node = node->child[0];
      block_start = fname_node->value;
      (block_start += "(");
      block_end = ")";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      block_seperator = ", ";
    };
    if ((node->value == "let") || (node->value == "local")) {
      std::string name = node->child[0]->value;
      std::string type = node_to_c_type(name, node->child[1], 0);
      block_start = type;
      (block_start += " ");
      block_end = "";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      if (node->child.size() == 1) {
        node->child.insert(node->child.begin()+0,node_new(NODE_STR, "="));
        if ((node->child[1]->value == "alloc") && (node->child[1]->child[0]->value == "arr")) {
          for (int i = 1; (i < node->child[1]->child.size()); i += 1) {
            (block_end += ";");
            (block_end += name);
            (block_end += "[");
            (block_end += tostring((i - 1)));
            (block_end += "]=");
            (block_end += node->child[1]->child[i]->value);
          };
        };
      };
    };
    if (node->value == "alloc") {
      block_start = "";
      block_end = "";
      if (node->child[0]->value == "str") {
        std::string alloc_string = "\"\"";
        if (node->child.size() > 1) {
          alloc_string = node->child[1]->value;
        };
        block_start = "STRING_ALLOC(";
        (block_start += alloc_string);
        (block_start += ")");
      };
      if (node->child[0]->type == NODE_EXPR) {
        if (node->child[0]->value == "arr") {
          block_start = "ARRAY_ALLOC(sizeof(";
          (block_start += node_to_c_type("", node->child[0], 1));
          (block_start += "),");
          (block_start += tostring((node->child.size() - 1)));
          (block_start += ")");
        };
        if (node->child[0]->value == "vec") {
          block_start = "{";
          for (int i = 1; (i < node->child.size()); i += 1) {
            (block_start += node_to_c(depth, symbol, node->child[i]));
            if (i < (node->child.size() - 1)) {
              (block_start += ",");
            };
          };
          (block_start += "}");
        };
        if (node->child[0]->value == "struct") {
          block_start = "ARRAY_ALLOC(sizeof(struct ";
          (block_start += node->child[0]->child[0]->value);
          (block_start += "),1)");
        };
        if (node->child[0]->value == "map") {
          block_start = "{}";
        };
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "free") {
      std::string array = node_to_c(depth, symbol, node->child[0]);
      block_start = "ARRAY_FREE(";
      (block_start += array);
      block_end = ")";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "#") {
      block_start = node_to_c_length(symbol, node->child[0]);
      (block_start += "(");
      block_end = ")";
    };
    if (node->value == "insert") {
      std::string init = "";
      if ((node->child[2]->value == "alloc") && (node->child[2]->child[0]->value == "arr")) {
        for (int i = 1; (i < node->child[2]->child.size()); i += 1) {
          (init += ";");
          (init += node->child[0]->value);
          (init += "[");
          (init += node->child[1]->value);
          (init += "]");
          (init += "[");
          (init += tostring((i - 1)));
          (init += "]=");
          (init += node->child[2]->child[i]->value);
        };
      };
      std::string array = node_to_c(depth, symbol, node->child[0]);
      std::string position = node_to_c(depth, symbol, node->child[1]);
      std::string value = node_to_c(depth, symbol, node->child[2]);
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
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "remove") {
      std::string array = node_to_c(depth, symbol, node->child[0]);
      std::string first = node_to_c(depth, symbol, node->child[1]);
      std::string last = node_to_c(depth, symbol, node->child[2]);
      block_start = array;
      (block_start += "=ARRAY_REMOVE(");
      (block_start += array);
      (block_start += ",");
      (block_start += first);
      (block_start += ",");
      (block_start += last);
      block_end = ")";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "slice") {
      block_start = node_to_c(depth, symbol, node->child[0]);
      (block_start += ".substr(");
      (block_start += node_to_c(depth, symbol, node->child[1]));
      (block_start += ",");
      (block_start += node_to_c(depth, symbol, node->child[2]));
      block_end = ")";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "get") {
      block_start = node_to_c(depth, symbol, node->child[0]);
      block_end = "";
      for (int i = 1; (i < node->child.size()); i += 1) {
        struct node* child = node->child[i];
        if ((child->type == NODE_STR) && (child->value.size() > 1)) {
          (block_end += "->");
          (block_end += node_to_c(depth, symbol, node->child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_c(depth, symbol, node->child[i]));
          (block_end += "]");
        };
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "set") {
      block_start = node_to_c(depth, symbol, node->child[0]);
      block_end = "";
      int n = (node->child.size() - 1);
      for (int i = 1; (i < n); i += 1) {
        struct node* child = node->child[i];
        if ((child->type == NODE_STR) && (child->value.size() > 1)) {
          (block_end += "->");
          (block_end += node_to_c(depth, symbol, node->child[i]));
          (block_end += "");
        } else {
          (block_end += "[");
          (block_end += node_to_c(depth, symbol, node->child[i]));
          (block_end += "]");
        };
      };
      (block_end += " = ");
      int node_type = node_symbol_node_type(symbol, node->child[n]);
      if (node_type == NODE_TYPE_STR) {
        (block_end += "STRING_ALLOC(");
      };
      (block_end += node_to_c(depth, symbol, node->child[n]));
      if (node_type == NODE_TYPE_STR) {
        (block_end += ")");
      };
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "cast") {
      if (node->child[1]->value == "str") {
        block_start = "tostring_int(";
        (block_start += node_to_c(depth, symbol, node->child[0]));
        block_end = ")";
      };
      if (node->child[1]->value == "int") {
        block_start = "(int)";
        block_end = node_to_c(depth, symbol, node->child[0]);
      };
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "then") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "else") {
      block_start = "else {";
      block_end = "}";
    };
    if (node->value == "for") {
      if (node->child.size() == 5) {
        block_start = "for (int ";
        (block_start += node_to_c(depth, symbol, node->child[0]));
        (block_start += " = ");
        (block_start += node_to_c(depth, symbol, node->child[1]));
        (block_start += "; ");
        (block_start += node_to_c(depth, symbol, node->child[2]));
        (block_start += "; ");
        (block_start += node_to_c(depth, symbol, node->child[0]));
        (block_start += " += ");
        (block_start += node_to_c(depth, symbol, node->child[3]));
        (block_start += ") ");
        node->child.erase(node->child.begin()+0,node->child.begin()+0+4);
        block_end = "";
      };
      if (node->child.size() == 4) {
        block_start = "for (const auto &[";
        (block_start += node_to_c(depth, symbol, node->child[0]));
        (block_start += ",");
        (block_start += node_to_c(depth, symbol, node->child[1]));
        (block_start += "] : ");
        (block_start += node_to_c(depth, symbol, node->child[2]));
        (block_start += ") ");
        node->child.erase(node->child.begin()+0,node->child.begin()+0+3);
        block_end = "";
      };
    };
    if ((node->value == "if") || (node->value == "while")) {
      block_start = node->value;
      (block_start += " ");
      int block_simple = (node->child[0]->type != NODE_EXPR);
      if (block_simple) {
        (block_start += "(");
      };
      (block_start += node_to_c(depth, symbol, node->child[0]));
      if (block_simple) {
        (block_start += ")");
      };
      (block_start += " ");
      block_end = "";
      node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
    };
    if (node->value == "do") {
      block_start = "{";
      block_end = "}";
    };
    if (node->value == "break") {
      block_start = "break";
      block_end = "";
    };
    if (node->value == "?") {
      block_start = node_to_c(depth, symbol, node->child[0]);
      (block_start += " ? ");
      (block_start += node_to_c(depth, symbol, node->child[1]));
      (block_start += " : ");
      (block_start += node_to_c(depth, symbol, node->child[2]));
      block_end = "";
      while (node->child.size() > 0) {
        node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
      };
    };
    if (node->value == "print") {
      block_start = "puts(";
      (block_start += node_to_c_tostring(symbol, node->child[0], 1));
      (block_start += "(");
      block_end = "))";
    };
    if ((node->value == ">>") || ((node->value == "<<") || ((node->value == "=") || ((node->value == "&&") || ((node->value == "||") || ((node->value == ">=") || ((node->value == "<=") || ((node->value == "<>") || ((node->value == "+") || ((node->value == "-") || ((node->value == "*") || ((node->value == "/") || ((node->value == "^") || ((node->value == "%") || ((node->value == "&") || ((node->value == "|") || ((node->value == "~") || ((node->value == "<") || (node->value == ">"))))))))))))))))))) {
      block_start = "(";
      block_end = ")";
      if (node->value == "=") {
        if ((node->child[0]->type == NODE_STR_QUOTE) || (node->child[1]->type == NODE_STR_QUOTE)) {
          block_start = "(strcmp(";
          block_end = ") == 0 ? 1 : 0)";
          node->value = ",";
        } else {
          node->value = "==";
        };
      };
      if (node->value == "<>") {
        node->value = "!=";
      };
      if ((node->value == "<<") && (node->child[0]->type == NODE_STR)) {
        block_start = node->child[0]->value;
        (block_start += "=");
        (block_start += "STRING_APPEND(");
        (block_start += node_to_c(depth, symbol, node->child[0]));
        (block_start += ",");
        (block_start += node_to_c_tostring(symbol, node->child[1], 0));
        (block_start += "(");
        (block_start += node_to_c(depth, symbol, node->child[1]));
        block_end = "))";
        while (node->child.size() > 0) {
          node->child.erase(node->child.begin()+0,node->child.begin()+0+1);
        };
      } else {
        node->child.insert(node->child.begin()+1,node_new(NODE_STR, node->value));
      };
    };
    if (node->value == "return") {
      block_start = "return ";
      block_end = "";
    };
    (s += block_start);
    for (int i = 0; (i < node->child.size()); i += 1) {
      struct node* node_child = node->child[i];
      int indent_needed = node_indent_needed(node, node_child);
      int indent_depth = indent_needed ? depth : (depth - 1);
      std::string indent = "  ";
      if (indent_needed) {
        (s += "\n");
        for (int i = 0; (i < indent_depth); i += 1) {
          (s += indent);
        };
      } else {
        if (i > 0) {
          (s += block_seperator);
        };
      };
      std::string child = node_to_c(indent_depth, symbol, node_child);
      (s += child);
      if ((node->value == "") || ((node->value == "func") || ((node->value == "struct") || ((node->value == "do") || ((node->value == "then") || (node->value == "else")))))) {
        (s += ";");
      };
      if (indent_needed && (i == (node->child.size() - 1))) {
        (s += "\n");
        for (int i = 0; (i < (indent_depth - 1)); i += 1) {
          (s += indent);
        };
      };
    };
    (s += block_end);
  };
  if (node->type != NODE_EXPR) {
    std::string value = node_to_c_preprocess(node);
    if (node->type == NODE_COMMENT) {
      value = "// ";
      (value += node->value);
    };
    (s += value);
  };
  return s;
}
std::string compile(std::string target, std::string filename) {
  std::string prog = readfile(filename);
  std::string out = "";
  std::vector<struct token*> tokens = token_parse(prog, filename, 0);
  struct node* root = node_from_tokens(tokens);
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
    std::vector<struct node_symbol*> symbol = std::vector<struct node_symbol*>();
    out = node_to_c(0, symbol, root);
  };
  return out;
}
std::string format(std::string filename) {
  std::string prog = readfile(filename);
  std::vector<struct token*> tokens = token_parse(prog, filename, 1);
  struct node* root = node_from_tokens(tokens);
  std::string out = node_to_wax(0, root);
  return out;
}
std::string help(void) {
  std::vector<std::string> lines = {"usage: \n\n","  wax <command> [arguments]\n\n","commands: \n\n","  build <--target=wax|--target=js|--target=cpp|--target=c> <filename.wax>\n","  fmt <filename.wax>\n"};
  std::string help = "";
  for (int i = 0; (i < lines.size()); i += 1) {
    (help += lines[i]);
  };
  return help;
}
int main_args(std::vector<std::string>& args) {
  if (args.size() < 3) {
    std::cout << help() << std::endl;
    return 1;
  };
  if ((args.size() == 4) && (args[1] == "build")) {
    std::string out = compile(args[2], args[3]);
    std::cout << out << std::endl;
    return 0;
  };
  if ((args.size() == 3) && (args[1] == "fmt")) {
    std::cout << format(args[2]) << std::endl;
    return 0;
  };
  std::cout << help() << std::endl;
  return 0;
}
int main(int argc, char** argv) {
  std::vector<std::string> args(argv, argv + argc);
  return main_args(args);
};

