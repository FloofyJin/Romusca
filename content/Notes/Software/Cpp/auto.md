Cpp inference that happens during compiler time that deduces the type of variable.

`auto` can be put in place of most? types in cpp. they are especially helpful in lambda
```
    auto add = [](int a, int b) -> auto { return a+b; };
    std::cout << add(1,2); // 3
```

`auto` is a copy
`auto&` is a reference