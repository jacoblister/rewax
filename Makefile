ifeq ($(OS),Windows_NT)
UNX=..\unx/
CC = cl /EHsc
WAXBIN = wax.exe
TMPBIN = tmp.exe
else
UNX=
CC = g++ -std=c++17
#CC = clang++
WAXBIN = ./wax
TMPBIN = ./tmp.bin
endif

# overall targets
all: compiler.js wax.js wax wax.exe

test: test_unit_js test_wax_js test_wax_extended_js test_unit_cpp test_wax_cpp test_wax_extended_cpp test_wax_vdom
testc: test_wax_c

clean:
	$(MAKE) -C waxclassic clean	
	$(UNX)rm -f wax wax.exe *.c *.cpp *.ts *.js *.bin *.out *.tmp *.o *.obj

# Wax Classic
waxclassic/waxc:
	$(MAKE) -C waxclassic

# Compiler target 
compiler.js: waxclassic/waxc
	$(WAXC) compiler.wax --ts compiler.ts
	tsc compiler.ts

# Self hosted compiler targets
wax.js: compiler.js
	node compiler.js build --target=js compiler.wax > wax.js

wax.cpp: compiler.js
	node compiler.js build --target=cpp compiler.wax > wax.cpp

wax: wax.cpp
	$(CC) wax.cpp -o wax

wax.exe: wax.cpp
	$(CC) wax.cpp -o wax

WAX_JS_WAXC = node compiler.js # waxc js build
WAX_JS_WAX = node wax.js # self hosted, js
WAX_CPP_WAX = ./wax # self hosted, c++
WAX = $(WAX_CPP_WAX)
WAXC = waxclassic/waxc

# Compiler unit tests
UNIT_TEST = $(wildcard *_test.wax)
UNIT_TEST_JS = $(patsubst %.wax, %.test.js, $(UNIT_TEST))
UNIT_TEST_CPP = $(patsubst %.wax, %.test.cpp, $(UNIT_TEST))

test_unit_js: compiler.js wax.js wax $(UNIT_TEST_JS)
test_unit_cpp: compiler.js wax.js wax $(UNIT_TEST_CPP)

%.test.js : %.wax
	$(WAXBIN) build --target=js $< > tmp.js && node tmp.js

%.test.cpp : %.wax
	$(WAXBIN) build --target=cpp $< > tmp.cpp && $(CC) tmp.cpp -o tmp.bin && ./tmp.bin

%.test.c : %.wax
	$(WAXBIN) build --target=c $< > tmp.c && gcc tmp.c -o tmp.bin && ./tmp.bin

WAX_TEST = $(wildcard test/*.wax)
WAX_TEST_SNAPSHOT = $(patsubst %.wax, %.out, $(WAX_TEST))
WAX_TEST_WAXC_TS = $(patsubst %.wax, %.test.waxc.ts.out, $(WAX_TEST))
WAX_TEST_WAXC_C = $(patsubst %.wax, %.test.waxc.c.out, $(WAX_TEST))
WAX_TEST_WAXC_CPP = $(patsubst %.wax, %.test.waxc.cpp.out, $(WAX_TEST))
WAX_TEST_JS = $(patsubst %.wax, %.test.js.out, $(WAX_TEST))
WAX_TEST_CPP = $(patsubst %.wax, %.test.cpp.out, $(WAX_TEST))
WAX_TEST_C = $(patsubst %.wax, %.test.c.out, $(WAX_TEST))

test_snapshot: compiler.js $(WAX_TEST_SNAPSHOT)
test_waxc_ts: compiler.js $(WAX_TEST_WAXC_TS)
test_waxc_c: compiler.js $(WAX_TEST_WAXC_C)
test_waxc_cpp: compiler.js $(WAX_TEST_WAXC_CPP)
test_wax_js: compiler.js wax.js $(WAX_TEST_JS)
test_wax_cpp: $(WAXBIN) $(WAX_TEST_CPP)
test_wax_c: $(WAXBIN) $(WAX_TEST_C)

WAX_TEST_EXTENDED = $(wildcard test_extended/*.wax)
WAX_TEST_EXTENDED_JS = $(patsubst %.wax, %.test.js.out, $(WAX_TEST_EXTENDED))
WAX_TEST_EXTENDED_CPP = $(patsubst %.wax, %.test.cpp.out, $(WAX_TEST_EXTENDED))

test_wax_extended_js: compiler.js wax.js $(WAX_TEST_EXTENDED_JS)
test_wax_extended_cpp: $(WAXBIN) $(WAX_TEST_EXTENDED_CPP)

test_wax_vdom:
	$(WAXBIN) build --target=wax test_vdom/vdom.wax > vdom.out && diff vdom.out test_vdom/vdom_out.wax

%.out : %.wax
	$(WAXC) --ts tmp.ts $< && tsc tmp.ts && node tmp.js > $@

%.test.waxc.ts.out : %.wax
	$(WAXC) --ts tmp.ts $< && tsc tmp.ts && node tmp.js > out.tmp

%.test.waxc.c.out : %.wax
	$(WAXC) --c tmp.c $< && gcc tmp.c -o tmp.bin && ./tmp.bin > out.tmp

%.test.waxc.cpp.out : %.wax
	$(WAXC) --cpp tmp.cpp $< && $(CC) tmp.cpp -o tmp.bin && ./tmp.bin > out.tmp

%.test.js.out : %.wax
	$(WAXBIN) build --target=js $< > tmp.js && node tmp.js > out.tmp && diff $*.out out.tmp

%.test.cpp.out : %.wax
	$(WAXBIN) build --target=cpp $< > tmp.cpp && $(CC) tmp.cpp -o $(TMPBIN) && $(TMPBIN) > out.tmp 
	$(UNX)diff $*.out out.tmp

%.test.c.out : %.wax
	$(WAXBIN) build --target=c $< > tmp.c && gcc tmp.c -o $(TMPBIN) && $(TMPBIN) > out.tmp 
	$(UNX)diff $*.out out.tmp

