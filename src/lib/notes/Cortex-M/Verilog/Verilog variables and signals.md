Signals represent wires or registers.
Variables represent local storage elements in procedural block such as always block or initial block.

Signals are updated before variables.

### wire
`wire` is a type of net data type that creates a physical connection between two or more logical gates.
You can read wire in a procedural block but you cannot assign to it.
### reg
`reg` is a type of data type used to store and manipulate binary and integer values.
`reg` is a Verilog variable type that can be assigned in a procedural block (`always` or `initial`). It does not imply a hardware register. Whether it synthesizes to combinational logic, a latch, or a flip-flop depends on how it is assigned.
