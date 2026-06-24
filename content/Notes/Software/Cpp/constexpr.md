constexpr is a keyword that tells the compiler that expression, function, or object can be evaluated at compile time, not just runtime.

"If you can figure this value out at compile time, please do. Enforce that its constant if required"

Good
```cpp
constexpr int val = 3;
```

Error
```cpp
int x = 5;
constexpr int val = x + 1; // x is not constexpr
```

#### A constexpr function or constructor
This function  can be evaluated at compile time if given compile-time argument, but can also run at runtime if needed
```cpp
constexpr int square(int x) {
	return x*x;
}
constexpr int val = square(2); //compile time
int num = square(2); // runtime
```
Rule for `constexpr` function
* Must contain only code that can be evaluated at compile time (no I/O, no new, etc., unless allowed in
* Must return one value. no void

Cool example
```cpp
#include <iostream>
#include <vector>
struct A {

    constexpr A() { };

    constexpr int compute() {
        std::vector<int> v;
        v.push_back(1);
        return v[0];
    }
};
int main(){
    A a;
    constexpr int val =  a.compute();
    std::cout << val;
    return 0;
}
```
This compiles because you can use `std::vector` after c++20 inside constexpr function. Also notice how `a` is defined as not a constexpr. That is because the object must be created at runtime. It is okay that the contents of the object is made at compile time. `a` 's state doesnt matter for compile time evaluation bc it doesnt depend on runtime input