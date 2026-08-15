You can set a delay in simulation with keyword `#5` to denote 5ns of delay.

Example of transition is 5ns
```verilog
buf #(5) b1(out, in);
```

Example of different rise and fall delay
```verilog
buf #(3, 7) b1(out, in);
```

Example of rise, fall, and turn-off delay
```verilog
bufif1 #(3, 7, 2) b1(out, in, en);
```
### specify and endspecify
This is used to create a block of delay between signals.
### inter statement delay
Time difference between two statements from completion of one statement and the start of another statement.
### intra statement delay
Time within a single statement. Time difference between the start of a statement and the execution of a specific operation within that statement.
### Delta simulation delay
It is a delay in simulation that models an execution that has no delay.
### transport delay
Time taken to propagate through a real circuit
### inertial delay
This delay is used to simulate a delay with fluctuations and noises that are usually prevalent in real life.
