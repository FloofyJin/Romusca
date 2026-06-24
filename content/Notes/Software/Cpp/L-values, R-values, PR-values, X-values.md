### L-value
Memory location which identifies an object. 
l-value can appear on left hand or right side of "=" operator

For example, if ptr is a pointer to a storage region, then ptr is a modifiable l-value that designates the storage region to which **ptr** points

l-values
* ptr or \*ptr in the equation `int \*ptr = (int \*) 0x1000100` 
* val in the equation `int val = 123`

eg.
```cpp
int& setValue() { // returns l-value
	static int x = 1;
	return x;
}
```

---
```
                expression
                   |
         ---------------------
         |                   |
       lvalue              rvalue
                              |
                    ----------------
                    |              |
                  prvalue        xvalue
```
- every xvalue is an rvalue
- every prvalue is an rvalue
- but they behave differently
### R-value
Data value that is stored at some address in memory. It is an expression that cant have a value assigned to it
r-value can appear on the right but not on the left

r-values
* val+5
* &val

eg.
```cpp
int setValue() { // returns r-value
	return 1;
}
```
### PR-values
"expiring" object
Object still exists but the compiler is allowed to  steal/move from it because its about to die

```cpp
std::String s = "hello"
```
This is an l-value

```cpp
std::string("hello")
```
This is a temporary object. It has no persistent identity.
This is a pr-value
### X-value
```cpp
std::move(s)
```
s still exists, memory still exists, but cpp now treats it as a "safe to move from", meaning program promises it no longer cares about preserving the original object's content

But why?
Its used for performance.
```cpp
std::vector<int> a = huge_vector();
```
without move semantics, entire vector content needs to be copied. With x-values, internal pointer is stolen and no massive copy is needed.
`std::move` basically copies data from one to the other, and tells the program the original data can be deleted