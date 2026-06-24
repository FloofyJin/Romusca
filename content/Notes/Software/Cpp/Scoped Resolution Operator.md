This symbol: (`::`)
It is a visual roadmap for the compiler tells it where exactly to look for specific variable, function, class, or namespace. It is used to tell the compiler that a function belongs to a specific class even though its used outside of the class's curly braces.

### You can also use scoped resolution to access static variables
```cpp
class Microcontroller {
public:
    static int systemClockMHz; // Shared across all instances
};

// Initialize the static variable using scope resolution
int Microcontroller::systemClockMHz = 180; 

int main() {
    // You don't need to instantiate a Microcontroller object to read this:
    int speed = Microcontroller::systemClockMHz; 
}
```

### You can force global scoped variable
```cpp
int counter = 100; // Global variable

int main() {
    int counter = 5; // Local variable hides the global one
    
    int localVal = counter;   // Equals 5
    int globalVal = ::counter; // Equals 100 (forces global scope)
}
```