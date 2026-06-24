A virtual function is a member function in a base class that you expect to redefine (override) in derived classes to achieve runtime polymorphism. When you call a virtual function through a base class pointer or reference, C++ uses a hidden look-up table called a **vtable** to ensure the program executes the specific version of the function belonging to the actual object type, rather than the pointer type. This allows you to write flexible, generic code that can interact with different derived objects dynamically at runtime.

It is a modifier on a function that tells the compiler these:
* If a derived (child) class redefines this function then use the derived version at runtime even when you're working through a base class pointer or reference.
* Ensures proper destruction
```
class  Base {
	virtial ~Base() {
		cout << "Base destroyed"; 
	}
}

class Child: public Base {
	int* data;
	Child() {
		data = new int[100];
	}
	~Child() {
		delete data;
		cout << "Derived destroyed";
	}
}

int main() {
	Base* obj = new Child();
	delete obj;
}
```
Notice how you made an obj of type `Base`. This means that when you delete obj, it tries to delete only `Base` part of the obj, so `Child` part doesn't get freed. This is bad, you need to make `Base` function virtual so that deletion gets propagated to the child.

It is important that you make parent class a virtual if you are allocating memory in the child because you will have memory leak if you try to delete Base obj while Base() is not virtual.
If you create an object that takes inheritance from a base like so `B* b = new A();`, A would be the most derived object. B would be the base and must have virtual destructor.

You dont have to make the parent function virtual if  you are creating an object of `Child`.
#### Destruction
If you have nested inheritance. Having the most class function that matches the base function would free the entire object. This means basically make base class destructors virtual if you will delete through a base pointer

assume A -> B -> D and A -> C
Construction order for `A`:
1. `B` (which derives from `D`)
2. `C`
3. `A` body
Destruction order (reverse):
4. `A::~A` body
5. `C::~C`
6. `B::~B` → `D::~D`

#### Downsides of making a virtual function
Besides the obvious design choice and readability, vtable pointer is added to the member variable an object containing virtual function which increases the size of the object slightly.
Vtable is a static object and doesnt contribute size to the object.