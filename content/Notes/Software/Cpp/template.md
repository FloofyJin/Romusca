C++ feature for enabling generic programming via blueprint

Template uses Template Argument Deduction. But there is a Class specific feature that was introduced in C++17 called [[CTAD or CTDI]] (Class Template Argument Deduction)

without template:
```cpp
int add(int a, int b) {
	return a + b;
}

double add(double a, double b) {
	return a + b;
}
```


With template:
```cpp
template <typename T>
T add(T a, T b) {
	return a + b;
}
```

#### Specialization pattern 
This is pattern matching for templates.

the key word `typename` is only used when you are trying to create a type T. You can do the same thing for List as well like so: `typename List` to specify that this you are creating a list of types. Of course, name could be anything but its easier for us as the programmer to know that its a List and not anything else.

No pattern matching
```
template <typename T>
struct Identity {
    using type = T;
};

Identity<int>::type        // int
Identity<double>::type     // double
Identity<Numbers<1,2>>::type // Numbers<1,2>
```

Pattern matching
```
template <int... Ns>
struct Numbers {};

template <typename T>
struct IsNumbers {
    static constexpr bool value = false;
};

template <int... Ns>
struct IsNumbers<Numbers<Ns...>> {
    static constexpr bool value = true;
};

IsNumbers<int>::value              // false
IsNumbers<Numbers<1,2>>::value     // true
```

### Definitions
Forward declaration
```
template <FixedString Name, typename... Lists>

struct InMyKingdom;
```
Primary definition - This is the general case for template. There can only be one for a template type. We know its a primary case bc theres no template argument (<> symbol) after the struct
```
template <FixedString Name, typename... Lists>
struct InMyKingdom {
    // Check if any list in our kingdom matches the one we're looking for
    template <typename TargetList>
    static constexpr bool contains() {
        // Fold expression using std::is_same_v to compare types
        return (std::is_same_v<TargetList, Lists> || ...);
    }

    static constexpr bool equalName() {
        return "Jake" == Name;
    }
};
```
partial specialization - In this example, there's no `Lists...` hence  its partial. When specialization matches, primary case is ignored. It does not inherit members from primary. Partial specialization is preferred when they match while primary acts as a fallback.
```
template <FixedString Name>
struct InMyKingdom <Name> {
    static constexpr bool value = false;
};
```
### Changes in C++20
1. In the pattern matching example, `Ns...` is necessary bc it allows the compiler to "absorb" the template argument captures the contents of Ns.
	c++20 introduced none-type template parameters. With this, I can use arbitrary class types like
```
template <FixedString Name>   // ❌ before C++20
```

2. default specialization is no longer needed. You don't need to explicitly define them