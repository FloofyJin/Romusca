### wire
Continuous assignments require wire.

Rule:
1. `assign` can only drive a `wire`.
2. You can only use `wire` to drive a `reg` or `logic` inside procedural block but it cannot be assigned in the block.
### reg
Despite its name, it does not mean a hardware register. It just means this signal is assigned from procedural block

Procedural assignments require `reg`.
Flip-flops also use `reg`.

### logic (only in SystemVerilog)
Can be used for almost all cases of `reg`. It can be used for all procedural blocks like combinational, latch, flip-flop.
It can be driven procedurally or by single continuous driver. You can use it for almost everything.

Use `wire` when you need a net with multiple drivers or are connecting outputs that require net schematics.

## All data types
Only Verilog: reg, wire, integer, real, time, realtime
Also in System Verilog: logic, bit, byte, shortint, int, logint, shortreal
