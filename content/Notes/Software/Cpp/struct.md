struct and class are essentially the same but members in struct are public by default, class other way around.
- `class`: members are **private** by default. Inheritance is **private** by default
- `struct`: members are **public** by default. Inheritance is **public** by default

There are some differences in Cpp and C.
In C:
```
struct Point{
	int x;
}

struct Point p; // Good

Point p; // Bad
```
In Cpp:
```
struct Point{
	int x;
}

struct Point p; // Good

Point p; // Good
```

#### Declaration (On the stack)
```cpp
MyClass c; // Correct way to call the default constructor
```

#### Declaration (On the heap via Raw Pointers)
```cpp
MyClass* c = new MyClass();
```
#### Declaration (Modern C++ Smart Pointers) (On the heap)
```cpp
#include <memory>

// Unique Pointer (Owns object exclusively)
std::unique_ptr<MyClass> c1 = std::make_unique<MyClass>();

// Way 3B: Shared Pointer (Multiple pointers can share ownership) 
std::shared_ptr<MyClass> c2 = std::make_shared<MyClass>();
```

#### Dot Operator (.)
For actual object or reference
```cpp
MyClass c;        // An actual object on the stack
MyClass& ref = c; // A reference to that object

c.makeRequest(1, 100);   // Use .
ref.makeRequest(1, 100); // Use .
```
#### Arrow Operator (->)
For variable that is a  pointer (holds memory address)
```cpp
MyClass* ptr = new MyClass(); // Raw pointer
auto smartPtr = std::make_unique<MyClass>(); // Smart pointer

ptr->makeRequest(1, 100);      // Use ->
smartPtr->makeRequest(1, 100); // Use ->
```
Arrow operator is actually a wrapper on top of a normal dot operator. Its basically doing two things:
1. Dereferencing the pointer to get real object (\*ptr)
2. Access  the member using dot `.makeRequest()`