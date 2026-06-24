CPP has the ability to initialize the member variable using constructor argument before the the constructor body runs.

This is especially helpful for setting const variables.

or if you are setting reference variables like `int &`


eg. This allocates c to chip
```cpp
struct Board {
    std::shared_ptr<Chip<int>> chip;

    Board(std::shared_ptr<Chip<int>> c) : chip(c) {
        std::cout << "board" << std::endl;
    }
};
```

eg. set val and val2
```cpp
class A(){
	int val, val2;
	A(int a) : val(a), val2(a) {
		std::cout << val << ", " << val2;
	}
}
```