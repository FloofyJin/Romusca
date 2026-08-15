Tasks and functions are both subroutines but there are a few differences.

For instance, tasks can contain statements that consume simulation time like delays but function cannot.

## Task
General and can calculate multiple result values and return them using output and input type argument. In other words, it allows us to group procedural code into one reusable block. It doesnt have a returning value tho.

task:
```verilog
task send_data;
    input [7:0] value;

    begin
        data = value;
        valid = 1;
        @(posedge clk);
        valid = 0;
    end
endtask

initial begin
    send_data(8'h12);
    send_data(8'h34);
    send_data(8'hAB);
end
```

Tasks can consume simulation time while functions cannot.

It can also have inputs and outputs.
```verilog
task add;
	input [7:0] a;
	input [7:0] b;
	output [7:0] sum;
	
	begin
		sum = a + b;
	end
endtask
```

### Why task?
Supposed i have a bunch of repeated code, i can use task to modularize it into a function that i can repeatedly call over and over again.
## Functions
A function must execute in zero simulation time. It is used to compute and return a value.

A function is best used for cases where you have to repeatedly perform computation.

eg1.
```verilog
assign parity1 = a[7] ^ a[6] ^ a[5] ^ a[4] ^
                 a[3] ^ a[2] ^ a[1] ^ a[0];

assign parity2 = b[7] ^ b[6] ^ b[5] ^ b[4] ^
                 b[3] ^ b[2] ^ b[1] ^ b[0];
```
Can be simplified to
```verilog
function logic parity8(input logic [7:0] data);
    parity8 = ^data;   // reduction XOR
endfunction

assign parity1 = parity8(a);
assign parity2 = parity8(b);
```