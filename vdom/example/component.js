let __vdom__dom_render_func


function __vdom__element_new(name) {
  let element = {};
  element.name = name;
  element.attr = {};
  element.child = [];
  element.event = {};
  return(element);
}
function __vdom__element_to_xml(depth, element) {
  let dom = "";
  for (let i = 0; (i < depth); i += 1) {
    (dom += "\t");
  };
  (dom += "<");
  (dom += element.name);
  for (const [k,v] of Object.entries(element.attr)){
    (dom += " ");
    (dom += k);
    (dom += "=\"");
    (dom += v);
    (dom += "\"");
  };
  if (element.child.length > 0) {
    (dom += ">");
    if (element.name == "text") {
      (dom += element.child[0].name);
    } else {
      (dom += "\n");
      for (let i = 0; (i < element.child.length); i += 1) {
        (dom += __vdom__element_to_xml((depth + 1), element.child[i]));
      };
      for (let i = 0; (i < depth); i += 1) {
        (dom += "\t");
      };
    };
    (dom += "</");
    (dom += element.name);
    (dom += ">\n");
  } else {
    (dom += "/>\n");
  };
  return(dom);
}
const __vdom__PATCH_UPDATE = 0;
const __vdom__PATCH_REPLACE = 1;

function __vdom__diff(current, target, path) {
  let patchList = [];
  let patch;
  if ((current.attr["key"] != target.attr["key"]) || ((current.name != target.name) || (current.child.length != target.child.length))) {
    patch = {};
    patch.path = path;
    patch.type = __vdom__PATCH_REPLACE;
    patch.element = target;
    patchList.splice(patchList.length,0,patch);
    return(patchList);
  };
  let attr_patch = 0;
  for (const [k,v] of Object.entries(target.attr)){
    if (v != current.attr[k]) {
      if (!attr_patch) {
        attr_patch = 1;
        patch = {};
        patch.path = path;
        patch.type = __vdom__PATCH_UPDATE;
        patch.element = __vdom__element_new(target.name);
        patchList.splice(patchList.length,0,patch);
      };
      patch.element.attr[k] = v;
    };
  };
  for (let i = 0; (i < target.child.length); i += 1) {
    let pathCopy = [];
    for (let j = 0; (j < path.length); j += 1) {
      pathCopy.splice(pathCopy.length,0,path[j]);
    };
    pathCopy.splice(pathCopy.length,0,i);
    let childPatch = __vdom__diff(current.child[i], target.child[i], pathCopy);
    for (let j = 0; (j < childPatch.length); j += 1) {
      patchList.splice(patchList.length,0,childPatch[j]);
    };
  };
  return(patchList);
}
let __vdom__dom = __vdom__element_new("")
let __vdom__dom_event_map
let __vdom__dom_background_pending = 0
let __vdom__dom_width = 800
let __vdom__dom_height = 600

