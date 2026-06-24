std::bind

It allows you to create a function and reference it with open field
```cpp
void print_number(int a, int b) {  
	std::cout << a << " " << b << std::endl;  
}
auto f = std::bind(printer_number, 10, std::placeholders:_1);
```
placeholder is used to tell the bind that one field will be provided later. Then I can do:
```cpp
f(12) // output: 10 12
```

### class  function
Suppose I have a class
```cpp
class Car{
	void vroom(int times){
		std::cout << times << std::endl;
	}
}
```
`&Car::vroom` is a a member function pointer, not a normal function pointer. Its not possible to know which vroom() its referencing. So we have to do
```cpp
Car c;
c.vroom(3);
// or
Car c;
auto f = &Car::vroom;
(c.*f)(3);
```
But this is ugly, so we can use `std::bind`
```cpp
Car c;
std::bind(
	&Car::vroom,
	&d,
	std::placeholders::_1);
```