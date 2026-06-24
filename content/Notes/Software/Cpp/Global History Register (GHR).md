It is not a general CPU Register, but internal prediction hardware. It improves prediction of guessing branch (like an "if" statement)

Many programs have patterns like
```
Branch A → Branch B → Branch C → repeat behavior
```
so GHR saves that pattern into memory

Most CPUs use structure like:
1. Branch Address (PC)
2. Global History Register (GHR)
	1. captures recent execution behavior. It captures outcome across whole program
3. Pattern History Table (PHT)
	1. table of 2 bit counter

The Global History Register is a hardware register used in branch prediction to store the outcomes of recent branches, such as taken or not taken. The processor uses these patterns to predict future branch behavior so it can keep the pipeline full and avoid costly pipeline flushes or stalls. While it can indirectly improve cache and memory efficiency, its primary purpose is improving control-flow prediction and execution throughput.