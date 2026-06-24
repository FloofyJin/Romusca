```cpp
    std::map<const char*, int> m{};
    m["a"] = 4;
    auto *p1 = "a";
    std::string tmp = "a";
    char *p2 = tmp.data();
    
    std::cout << m["a"] << std::endl;
    std::cout << m[p1] << std::endl;
    std::cout << m[p2] << std::endl;
    /*output
    / 4
    / 4
    / 0
    */
```
One thing to note here is that the key value of the map is memory address not a string literal, so on line 2, key value is the memory address of "a"

"a" is a string literal that is probably stored in memory as something like 0x5000. 
And in the second lookup, it tries to set p1 with value "a". Most compilers merge identical string literals so p1 points to same literal 0x5000.
In third lookup, tmp owns its own buffer so the memory is different thus p2 points to a different memory, for example 0x8000.

==NOTE==: But again, this is compiler dependent, some compilers will not use same memory address for string literals.