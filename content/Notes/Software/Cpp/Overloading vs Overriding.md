This is basically Runtime polymorphism. "Many forms"
#### Overloading (static polymorphism) compile-time
Same function name, different parameter list.
Compile time
```cpp
struct Child {
    void speaks(const char *words) {
        std::cout << "Child: " << words << std::endl;
    }

    void speaks(int i) {
        std::cout << "Child: " << i << std::endl;
    }
};

int main(){
    Child* b = new Child();
    b->speaks(1);
    return 0;
}
```
output:
```
Child: 1
```
#### Overriding (dynamic polymorphism) Run-time
C++11
Redefining a base class's virtual function in a derived class with the same signature. this is a form of [[Multiple inheritance]].
Run time.

Example: Run time polymorphism
```
class Animal {
	virtual void speak() { // Fact that its virtual is important
		cout << "Animal speaks" << endl;
	}
}

class Dog : public Animal {
	void speak() override {
		cout << "Dog barks" << endl;
	}
}

int main() {
	Animal* a = new Dog();
	a->speak();
}
```
output:
```
Dog barks
```

implication:
1. Memory overhead: Every object instance grows by the size of one pointer to accommodate vptr
2. Execution overhead: A direct function call is a simple jump  instruction while a virtual call requires pointer indirection like loading vptr, calculating vtable offset, and fetching function address. This can cause CPI cache misses.