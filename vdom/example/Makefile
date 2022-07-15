ifeq ($(OS),Windows_NT)
UNX=..\..\unx/
WAX=..\..\wax.exe
CC = cl /EHsc /std:c++17 /I..\libwebview
CLINK = ..\libwebview\WebView2LoaderStatic.lib gdi32.lib user32.lib Shlwapi.lib Advapi32.lib
else
UNX=
WAX=../../wax
CC = g++ -std=c++17 -I../libwebview 
CLINK = `pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.0`
endif

all: svg svg.js component component.js

clean: 
	$(UNX)rm -f *.js *.cpp *.obj *.exe svg component

svg: svg.wax
	$(WAX) build --target=cpp svg.wax > svg.cpp && $(CC) svg.cpp -o svg $(CLINK)

svg.js: svg.wax
	$(WAX) build --target=js svg.wax > svg.js

component: component.wax
	$(WAX) build --target=cpp component.wax > component.cpp && $(CC) component.cpp -o component $(CLINK)

component.js: svg.wax
	$(WAX) build --target=js component.wax > component.js