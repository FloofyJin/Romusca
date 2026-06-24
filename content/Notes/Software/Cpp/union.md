It is a datatype that allows multiple members to occupy the same memory location. Unlike struct where its member has its own distinct memory 

```cpp
union A {
	int a;
	int b;
}
```

you can define only one variable inside a  union at the same time. so `a` and `b` cannot be defined at the same time.

Compiler allocates space for the largest members in the union