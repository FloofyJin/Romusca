*Heap is faster than stack*
### Stack
Stack memory is for local variables inside functions. Memory is automatically allocated and deallocated
### Heap
Dynamic memory allocation. Most heap implementation use [[free list]] or similar data structure to keep track of free memory blocks.

When you `malloc(size)` or `new`, allocator searches the freelist for a suitable block
When you `free(ptr)` or `delete`, block is added back to freelist

cpp inherits from C, so it has `malloc` and `free()`, but it usually not preferred since they arent typesafe

local variables go in the stack