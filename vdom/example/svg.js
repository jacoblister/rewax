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

let example_clicker = {}
function clicker_handler(event) {
  let clicker = example_clicker;
  clicker.clicks = (clicker.clicks + 1);
  console.log(event.type);
  __vdom__update();
}
function clicker_render_compact(clicker) {
  let svg = __vdom__element_new("svg");
  svg.attr["version"] = "1.1";
  svg.attr["xmlns"] = "http://www.w3.org/2000/svg";
  svg.attr["width"] = ""+640;
  svg.attr["height"] = ""+480;
  let msg = "Clicks: ";
  (msg += ""+clicker.clicks);
  {
    let _0_10_text = __vdom__element_new("text");
    svg.child.splice(svg.child.length,0,_0_10_text);
    _0_10_text.attr["x"] = ""+100;
    _0_10_text.attr["y"] = ""+45;
    _0_10_text.attr["style"] = "user-select:none;";
    _0_10_text.attr["text"] = ""+msg;
  };
  {
    let _0_11_g = __vdom__element_new("g");
    svg.child.splice(svg.child.length,0,_0_11_g);
    _0_11_g.attr["transform"] = "translate(0.5 0.5)";
    {
      let _1_2_rect = __vdom__element_new("rect");
      _0_11_g.child.splice(_0_11_g.child.length,0,_1_2_rect);
      _1_2_rect.attr["stroke"] = "red";
      _1_2_rect.attr["fill"] = ""+clicker.fill;
      _1_2_rect.attr["x"] = ""+100;
      _1_2_rect.attr["y"] = ""+50;
      _1_2_rect.attr["width"] = ""+200;
      _1_2_rect.attr["height"] = ""+100;
      _1_2_rect.event["mousedown"] = function (event) {
          clicker.fill = "white";
          __vdom__update();
        };
      _1_2_rect.event["mouseup"] = function (event) {
          clicker.fill = "orange";
          __vdom__update();
        };
    };
    {
      let _1_3_rect = __vdom__element_new("rect");
      _0_11_g.child.splice(_0_11_g.child.length,0,_1_3_rect);
      _1_3_rect.attr["stroke"] = "red";
      _1_3_rect.attr["fill"] = "yellow";
      _1_3_rect.attr["x"] = ""+125;
      _1_3_rect.attr["y"] = ""+75;
      _1_3_rect.attr["width"] = ""+200;
      _1_3_rect.attr["height"] = ""+100;
      _1_3_rect.event["click"] = function (event) {
          clicker.clicks = (clicker.clicks + 1);
          __vdom__update();
        };
    };
  };
  return(svg);
}
function render() {
  return(clicker_render_compact(example_clicker));
}
function main() {
  example_clicker.clicks = 0;
  example_clicker.fill = "orange";
  __vdom__dom_init();
  __vdom__dom_render_func = render;
  __vdom__dom_run();
  return(0);
}
(typeof process == 'undefined') ? main([]) : process.exit(main(process.argv.slice(1)));

