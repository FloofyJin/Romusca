Trailing return type in C++ is an alternative syntax to specifying return before function name

##### Regular
`ReturnTyep functionName(ParameterType parameter);
###### Trailing return type
`auto functionName(ParaemeterType parameter) -> ReturnType`


### Use case
##### Dependent return type in templates - return type in a template might rely on the parameter
```
template <typename T, typename U>
auto sum(T t, U u) -> decltype(t + u);
```

##### Lambda expressions - trailing return type is the only way to specify return in Lambda expression
```
auto myLambda = [](int x, int y) -> int { return x + y; };
```

##### Member function definition outside the class - defining member function of a class template outside the class definition by avoiding the need to qualify member typedef multiple times
```
struct MyClass {
	typedef std::vector<int> IntegerSequence;
	IntegerSequence getIntegers() const;
}

MyClass::IntegerSequence MyClass::getIntegers() const { /** **/ }

auto MyClass:getIntegers() const -> IntegerSequence { /** **/ }
```

