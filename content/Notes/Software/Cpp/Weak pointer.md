Weak pointer is a non owning reference to an object managed by [[Shared pointer]]
* It doesnt increase reference count
* lets you peek at the object if its still alive
* you must convert it to `std::shared_ptr` lock() before using it

What this means is that you can have two classes that reference each other but there wont be a circular dependency if you make one of them a weak pointer.

You can cretae a weak pointer with `std::weak_ptr<T>`

Example
```cpp
std::shared_ptr<int> sp = std::make_shared<int>(10);
std::weak_ptr<int> copy_sp = sp;

if (auto locked = wp.lock()) {   // lock returns shared_ptr if alive
    std::cout << *locked << "\n";  // safe to use
} else {
    std::cout << "object expired\n";
}
```

Circular pointer issue it solves
```cpp
#include <memory>
#include <iostream>

struct B;  // forward declare

struct A {
    std::shared_ptr<B> bptr;
    ~A() { std::cout << "A destroyed\n"; }
};

struct B {
    std::shared_ptr<A> aptr;
    ~B() { std::cout << "B destroyed\n"; }
};

int main() {
    auto a = std::make_shared<A>();
    auto b = std::make_shared<B>();
    a->bptr = b;
    b->aptr = a;
}
```