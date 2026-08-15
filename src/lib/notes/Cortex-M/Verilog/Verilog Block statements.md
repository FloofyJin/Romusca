Groups set of statements together that are syntactically equivalent to a single statement.

There are two kinds of block statements: sequential `begin-end` and parallel `fork-join`.

### begin
Statements wrapped using `begin` and `end` keywords will be executed sequentially in the given order. 

Can only be used in procedural block. So if used in `always_latch` or `always_ff`, we will read the statements sequentially but all the changes will happen at the end of the block. Essentially all the changes are scheduled until the end statement because we use non-blocking "<=" symbol for assignment. 
It is kind of weird to think about, but it is non-blocking because we are reading all the lines without waiting so it called non-blocking.

```verilog
begin
	statement1; //execute first
	statement2; //execute second
end
```