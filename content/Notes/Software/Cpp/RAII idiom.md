Resource Acquisition Is Initialization
C++ programming technique
It binds the life cycle of a resource that must be acquired before use to  the lifetime of an object. Resource here could be allocated heap memory, thread of execution, open socket, open file, locked mutex, disk space, database connection—anything that exists in limited supply.

It guarantees that the resource is available to any function that may access the object.
It guarantees that  all resources are released when lifetime of their controlling object ends.

It encapsulate each resource into a class where
* constructor acquires the resource and establishes all class invariants or throws an exception
* destructor releases the resource and never throws  exception

Always use the resource via an instance of a RAII-class that either
- has automatic storage duration or temporary lifetime itself, or
- has lifetime that is bounded by the lifetime of an automatic or temporary object.

Classes with `open()`/`close()`, `lock()`/`unlock()`, or `init()`/`copyFrom()`/`destroy()` member functions are typical examples of non-RAII classes.

example:
```cpp
std::mutex m;

void bad() 
{
    m.lock();             // acquire the mutex
    f();                  // if f() throws an exception, the mutex is never released
    if (!everything_ok())
        return;           // early return, the mutex is never released
    m.unlock();           // if bad() reaches this statement, the mutex is released
}

void good()
{
    std::lock_guard<std::mutex> lk(m); // RAII class: mutex acquisition is initialization
    f();                               // if f() throws an exception, the mutex is released
    if (!everything_ok())
        return;                        // early return, the mutex is released
}                                      // if good() returns normally, the mutex is released
```