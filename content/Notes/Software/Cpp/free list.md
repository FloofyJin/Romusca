Data structure used in a scheme for a dynamic memory allocation. It works by connecting unallocated region of memory in a linked list. It is used to keep track of blocks of memory that have been allocated from the operating system but are currently unused (free).

How it works: When you request memory using malloc or new, system allocates memory. But going the operating system to allocate this chunk of memory is slow, so allocator requests a large chunk of memory up front from the OS, breaks it down, and uses a free list to keep track of which sub block are available

Fun fact: OCaml runtime uses free list to satisfy allocation request