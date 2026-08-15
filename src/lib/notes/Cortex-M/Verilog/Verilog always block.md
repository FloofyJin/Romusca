eIn verilog, `always` block can model different algorithmic behavior types.

SystemVerilog addresses these behavior types by making intent explicit and enabling tools like simulators, synthesiers, and checkers for certain blocks.
This means you cannot put combinational and sequential assignment in the same always block
#### Why use always block?
Synthesis compiler cannot execute statements by themselves. So we must determine whether block is combination, latch, or flip-flop logic. 

You can give you own sensitivity list or you can leave it blank in which case the synthesizer will figure it out by itself.
If you want to give your own sensitivity list, you can do `always @*`. In SystemVerilog, `always_comb` doesnt require @* because it can figure out what is needed. You only really need to list the sensitivity if you are just using `always`

Variables assigned inside `always_comb` block cannot be driven by any other procedural block.
#### What is blocking/non-blocking assignment?
Blocking assignments execute immediately in procedural block. Blocking is used in combinational logic usually since we want wires to get the new value immediately.

Non-blocking assignments execute at the end of the current time step. But all the lines in the procedural block using non-blocking code gets executed simultaneously. This is needed so that we can change routing without messing up any previous connections.
blocking (=): `always_comb`
non-blocking (<=): `always_ff`, `always_latch`

NOTE: it is recommended to use non-blocking for `always_latch` but some older code uses `=`
NOTE: it is called non-blocking because we schedule changes for all the lines inside the block instead of assigning one at a time like in combination block.

#### What is combinational?
Assigning value changes immediately when its inputs change. Changing a will change y immediately. There is no memory involved.
```verilog
assign y = a & b;
```
Output depends only on current state.
#### What is sequential?
If the block stores memory, it is sequential bc previous value is important.
Its output depends on current input and previous state
## always_comb (combinational)
procedural block is used to indicate the intent to model combinational logic. You also don't have to write the sensitivity list myself bc `always_comb` can figure it out by looking at what signals are used in the block.
## always_latch (sequential)
Procedural block used when the intent is to model a latch based logic. Sensitivity inferred much like `always_comb`.  
It triggers the duration of latch signals with names you can make up like:
- enable
- write_en
- load
- gate
- valid
- capture
- hold_n
- etc

Variables assigned inside `always_latch` block cannot be driven by any other procedural block.

`always_latch` block executes once at time zero to make sure the latch outputs are consistent with the inputs at the very start of simulation.
eg.
```verilog
module data_selector_with_latch (
    input  wire a_in,
    input  wire b_in,
    input  wire sel,
    input  wire enable,
    output reg  data_out
);

    // This is the combinational part of the logic, a 2-to-1 mux
    wire mux_out;
    assign mux_out = sel ? a_in : b_in;

    // This is the sequential part (the latch) that will hold the value
    always_latch begin
        if (enable) begin
            data_out = mux_out;
        end
    end
endmodule
```
## always_ff (sequential)
Procedural block used with the intent to model flip flop logic. It is typically used with clock either posedge or negedge. Unlike latch, it will trigger on clk cycle.
You are required to provide posedge or negedge clk, or reset, or set.

Variables assigned inside `always_ff` block cannot be driven by any other procedural block.

`always_ff` block executes once at time zero to make sure the latch outputs are consistent with the inputs at the very start of simulation.
eg.
```verilog
module sync_counter_3bit (
    input  wire clk,
    input  wire reset_n, // Active-low reset
    output reg  [2:0] count
);

    // This is the sequential always block, triggered on a clock edge
    always_ff @(posedge clk or negedge reset_n) begin
        if (!reset_n) begin
            // Asynchronous reset: sets the count to 0 when reset_n is low
            count <= 3'b000;
        end else begin
            // On the positive edge of the clock, increment the count
            count <= count + 1'b1;
        end
    end
endmodule
```