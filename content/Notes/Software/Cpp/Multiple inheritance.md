Take this example
```cpp
class C {
	public:
	    C() { std::cout << "C constructor\n"; }
	};

class B {
	public:
	    B() { std::cout << "B constructor\n"; }
	};

class A : public B, public C {
	public:
	    A() { std::cout << "A constructor\n"; }
	};
```
Calling `A a;` would print the following:
B constructor
C constructor
A constructor

Take this example
```cpp
class D {
public:
	D() { std::cout << "D constructor\n"; }
};
	
class C {
public:
	C() { std::cout << "C constructor\n"; }
};

class B: public D {
public:
	B() { std::cout << "B constructor\n"; }
};

class A : public B, public C {
public:
	A() { std::cout << "A constructor\n"; }
};
```
Calling `A a;` would print the following:
D constructor
B constructor
C constructor
A constructor