 requires `#include <memory>`

`std::shared_ptr<T>` is a s mart pointer that manages a dynamically allocated object. Multiple `shared_ptr` can point to the same object. The object will be deleted it all of `shared_ptr` owning it is deleted.

[reference sheet](https://en.cppreference.com/w/cpp/memory/shared_ptr.html)

You can make multiple references like so:
```cpp
#include <iostream>
#include <memory>

struct A {
    A() {
        std::cout<<"constructing A\n";
    }
};

int main(){
    std::shared_ptr<A> p1 = std::make_shared<A>();
    std::shared_ptr<A> p2 = p1; // Two owners

    std::cout << "Use count: " << p1.use_count() << "\n"; // Use count: 2
    return 0;
}
```

Making a shared pointer is roughly the same as allocating memory on heap via `new A()`. Memory is freed automatically.