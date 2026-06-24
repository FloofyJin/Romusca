In cpp, typedef is a keyword used to create an alias for an existing datatype.

```
typedef usigned long ulong;
ulong x =  100;
```

You can also create simpler structs
```
struct Point {
	int x;
}

// without typedef
struct Point p1;

// With typedef
typedef struct Point PointAlias;
PointAlias p2;
```

Function pointers
```
typedef void (*Callback)(int);

void myFunc(int x) {}

int main() {
	Callback cb = myFunc;
	cb(6);
}
```
^ Special note here:
`Callback cb = &myFunc;`