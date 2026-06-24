Class Template Argument Deduction
Introduced in C++17

Feature that lets compiler deduce template parameter.

you can drop the template parameters <...> when creating object and the compiler will figure it out directly from the constructor inputs

Before C++17
```cpp
#include <utility>
#include <string>
std::pair<int, std::string> p(42, "hello");
```

After C++17
```cpp
#include <utility>
#include <string>
std::pair p(42, "hello");
```

Works only with class [[template]]
