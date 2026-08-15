## language constructs
`localparam` is a SystemVerilog language construct. It is an actual language object. You can use it to compare values  in conditions for instance.
```verilog
module cpimter;
	localparam MAX_COUNT = 255;
	logic [7:0] count;

	always_ff @(posedge clk) begin
		if(count == MAX_COUNT)
			count <= 0
	end

endmodule
```
`localparam` only exists in the module it was created in.
####  Some language constructs
- localparam
- parameter
- logic
- always_ff
- always_comb
- module
- class
- typedef
- enum
- task
- function
## Macros
#### \`include
 \`include:  includes other source files in the code
```verilog
`include "interface.sv"
```

#### \`define
\`define: defines a macro for pre-procressing
```verilog
`define NUM_MUX_INST   4
```
`define` is a pre-processor macro.
Before the compiler even parses your code, preprocessor replace every occurrences of the macro with its value. It is a text replacement. Compiler doesnt understand it because compiler never sees it.

```verilog
`define WIDTH 8

module adder (
    input  [`WIDTH-1:0] a,
    input  [`WIDTH-1:0] b,
    output [`WIDTH-1:0] sum
);
```
You can also even use arguments
```verilog
`define MAX(a,b) ((a) > (b) ? (a) : (b))

logic [7:0] c;

assign c = `MAX(x, y);
```
`define` is also global.
#### ifdef / \`ifndef
\`ifdef / \`ifndef: tests whether a macro is defined or not
```verilog
`ifdef FEATURE_1
  // some code
`else
  // some other code
`endif
```
