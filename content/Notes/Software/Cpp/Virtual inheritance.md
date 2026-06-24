Virtual inheritance is about resolving the diamond problem in multiple inheritance.
Assume you have a class A. And that function inherits from class B and C. class B and C have a function that has the same name and argument. The two functions are identical besides what is inside of it. Virtual inheritance is needed by class A to not mix up the two functions that it inherits from.

This is different from [[virtual function]]

This is a diamond problem because it solves the issue of when two class inherits from the same parent forming a diamond if you draw their relationship.

```
struct D {
    D() { std::cout << "D constructor\n"; }
};

struct B : public D {};
struct C : public D {};

// A inherits from B and C
struct A : public B, public C {};
```
In this case, there's 2 copies of D which is not okay.
We solve this by doing this
```
struct B : public virtual D {};
struct C : public virtual D {};
struct A : public B, public C {};
```

This ambiguity-preventing mechanism relies on a hidden pointer, called a virtual base pointer (vbptr), to look up the shared base object's location in memory at runtime.