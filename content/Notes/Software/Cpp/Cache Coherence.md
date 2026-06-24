Cache Coherence is all about keeping multiple copies of the same memory location consistent in a multiprocessor or multicore system.

In modern CPU, multiple cores access the same memory address despite having their own caches. If one writes to a cache block, it may realize that it holds a stale value.

Typically each core has its own L1 and L2 cache but L3 is likely shared.

#### Protocols
To fix this, there are rules for how caches should interact.

MESI states
* M (Modified) - Cache has only valid copy, and it has been modified.
* E (Exclusive) - Cache has the only valid copy, but it matches main memory.
* S (Shared) - Cache has a valid copy, but others may also have it.
* I (Invalid) - Cache copy is invalid.

Core 1 reads `x`: Core1:E, Core2:I
Core 1 writes to `x`: Core1:M, Core2:I
Core 2 reads `x`: Core1:S, Core2:S
Core 2 writes to `x`: Core1:I, Core2:M

Core state changes to `M` when it writes. When it does, other cores that has that cache addr will be set to `I`.

Multiple cores reading the same shared memory will set themselves to `S`

Core that has just read a mem will set to `E` if it is the only core that read that memory. otherwise, it would be `S`

#### How do cores know if addr is outdated?
For smaller systems, all the cores share a bus where they can broadcast their actions. And every core snoops (listens) to requests

For bigger systems with many cores and sockets, broadcasting expensive and they have a directory system.

Coherence ensures all cores see a consistent value for a single memory location
Consistency model defines when write becomes visible to other cores.