function dom_timer() {
   __vdom__dom_background();
   setTimeout(dom_timer, 100);
 }
 dom_timer();
 __vdom__dom_width = window.innerWidth;
 __vdom__dom_heigth = window.innerHeigth;
 function dom_resize() {
   __vdom__dom_width = window.innerWidth;
   __vdom__dom_heigth = window.innerHeigth;
   __vdom__update();
 }
 window.onresize = dom_resize;
 function dom_event(type, jsevent, handler) {
   if (type == 'contextmenu') {jsevent.preventDefault();}
   if (type != 'contextmenu' && type != 'pointerup' && jsevent.button > 0) {return; };
   let bbox = jsevent.target.getBoundingClientRect();
   let event = {type: type, client_x: jsevent.clientX, client_y: jsevent.clientY, offset_x: jsevent.clientX - bbox.x, offset_y: jsevent.clientY - bbox.y};
   handler(event);
 }
 function dom_getElementByPath(path) {
   let element = document.documentElement;
   for (var i = 0; i < path.length; i++) {
     element = element.children[path[i]];
   }
   return element;
 }
 function __vdom__dom_init() {} function __vdom__dom_element_write(element) {
  let name = element.name;
  let dom_element;
  dom_element = document.createElementNS('http://www.w3.org/2000/svg', name);
;
  for (const [attr,value] of Object.entries(element.attr)){
    if (attr == "text") {
      dom_element.textContent=value;
;
    } else {
      dom_element.setAttribute(attr, value);
;
    };
  };
  for (const [type,handler] of Object.entries(element.event)){
    dom_element.addEventListener(type, function(evt) {
;
      try{evt.target.releasePointerCapture(evt.pointerId);}catch{}
;
      dom_event(type, evt, handler);
;
    })
;
  };
  for (let i = 0; (i < element.child.length); i += 1) {
    let dom_element_child = __vdom__dom_element_write(element.child[i]);
    dom_element.appendChild(dom_element_child);
;
  };
  return(dom_element);
} function __vdom__dom_patch(patch) {
  let path = patch.path;
  if (patch.type == __vdom__PATCH_REPLACE) {
    let target = dom_getElementByPath(path);
;
    let replacement = __vdom__dom_element_write(patch.element);
    target.replaceWith(replacement);
;
  };
  if (patch.type == __vdom__PATCH_UPDATE) {
    let child = dom_getElementByPath(path);
;
    for (const [attr,value] of Object.entries(patch.element.attr)){
      if (attr == "text") {
        child.textContent=value;
;
      } else {
        child.setAttribute(attr, value);
;
      };
    };
  };
} function __vdom__update() {
  let dom = __vdom__dom_render_func();
  let path = [];
  let patch = __vdom__diff(__vdom__dom, dom, path);
  for (let i = 0; (i < patch.length); i += 1) {
    __vdom__dom_patch(patch[i]);
  };
  __vdom__dom = dom;
} function __vdom__update_background() {
  __vdom__dom_background_pending = 1;
} function __vdom__dom_background() {
  if (__vdom__dom_background_pending) {
    __vdom__update();
  };
} function __vdom__dom_run() {
  __vdom__update();
}
const __vdom__LIST_WIDTH = 50;
const __vdom__LIST_ITEM_X_MARGIN = 2;
const __vdom__LIST_ITEM_HEIGHT = 10;
const __vdom__LIST_ITEM_HEIGHT_HALF = 5;
let __vdom__list_selected_index
function __vdom__list_render(pos_x, pos_y, values, select) {
  let g = __vdom__element_new("g");
  g.attr["key"] = "list";
  {
    let _0_2_rect = __vdom__element_new("rect");
    g.child.splice(g.child.length,0,_0_2_rect);
    _0_2_rect.attr["id"] = "vdom.listbox";
    _0_2_rect.attr["x"] = ""+pos_x;
    _0_2_rect.attr["y"] = ""+pos_y;
    _0_2_rect.attr["width"] = ""+__vdom__LIST_WIDTH;
    _0_2_rect.attr["height"] = ""+(values.length * __vdom__LIST_ITEM_HEIGHT);
    _0_2_rect.attr["fill"] = "white";
    _0_2_rect.attr["stroke"] = "black";
    _0_2_rect.attr["pointer-events"] = "all";
    _0_2_rect.event["pointermove"] = function (event) {
        __vdom__list_selected_index = (event.offset_y / __vdom__LIST_ITEM_HEIGHT)|0;
        if (__vdom__list_selected_index >= values.length) {
          __vdom__list_selected_index = (values.length - 1);
        };
        __vdom__update();
      };
    _0_2_rect.event["pointerdown"] = function (event) {
        let i = __vdom__list_selected_index;
        select(values[i]);
      };
    _0_2_rect.event["pointerup"] = function (event) {
        let i = __vdom__list_selected_index;
        select(values[i]);
      };
    _0_2_rect.event["pointerout"] = function (event) {
        __vdom__list_selected_index = -1;
        __vdom__update();
      };
  };
  if (__vdom__list_selected_index >= 0) {
    {
      let _1_0_rect = __vdom__element_new("rect");
      g.child.splice(g.child.length,0,_1_0_rect);
      _1_0_rect.attr["x"] = ""+pos_x;
      _1_0_rect.attr["y"] = ""+(pos_y + (__vdom__list_selected_index * __vdom__LIST_ITEM_HEIGHT));
      _1_0_rect.attr["width"] = ""+__vdom__LIST_WIDTH;
      _1_0_rect.attr["height"] = ""+__vdom__LIST_ITEM_HEIGHT;
      _1_0_rect.attr["fill"] = "lightgrey";
      _1_0_rect.attr["stroke"] = "none";
      _1_0_rect.attr["pointer-events"] = "none";
    };
  };
  for (let i = 0; (i < values.length); i += 1) {
    {
      let _1_0_text = __vdom__element_new("text");
      g.child.splice(g.child.length,0,_1_0_text);
      _1_0_text.attr["font-size"] = "10";
      _1_0_text.attr["font-family"] = "sans-serif";
      _1_0_text.attr["text-anchor"] = "left";
      _1_0_text.attr["alignment-baseline"] = "central";
      _1_0_text.attr["pointer-events"] = "none";
      _1_0_text.attr["x"] = ""+(pos_x + __vdom__LIST_ITEM_X_MARGIN);
      _1_0_text.attr["y"] = ""+((pos_y + (i * __vdom__LIST_ITEM_HEIGHT)) + __vdom__LIST_ITEM_HEIGHT_HALF);
      _1_0_text.attr["text"] = ""+values[i];
    };
  };
  return(g);
}

