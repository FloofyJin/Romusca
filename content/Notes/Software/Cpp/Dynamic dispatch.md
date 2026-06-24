Mechanism where the compiler decides which virtual function to call at runtime rather than compile time

If I have a base class and  derived class, and they both implement the same function, dynamic dispatch ensures that the correct overridden function is called based on object being pointed to, not the type

vtable (virtual table): For classes with virtual function, compiler creates static table. This static table has an array of function pointers.

vptr (vritual pointer): Every object of a class with [[virtual functions]] get a hidden pointer. This vptr points to vtable corresponding to the object's  actual runtime type.

1. During runtime, program looks at the object's vptr.
2. It follows the vptr to the class's vtable
3. It looks up the correct function pointer in the table and executes that code

Q&A:
Q: Does every class get its own vtable?
A: No, not every class. A class only gets a vtable if it introduces a virtual function, overrides a virtual function from a parent class, or inherits from a class that has virtual functions. If a class contains only normal functions and variables, the compiler does not generate a vtable for it at all, and its objects will not contain a hidden vptr.

Q: Is the size of the vtable dynamic? How big are they?
A: The size of a vtable is fixed at compile-time (static). It does not shrink or grow while the program is running.
A vtable is essentially an array of function pointers. Therefore, its size depends strictly on the number of virtual functions a class has access to. On a 64-bit system, a pointer is **8 bytes**. A vtable is essentially an array of function pointers. Therefore, its size depends strictly on the number of virtual functions a class has access to. On a 64-bit system, a pointer is 8 bytes.

Q: Why do we only keep virtual functions in the vtable? What about normal functions?
A: We only keep virtual functions in the vtable because they are the only functions whose destination can change at runtime.
To understand why normal functions don't need a vtable, we have to look at how the CPU and the compiler handle them. Normal functions have behaviors strictly bound to the type of the pointer or variable you use to call it.

Normal function
```cpp
class Base { public: void print() {} };
class Derived : public Base { public: void print() {} };

Base* ptr = new Derived();
ptr->print(); // Calls Base::print()
```
We know what  print() does during compile time, we it gets replaced with Base::print()

Virtual function
```cpp
class Base {
public:
    // 1. The keyword is defined HERE in the architecture of the class
    virtual void print() { 
        std::cout << "Base\n"; 
    }
};
class Derived : public Base {
public:
    // 2. This is automatically virtual because Base::print() is virtual!
    // Specifying 'override' is optional but highly recommended.
    void print() override { 
        std::cout << "Derived\n"; 
    }
};

Base* ptr = (rand() % 2 == 0) ? new Base() : new Derived();
ptr->print(); // The compiler cannot possibly know which one this is!
```
Because compiler cannot look at the code to determine the target of print(), it will generate the code during runtime using vtable.