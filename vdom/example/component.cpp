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


std::function<struct __vdom__element* (void)> __vdom__dom_render_func;
struct __vdom__event {
  std::string type;
  std::string data;
  int client_x;
  int client_y;
  int offset_x;
  int offset_y;
};
struct __vdom__element {
  std::string name;
  std::map<std::string,std::string> attr;
  std::vector<struct __vdom__element*> child;
  std::map<std::string,std::function<void (struct __vdom__event* event)>> event;
};
struct __vdom__element* __vdom__element_new(std::string name) {
  struct __vdom__element* element = new __vdom__element();
  element->name = name;
  element->attr = {};
  element->child = std::vector<struct __vdom__element*>();
  element->event = {};
  return element;
}
std::string __vdom__element_to_xml(int depth, struct __vdom__element* element) {
  std::string dom = "";
  for (int i = 0; (i < depth); i += 1) {
    (dom += "\t");
  };
  (dom += "<");
  (dom += element->name);
  for (const auto &[k,v] : element->attr) {
    (dom += " ");
    (dom += k);
    (dom += "=\"");
    (dom += v);
    (dom += "\"");
  };
  if (element->child.size() > 0) {
    (dom += ">");
    if (element->name == "text") {
      (dom += element->child[0]->name);
    } else {
      (dom += "\n");
      for (int i = 0; (i < element->child.size()); i += 1) {
        (dom += __vdom__element_to_xml((depth + 1), element->child[i]));
      };
      for (int i = 0; (i < depth); i += 1) {
        (dom += "\t");
      };
    };
    (dom += "</");
    (dom += element->name);
    (dom += ">\n");
  } else {
    (dom += "/>\n");
  };
  return dom;
}
#define __vdom__PATCH_UPDATE 0
#define __vdom__PATCH_REPLACE 1
struct __vdom__patch {
  int type;
  std::vector<int> path;
  struct __vdom__element* element;
};
std::vector<struct __vdom__patch*> __vdom__diff(struct __vdom__element* current, struct __vdom__element* target, std::vector<int>& path) {
  std::vector<struct __vdom__patch*> patchList = std::vector<struct __vdom__patch*>();
  struct __vdom__patch* patch;
  if ((current->attr["key"] != target->attr["key"]) || ((current->name != target->name) || (current->child.size() != target->child.size()))) {
    patch = new __vdom__patch();
    patch->path = path;
    patch->type = __vdom__PATCH_REPLACE;
    patch->element = target;
    patchList.insert(patchList.begin()+patchList.size(),patch);
    return patchList;
  };
  int attr_patch = 0;
  for (const auto &[k,v] : target->attr) {
    if (v != current->attr[k]) {
      if (!attr_patch) {
        attr_patch = 1;
        patch = new __vdom__patch();
        patch->path = path;
        patch->type = __vdom__PATCH_UPDATE;
        patch->element = __vdom__element_new(target->name);
        patchList.insert(patchList.begin()+patchList.size(),patch);
      };
      patch->element->attr[k] = v;
    };
  };
  for (int i = 0; (i < target->child.size()); i += 1) {
    std::vector<int> pathCopy = std::vector<int>();
    for (int j = 0; (j < path.size()); j += 1) {
      pathCopy.insert(pathCopy.begin()+pathCopy.size(),path[j]);
    };
    pathCopy.insert(pathCopy.begin()+pathCopy.size(),i);
    std::vector<struct __vdom__patch*> childPatch = __vdom__diff(current->child[i], target->child[i], pathCopy);
    for (int j = 0; (j < childPatch.size()); j += 1) {
      patchList.insert(patchList.begin()+patchList.size(),childPatch[j]);
    };
  };
  return patchList;
}
struct __vdom__element* __vdom__dom = __vdom__element_new("");
std::map<std::string,std::function<void (struct __vdom__event* event)>> __vdom__dom_event_map;
int __vdom__dom_background_pending = 0;
int __vdom__dom_width = 800;
int __vdom__dom_height = 600;
#include "webview.h"
 void __vdom__dom_onload(void);
 void __vdom__dom_onresize(int width, int height);
 void __vdom__dom_event(std::string id, std::string type, int client_x, int client_y, int offset_x, int offset_y);
 void __vdom__dom_background();
 webview::webview _webview(640,480,false,true);
 void _webview_init(std::string js) {
   _webview.bind("dom_event", [](std::string s) -> std::string {__vdom__dom_event(
     webview::json_parse(s, "", 0), // id
     webview::json_parse(s, "", 1), // type
     std::stoi(webview::json_parse(s, "", 2)), // client_x
     std::stoi(webview::json_parse(s, "", 3)), // client_y
     std::stoi(webview::json_parse(s, "", 4)), // offset_x
     std::stoi(webview::json_parse(s, "", 5)) // offset_y
     ); return s;}
   );
   _webview.bind("dom_onload", [](std::string s) -> std::string {__vdom__dom_onload(); return s;});
   _webview.bind("dom_onresize", [](std::string s) -> std::string {__vdom__dom_onresize(std::stoi(webview::json_parse(s, "", 0)), std::stoi(webview::json_parse(s, "", 1))); return s;});
   _webview.bind("dom_background", [](std::string s) -> std::string {__vdom__dom_background(); return s;});
   _webview.init(js);
   _webview.navigate("data:image/svg+xml, <svg id='root' version='1.1' xmlns='http://www.w3.org/2000/svg'></svg>");
 }
 void __vdom__dom_init(void) {
  __vdom__dom_event_map = {};
  std::string js = "";
  (js += "let _webview_element;");
  (js += "let _webview_element_stack = [];");
  (js += "let _webview_element_selected;");
  (js += "function dom_timer() {");
  (js += "  dom_background();");
  (js += "  setTimeout(dom_timer, 10);");
  (js += "}");
  (js += "dom_timer();");
  (js += "dom_onload('');");
  (js += "dom_onresize(window.innerWidth, window.innerHeight);");
  (js += "window.onresize = function() { dom_onresize(window.innerWidth, window.innerHeight); };");
  (js += "function _webview_dom_event(id, type, evt) {");
  (js += "  if (type == 'contextmenu') {evt.preventDefault();}");
  (js += "  if (type != 'contextmenu' && type != 'pointerup' && evt.button > 0) {return; };");
  (js += "  let client_x = evt.clientX;");
  (js += "  let client_y = evt.clientY;");
  (js += "  let bbox = evt.target.getBoundingClientRect();");
  (js += "  let offset_x = evt.clientX - bbox.x;");
  (js += "  let offset_y = evt.clientY - bbox.y;");
  (js += "  dom_event(id, type, client_x, client_y, offset_x, offset_y);");
  (js += "}");
  (js += "function _webview_element_select_path(path) {");
  (js += "  _webview_element_selected = document.documentElement;");
  (js += "  for (var i = 0; i < path.length; i++) {");
  (js += "    _webview_element_selected = _webview_element_selected.children[path[i]];");
  (js += "  }");
  (js += "  _webview_element_stack = [];");
  (js += "}");
  _webview_init(js);
} void __vdom__dom_event(std::string id, std::string type, int client_x, int client_y, int offset_x, int offset_y) {
  struct __vdom__event* event = new __vdom__event();
  event->type = type;
  event->client_x = client_x;
  event->client_y = client_y;
  event->offset_x = offset_x;
  event->offset_y = offset_y;
  std::string m = id;
  (m += ":");
  (m += type);
  std::function<void (struct __vdom__event* event)> fn = __vdom__dom_event_map[m];
  fn(event);
} void __vdom__dom_element_write(struct __vdom__element* element) {
  std::string name = element->name;
  _webview.eval("_webview_element = document.createElementNS('http://www.w3.org/2000/svg', '" + name + "');");
;
  for (const auto &[attr,value] : element->attr) {
    if (attr == "text") {
      _webview.eval("_webview_element.textContent='" + value + "'");
;
    } else {
      _webview.eval("_webview_element.setAttribute('" + attr + "', '" + value + "');");
;
    };
  };
  for (const auto &[type,handler] : element->event) {
    std::string id = element->attr["id"];
    std::string m = id;
    (m += ":");
    (m += type);
    __vdom__dom_event_map[m] = handler;
    _webview.eval("_webview_element.addEventListener('" + type + "', function(evt) { try{evt.target.releasePointerCapture(evt.pointerId);}catch{}_webview_dom_event('"+id+"', '"+type+"', evt); });");
;
  };
  for (int i = 0; (i < element->child.size()); i += 1) {
    _webview.eval("_webview_element_stack.push(_webview_element);");
;
    __vdom__dom_element_write(element->child[i]);
    _webview.eval("_webview_element_selected = _webview_element_stack.pop();");
;
    _webview.eval("_webview_element_selected.appendChild(_webview_element);");
;
    _webview.eval("_webview_element = _webview_element_selected;");
;
  };
} void __vdom__dom_patch(struct __vdom__patch* patch) {
  std::string path = "[";
  for (int i = 0; (i < patch->path.size()); i += 1) {
    if (i > 0) {
      (path += ",");
    };
    (path += tostring(patch->path[i]));
  };
  (path += "]");
  if (patch->type == __vdom__PATCH_REPLACE) {
    __vdom__dom_element_write(patch->element);
    _webview.eval("_webview_element_select_path(" + path + ");");
;
    _webview.eval("_webview_element_selected.replaceWith(_webview_element);");
;
  };
  if (patch->type == __vdom__PATCH_UPDATE) {
    _webview.eval("_webview_element_select_path(" + path + ");");
;
    _webview.eval("_webview_element = _webview_element_selected");
;
    for (const auto &[attr,value] : patch->element->attr) {
      if (attr == "text") {
        _webview.eval("_webview_element.textContent='" + value + "'");
;
      } else {
        _webview.eval("_webview_element.setAttribute('" + attr + "', '" + value + "');");
;
      };
    };
  };
} void __vdom__update(void) {
  struct __vdom__element* dom = __vdom__dom_render_func();
  std::vector<int> path = std::vector<int>();
  std::vector<struct __vdom__patch*> patch = __vdom__diff(__vdom__dom, dom, path);
  for (int i = 0; (i < patch.size()); i += 1) {
    __vdom__dom_patch(patch[i]);
  };
  __vdom__dom = dom;
} void __vdom__update_background(void) {
  __vdom__dom_background_pending = 1;
} void __vdom__dom_background(void) {
  if (__vdom__dom_background_pending) {
    __vdom__update();
    __vdom__dom_background_pending = 0;
  };
} void __vdom__dom_onload(void) {
  __vdom__update();
} void __vdom__dom_onresize(int width, int height) {
  __vdom__dom_width = width;
  __vdom__dom_height = height;
  __vdom__update();
} void __vdom__dom_run(void) {
  _webview.run();
;
}

