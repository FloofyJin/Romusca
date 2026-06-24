introduced in C++11
If any side is `&`, result becomes `&` expect `&& &&`

| Combination | Result |
| ----------- | ------ |
| T& &        | T&     |
| T& &&       | T&     |
| T&& &       | T&     |
| T&& &&      | T&&    |
### The Rule: The "Amper-Sandwich"
L-value reference: &
R-value reference: &&

When these two types meet during type deduction, l-value reference always wins

### What is &?
The symbol "&" is an l-value which a reference to original variable
```cpp
int original = 10;
int& nickname = original; // 'nickname' is now another name for 'original'

nickname = 20; // This changes 'original' to 20
```
### What is &&?
Allows us to store temporary value that is about to vanish.
We know "42" is an r-value, so we can use int&& to store that
```cpp
int&& temporaryRef = 42; // Valid! 42 is a temporary value (rvalue).
// int& badRef = 42;    // Compiler Error! A normal reference can't hold a temporary literal.
```