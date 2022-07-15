ifeq ($(OS),Windows_NT)
UNX=..\unx/
WAX=..\wax.exe
CC = cl /EHsc /std:c++17 /I./libwebview
CLINK = .\libwebview\WebView2LoaderStatic.lib gdi32.lib user32.lib Shlwapi.lib Advapi32.lib
else
UNX=
WAX=../wax
CC = g++ -std=c++17 -I./libwebview 
CLINK = `pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.0`
endif

test: test_unit_js test_unit_cpp

# unit tests
UNIT_TEST = $(wildcard *_test.wax)
UNIT_TEST_CPP = $(patsubst %.wax, %.test.cpp, $(UNIT_TEST))
UNIT_TEST_JS = $(patsubst %.wax, %.test.js, $(UNIT_TEST))
test_unit_cpp: $(UNIT_TEST_CPP)
test_unit_js: $(UNIT_TEST_JS)

%.test.cpp : %.wax
	$(WAX) build --target=cpp $< > tmp.cpp && $(CC) tmp.cpp -o tmp.bin && ./tmp.bin

%.test.js : %.wax
	$(WAX) build --target=js $< > tmp.js && node tmp.js

clean: 
	$(UNX)rm -f *.cpp *.js *.bin