#define __vdom__LIST_WIDTH 50
#define __vdom__LIST_ITEM_X_MARGIN 2
#define __vdom__LIST_ITEM_HEIGHT 10
#define __vdom__LIST_ITEM_HEIGHT_HALF 5
int __vdom__list_selected_index;
struct __vdom__element* __vdom__list_render(int pos_x, int pos_y, std::vector<std::string>& values, std::function<void (std::string value)> select) {
  struct __vdom__element* g = __vdom__element_new("g");
  g->attr["key"] = "list";
  {
    struct __vdom__element* _0_2_rect = __vdom__element_new("rect");
    g->child.insert(g->child.begin()+g->child.size(),_0_2_rect);
    _0_2_rect->attr["id"] = "vdom.listbox";
    _0_2_rect->attr["x"] = tostring(pos_x);
    _0_2_rect->attr["y"] = tostring(pos_y);
    _0_2_rect->attr["width"] = tostring(__vdom__LIST_WIDTH);
    _0_2_rect->attr["height"] = tostring((values.size() * __vdom__LIST_ITEM_HEIGHT));
    _0_2_rect->attr["fill"] = "white";
    _0_2_rect->attr["stroke"] = "black";
    _0_2_rect->attr["pointer-events"] = "all";
    _0_2_rect->event["pointermove"] = [=](struct __vdom__event* event) {
        __vdom__list_selected_index = (int)(event->offset_y / __vdom__LIST_ITEM_HEIGHT);
        if (__vdom__list_selected_index >= values.size()) {
          __vdom__list_selected_index = (values.size() - 1);
        };
        __vdom__update();
      };
    _0_2_rect->event["pointerdown"] = [=](struct __vdom__event* event) {
        int i = __vdom__list_selected_index;
        select(values[i]);
      };
    _0_2_rect->event["pointerup"] = [=](struct __vdom__event* event) {
        int i = __vdom__list_selected_index;
        select(values[i]);
      };
    _0_2_rect->event["pointerout"] = [=](struct __vdom__event* event) {
        __vdom__list_selected_index = -1;
        __vdom__update();
      };
  };
  if (__vdom__list_selected_index >= 0) {
    {
      struct __vdom__element* _1_0_rect = __vdom__element_new("rect");
      g->child.insert(g->child.begin()+g->child.size(),_1_0_rect);
      _1_0_rect->attr["x"] = tostring(pos_x);
      _1_0_rect->attr["y"] = tostring((pos_y + (__vdom__list_selected_index * __vdom__LIST_ITEM_HEIGHT)));
      _1_0_rect->attr["width"] = tostring(__vdom__LIST_WIDTH);
      _1_0_rect->attr["height"] = tostring(__vdom__LIST_ITEM_HEIGHT);
      _1_0_rect->attr["fill"] = "lightgrey";
      _1_0_rect->attr["stroke"] = "none";
      _1_0_rect->attr["pointer-events"] = "none";
    };
  };
  for (int i = 0; (i < values.size()); i += 1) {
    {
      struct __vdom__element* _1_0_text = __vdom__element_new("text");
      g->child.insert(g->child.begin()+g->child.size(),_1_0_text);
      _1_0_text->attr["font-size"] = "10";
      _1_0_text->attr["font-family"] = "sans-serif";
      _1_0_text->attr["text-anchor"] = "left";
      _1_0_text->attr["alignment-baseline"] = "central";
      _1_0_text->attr["pointer-events"] = "none";
      _1_0_text->attr["x"] = tostring((pos_x + __vdom__LIST_ITEM_X_MARGIN));
      _1_0_text->attr["y"] = tostring(((pos_y + (i * __vdom__LIST_ITEM_HEIGHT)) + __vdom__LIST_ITEM_HEIGHT_HALF));
      _1_0_text->attr["text"] = tostring(values[i]);
    };
  };
  return g;
}
struct example {
  int active;
  int pos_x;
  int pos_y;
};
struct example* example_data = new example();
struct __vdom__element* example_render(struct example* example) {
  std::vector<std::string> items = {"red","green","blue"};
  struct __vdom__element* svg = __vdom__element_new("svg");
  svg->attr["version"] = "1.1";
  svg->attr["xmlns"] = "http://www.w3.org/2000/svg";
  svg->attr["width"] = tostring(640);
  svg->attr["height"] = tostring(480);
  {
    struct __vdom__element* _0_8_defs = __vdom__element_new("defs");
    svg->child.insert(svg->child.begin()+svg->child.size(),_0_8_defs);
    {
      struct __vdom__element* _1_0_style = __vdom__element_new("style");
      _0_8_defs->child.insert(_0_8_defs->child.begin()+_0_8_defs->child.size(),_1_0_style);
      _1_0_style->attr["type"] = "text/css";
      _1_0_style->attr["text"] = "text{user-select:none;}";
    };
    {
      struct __vdom__element* _1_1_style = __vdom__element_new("style");
      _0_8_defs->child.insert(_0_8_defs->child.begin()+_0_8_defs->child.size(),_1_1_style);
      _1_1_style->attr["type"] = "text/css";
      _1_1_style->attr["text"] = "text::selection {background:none;}";
    };
  };
  struct __vdom__element* g = __vdom__element_new("g");
  g->attr["transform"] = "translate(0.5 0.5)";
  svg->child.insert(svg->child.begin()+svg->child.size(),g);
  struct __vdom__element* rect = __vdom__element_new("rect");
  rect->attr["id"] = "main";
  rect->attr["x"] = tostring(0);
  rect->attr["y"] = tostring(0);
  rect->attr["width"] = tostring(800);
  rect->attr["height"] = tostring(600);
  rect->attr["stroke"] = "none";
  rect->attr["fill"] = "white";
  rect->event["mousedown"] = [=](struct __vdom__event* event) {
      example->active = 0;
      __vdom__update();
    };
  rect->event["contextmenu"] = [=](struct __vdom__event* event) {
      example->active = 1;
      example->pos_x = event->client_x;
      example->pos_y = event->client_y;
      __vdom__update();
    };
  g->child.insert(g->child.begin()+g->child.size(),rect);
  if (example->active == 1) {
    g->child.insert(g->child.begin()+g->child.size(),__vdom__list_render(example->pos_x, example->pos_y, items, [=](std::string value) {
        std::cout << value << std::endl;
        example->active = 0;
        __vdom__update();
      }));
  };
  return svg;
}
struct __vdom__element* render(void) {
  return example_render(example_data);
}
int main_args(std::vector<std::string>& args) {
  __vdom__dom_init();
  __vdom__dom_render_func = render;
  __vdom__dom_run();
  return 0;
}
int main(int argc, char** argv) {
  std::vector<std::string> args(argv, argv + argc);
  return main_args(args);
};

