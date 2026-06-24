One of 3 smart pointers: [[Weak pointer]], [[Shared pointer]]
```cpp
include <memory>
```

`std::unique_ptr<T>` 
* Exclusive ownership. Only one `unique_ptr` can own an object
* Automatically deletes when destroyed.
* Movable but not copyable

```
auto up = std::make_unique<int>(10)
std::cout << "Number: " << *up; // Number: 10
```


You can move ownership using `std::move`. Once moved, the original unique pointer is null.

[reference](https://en.cppreference.com/w/cpp/memory/unique_ptr.html)