let example_data = {}
function example_render(example) {
  let items = ["red","green","blue"];
  let svg = __vdom__element_new("svg");
  svg.attr["version"] = "1.1";
  svg.attr["xmlns"] = "http://www.w3.org/2000/svg";
  svg.attr["width"] = ""+640;
  svg.attr["height"] = ""+480;
  {
    let _0_8_defs = __vdom__element_new("defs");
    svg.child.splice(svg.child.length,0,_0_8_defs);
    {
      let _1_0_style = __vdom__element_new("style");
      _0_8_defs.child.splice(_0_8_defs.child.length,0,_1_0_style);
      _1_0_style.attr["type"] = "text/css";
      _1_0_style.attr["text"] = "text{user-select:none;}";
    };
    {
      let _1_1_style = __vdom__element_new("style");
      _0_8_defs.child.splice(_0_8_defs.child.length,0,_1_1_style);
      _1_1_style.attr["type"] = "text/css";
      _1_1_style.attr["text"] = "text::selection {background:none;}";
    };
  };
  let g = __vdom__element_new("g");
  g.attr["transform"] = "translate(0.5 0.5)";
  svg.child.splice(svg.child.length,0,g);
  let rect = __vdom__element_new("rect");
  rect.attr["id"] = "main";
  rect.attr["x"] = ""+0;
  rect.attr["y"] = ""+0;
  rect.attr["width"] = ""+800;
  rect.attr["height"] = ""+600;
  rect.attr["stroke"] = "none";
  rect.attr["fill"] = "white";
  rect.event["mousedown"] = function (event) {
      example.active = 0;
      __vdom__update();
    };
  rect.event["contextmenu"] = function (event) {
      example.active = 1;
      example.pos_x = event.client_x;
      example.pos_y = event.client_y;
      __vdom__update();
    };
  g.child.splice(g.child.length,0,rect);
  if (example.active == 1) {
    g.child.splice(g.child.length,0,__vdom__list_render(example.pos_x, example.pos_y, items, function (value) {
        console.log(value);
        example.active = 0;
        __vdom__update();
      }));
  };
  return(svg);
}
function render() {
  return(example_render(example_data));
}
function main() {
  __vdom__dom_init();
  __vdom__dom_render_func = render;
  __vdom__dom_run();
  return(0);
}
(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));

