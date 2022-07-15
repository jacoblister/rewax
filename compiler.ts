/*****************************************
 * compiler                              *
 *****************************************/
/* Compiled by WAXC (Version Jul 15 2022)*/


module compiler{
/*=== WAX Standard Library BEGIN ===*/
const w_slice=(x:Array<any>|string,i:number,n:number)=>x.slice(i,i+n);
/*=== WAX Standard Library END   ===*/

/*=== User Code            BEGIN ===*/

  export class token_file{
    name:string=(null as any);
  };
  export class token{
    type:number=0;
    value:string=(null as any);
    file:token_file=(null as any);
    newlines:number=0;
    linenumber:number=0;
  };
  export function token_new(type:number,value:string,file:token_file,newlines:number,linenumber:number):token{
    let t:token=(null as any);
    t=(new token());
    ((t).type=type);
    ((t).value=value);
    ((t).file=file);
    ((t).newlines=newlines);
    ((t).linenumber=linenumber);
    return t;
  };
  export function token_parse(input:string,filename:string,comments:number):Array<token>{
    let file:token_file=(null as any);
    file=(new token_file());
    ((file).name=filename);
    let token:string=(null as any);
    token="";
    let tokens:Array<token>=(null as any);
    tokens=[];
    let newlines:number=0;
    newlines=0;
    let linenumber:number=0;
    linenumber=1;
    let in_comment:number=0;
    in_comment=0;
    let in_single_quote:number=0;
    in_single_quote=0;
    let in_double_quote:number=0;
    in_double_quote=0;
    let in_quote:number=0;
    in_quote=0;
    let in_quote_escape:number=0;
    in_quote_escape=0;
    for(let i:number=(0);Number((i)<((input).length));i+=(1)){
      let c:number=0;
      c=(input).charCodeAt(i);
      if(in_quote_escape){
        in_quote_escape=0;
      }else{
        if(((Number(!(in_double_quote)))&&(Number((c)==('\''.charCodeAt(0)))))){
          in_single_quote=Number(!(in_single_quote));
        };
        if(((Number(!(in_single_quote)))&&(Number((c)==('"'.charCodeAt(0)))))){
          in_double_quote=Number(!(in_double_quote));
        };
        in_quote=((in_single_quote)||(in_double_quote));
        if(in_quote){
          if(Number((c)==('\\'.charCodeAt(0)))){
            in_quote_escape=1;
          };
        };
        if(Number(!(in_quote))){
          if(Number((c)==(';'.charCodeAt(0)))){
            in_comment=1;
          };
        };
        if(Number((c)==('\n'.charCodeAt(0)))){
          if(in_comment){
            if(Number((comments)!=(0))){
              (tokens).splice((tokens.length),0,(token_new(2,token,file,newlines,linenumber)));
              newlines=0;
            };
            token="";
          };
          in_comment=0;
        };
      };
      let whitespace:number=0;
      whitespace=((((((Number((c)==('\t'.charCodeAt(0))))||(Number((c)==(' '.charCodeAt(0))))))||(Number((c)==('\n'.charCodeAt(0))))))||(Number((c)==('\r'.charCodeAt(0)))));
      let paren:number=0;
      paren=((Number((c)==('('.charCodeAt(0))))||(Number((c)==(')'.charCodeAt(0)))));
      if(((((Number(!(in_quote)))&&(Number(!(in_comment)))))&&(((whitespace)||(paren))))){
        if(Number(((token).length)>(0))){
          (tokens).splice((tokens.length),0,(token_new(0,token,file,newlines,linenumber)));
          newlines=0;
        };
        if(paren){
          token="";
          (token)+=String.fromCharCode((input).charCodeAt(i));
          (tokens).splice((tokens.length),0,(token_new(1,token,file,newlines,linenumber)));
          newlines=0;
        };
        token="";
      }else{
        (token)+=String.fromCharCode((input).charCodeAt(i));
      };
      if(Number((c)==('\n'.charCodeAt(0)))){
        newlines=((newlines)+(1));
        linenumber=((linenumber)+(1));
      };
    };
    return tokens;
  };
  export function token_write_to_output(tokens:Array<token>){
    console.log("count:");
    console.log((tokens.length).toString());
    console.log("");
    for(let i:number=(0);Number((i)<(tokens.length));i+=(1)){
      console.log(((((tokens)[i])).value));
    };
  };
  export function token_to_string(tokens:Array<token>,width:number):string{
    let s:string=(null as any);
    s="";
    let line:string=(null as any);
    line="";
    for(let i:number=(0);Number((i)<(tokens.length));i+=(1)){
      let token:string=(null as any);
      token="";
      for(let j:number=(0);Number((j)<((((((tokens)[i])).value)).length));j+=(1)){
        let c:number=0;
        c=(((((tokens)[i])).value)).charCodeAt(j);
        let encoded:string=(null as any);
        encoded="";
        (encoded)+=String.fromCharCode(c);
        if(Number((c)==('\"'.charCodeAt(0)))){
          encoded="\\\"";
        };
        if(Number((c)==('\\'.charCodeAt(0)))){
          encoded="";
          (encoded)+=String.fromCharCode('\\'.charCodeAt(0));
          (encoded)+=String.fromCharCode('\\'.charCodeAt(0));
        };
        ((token)+=(encoded));
      };
      ((line)+=(token));
      if(Number(((line).length)>(width))){
        ((s)+=("\""));
        ((s)+=(line));
        ((s)+=("\\n\"\n"));
        line="";
      }else{
        if(((Number((token)!=("(")))&&(Number((token)!=(")"))))){
          ((line)+=(" "));
        };
      };
    };
    ((s)+=("\""));
    ((s)+=(line));
    ((s)+=("\\n\"\n"));
    return s;
  };
  export class node{
    type:number=0;
    value:string=(null as any);
    child:Array<node>=(null as any);
    token:token=(null as any);
  };
  export function node_new(type:number,value:string):node{
    let node_new:node=(null as any);
    node_new=(new node());
    ((node_new).type=type);
    ((node_new).value=value);
    ((node_new).child=[]);
    ((node_new).token=(new token()));
    return node_new;
  };
  export function node_copy(src:node):node{
    let res:node=(null as any);
    res=(new node());
    ((res).type=((src).type));
    ((res).value=((src).value));
    ((res).child=[]);
    for(let i:number=(0);Number((i)<(((src).child).length));i+=(1)){
      (((res).child)).splice((i),0,(node_copy(((((src).child))[i]))));
    };
    ((res).token=((src).token));
    return res;
  };
  export function node_type_from_token(token:string):number{
    if(Number(((token).length)>(0))){
      let c:number=0;
      c=(token).charCodeAt(0);
      if(Number((c)==('@'.charCodeAt(0)))){
        return 2;
      };
      if(Number((c)==('\''.charCodeAt(0)))){
        return 3;
      };
      if(Number((c)==('"'.charCodeAt(0)))){
        return 5;
      };
      if(((((Number((c)>=('0'.charCodeAt(0))))&&(Number((c)<=('9'.charCodeAt(0))))))||(Number((c)==('-'.charCodeAt(0)))))){
        for(let i:number=(0);Number((i)<((token).length));i+=(1)){
          c=(token).charCodeAt(i);
          if(Number((c)==('.'.charCodeAt(0)))){
            return 7;
          };
        };
        return 6;
      };
    };
    return 4;
  };
  export function node_from_tokens(tokens:Array<token>):node{
    let stack:Array<node>=(null as any);
    stack=[];
    (stack).splice((stack.length),0,(node_new(0,"")));
    let i:number=0;
    i=0;
    while(Number((i)<(tokens.length))){
      let token:string=(null as any);
      token=((((tokens)[i])).value);
      if(Number((((((tokens)[i])).type))==(2))){
        let child:node=(null as any);
        child=node_new(8,token);
        ((child).token=((tokens)[i]));
        let node:node=(null as any);
        node=((stack)[((stack.length)-(1))]);
        (((node).child)).splice((((node).child).length),0,(child));
      }else{
        if(Number((token)==("("))){
          let value:string=(null as any);
          value="";
          let next_token:string=(null as any);
          next_token=((((tokens)[((i)+(1))])).value);
          if(((Number((next_token)!=("(")))&&(Number((next_token)!=(")"))))){
            value=next_token;
          };
          let node:node=(null as any);
          node=node_new(1,value);
          ((node).token=((tokens)[i]));
          if(Number((value)!=(""))){
            i=((i)+(1));
          };
          let parent:node=(null as any);
          parent=((stack)[((stack.length)-(1))]);
          (((parent).child)).splice((((parent).child).length),0,(node));
          (stack).splice((stack.length),0,(node));
        }else{
          if(Number((token)==(")"))){
            (stack).splice((((stack.length)-(1))),(1));
          }else{
            let child:node=(null as any);
            child=node_new(node_type_from_token(token),token);
            ((child).token=((tokens)[i]));
            let node:node=(null as any);
            node=((stack)[((stack.length)-(1))]);
            (((node).child)).splice((((node).child).length),0,(child));
          };
        };
      };
      i=((i)+(1));
    };
    return ((stack)[0]);
  };
  export function node_expand(node_org:node):node{
    if(Number((((node_org).child).length)<(2))){
      return node_org;
    };
    let expanded:node=(null as any);
    expanded=node_new(1,((node_org).value));
    (((expanded).child)).splice((((expanded).child).length),0,(((((node_org).child))[0])));
    if(Number((((node_org).child).length)==(2))){
      (((expanded).child)).splice((((expanded).child).length),0,(((((node_org).child))[1])));
    }else{
      let expanded_child:node=(null as any);
      expanded_child=node_new(1,((node_org).value));
      for(let i:number=(1);Number((i)<(((node_org).child).length));i+=(1)){
        (((expanded_child).child)).splice((((expanded_child).child).length),0,(((((node_org).child))[i])));
      };
      (((expanded).child)).splice((((expanded).child).length),0,(expanded_child));
    };
    return expanded;
  };
  export function node_indent_needed(node:node,child:node):number{
    if(Number((((child).type))!=(1))){
      return 0;
    };
    if(((Number((((child).value))==("param")))||(Number((((child).value))==("result"))))){
      return 0;
    };
    if(((((((((((Number((((node).value))==("")))||(Number((((node).value))==("func")))))||(Number((((node).value))==("do")))))||(Number((((node).value))==("then")))))||(Number((((node).value))==("else")))))||(Number((((node).value))==("struct"))))){
      return 1;
    };
    return 0;
  };

let node_to_wax_indent:number=0;
  export function node_to_str(depth:number,node:node):string{
    let s:string=(null as any);
    s="";
    if(Number((((node).type))==(0))){
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        let child:string=(null as any);
        child=node_to_str(0,((((node).child))[i]));
        for(let j:number=(0);Number((j)<(((((((((node).child))[i])).token)).newlines)));j+=(1)){
          ((s)+=("\n"));
        };
        ((s)+=(child));
      };
    };
    if(Number((((node).type))==(1))){
      ((s)+=("("));
      ((s)+=(((node).value)));
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        let node_child:node=(null as any);
        node_child=((((node).child))[i]);
        let indent_needed:number=0;
        indent_needed=Number((((node_child).type))==(1));
        if(node_to_wax_indent){
          indent_needed=node_indent_needed(node,node_child);
          indent_needed=((((indent_needed)||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||"))));
        };
        indent_needed=Number((((((node_child).token)).newlines))>(0));
        let indent_depth:number=0;
        indent_depth=((indent_needed)?(depth):(((depth)-(1))));
        let indent:string=(null as any);
        indent="\t";
        if(indent_needed){
          for(let i:number=(0);Number((i)<(((((node_child).token)).newlines)));i+=(1)){
            ((s)+=("\n"));
          };
          for(let i:number=(0);Number((i)<=(indent_depth));i+=(1)){
            ((s)+=(indent));
          };
        }else{
          ((s)+=(" "));
        };
        let child:string=(null as any);
        child=node_to_str(((indent_depth)+(1)),node_child);
        ((s)+=(child));
        if(((indent_needed)&&(Number((i)==(((((node).child).length)-(1))))))){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(indent_depth));i+=(1)){
            ((s)+=(indent));
          };
        };
      };
      ((s)+=(")"));
    };
    if(Number((((node).type))!=(1))){
      ((s)+=(((node).value)));
    };
    return s;
  };
  export function node_to_wax(depth:number,node:node):string{
    node_to_wax_indent=1;
    return node_to_str(depth,node);
  };
  function error_exit(msg) { throw(msg) }  export function compile_error(module:string,node:node,msg:string){
    let out_:string=(null as any);
    out_=module;
    ((out_)+=(" error: "));
    ((out_)+=(((((((node).token)).file)).name)));
    ((out_)+=(", line "));
    ((out_)+=((((((node).token)).linenumber)).toString()));
    ((out_)+=("\n  "));
    ((out_)+=(msg));
    ((out_)+=("\n\n"));
    error_exit(out_);
  };
  export class node_symbol{
    name:string=(null as any);
    node:node=(null as any);
  };
  export function dump_symbol(symbol:Array<node_symbol>):string{
    let s:string=(null as any);
    s="";
    for(let i:number=(0);Number((i)<(symbol.length));i+=(1)){
      ((s)+=(" "));
      ((s)+=(((((symbol)[i])).name)));
    };
    return s;
  };
  export function node_symbol_scope_node(symbol:Array<node_symbol>,node:node):Array<node_symbol>{
    let copy_symbol:Array<node_symbol>=(null as any);
    copy_symbol=[];
    for(let i:number=(0);Number((i)<(symbol.length));i+=(1)){
      let s:node_symbol=(null as any);
      s=(new node_symbol());
      ((s).name=((((symbol)[i])).name));
      ((s).node=((((symbol)[i])).node));
      (copy_symbol).splice((copy_symbol.length),0,(s));
    };
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      let child:node=(null as any);
      child=((((node).child))[i]);
      if(((((((((Number((((child).value))==("struct")))||(Number((((child).value))==("func")))))||(Number((((child).value))==("let")))))||(Number((((child).value))==("param")))))||(Number((((child).value))==("for"))))){
        let s:node_symbol=(null as any);
        s=(new node_symbol());
        ((s).name=((((((child).child))[0])).value));
        ((s).node=child);
        (copy_symbol).splice((copy_symbol.length),0,(s));
      };
    };
    return copy_symbol;
  };
  export function node_symbol_get_node(symbol:Array<node_symbol>,type:string,node:node):node{
    for(let i:number=(((symbol.length)-(1)));Number((i)>=(0));i+=(-1)){
      if(Number((((((symbol)[i])).name))==(((node).value)))){
        if(((Number((type)==("")))||(Number((type)==(((((((symbol)[i])).node)).value)))))){
          return ((((symbol)[i])).node);
        };
      };
    };
    compile_error("Symbol",node,"symbol not found");
    return ((((symbol)[0])).node);
  };
  export function node_symbol_node_type_src(symbol:Array<node_symbol>,node:node):node{
    if(((((((((((((((Number((((node).type))==(2)))||(Number((((node).type))==(5)))))||(Number((((node).type))==(3)))))||(Number((((node).type))==(6)))))||(Number((((node).type))==(7)))))||(Number((((node).value))==("str")))))||(Number((((node).value))==("int")))))||(Number((((node).value))==("float"))))){
      return node;
    };
    if(Number((((node).type))==(4))){
      let symbol_node:node=(null as any);
      symbol_node=node_symbol_get_node(symbol,"",node);
      if(Number((((symbol_node).value))==("func"))){
        return node;
      };
      if(((((Number((((symbol_node).value))==("let")))||(Number((((symbol_node).value))==("param")))))||(Number((((symbol_node).value))==("for"))))){
        return node_symbol_node_type_src(symbol,((((symbol_node).child))[1]));
      };
    };
    if(Number((((node).type))==(1))){
      if(Number((((node).value))==("="))){
        return node;
      };
      if(Number((((node).value))==("#"))){
        return node;
      };
      if(Number((((node).value))==("vec"))){
        return node;
      };
      if(Number((((node).value))==("arr"))){
        return node;
      };
      if(Number((((node).value))==("struct"))){
        return node;
      };
      if(Number((((node).value))==("cast"))){
        return ((((node).child))[1]);
      };
      if(Number((((node).value))==("?"))){
        return ((((node).child))[1]);
      };
      if(Number((((node).value))==("call"))){
        let symbol_node:node=(null as any);
        symbol_node=node_symbol_get_node(symbol,"",((((node).child))[0]));
        for(let i:number=(1);Number((i)<(((symbol_node).child).length));i+=(1)){
          if(Number((((((((symbol_node).child))[i])).value))==("result"))){
            return ((((((((symbol_node).child))[i])).child))[0]);
          };
        };
        compile_error("Symbol",node,"function result not found");
      };
      if(Number((((node).value))==("get"))){
        let target_node:node=(null as any);
        if(Number((((((((node).child))[0])).type))==(4))){
          let symbol_node:node=(null as any);
          symbol_node=node_symbol_get_node(symbol,"",((((node).child))[0]));
          if(((Number((((symbol_node).value))!=("let")))&&(Number((((symbol_node).value))!=("param"))))){
            compile_error("Symbol",node,"symbol not variable");
          };
          target_node=((((symbol_node).child))[1]);
        }else{
          if(Number((((((((node).child))[0])).value))==("get"))){
            let get_node_type:node=(null as any);
            get_node_type=node_symbol_node_type_src(symbol,((((node).child))[0]));
            target_node=get_node_type;
          }else{
            compile_error("Symbol",node,"bad get expression");
          };
        };
        for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
          if(Number((((target_node).value))==("vec"))){
            target_node=((((target_node).child))[1]);
          }else{
            if(Number((((target_node).value))==("arr"))){
              target_node=((((target_node).child))[0]);
            }else{
              if(Number((((target_node).value))==("str"))){
                return node_new(2,"");
              }else{
                if(Number((((target_node).value))==("struct"))){
                  let symbol_node:node=(null as any);
                  symbol_node=node_symbol_get_node(symbol,"struct",((((target_node).child))[0]));
                  let found:number=0;
                  found=0;
                  for(let j:number=(1);Number((j)<(((symbol_node).child).length));j+=(1)){
                    if(((Number((((((((symbol_node).child))[j])).value))==("let")))&&(Number((((((((((((symbol_node).child))[j])).child))[0])).value))==(((((((node).child))[i])).value)))))){
                      target_node=((((((((symbol_node).child))[j])).child))[1]);
                      found=1;
                    };
                  };
                  if(Number(!(found))){
                    compile_error("Symbol",node,"struct member not found");
                  };
                };
              };
            };
          };
        };
        return node_symbol_node_type_src(symbol,target_node);
      };
      return node_symbol_node_type_src(symbol,((((node).child))[0]));
    };
    compile_error("Symbol",node,"source node not established");
    return node;
  };
  export function node_symbol_node_type(symbol:Array<node_symbol>,node:node):number{
    let src_node:node=(null as any);
    src_node=node_symbol_node_type_src(symbol,node);
    if(Number((((src_node).type))==(2))){
      return 2;
    };
    if(Number((((src_node).type))==(5))){
      return 1;
    };
    if(Number((((src_node).type))==(3))){
      return 2;
    };
    if(Number((((src_node).type))==(6))){
      return 2;
    };
    if(Number((((src_node).type))==(7))){
      return 3;
    };
    if(Number((((src_node).value))==("="))){
      return 2;
    };
    if(Number((((src_node).value))==("#"))){
      return 2;
    };
    if(Number((((src_node).value))==("str"))){
      return 1;
    };
    if(Number((((src_node).value))==("int"))){
      return 2;
    };
    if(Number((((src_node).value))==("float"))){
      return 3;
    };
    if(Number((((src_node).value))==("call"))){
      return 2;
    };
    return 0;
  };
  declare var require: any;  function readfile(filename) {    let fs=require('fs');    return fs.readFileSync(filename).toString();  }  export function preprocess_replace_node(node:node,define:Record<string,node>){
    if(Number((((node).type))==(2))){
      let k:string=(null as any);
      k="";
      for(let i:number=(1);Number((i)<((((node).value)).length));i+=(1)){
        (k)+=String.fromCharCode((((node).value)).charCodeAt(i));
      };
      let replace:node=(null as any);
      replace=((((((define)[k]??(null as any))).child))[1]);
      ((node).type=((replace).type));
      ((node).value=((replace).value));
    };
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      preprocess_replace_node(((((node).child))[i]),define);
    };
  };
  export function preprocess_replace(node:node):node{
    let define:Record<string,node>=(null as any);
    define={};
    let i:number=0;
    i=0;
    while(Number((i)<(((node).child).length))){
      if(Number((((((((node).child))[i])).value))==("@define"))){
        ((define)[((((((((((node).child))[i])).child))[0])).value)]=((((node).child))[i]));
        (((node).child)).splice((i),(1));
      }else{
        preprocess_replace_node(((((node).child))[i]),define);
        i=((i)+(1));
      };
    };
    return node;
  };
  export function preprocess_package_rewrite_identifier(package_:string,identifier:Record<string,number>,node:node){
    let v:string=(null as any);
    v=((node).value);
    if(Number((((node).type))==(2))){
      /**remove**/;
    };
    if(Number((((identifier)[v]??0))==(1))){
      let value:string=(null as any);
      if(Number((((node).type))==(2))){
        value="@";
      };
      ((value)+=("__"));
      ((value)+=(package_));
      ((value)+=("__"));
      ((value)+=(v));
      ((node).value=value);
    };
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      preprocess_package_rewrite_identifier(package_,identifier,((((node).child))[i]));
    };
  };
  export function preprocess_package_rewrite(package_:string,node:node){
    let identifier:Record<string,number>=(null as any);
    identifier={};
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      if(((((Number((((((((node).child))[i])).value))==("@define")))||(Number((((((((node).child))[i])).value))==("func")))))||(Number((((((((node).child))[i])).value))==("struct"))))){
        ((identifier)[((((((((((node).child))[i])).child))[0])).value)]=1);
      };
    };
    preprocess_package_rewrite_identifier(package_,identifier,node);
  };
  export function preprocess_package_from_path(pathprefix:string,node:node):string[]{
    let package_:string=(null as any);
    package_="";
    let filename:string=(null as any);
    filename="";
    let basepath:string=(null as any);
    basepath="";
    let quotedfilename:string=(null as any);
    quotedfilename=((((((node).child))[0])).value);
    if(Number((((node).child).length)==(2))){
      for(let i:number=(1);Number((i)<((((((((((node).child))[0])).value)).length)-(1))));i+=(1)){
        (package_)+=String.fromCharCode((((((((node).child))[0])).value)).charCodeAt(i));
      };
      quotedfilename=((((((node).child))[1])).value);
    };
    let start:number=0;
    start=0;
    let end:number=0;
    end=(quotedfilename).length;
    for(let i:number=(0);Number((i)<((quotedfilename).length));i+=(1)){
      if(Number(((quotedfilename).charCodeAt(i))==('/'.charCodeAt(0)))){
        start=((i)+(1));
      };
      if(Number(((quotedfilename).charCodeAt(i))==('.'.charCodeAt(0)))){
        end=i;
      };
    };
    if(Number((((node).child).length)==(1))){
      for(let i:number=(start);Number((i)<(end));i+=(1)){
        (package_)+=String.fromCharCode((quotedfilename).charCodeAt(i));
      };
    };
    for(let i:number=(0);Number((i)<((pathprefix).length));i+=(1)){
      (filename)+=String.fromCharCode((pathprefix).charCodeAt(i));
    };
    for(let i:number=(1);Number((i)<((((quotedfilename).length)-(1))));i+=(1)){
      (filename)+=String.fromCharCode((quotedfilename).charCodeAt(i));
    };
    for(let i:number=(0);Number((i)<((pathprefix).length));i+=(1)){
      (basepath)+=String.fromCharCode((pathprefix).charCodeAt(i));
    };
    for(let i:number=(1);Number((i)<(start));i+=(1)){
      (basepath)+=String.fromCharCode((quotedfilename).charCodeAt(i));
    };
    return [(package_),(filename),(basepath)];
  };
  export function preprocess_include_import(basepath:string,node:node){
    let i:number=0;
    i=0;
    while(Number((i)<(((node).child).length))){
      if(((Number((((((((node).child))[i])).value))==("@include")))||(Number((((((((node).child))[i])).value))==("@import"))))){
        let res:string[]=(null as any);
        res=preprocess_package_from_path(basepath,((((node).child))[i]));
        let package_:string=(null as any);
        package_=((res)[0]);
        let filename:string=(null as any);
        filename=((res)[1]);
        let prefix:string=(null as any);
        prefix=((res)[2]);
        let include_str:string=(null as any);
        include_str=readfile(filename);
        if(Number(((include_str).length)==(0))){
          let err:string=(null as any);
          err="Cannot open file: ";
          ((err)+=(filename));
          compile_error("Preprocess",((((node).child))[i]),err);
        };
        let tokens:Array<token>=(null as any);
        tokens=token_parse(include_str,filename,0);
        let include:node=(null as any);
        include=node_from_tokens(tokens);
        preprocess_include_import(prefix,include);
        if(Number((((((((node).child))[i])).value))==("@import"))){
          preprocess_package_rewrite(package_,include);
        };
        (((node).child)).splice((i),(1));
        for(let j:number=(0);Number((j)<(((include).child).length));j+=(1)){
          (((node).child)).splice((((i)+(j))),0,(((((include).child))[j])));
        };
        i=((i)+(((include).child).length));
      }else{
        i=((i)+(1));
      };
    };
  };
  export function preprocess_identifier_rewrite(node:node){
    if(Number((((node).type))==(4))){
      for(let i:number=(0);Number((i)<((((node).value)).length));i+=(1)){
        if(Number(((((node).value)).charCodeAt(i))==('.'.charCodeAt(0)))){
          /**remove**/;
          /**insert**/;
          /**insert**/;
          /**insert**/;
          /**insert**/;
        };
      };
    };
    if(Number((((node).type))==(2))){
      for(let i:number=(0);Number((i)<((((node).value)).length));i+=(1)){
        if(Number(((((node).value)).charCodeAt(i))==('.'.charCodeAt(0)))){
          /**remove**/;
          /**insert**/;
          /**insert**/;
          /**insert**/;
          /**insert**/;
        };
      };
    };
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      preprocess_identifier_rewrite(((((node).child))[i]));
    };
  };
  export function preprocess(node:node):node{
    preprocess_include_import("",node);
    preprocess_identifier_rewrite(node);
    return node;
  };
  export function preprocess_vdom_quote(value:string):string{
    let out_:string=(null as any);
    out_="";
    ((out_)+=("\""));
    ((out_)+=(value));
    ((out_)+=("\""));
    return out_;
  };
  export function preprocess_vdom_isaction(type:string):number{
    if(((((Number((type)==("do")))||(Number((type)==("then")))))||(Number((type)==("else"))))){
      return 1;
    };
    return 0;
  };
  export function preprocess_vdom_reserverd(type:string):number{
    if(((((((((((((((Number((type)==("let")))||(Number((type)==("set")))))||(Number((type)==("<<")))))||(Number((type)==("if")))))||(Number((type)==("else")))))||(Number((type)==("for")))))||(Number((type)==("while")))))||(Number((type)==("do"))))){
      return 1;
    };
    return 0;
  };
  export function preprocess_vdom_element(node:node):node{
    let out_:node=(null as any);
    out_=node_new(1,"call");
    (((out_).child)).splice((0),0,(node_new(4,"__vdom__element_new")));
    (((out_).child)).splice((1),0,(node_new(5,preprocess_vdom_quote(((node).value)))));
    return out_;
  };
  export function preprocess_vdom_element_child(depth:number,name:string,node:node):Array<node>{
    let out_:Array<node>=(null as any);
    out_=[];
    let i:number=0;
    i=0;
    while(Number((i)<(((node).child).length))){
      let type:string=(null as any);
      type="";
      if(Number((((((((node).child))[i])).type))==(4))){
        type="attr";
        if(((Number((((((((node).child))[((i)+(1))])).type))==(1)))&&(Number((((((((node).child))[((i)+(1))])).value))==("func"))))){
          type="event";
        };
      };
      if(Number((((((((node).child))[i])).type))==(1))){
        type="element";
        if(Number((((((((node).child))[i])).value))==("child"))){
          type="child";
        };
        if(Number((preprocess_vdom_reserverd(((((((node).child))[i])).value)))!=(0))){
          type="reserved";
        };
      };
      if(((Number((type)==("attr")))||(Number((type)==("event"))))){
        let attr_set:node=(null as any);
        attr_set=node_new(1,"set");
        ((((attr_set).token)).newlines=1);
        (((attr_set).child)).splice((0),0,(node_new(4,name)));
        (((attr_set).child)).splice((1),0,(node_new(4,type)));
        (((attr_set).child)).splice((2),0,(node_new(5,preprocess_vdom_quote(((((((node).child))[i])).value)))));
        if(((Number((type)==("event")))||(Number((((((((node).child))[((i)+(1))])).type))==(5))))){
          (((attr_set).child)).splice((3),0,(((((node).child))[((i)+(1))])));
        }else{
          let value:node=(null as any);
          value=node_new(1,"cast");
          (((value).child)).splice((0),0,(((((node).child))[((i)+(1))])));
          (((value).child)).splice((1),0,(node_new(4,"str")));
          (((attr_set).child)).splice((3),0,(value));
        };
        (out_).splice((out_.length),0,(attr_set));
        i=((i)+(1));
      };
      if(Number((type)==("reserved"))){
        let child:Array<node>=(null as any);
        child=((((((node).child))[i])).child);
        ((((((node).child))[i])).child)=[];
        for(let j:number=(0);Number((j)<(child.length));j+=(1)){
          if(((Number((((((child)[j])).type))==(1)))&&(preprocess_vdom_isaction(((((child)[j])).value))))){
            let action_node:node=(null as any);
            action_node=node_new(1,((((child)[j])).value));
            let element_child:Array<node>=(null as any);
            element_child=preprocess_vdom_element_child(((depth)+(1)),name,((child)[j]));
            for(let k:number=(0);Number((k)<(element_child.length));k+=(1)){
              (((action_node).child)).splice((((action_node).child).length),0,(((element_child)[k])));
            };
            (((((((node).child))[i])).child)).splice((((((((node).child))[i])).child).length),0,(action_node));
          }else{
            (((((((node).child))[i])).child)).splice((((((((node).child))[i])).child).length),0,(((child)[j])));
          };
        };
        (out_).splice((out_.length),0,(((((node).child))[i])));
      };
      if(Number((type)==("child"))){
        let element_insert:node=(null as any);
        element_insert=node_new(1,"insert");
        ((((element_insert).token)).newlines=1);
        ((((element_insert).token)).newlines=1);
        let element_insert_get:node=(null as any);
        element_insert_get=node_new(1,"get");
        (((element_insert_get).child)).splice((0),0,(node_new(4,name)));
        (((element_insert_get).child)).splice((1),0,(node_new(4,"child")));
        (((element_insert).child)).splice((0),0,(element_insert_get));
        let element_insert_count:node=(null as any);
        element_insert_count=node_new(1,"#");
        let element_insert_count_get:node=(null as any);
        element_insert_count_get=node_new(1,"get");
        (((element_insert_count_get).child)).splice((0),0,(node_new(4,name)));
        (((element_insert_count_get).child)).splice((1),0,(node_new(4,"child")));
        (((element_insert_count).child)).splice((0),0,(element_insert_count_get));
        (((element_insert).child)).splice((1),0,(element_insert_count));
        (((element_insert).child)).splice((2),0,(node_new(4,((((((((((node).child))[i])).child))[0])).value))));
        (out_).splice((out_.length),0,(element_insert));
      };
      if(Number((type)==("element"))){
        let block:node=(null as any);
        block=node_new(1,"");
        if(Number((preprocess_vdom_isaction(((node).value)))!=(0))){
          ((block).value=((node).value));
        };
        ((((block).token)).newlines=1);
        (out_).splice((out_.length),0,(block));
        let child_name:string=(null as any);
        child_name="_";
        ((child_name)+=((depth).toString()));
        ((child_name)+=("_"));
        ((child_name)+=((i).toString()));
        ((child_name)+=("_"));
        ((child_name)+=(((((((node).child))[i])).value)));
        let element:node=(null as any);
        element=node_new(1,"let");
        ((((element).token)).newlines=1);
        (((element).child)).splice((0),0,(node_new(4,child_name)));
        let element_struct:node=(null as any);
        element_struct=node_new(1,"struct");
        (((element_struct).child)).splice((0),0,(node_new(4,"__vdom__element")));
        (((element).child)).splice((1),0,(element_struct));
        (((element).child)).splice((2),0,(preprocess_vdom_element(((((node).child))[i]))));
        (((block).child)).splice((((block).child).length),0,(element));
        let element_insert:node=(null as any);
        element_insert=node_new(1,"insert");
        ((((element_insert).token)).newlines=1);
        let element_insert_get:node=(null as any);
        element_insert_get=node_new(1,"get");
        (((element_insert_get).child)).splice((0),0,(node_new(4,name)));
        (((element_insert_get).child)).splice((1),0,(node_new(4,"child")));
        (((element_insert).child)).splice((0),0,(element_insert_get));
        let element_insert_count:node=(null as any);
        element_insert_count=node_new(1,"#");
        let element_insert_count_get:node=(null as any);
        element_insert_count_get=node_new(1,"get");
        (((element_insert_count_get).child)).splice((0),0,(node_new(4,name)));
        (((element_insert_count_get).child)).splice((1),0,(node_new(4,"child")));
        (((element_insert_count).child)).splice((0),0,(element_insert_count_get));
        (((element_insert).child)).splice((1),0,(element_insert_count));
        (((element_insert).child)).splice((2),0,(node_new(4,child_name)));
        (((block).child)).splice((((block).child).length),0,(element_insert));
        let element_child:Array<node>=(null as any);
        element_child=preprocess_vdom_element_child(((depth)+(1)),child_name,((((node).child))[i]));
        for(let j:number=(0);Number((j)<(element_child.length));j+=(1)){
          (((block).child)).splice((((block).child).length),0,(((element_child)[j])));
        };
      };
      i=((i)+(1));
    };
    return out_;
  };
  export function preprocess_vdom(node:node):node{
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      if(((((((((Number((((((((node).child))[i])).value))==("let")))&&(Number((((((((node).child))[i])).child).length)==(3)))))&&(Number((((((((((((node).child))[i])).child))[1])).value))==("struct")))))&&(((Number((((((((((((((((node).child))[i])).child))[1])).child))[0])).value))==("vdom.element")))||(Number((((((((((((((((node).child))[i])).child))[1])).child))[0])).value))==("__vdom__element")))))))&&(((Number((((((((((((node).child))[i])).child))[2])).value))!=("call")))&&(Number((((((((((((node).child))[i])).child))[2])).value))!=("alloc"))))))){
        let element_child:Array<node>=(null as any);
        element_child=preprocess_vdom_element_child(0,((((((((((node).child))[i])).child))[0])).value),((((((((node).child))[i])).child))[2]));
        ((((((((node).child))[i])).child))[2])=preprocess_vdom_element(((((((((node).child))[i])).child))[2]));
        ((((((((((((node).child))[i])).child))[2])).token)).newlines=0);
        for(let j:number=(0);Number((j)<(element_child.length));j+=(1)){
          i=((i)+(1));
          (((node).child)).splice((i),0,(((element_child)[j])));
        };
      }else{
        ((((node).child))[i])=preprocess_vdom(((((node).child))[i]));
      };
    };
    return node;
  };
  export function validate(node:node){
    if(Number((((node).type))==(1))){
      if(Number((((node).value))==("let"))){
        if(((Number((((node).child).length)<(2)))||(Number((((node).child).length)>(3))))){
          compile_error("Validation",node,"'let' requires 2 or 3 args");
        };
      };
    };
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      let child:string=(null as any);
      child=node_to_str(0,((((node).child))[i]));
      validate(((((node).child))[i]));
    };
  };
  export function node_to_js(depth:number,node:node):string{
    let s:string=(null as any);
    s="";
    depth=((depth)+(1));
    node=node_copy(node);
    if(Number((((node).type))==(0))){
      let has_main:number=0;
      has_main=0;
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        if(((Number((((((((node).child))[i])).value))==("func")))&&(Number((((((((((((node).child))[i])).child))[0])).value))==("main"))))){
          has_main=1;
        };
        let child:string=(null as any);
        child=node_to_js(0,((((node).child))[i]));
        ((s)+=(child));
        ((s)+=("\n"));
      };
      if(has_main){
        ((s)+=("(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));\n"));
      };
    };
    if(((((Number((((node).value))==("+")))||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||"))))){
      node=node_expand(node);
    };
    if(Number((((node).type))==(1))){
      let block_start:string=(null as any);
      block_start="(";
      ((block_start)+=(((node).value)));
      let block_end:string=(null as any);
      block_end=")";
      let block_seperator:string=(null as any);
      block_seperator=" ";
      if(Number((((node).value))==(""))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("@define"))){
        block_start="const ";
        ((block_start)+=(((((((node).child))[0])).value)));
        ((block_start)+=(" = "));
        ((block_start)+=(((((((node).child))[1])).value)));
        ((block_start)+=(";"));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("@if"))){
        block_start="";
        block_end="";
        if(Number((((((((node).child))[0])).value))==("TARGET_JS"))){
          (((node).child)).splice((0),(1));
          (((node).child)).splice((0),(1));
        }else{
          while(Number((((node).child).length)>(0))){
            (((node).child)).splice((0),(1));
          };
        };
      };
      if(Number((((node).value))==("extern"))){
        block_start="";
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("asm"))){
        let quotedline:string=(null as any);
        quotedline=((((((node).child))[0])).value);
        let line:string=(null as any);
        line="";
        for(let j:number=(1);Number((j)<((((quotedline).length)-(1))));j+=(1)){
          (line)+=String.fromCharCode((quotedline).charCodeAt(j));
        };
        block_start=line;
        block_end="\n";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("struct"))){
        block_start="";
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("func"))){
        block_start="function ";
        if(Number((((((((node).child))[0])).type))==(4))){
          let fname_node:node=(null as any);
          fname_node=((((node).child))[0]);
          ((block_start)+=(((fname_node).value)));
          (((node).child)).splice((0),(1));
        };
        ((block_start)+=("("));
        let param_count:number=0;
        param_count=0;
        let i:number=0;
        i=0;
        while(Number((i)<(((node).child).length))){
          let child_node:node=(null as any);
          child_node=((((node).child))[i]);
          if(Number((((child_node).value))==("param"))){
            if(Number((((child_node).child).length)==(2))){
              let param_node:node=(null as any);
              param_node=((((child_node).child))[0]);
              if(Number((param_count)>(0))){
                ((block_start)+=(", "));
              };
              ((block_start)+=(((param_node).value)));
              param_count=((param_count)+(1));
            };
            (((node).child)).splice((i),(1));
            i=((i)-(1));
          };
          if(Number((((child_node).value))==("result"))){
            (((node).child)).splice((i),(1));
            i=((i)-(1));
          };
          i=((i)+(1));
        };
        ((block_start)+=(") {"));
        block_end="}";
      };
      if(Number((((node).value))==("call"))){
        let fname_node:node=(null as any);
        fname_node=((((node).child))[0]);
        block_start=((fname_node).value);
        ((block_start)+=("("));
        block_end=")";
        (((node).child)).splice((0),(1));
        block_seperator=", ";
      };
      if(((Number((((node).value))==("let")))||(Number((((node).value))==("local"))))){
        block_start="let ";
        block_end="";
        (((node).child)).splice((1),(1));
        if(Number((((node).child).length)==(2))){
          (((node).child)).splice((1),0,(node_new(4,"=")));
        };
      };
      if(Number((((node).value))==("alloc"))){
        block_start="";
        block_end="";
        let child:node=(null as any);
        child=((((node).child))[0]);
        if(Number((((child).type))==(1))){
          if(((Number((((((((node).child))[0])).value))==("vec")))&&(Number((((node).child).length)==(1))))){
            block_start="new Array(";
            ((block_start)+=(node_to_js(depth,((((((((node).child))[0])).child))[0]))));
            ((block_start)+=(").fill(0)"));
          }else{
            if(((Number((((((((node).child))[0])).value))==("arr")))||(Number((((((((node).child))[0])).value))==("vec"))))){
              block_start="[";
              for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
                ((block_start)+=(node_to_js(depth,((((node).child))[i]))));
                if(Number((i)<(((((node).child).length)-(1))))){
                  ((block_start)+=(","));
                };
              };
              ((block_start)+=("]"));
            };
          };
          if(((Number((((((((node).child))[0])).value))==("map")))||(Number((((((((node).child))[0])).value))==("struct"))))){
            block_start="{}";
          };
        };
        if(Number((((child).type))==(4))){
          if(Number((((node).child).length)>=(2))){
            block_start=node_to_js(depth,((((node).child))[1]));
          }else{
            block_start="\"\"";
          };
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("free"))){
        block_start="/*GC*/";
        block_end="";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("#"))){
        block_start="";
        block_end=".length";
      };
      if(Number((((node).value))==("insert"))){
        block_start=node_to_js(depth,((((node).child))[0]));
        ((block_start)+=(".splice("));
        ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
        ((block_start)+=(",0,"));
        ((block_start)+=(node_to_js(depth,((((node).child))[2]))));
        block_end=")";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("remove"))){
        if(Number((((((((node).child))[1])).type))!=(5))){
          block_start=node_to_js(depth,((((node).child))[0]));
          ((block_start)+=(".splice("));
          ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
          ((block_start)+=(","));
          ((block_start)+=(node_to_js(depth,((((node).child))[2]))));
          block_end=")";
        };
        if(Number((((((((node).child))[1])).type))==(5))){
          block_start="delete ";
          ((block_start)+=(node_to_js(depth,((((node).child))[0]))));
          ((block_start)+=("["));
          ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
          block_end="]";
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("slice"))){
        block_start=node_to_js(depth,((((node).child))[0]));
        ((block_start)+=(".slice("));
        ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
        ((block_start)+=(",("));
        ((block_start)+=(node_to_js(depth,((((node).child))[2]))));
        ((block_start)+=(" + "));
        ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
        block_end="))";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("get"))){
        block_start=node_to_js(depth,((((node).child))[0]));
        block_end="";
        for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
          let child:node=(null as any);
          child=((((node).child))[i]);
          if(((Number((((child).type))==(4)))&&(Number(((((child).value)).length)>(1))))){
            ((block_end)+=("."));
            ((block_end)+=(node_to_js(depth,((((node).child))[i]))));
            ((block_end)+=(""));
          }else{
            ((block_end)+=("["));
            ((block_end)+=(node_to_js(depth,((((node).child))[i]))));
            ((block_end)+=("]"));
          };
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("set"))){
        block_start=node_to_js(depth,((((node).child))[0]));
        block_end="";
        let n:number=0;
        n=((((node).child).length)-(1));
        for(let i:number=(1);Number((i)<(n));i+=(1)){
          let child:node=(null as any);
          child=((((node).child))[i]);
          if(((Number((((child).type))==(4)))&&(Number(((((child).value)).length)>(1))))){
            ((block_end)+=("."));
            ((block_end)+=(node_to_js(depth,((((node).child))[i]))));
            ((block_end)+=(""));
          }else{
            ((block_end)+=("["));
            ((block_end)+=(node_to_js(depth,((((node).child))[i]))));
            ((block_end)+=("]"));
          };
        };
        ((block_end)+=(" = "));
        ((block_end)+=(node_to_js(depth,((((node).child))[n]))));
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("cast"))){
        if(Number((((((((node).child))[1])).value))==("str"))){
          block_start="\"\"+";
          block_end=node_to_js(depth,((((node).child))[0]));
        };
        if(Number((((((((node).child))[1])).value))==("int"))){
          block_start=node_to_js(depth,((((node).child))[0]));
          block_end="|0";
        };
        (((node).child)).splice((0),(1));
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("then"))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("else"))){
        block_start="else {";
        block_end="}";
      };
      if(Number((((node).value))==("for"))){
        if(Number((((node).child).length)==(5))){
          block_start="for (let ";
          ((block_start)+=(node_to_js(depth,((((node).child))[0]))));
          ((block_start)+=(" = "));
          ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
          ((block_start)+=("; "));
          ((block_start)+=(node_to_js(depth,((((node).child))[2]))));
          ((block_start)+=("; "));
          ((block_start)+=(node_to_js(depth,((((node).child))[0]))));
          ((block_start)+=(" += "));
          ((block_start)+=(node_to_js(depth,((((node).child))[3]))));
          ((block_start)+=(") "));
          (((node).child)).splice((0),(4));
          block_end="";
        };
        if(Number((((node).child).length)==(4))){
          block_start="for (const [";
          ((block_start)+=(node_to_js(depth,((((node).child))[0]))));
          ((block_start)+=(","));
          ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
          ((block_start)+=("] of Object.entries("));
          ((block_start)+=(node_to_js(depth,((((node).child))[2]))));
          ((block_start)+=("))"));
          (((node).child)).splice((0),(3));
          block_end="";
        };
      };
      if(((Number((((node).value))==("if")))||(Number((((node).value))==("while"))))){
        block_start=((node).value);
        ((block_start)+=(" "));
        let block_simple:number=0;
        block_simple=Number((((((((node).child))[0])).type))!=(1));
        if(block_simple){
          ((block_start)+=("("));
        };
        ((block_start)+=(node_to_js(depth,((((node).child))[0]))));
        if(block_simple){
          ((block_start)+=(")"));
        };
        ((block_start)+=(" "));
        block_end="";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("do"))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("break"))){
        block_start="break";
        block_end="";
      };
      if(Number((((node).value))==("?"))){
        block_start=node_to_js(depth,((((node).child))[0]));
        ((block_start)+=(" ? "));
        ((block_start)+=(node_to_js(depth,((((node).child))[1]))));
        ((block_start)+=(" : "));
        ((block_start)+=(node_to_js(depth,((((node).child))[2]))));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("print"))){
        block_start="console.log(";
      };
      if(((((((((((((((((((((((((((((((((((((Number((((node).value))==(">>")))||(Number((((node).value))==("<<")))))||(Number((((node).value))==("=")))))||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||")))))||(Number((((node).value))==(">=")))))||(Number((((node).value))==("<=")))))||(Number((((node).value))==("<>")))))||(Number((((node).value))==("+")))))||(Number((((node).value))==("-")))))||(Number((((node).value))==("*")))))||(Number((((node).value))==("/")))))||(Number((((node).value))==("^")))))||(Number((((node).value))==("%")))))||(Number((((node).value))==("&")))))||(Number((((node).value))==("|")))))||(Number((((node).value))==("~")))))||(Number((((node).value))==("<")))))||(Number((((node).value))==(">"))))){
        block_start="(";
        block_end=")";
        if(Number((((node).value))==("="))){
          ((node).value="==");
        };
        if(Number((((node).value))==("<>"))){
          ((node).value="!=");
        };
        if(((Number((((node).value))==("<<")))&&(Number((((((((node).child))[0])).type))==(4))))){
          ((node).value="+=");
        };
        (((node).child)).splice((1),0,(node_new(4,((node).value))));
      };
      if(Number((((node).value))==("return"))){
        if(Number((((node).child).length)>(0))){
          block_start="return(";
          block_end=")";
        }else{
          block_start="return";
          block_end="";
        };
      };
      ((s)+=(block_start));
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        let node_child:node=(null as any);
        node_child=((((node).child))[i]);
        let indent_needed:number=0;
        indent_needed=node_indent_needed(node,node_child);
        let indent_depth:number=0;
        indent_depth=((indent_needed)?(depth):(((depth)-(1))));
        let indent:string=(null as any);
        indent="  ";
        if(indent_needed){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(indent_depth));i+=(1)){
            ((s)+=(indent));
          };
        }else{
          if(Number((i)>(0))){
            ((s)+=(block_seperator));
          };
        };
        let child:string=(null as any);
        child=node_to_js(indent_depth,node_child);
        ((s)+=(child));
        if(((((((((Number((((node).value))==("")))||(Number((((node).value))==("func")))))||(Number((((node).value))==("do")))))||(Number((((node).value))==("then")))))||(Number((((node).value))==("else"))))){
          ((s)+=(";"));
        };
        if(((indent_needed)&&(Number((i)==(((((node).child).length)-(1))))))){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(((indent_depth)-(1))));i+=(1)){
            ((s)+=(indent));
          };
        };
      };
      ((s)+=(block_end));
    };
    if(Number((((node).type))!=(1))){
      let value:string=(null as any);
      value=((node).value);
      if(Number((((node).type))==(2))){
        value="";
        for(let i:number=(1);Number((i)<((((node).value)).length));i+=(1)){
          (value)+=String.fromCharCode((((node).value)).charCodeAt(i));
        };
      };
      if(Number((((node).type))==(8))){
        value="// ";
        ((value)+=(((node).value)));
      };
      ((s)+=(value));
    };
    return s;
  };
  export function node_to_cpp_preprocess(node:node):string{
    let value:string=(null as any);
    value=((node).value);
    if(Number((((node).type))==(2))){
      value="";
      for(let i:number=(1);Number((i)<((((node).value)).length));i+=(1)){
        (value)+=String.fromCharCode((((node).value)).charCodeAt(i));
      };
    };
    return value;
  };
  export function node_to_cpp_type(node:node):string{
    let type:string=(null as any);
    type=((node).value);
    if(Number((((node).value))==("str"))){
      type="std::string";
    };
    if(Number((((node).value))==("vec"))){
      type="std::array<";
      ((type)+=(node_to_cpp_type(((((node).child))[1]))));
      ((type)+=(","));
      ((type)+=(node_to_cpp_preprocess(((((node).child))[0]))));
      ((type)+=(">"));
    };
    if(Number((((node).value))==("arr"))){
      type="std::vector<";
      ((type)+=(node_to_cpp_type(((((node).child))[0]))));
      ((type)+=(">"));
    };
    if(Number((((node).value))==("struct"))){
      type="struct ";
      ((type)+=(((((((node).child))[0])).value)));
      ((type)+=("*"));
    };
    if(Number((type)==("map"))){
      type="std::map<";
      ((type)+=(node_to_cpp_type(((((node).child))[0]))));
      ((type)+=(","));
      ((type)+=(node_to_cpp_type(((((node).child))[1]))));
      ((type)+=(">"));
    };
    if(Number((type)==("func"))){
      let return_type:string=(null as any);
      return_type="void";
      let params_:string=(null as any);
      params_="void";
      let i:number=0;
      i=0;
      while(Number((i)<(((node).child).length))){
        let child_node:node=(null as any);
        child_node=((((node).child))[i]);
        if(Number((((child_node).value))==("param"))){
          if(Number((params_)==("void"))){
            params_="";
          }else{
            ((params_)+=(", "));
          };
          let type:string=(null as any);
          type="";
          type=node_to_cpp_type(((((child_node).child))[1]));
          if(((((Number((((((((child_node).child))[1])).value))==("vec")))||(Number((((((((child_node).child))[1])).value))==("arr")))))||(Number((((((((child_node).child))[1])).value))==("map"))))){
            ((type)+=("&"));
          };
          ((params_)+=(type));
          ((params_)+=(" "));
          ((params_)+=(((((((child_node).child))[0])).value)));
          (((node).child)).splice((i),(1));
          i=((i)-(1));
        };
        if(Number((((child_node).value))==("result"))){
          return_type=node_to_cpp_type(((((child_node).child))[0]));
          (((node).child)).splice((i),(1));
          i=((i)-(1));
        };
        i=((i)+(1));
      };
      let function_:string=(null as any);
      function_="";
      if(Number((((node).child).length)>(0))){
        if(Number((((((((node).child))[0])).type))==(4))){
          let func_name:string=(null as any);
          func_name=((((((node).child))[0])).value);
          if(Number((func_name)==("main"))){
            func_name="main_args";
            params_="std::vector<std::string>& args";
            return_type="int";
          };
          ((function_)+=(return_type));
          ((function_)+=(" "));
          ((function_)+=(func_name));
          ((function_)+=("("));
          ((function_)+=(params_));
          ((function_)+=(")"));
        }else{
          ((function_)+=("[=]("));
          ((function_)+=(params_));
          ((function_)+=(")"));
        };
      }else{
        ((function_)+=("std::function<"));
        ((function_)+=(return_type));
        ((function_)+=(" ("));
        ((function_)+=(params_));
        ((function_)+=(")>"));
      };
      type=function_;
    };
    return type;
  };
  export function node_to_cpp(depth:number,node:node):string{
    let s:string=(null as any);
    s="";
    depth=((depth)+(1));
    node=node_copy(node);
    if(Number((((node).type))==(0))){
      ((s)+=("#include <iostream>\n"));
      ((s)+=("#include <sstream>\n"));
      ((s)+=("#include <string>\n"));
      ((s)+=("#include <vector>\n"));
      ((s)+=("#include <array>\n"));
      ((s)+=("#include <map>\n"));
      ((s)+=("#include <functional>\n"));
      ((s)+=("template<typename T> std::string tostring(const T& x) {\n"));
      ((s)+=("  std::stringstream ss;\n"));
      ((s)+=("  ss << x;\n"));
      ((s)+=("  return ss.str();\n"));
      ((s)+=("}\n"));
      ((s)+=("\n\n"));
      let has_main:number=0;
      has_main=0;
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        if(((Number((((((((node).child))[i])).value))==("func")))&&(Number((((((((((((node).child))[i])).child))[0])).value))==("main"))))){
          has_main=1;
        };
        let child:string=(null as any);
        child=node_to_cpp(0,((((node).child))[i]));
        ((s)+=(child));
        if(Number((((((((node).child))[i])).value))==("let"))){
          ((s)+=(";"));
        };
        ((s)+=("\n"));
      };
      if(has_main){
        ((s)+=("int main(int argc, char** argv) {\n"));
        ((s)+=("  std::vector<std::string> args(argv, argv + argc);\n"));
        ((s)+=("  return main_args(args);\n"));
        ((s)+=("};\n"));
      };
    };
    if(((((Number((((node).value))==("+")))||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||"))))){
      node=node_expand(node);
    };
    if(Number((((node).type))==(1))){
      let block_start:string=(null as any);
      block_start="(";
      ((block_start)+=(((node).value)));
      let block_end:string=(null as any);
      block_end=")";
      let block_seperator:string=(null as any);
      block_seperator=" ";
      if(Number((((node).value))==(""))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("@define"))){
        block_start="#define ";
        ((block_start)+=(((((((node).child))[0])).value)));
        ((block_start)+=(" "));
        ((block_start)+=(((((((node).child))[1])).value)));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("@if"))){
        block_start="";
        block_end="";
        if(Number((((((((node).child))[0])).value))==("TARGET_CPP"))){
          (((node).child)).splice((0),(1));
          (((node).child)).splice((0),(1));
        }else{
          while(Number((((node).child).length)>(0))){
            (((node).child)).splice((0),(1));
          };
        };
      };
      if(Number((((node).value))==("extern"))){
        block_start="";
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("asm"))){
        let quotedline:string=(null as any);
        quotedline=((((((node).child))[0])).value);
        let line:string=(null as any);
        line="";
        for(let j:number=(1);Number((j)<((((quotedline).length)-(1))));j+=(1)){
          if(Number(((quotedline).charCodeAt(j))!=(92))){
            (line)+=String.fromCharCode((quotedline).charCodeAt(j));
          };
        };
        block_start=line;
        block_end="\n";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("struct"))){
        block_start="struct ";
        ((block_start)+=(((((((node).child))[0])).value)));
        ((block_start)+=(" {"));
        block_end="};";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("func"))){
        block_start=node_to_cpp_type(node);
        ((block_start)+=(" {"));
        block_end="}";
        if(Number((((((((node).child))[0])).type))==(4))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("call"))){
        let fname_node:node=(null as any);
        fname_node=((((node).child))[0]);
        block_start=((fname_node).value);
        ((block_start)+=("("));
        block_end=")";
        (((node).child)).splice((0),(1));
        block_seperator=", ";
      };
      if(((Number((((node).value))==("let")))||(Number((((node).value))==("local"))))){
        let type:string=(null as any);
        type=node_to_cpp_type(((((node).child))[1]));
        block_start=type;
        ((block_start)+=(" "));
        block_end="";
        (((node).child)).splice((1),(1));
        if(Number((((node).child).length)==(2))){
          (((node).child)).splice((1),0,(node_new(4,"=")));
        };
      };
      if(Number((((node).value))==("alloc"))){
        block_start="";
        block_end="";
        if(Number((((((((node).child))[0])).value))==("str"))){
          block_start="\"\"";
          if(Number((((node).child).length)>(1))){
            block_start=((((((node).child))[1])).value);
          };
        };
        if(Number((((((((node).child))[0])).type))==(1))){
          if(((Number((((((((node).child))[0])).value))==("vec")))||(Number((((((((node).child))[0])).value))==("arr"))))){
            if(Number((((node).child).length)==(1))){
              let init:string=(null as any);
              init=node_to_cpp_type(((((node).child))[0]));
              ((init)+=("()"));
              block_start=init;
            }else{
              block_start="{";
              for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
                ((block_start)+=(node_to_cpp(depth,((((node).child))[i]))));
                if(Number((i)<(((((node).child).length)-(1))))){
                  ((block_start)+=(","));
                };
              };
              ((block_start)+=("}"));
            };
          };
          if(Number((((((((node).child))[0])).value))==("struct"))){
            block_start="new ";
            ((block_start)+=(((((((((((node).child))[0])).child))[0])).value)));
            ((block_start)+=("()"));
          };
          if(Number((((((((node).child))[0])).value))==("map"))){
            block_start="{}";
          };
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("free"))){
        block_start="/*GC*/";
        block_end="";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("#"))){
        block_start="";
        block_end=".size()";
      };
      if(Number((((node).value))==("insert"))){
        let array:string=(null as any);
        array=node_to_cpp(depth,((((node).child))[0]));
        let position:string=(null as any);
        position=node_to_cpp(depth,((((node).child))[1]));
        let value:string=(null as any);
        value=node_to_cpp(depth,((((node).child))[2]));
        block_start=array;
        ((block_start)+=(".insert("));
        ((block_start)+=(array));
        ((block_start)+=(".begin()+"));
        ((block_start)+=(position));
        ((block_start)+=(","));
        ((block_start)+=(value));
        block_end=")";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("remove"))){
        if(Number((((node).child).length)==(2))){
          block_start=node_to_cpp(depth,((((node).child))[0]));
          ((block_start)+=(".erase("));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[1]))));
          block_end=")";
        }else{
          let array:string=(null as any);
          array=node_to_cpp(depth,((((node).child))[0]));
          let first:string=(null as any);
          first=node_to_cpp(depth,((((node).child))[1]));
          let last:string=(null as any);
          last=node_to_cpp(depth,((((node).child))[2]));
          block_start=array;
          ((block_start)+=(".erase("));
          ((block_start)+=(array));
          ((block_start)+=(".begin()+"));
          ((block_start)+=(first));
          ((block_start)+=(","));
          ((block_start)+=(array));
          ((block_start)+=(".begin()+"));
          ((block_start)+=(first));
          ((block_start)+=("+"));
          ((block_start)+=(last));
          block_end=")";
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("slice"))){
        block_start=node_to_cpp(depth,((((node).child))[0]));
        ((block_start)+=(".substr("));
        ((block_start)+=(node_to_cpp(depth,((((node).child))[1]))));
        ((block_start)+=(","));
        ((block_start)+=(node_to_cpp(depth,((((node).child))[2]))));
        block_end=")";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("get"))){
        block_start=node_to_cpp(depth,((((node).child))[0]));
        block_end="";
        for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
          let child:node=(null as any);
          child=((((node).child))[i]);
          if(((Number((((child).type))==(4)))&&(Number(((((child).value)).length)>(1))))){
            ((block_end)+=("->"));
            ((block_end)+=(node_to_cpp(depth,((((node).child))[i]))));
            ((block_end)+=(""));
          }else{
            ((block_end)+=("["));
            ((block_end)+=(node_to_cpp(depth,((((node).child))[i]))));
            ((block_end)+=("]"));
          };
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("set"))){
        block_start=node_to_cpp(depth,((((node).child))[0]));
        block_end="";
        let n:number=0;
        n=((((node).child).length)-(1));
        for(let i:number=(1);Number((i)<(n));i+=(1)){
          let child:node=(null as any);
          child=((((node).child))[i]);
          if(((Number((((child).type))==(4)))&&(Number(((((child).value)).length)>(1))))){
            ((block_end)+=("->"));
            ((block_end)+=(node_to_cpp(depth,((((node).child))[i]))));
            ((block_end)+=(""));
          }else{
            ((block_end)+=("["));
            ((block_end)+=(node_to_cpp(depth,((((node).child))[i]))));
            ((block_end)+=("]"));
          };
        };
        ((block_end)+=(" = "));
        ((block_end)+=(node_to_cpp(depth,((((node).child))[n]))));
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("cast"))){
        if(Number((((((((node).child))[1])).value))==("str"))){
          block_start="tostring(";
          ((block_start)+=(node_to_cpp(depth,((((node).child))[0]))));
          block_end=")";
        };
        if(Number((((((((node).child))[1])).value))==("int"))){
          block_start="(int)";
          block_end=node_to_cpp(depth,((((node).child))[0]));
        };
        (((node).child)).splice((0),(1));
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("then"))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("else"))){
        block_start="else {";
        block_end="}";
      };
      if(Number((((node).value))==("for"))){
        if(Number((((node).child).length)==(5))){
          block_start="for (int ";
          ((block_start)+=(node_to_cpp(depth,((((node).child))[0]))));
          ((block_start)+=(" = "));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[1]))));
          ((block_start)+=("; "));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[2]))));
          ((block_start)+=("; "));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[0]))));
          ((block_start)+=(" += "));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[3]))));
          ((block_start)+=(") "));
          (((node).child)).splice((0),(4));
          block_end="";
        };
        if(Number((((node).child).length)==(4))){
          block_start="for (const auto &[";
          ((block_start)+=(node_to_cpp(depth,((((node).child))[0]))));
          ((block_start)+=(","));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[1]))));
          ((block_start)+=("] : "));
          ((block_start)+=(node_to_cpp(depth,((((node).child))[2]))));
          ((block_start)+=(") "));
          (((node).child)).splice((0),(3));
          block_end="";
        };
      };
      if(((Number((((node).value))==("if")))||(Number((((node).value))==("while"))))){
        block_start=((node).value);
        ((block_start)+=(" "));
        let block_simple:number=0;
        block_simple=Number((((((((node).child))[0])).type))!=(1));
        if(block_simple){
          ((block_start)+=("("));
        };
        ((block_start)+=(node_to_cpp(depth,((((node).child))[0]))));
        if(block_simple){
          ((block_start)+=(")"));
        };
        ((block_start)+=(" "));
        block_end="";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("do"))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("break"))){
        block_start="break";
        block_end="";
      };
      if(Number((((node).value))==("?"))){
        block_start=node_to_cpp(depth,((((node).child))[0]));
        ((block_start)+=(" ? "));
        ((block_start)+=(node_to_cpp(depth,((((node).child))[1]))));
        ((block_start)+=(" : "));
        ((block_start)+=(node_to_cpp(depth,((((node).child))[2]))));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("print"))){
        block_start="std::cout << ";
        block_end=" << std::endl";
      };
      if(((((((((((((((((((((((((((((((((((((Number((((node).value))==(">>")))||(Number((((node).value))==("<<")))))||(Number((((node).value))==("=")))))||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||")))))||(Number((((node).value))==(">=")))))||(Number((((node).value))==("<=")))))||(Number((((node).value))==("<>")))))||(Number((((node).value))==("+")))))||(Number((((node).value))==("-")))))||(Number((((node).value))==("*")))))||(Number((((node).value))==("/")))))||(Number((((node).value))==("^")))))||(Number((((node).value))==("%")))))||(Number((((node).value))==("&")))))||(Number((((node).value))==("|")))))||(Number((((node).value))==("~")))))||(Number((((node).value))==("<")))))||(Number((((node).value))==(">"))))){
        block_start="(";
        block_end=")";
        if(Number((((node).value))==("="))){
          ((node).value="==");
        };
        if(Number((((node).value))==("<>"))){
          ((node).value="!=");
        };
        if(((Number((((node).value))==("<<")))&&(Number((((((((node).child))[0])).type))==(4))))){
          ((node).value="+=");
        };
        (((node).child)).splice((1),0,(node_new(4,((node).value))));
      };
      if(Number((((node).value))==("return"))){
        block_start="return ";
        block_end="";
      };
      ((s)+=(block_start));
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        let node_child:node=(null as any);
        node_child=((((node).child))[i]);
        let indent_needed:number=0;
        indent_needed=node_indent_needed(node,node_child);
        let indent_depth:number=0;
        indent_depth=((indent_needed)?(depth):(((depth)-(1))));
        let indent:string=(null as any);
        indent="  ";
        if(indent_needed){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(indent_depth));i+=(1)){
            ((s)+=(indent));
          };
        }else{
          if(Number((i)>(0))){
            ((s)+=(block_seperator));
          };
        };
        let child:string=(null as any);
        child=node_to_cpp(indent_depth,node_child);
        ((s)+=(child));
        if(((((((((((Number((((node).value))==("")))||(Number((((node).value))==("func")))))||(Number((((node).value))==("struct")))))||(Number((((node).value))==("do")))))||(Number((((node).value))==("then")))))||(Number((((node).value))==("else"))))){
          ((s)+=(";"));
        };
        if(((indent_needed)&&(Number((i)==(((((node).child).length)-(1))))))){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(((indent_depth)-(1))));i+=(1)){
            ((s)+=(indent));
          };
        };
      };
      ((s)+=(block_end));
    };
    if(Number((((node).type))!=(1))){
      let value:string=(null as any);
      value=node_to_cpp_preprocess(node);
      if(Number((((node).type))==(8))){
        value="// ";
        ((value)+=(((node).value)));
      };
      ((s)+=(value));
    };
    return s;
  };
  export function node_to_c_preprocess(node:node):string{
    let value:string=(null as any);
    value=((node).value);
    if(Number((((node).type))==(2))){
      value="";
      for(let i:number=(1);Number((i)<((((node).value)).length));i+=(1)){
        (value)+=String.fromCharCode((((node).value)).charCodeAt(i));
      };
    };
    return value;
  };
  export function node_to_c_type(name:string,node:node,element_only:number):string{
    let type:string=(null as any);
    type=((node).value);
    let suffix:string=(null as any);
    suffix="";
    if(Number((((node).value))==("str"))){
      type="char*";
    };
    if(Number((((node).value))==("vec"))){
      type=node_to_c_type("",((((node).child))[1]),0);
      if(Number((name)!=(""))){
        ((suffix)+=("["));
        ((suffix)+=(node_to_c_preprocess(((((node).child))[0]))));
        ((suffix)+=("]"));
      }else{
        ((type)+=("*"));
      };
    };
    if(Number((((node).value))==("arr"))){
      type=node_to_c_type("",((((node).child))[0]),0);
      if(Number(!(element_only))){
        ((type)+=("*"));
      };
    };
    if(Number((((node).value))==("struct"))){
      type="struct ";
      ((type)+=(((((((node).child))[0])).value)));
      ((type)+=("*"));
    };
    if(Number((type)==("map"))){
      type="std::map<";
      ((type)+=(node_to_c_type("",((((node).child))[0]),0)));
      ((type)+=(","));
      ((type)+=(node_to_c_type("",((((node).child))[1]),0)));
      ((type)+=(">"));
    };
    if(Number((type)==("func"))){
      let return_type:string=(null as any);
      return_type="void";
      let params_:string=(null as any);
      params_="void";
      let i:number=0;
      i=0;
      while(Number((i)<(((node).child).length))){
        let child_node:node=(null as any);
        child_node=((((node).child))[i]);
        if(Number((((child_node).value))==("param"))){
          if(Number((params_)==("void"))){
            params_="";
          }else{
            ((params_)+=(", "));
          };
          let c_var:string=(null as any);
          c_var="";
          c_var=node_to_c_type(((((((child_node).child))[0])).value),((((child_node).child))[1]),0);
          ((params_)+=(c_var));
          (((node).child)).splice((i),(1));
          i=((i)-(1));
        };
        if(Number((((child_node).value))==("result"))){
          return_type=node_to_c_type("",((((child_node).child))[0]),0);
          (((node).child)).splice((i),(1));
          i=((i)-(1));
        };
        i=((i)+(1));
      };
      let c_function:string=(null as any);
      c_function="";
      if(Number((((node).child).length)>(0))){
        if(Number((((((((node).child))[0])).type))==(4))){
          let func_name:string=(null as any);
          func_name=((((((node).child))[0])).value);
          if(Number((func_name)==("main"))){
            func_name="main_args";
            params_="char **args";
            return_type="int";
          };
          ((c_function)+=(return_type));
          ((c_function)+=(" "));
          ((c_function)+=(func_name));
          ((c_function)+=("("));
          ((c_function)+=(params_));
          ((c_function)+=(")"));
        }else{
          ((c_function)+=("[=]("));
          ((c_function)+=(params_));
          ((c_function)+=(")"));
        };
      }else{
        ((c_function)+=(return_type));
        ((c_function)+=(" (*"));
        ((c_function)+=(name));
        ((c_function)+=(")("));
        ((c_function)+=(params_));
        ((c_function)+=(")"));
        name="";
      };
      type=c_function;
    };
    let out_:string=(null as any);
    out_=type;
    if(Number((name)!=(""))){
      ((out_)+=(" "));
      ((out_)+=(name));
      ((out_)+=(suffix));
    };
    return out_;
  };
  export function node_to_c_tostring(symbol:Array<node_symbol>,node:node,castint:number):string{
    let node_type:number=0;
    node_type=node_symbol_node_type(symbol,node);
    if(Number((node_type)==(1))){
      return "tostring_char_p";
    };
    if(Number((node_type)==(2))){
      return ((castint)?("tostring_int"):("tostring_char"));
    };
    if(Number((node_type)==(3))){
      return "tostring_float";
    };
    return "tostring_unknown";
  };
  export function node_to_c_length(symbol:Array<node_symbol>,node:node):string{
    let node_type:number=0;
    node_type=node_symbol_node_type(symbol,node);
    if(Number((node_type)==(1))){
      return "strlen";
    };
    return "ARRAY_LENGTH";
  };
  export function node_to_c_has_keyword(node:node,keyword:string):number{
    if(Number((((node).value))==(keyword))){
      return 1;
    };
    for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
      if(Number((node_to_c_has_keyword(((((node).child))[i]),keyword))!=(0))){
        return 1;
      };
    };
    return 0;
  };
  export function node_to_c(depth:number,parent_symbol:Array<node_symbol>,node:node):string{
    let s:string=(null as any);
    s="";
    let symbol:Array<node_symbol>=(null as any);
    symbol=node_symbol_scope_node(parent_symbol,node);
    depth=((depth)+(1));
    node=node_copy(node);
    if(Number((((node).type))==(0))){
      let has_main:number=0;
      has_main=0;
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        if(((Number((((((((node).child))[i])).value))==("func")))&&(Number((((((((((((node).child))[i])).child))[0])).value))==("main"))))){
          has_main=1;
        };
      };
      if(Number((node_to_c_has_keyword(node,"print"))!=(0))){
        ((s)+=("#include <stdio.h>\n"));
        ((s)+=("#include <stdlib.h>\n"));
        ((s)+=("#include <string.h>\n"));
        ((s)+=("\n"));
        ((s)+=("char *tostring_char_p(char *value) { return value; }\n"));
        ((s)+=("char *tostring_char(int value) { static char buf[256]; sprintf(buf, \"%c\", value); return buf; }\n"));
        ((s)+=("char *tostring_int(int value) { static char buf[256]; sprintf(buf, \"%d\", value); return buf; }\n"));
        ((s)+=("char *tostring_float(float value) { static char buf[256]; sprintf(buf, \"%g\", value); return buf; }\n"));
        ((s)+=("char *tostring_double(double value) { static char buf[256]; sprintf(buf, \"%g\", value); return buf; }\n"));
        ((s)+=("void *STRING_ALLOC(char *str) {"));
        ((s)+=("  char *data = malloc(strlen(str) + 1);"));
        ((s)+=("  memcpy(data, str, strlen(str) + 1);"));
        ((s)+=("  return data;"));
        ((s)+=("}\n"));
        ((s)+=("char *STRING_APPEND(char *str, char *append) {"));
        ((s)+=("  char *data = realloc(str, strlen(str) + strlen(append) + 1);"));
        ((s)+=("  strcat(data, append);"));
        ((s)+=("  return data;"));
        ((s)+=("}\n"));
      };
      if(has_main){
        ((s)+=("struct ARRAY_HEADER {"));
        ((s)+=("    int element_size;"));
        ((s)+=("    int element_count;"));
        ((s)+=("};\n"));
        ((s)+=("void *ARRAY_ALLOC(int element_size, int element_count) {"));
        ((s)+=("  struct ARRAY_HEADER *header = malloc(sizeof(struct ARRAY_HEADER) + (element_size * element_count));"));
        ((s)+=("  header->element_size = element_size;"));
        ((s)+=("  header->element_count = element_count;"));
        ((s)+=("  void *data = ((char *)header) + sizeof(struct ARRAY_HEADER);"));
        ((s)+=("  return data;"));
        ((s)+=("}\n"));
        ((s)+=("void *ARRAY_INSERT(void *data, int index) {"));
        ((s)+=("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
        ((s)+=("  header = realloc(header, sizeof(struct ARRAY_HEADER) + (header->element_size * (header->element_count + 1)));"));
        ((s)+=("  data = ((char *)header) + sizeof(struct ARRAY_HEADER);"));
        ((s)+=("  memmove((char *)data + ((index + 1) * header->element_size), (char *)data + (index * header->element_size), (header->element_count - index) * header->element_size);"));
        ((s)+=("  header->element_count = header->element_count + 1;"));
        ((s)+=("  return data;"));
        ((s)+=("}\n"));
        ((s)+=("void *ARRAY_REMOVE(void *data, int index, int count) {"));
        ((s)+=("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
        ((s)+=("  memmove((char *)data + (index * header->element_size), (char *)data + ((index + count) * header->element_size), (header->element_count - (index + count)) * header->element_size);"));
        ((s)+=("  header->element_count = header->element_count - count;"));
        ((s)+=("  header = realloc(header, sizeof(struct ARRAY_HEADER) + (header->element_size * header->element_count));"));
        ((s)+=("  data = (void *)((char *)header + sizeof(struct ARRAY_HEADER));"));
        ((s)+=("  return data;"));
        ((s)+=("}\n"));
        ((s)+=("void ARRAY_FREE(void *data) {"));
        ((s)+=("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
        ((s)+=("  free(header);"));
        ((s)+=("}\n"));
        ((s)+=("int ARRAY_LENGTH(void *data) {"));
        ((s)+=("  struct ARRAY_HEADER *header = (void *)((char *)data - sizeof(struct ARRAY_HEADER));"));
        ((s)+=("  return header->element_count;"));
        ((s)+=("}\n"));
      };
      ((s)+=("\n\n"));
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        let child:string=(null as any);
        child=node_to_c(0,symbol,((((node).child))[i]));
        ((s)+=(child));
        if(Number((((((((node).child))[i])).value))==("let"))){
          ((s)+=(";"));
        };
        ((s)+=("\n"));
      };
      if(has_main){
        ((s)+=("int main(int argc, char** argv) {\n"));
        ((s)+=("  char **args = ARRAY_ALLOC(sizeof(char *),argc);\n"));
        ((s)+=("  for (int i = 0; i < argc; i++) { args[i] = argv[i]; }\n"));
        ((s)+=("  return main_args(args);\n"));
        ((s)+=("};\n"));
      };
    };
    if(((((Number((((node).value))==("+")))||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||"))))){
      node=node_expand(node);
    };
    if(Number((((node).type))==(1))){
      let block_start:string=(null as any);
      block_start="(";
      ((block_start)+=(((node).value)));
      let block_end:string=(null as any);
      block_end=")";
      let block_seperator:string=(null as any);
      block_seperator=" ";
      if(Number((((node).value))==(""))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("@define"))){
        block_start="#define ";
        ((block_start)+=(((((((node).child))[0])).value)));
        ((block_start)+=(" "));
        ((block_start)+=(((((((node).child))[1])).value)));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("@if"))){
        block_start="";
        block_end="";
        if(Number((((((((node).child))[0])).value))==("TARGET_C"))){
          (((node).child)).splice((0),(1));
          (((node).child)).splice((0),(1));
        }else{
          while(Number((((node).child).length)>(0))){
            (((node).child)).splice((0),(1));
          };
        };
      };
      if(Number((((node).value))==("extern"))){
        block_start="";
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("asm"))){
        let quotedline:string=(null as any);
        quotedline=((((((node).child))[0])).value);
        let line:string=(null as any);
        line="";
        for(let j:number=(1);Number((j)<((((quotedline).length)-(1))));j+=(1)){
          if(Number(((quotedline).charCodeAt(j))!=(92))){
            (line)+=String.fromCharCode((quotedline).charCodeAt(j));
          };
        };
        block_start=line;
        block_end="\n";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("struct"))){
        block_start="struct ";
        ((block_start)+=(((((((node).child))[0])).value)));
        ((block_start)+=(" {"));
        block_end="};";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("func"))){
        block_start=node_to_c_type("",node,0);
        ((block_start)+=(" {"));
        block_end="}";
        if(Number((((((((node).child))[0])).type))==(4))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("call"))){
        let fname_node:node=(null as any);
        fname_node=((((node).child))[0]);
        block_start=((fname_node).value);
        ((block_start)+=("("));
        block_end=")";
        (((node).child)).splice((0),(1));
        block_seperator=", ";
      };
      if(((Number((((node).value))==("let")))||(Number((((node).value))==("local"))))){
        let name:string=(null as any);
        name=((((((node).child))[0])).value);
        let type:string=(null as any);
        type=node_to_c_type(name,((((node).child))[1]),0);
        block_start=type;
        ((block_start)+=(" "));
        block_end="";
        (((node).child)).splice((0),(1));
        (((node).child)).splice((0),(1));
        if(Number((((node).child).length)==(1))){
          (((node).child)).splice((0),0,(node_new(4,"=")));
          if(((Number((((((((node).child))[1])).value))==("alloc")))&&(Number((((((((((((node).child))[1])).child))[0])).value))==("arr"))))){
            for(let i:number=(1);Number((i)<(((((((node).child))[1])).child).length));i+=(1)){
              ((block_end)+=(";"));
              ((block_end)+=(name));
              ((block_end)+=("["));
              ((block_end)+=((((i)-(1))).toString()));
              ((block_end)+=("]="));
              ((block_end)+=(((((((((((node).child))[1])).child))[i])).value)));
            };
          };
        };
      };
      if(Number((((node).value))==("alloc"))){
        block_start="";
        block_end="";
        if(Number((((((((node).child))[0])).value))==("str"))){
          let alloc_string:string=(null as any);
          alloc_string="\"\"";
          if(Number((((node).child).length)>(1))){
            alloc_string=((((((node).child))[1])).value);
          };
          block_start="STRING_ALLOC(";
          ((block_start)+=(alloc_string));
          ((block_start)+=(")"));
        };
        if(Number((((((((node).child))[0])).type))==(1))){
          if(Number((((((((node).child))[0])).value))==("arr"))){
            block_start="ARRAY_ALLOC(sizeof(";
            ((block_start)+=(node_to_c_type("",((((node).child))[0]),1)));
            ((block_start)+=("),"));
            ((block_start)+=((((((node).child).length)-(1))).toString()));
            ((block_start)+=(")"));
          };
          if(Number((((((((node).child))[0])).value))==("vec"))){
            block_start="{";
            for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
              ((block_start)+=(node_to_c(depth,symbol,((((node).child))[i]))));
              if(Number((i)<(((((node).child).length)-(1))))){
                ((block_start)+=(","));
              };
            };
            ((block_start)+=("}"));
          };
          if(Number((((((((node).child))[0])).value))==("struct"))){
            block_start="ARRAY_ALLOC(sizeof(struct ";
            ((block_start)+=(((((((((((node).child))[0])).child))[0])).value)));
            ((block_start)+=("),1)"));
          };
          if(Number((((((((node).child))[0])).value))==("map"))){
            block_start="{}";
          };
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("free"))){
        let array:string=(null as any);
        array=node_to_c(depth,symbol,((((node).child))[0]));
        block_start="ARRAY_FREE(";
        ((block_start)+=(array));
        block_end=")";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("#"))){
        block_start=node_to_c_length(symbol,((((node).child))[0]));
        ((block_start)+=("("));
        block_end=")";
      };
      if(Number((((node).value))==("insert"))){
        let init:string=(null as any);
        init="";
        if(((Number((((((((node).child))[2])).value))==("alloc")))&&(Number((((((((((((node).child))[2])).child))[0])).value))==("arr"))))){
          for(let i:number=(1);Number((i)<(((((((node).child))[2])).child).length));i+=(1)){
            ((init)+=(";"));
            ((init)+=(((((((node).child))[0])).value)));
            ((init)+=("["));
            ((init)+=(((((((node).child))[1])).value)));
            ((init)+=("]"));
            ((init)+=("["));
            ((init)+=((((i)-(1))).toString()));
            ((init)+=("]="));
            ((init)+=(((((((((((node).child))[2])).child))[i])).value)));
          };
        };
        let array:string=(null as any);
        array=node_to_c(depth,symbol,((((node).child))[0]));
        let position:string=(null as any);
        position=node_to_c(depth,symbol,((((node).child))[1]));
        let value:string=(null as any);
        value=node_to_c(depth,symbol,((((node).child))[2]));
        block_start="{int __index__=";
        ((block_start)+=(position));
        ((block_start)+=(";"));
        ((block_start)+=(array));
        ((block_start)+=("=ARRAY_INSERT("));
        ((block_start)+=(array));
        ((block_start)+=(",__index__);"));
        ((block_start)+=(array));
        ((block_start)+=("[__index__]="));
        ((block_start)+=(value));
        ((block_start)+=(init));
        ((block_start)+=(";}"));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("remove"))){
        let array:string=(null as any);
        array=node_to_c(depth,symbol,((((node).child))[0]));
        let first:string=(null as any);
        first=node_to_c(depth,symbol,((((node).child))[1]));
        let last:string=(null as any);
        last=node_to_c(depth,symbol,((((node).child))[2]));
        block_start=array;
        ((block_start)+=("=ARRAY_REMOVE("));
        ((block_start)+=(array));
        ((block_start)+=(","));
        ((block_start)+=(first));
        ((block_start)+=(","));
        ((block_start)+=(last));
        block_end=")";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("slice"))){
        block_start=node_to_c(depth,symbol,((((node).child))[0]));
        ((block_start)+=(".substr("));
        ((block_start)+=(node_to_c(depth,symbol,((((node).child))[1]))));
        ((block_start)+=(","));
        ((block_start)+=(node_to_c(depth,symbol,((((node).child))[2]))));
        block_end=")";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("get"))){
        block_start=node_to_c(depth,symbol,((((node).child))[0]));
        block_end="";
        for(let i:number=(1);Number((i)<(((node).child).length));i+=(1)){
          let child:node=(null as any);
          child=((((node).child))[i]);
          if(((Number((((child).type))==(4)))&&(Number(((((child).value)).length)>(1))))){
            ((block_end)+=("->"));
            ((block_end)+=(node_to_c(depth,symbol,((((node).child))[i]))));
            ((block_end)+=(""));
          }else{
            ((block_end)+=("["));
            ((block_end)+=(node_to_c(depth,symbol,((((node).child))[i]))));
            ((block_end)+=("]"));
          };
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("set"))){
        block_start=node_to_c(depth,symbol,((((node).child))[0]));
        block_end="";
        let n:number=0;
        n=((((node).child).length)-(1));
        for(let i:number=(1);Number((i)<(n));i+=(1)){
          let child:node=(null as any);
          child=((((node).child))[i]);
          if(((Number((((child).type))==(4)))&&(Number(((((child).value)).length)>(1))))){
            ((block_end)+=("->"));
            ((block_end)+=(node_to_c(depth,symbol,((((node).child))[i]))));
            ((block_end)+=(""));
          }else{
            ((block_end)+=("["));
            ((block_end)+=(node_to_c(depth,symbol,((((node).child))[i]))));
            ((block_end)+=("]"));
          };
        };
        ((block_end)+=(" = "));
        let node_type:number=0;
        node_type=node_symbol_node_type(symbol,((((node).child))[n]));
        if(Number((node_type)==(1))){
          ((block_end)+=("STRING_ALLOC("));
        };
        ((block_end)+=(node_to_c(depth,symbol,((((node).child))[n]))));
        if(Number((node_type)==(1))){
          ((block_end)+=(")"));
        };
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("cast"))){
        if(Number((((((((node).child))[1])).value))==("str"))){
          block_start="tostring_int(";
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[0]))));
          block_end=")";
        };
        if(Number((((((((node).child))[1])).value))==("int"))){
          block_start="(int)";
          block_end=node_to_c(depth,symbol,((((node).child))[0]));
        };
        (((node).child)).splice((0),(1));
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("then"))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("else"))){
        block_start="else {";
        block_end="}";
      };
      if(Number((((node).value))==("for"))){
        if(Number((((node).child).length)==(5))){
          block_start="for (int ";
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[0]))));
          ((block_start)+=(" = "));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[1]))));
          ((block_start)+=("; "));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[2]))));
          ((block_start)+=("; "));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[0]))));
          ((block_start)+=(" += "));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[3]))));
          ((block_start)+=(") "));
          (((node).child)).splice((0),(4));
          block_end="";
        };
        if(Number((((node).child).length)==(4))){
          block_start="for (const auto &[";
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[0]))));
          ((block_start)+=(","));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[1]))));
          ((block_start)+=("] : "));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[2]))));
          ((block_start)+=(") "));
          (((node).child)).splice((0),(3));
          block_end="";
        };
      };
      if(((Number((((node).value))==("if")))||(Number((((node).value))==("while"))))){
        block_start=((node).value);
        ((block_start)+=(" "));
        let block_simple:number=0;
        block_simple=Number((((((((node).child))[0])).type))!=(1));
        if(block_simple){
          ((block_start)+=("("));
        };
        ((block_start)+=(node_to_c(depth,symbol,((((node).child))[0]))));
        if(block_simple){
          ((block_start)+=(")"));
        };
        ((block_start)+=(" "));
        block_end="";
        (((node).child)).splice((0),(1));
      };
      if(Number((((node).value))==("do"))){
        block_start="{";
        block_end="}";
      };
      if(Number((((node).value))==("break"))){
        block_start="break";
        block_end="";
      };
      if(Number((((node).value))==("?"))){
        block_start=node_to_c(depth,symbol,((((node).child))[0]));
        ((block_start)+=(" ? "));
        ((block_start)+=(node_to_c(depth,symbol,((((node).child))[1]))));
        ((block_start)+=(" : "));
        ((block_start)+=(node_to_c(depth,symbol,((((node).child))[2]))));
        block_end="";
        while(Number((((node).child).length)>(0))){
          (((node).child)).splice((0),(1));
        };
      };
      if(Number((((node).value))==("print"))){
        block_start="puts(";
        ((block_start)+=(node_to_c_tostring(symbol,((((node).child))[0]),1)));
        ((block_start)+=("("));
        block_end="))";
      };
      if(((((((((((((((((((((((((((((((((((((Number((((node).value))==(">>")))||(Number((((node).value))==("<<")))))||(Number((((node).value))==("=")))))||(Number((((node).value))==("&&")))))||(Number((((node).value))==("||")))))||(Number((((node).value))==(">=")))))||(Number((((node).value))==("<=")))))||(Number((((node).value))==("<>")))))||(Number((((node).value))==("+")))))||(Number((((node).value))==("-")))))||(Number((((node).value))==("*")))))||(Number((((node).value))==("/")))))||(Number((((node).value))==("^")))))||(Number((((node).value))==("%")))))||(Number((((node).value))==("&")))))||(Number((((node).value))==("|")))))||(Number((((node).value))==("~")))))||(Number((((node).value))==("<")))))||(Number((((node).value))==(">"))))){
        block_start="(";
        block_end=")";
        if(Number((((node).value))==("="))){
          if(((Number((((((((node).child))[0])).type))==(5)))||(Number((((((((node).child))[1])).type))==(5))))){
            block_start="(strcmp(";
            block_end=") == 0 ? 1 : 0)";
            ((node).value=",");
          }else{
            ((node).value="==");
          };
        };
        if(Number((((node).value))==("<>"))){
          ((node).value="!=");
        };
        if(((Number((((node).value))==("<<")))&&(Number((((((((node).child))[0])).type))==(4))))){
          block_start=((((((node).child))[0])).value);
          ((block_start)+=("="));
          ((block_start)+=("STRING_APPEND("));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[0]))));
          ((block_start)+=(","));
          ((block_start)+=(node_to_c_tostring(symbol,((((node).child))[1]),0)));
          ((block_start)+=("("));
          ((block_start)+=(node_to_c(depth,symbol,((((node).child))[1]))));
          block_end="))";
          while(Number((((node).child).length)>(0))){
            (((node).child)).splice((0),(1));
          };
        }else{
          (((node).child)).splice((1),0,(node_new(4,((node).value))));
        };
      };
      if(Number((((node).value))==("return"))){
        block_start="return ";
        block_end="";
      };
      ((s)+=(block_start));
      for(let i:number=(0);Number((i)<(((node).child).length));i+=(1)){
        let node_child:node=(null as any);
        node_child=((((node).child))[i]);
        let indent_needed:number=0;
        indent_needed=node_indent_needed(node,node_child);
        let indent_depth:number=0;
        indent_depth=((indent_needed)?(depth):(((depth)-(1))));
        let indent:string=(null as any);
        indent="  ";
        if(indent_needed){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(indent_depth));i+=(1)){
            ((s)+=(indent));
          };
        }else{
          if(Number((i)>(0))){
            ((s)+=(block_seperator));
          };
        };
        let child:string=(null as any);
        child=node_to_c(indent_depth,symbol,node_child);
        ((s)+=(child));
        if(((((((((((Number((((node).value))==("")))||(Number((((node).value))==("func")))))||(Number((((node).value))==("struct")))))||(Number((((node).value))==("do")))))||(Number((((node).value))==("then")))))||(Number((((node).value))==("else"))))){
          ((s)+=(";"));
        };
        if(((indent_needed)&&(Number((i)==(((((node).child).length)-(1))))))){
          ((s)+=("\n"));
          for(let i:number=(0);Number((i)<(((indent_depth)-(1))));i+=(1)){
            ((s)+=(indent));
          };
        };
      };
      ((s)+=(block_end));
    };
    if(Number((((node).type))!=(1))){
      let value:string=(null as any);
      value=node_to_c_preprocess(node);
      if(Number((((node).type))==(8))){
        value="// ";
        ((value)+=(((node).value)));
      };
      ((s)+=(value));
    };
    return s;
  };
  export function compile(target:string,filename:string):string{
    let prog:string=(null as any);
    prog=readfile(filename);
    let out_:string=(null as any);
    out_="";
    let tokens:Array<token>=(null as any);
    tokens=token_parse(prog,filename,0);
    let root:node=(null as any);
    root=node_from_tokens(tokens);
    root=preprocess(root);
    root=preprocess_vdom(root);
    if(Number((target)==("--target=wax"))){
      out_=node_to_wax(0,root);
    };
    if(Number((target)==("--target=js"))){
      out_=node_to_js(0,root);
    };
    if(Number((target)==("--target=cpp"))){
      out_=node_to_cpp(0,root);
    };
    if(Number((target)==("--target=c"))){
      let symbol:Array<node_symbol>=(null as any);
      symbol=[];
      out_=node_to_c(0,symbol,root);
    };
    return out_;
  };
  export function format(filename:string):string{
    let prog:string=(null as any);
    prog=readfile(filename);
    let tokens:Array<token>=(null as any);
    tokens=token_parse(prog,filename,1);
    let root:node=(null as any);
    root=node_from_tokens(tokens);
    let out_:string=(null as any);
    out_=node_to_wax(0,root);
    return out_;
  };
  export function help():string{
    let lines:Array<string>=(null as any);
    lines=[("usage: \n\n"),("  wax <command> [arguments]\n\n"),("commands: \n\n"),("  build <--target=wax|--target=js|--target=cpp|--target=c> <filename.wax>\n"),("  fmt <filename.wax>\n")];
    let help:string=(null as any);
    help="";
    for(let i:number=(0);Number((i)<(lines.length));i+=(1)){
      ((help)+=(((lines)[i])));
    };
    return help;
  };
  export function main(args:Array<string>):number{
    if(Number((args.length)<(3))){
      console.log(help());
      return 1;
    };
    if(((Number((args.length)==(4)))&&(Number((((args)[1]))==("build"))))){
      let out_:string=(null as any);
      out_=compile(((args)[2]),((args)[3]));
      console.log(out_);
      return 0;
    };
    if(((Number((args.length)==(3)))&&(Number((((args)[1]))==("fmt"))))){
      console.log(format(((args)[2])));
      return 0;
    };
    console.log(help());
    return 0;
  };
/*=== User Code            END   ===*/
// @ts-ignore
(typeof process=='undefined')?main([]):process.exit(main(process.argv.slice(1)));}