Syntax used to initialize variables in a constructor to initialize variable before the class is built. This is helpful for defining const

```cpp
class A(){
	int val, val2;
	A(int a) : val(a), val2(a) {
		std::cout << val << ", " << val2;
	}
}
```