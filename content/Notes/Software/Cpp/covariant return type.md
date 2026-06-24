Its just a feature to make inheritance clean. 
Normally, when you override a virtual function in a derived class, the **return type must match exactly**. But in Cpp, if the return type is a pointer or reference to a class, then in the derived class you can override it with a more derived type.

Basically this means you can override the return type in a derived class if the said overriding function in the Base class returns a pointer or a reference to a class/struct type.

Rule:
* Covariant return type in Child has to be marked override (optional but good practice)
* Covariant return type must be inheriting from the Base type
* Parent class with parent function must be marked virtual
* Parent function must return the Base type
* return type must be pointers (or references) where it child return type publicly inherits from parent return type

Good
```
struct Base {};
struct Derived: Base {};

struct Parent {
    virtual Base* create() {
	    return new Base();
    };
};

struct Child : Parent {
    // Covariant return type: Derived* is OK
    Derived* create() override{
	    return new Derived();
    };
};
```

Bad
```
struct Parent {
    virtual Base create();  // returns by value
};

struct Child : Parent {
    Derived create() override;  // ❌ NOT allowed
};
```