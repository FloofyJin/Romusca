C++11
You can define variables with curly braces. It helps with uniformity as functions can be defined in a similar fashion.

Example
- Primitive types: `int x{10};`
- Arrays: `int arr[]{1, 2, 3};`
- Structs and classes (including aggregates): `struct Point { int x, y;` `};` `Point p{1, 2};`

- Standard library containers: `std::vector<int> v{1, 2, 3};`

- Objects with constructors: `MyClass obj{arg1, arg2};`

Narrowing Conversion Prevention:
A significant benefit of brace initialization is its ability to prevent narrowing conversions that might lead to data loss. For example, initializing an int with a double value that would lose precision will result in a compile-time error:

int x = 3.14; // OK (narrowing conversion, potential data loss)
int y{3.14};  // Error: narrowing conversion not allowed with brace initialization