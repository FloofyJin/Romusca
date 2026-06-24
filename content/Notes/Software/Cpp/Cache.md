#### Cache miss
You have a cache miss at L1, you move to L2. If you have a cache miss at L2, you move to L3. If you have cache miss, you move to main memory DDR RAM.
### Cache misses
3 types of cache miss: Compulsory miss, capacity miss, conflict miss
* Compulsory miss - first time a block is accessed. Must load it into cache
* Capacity miss - Cache is too small to hold all working data. Some data gets evicted before its reused
* Conflict miss - Happens in set-associative or direct-mapped caches. Two or more blocks map to the same set causing one to be evicted even though other parts of the cache have free space.

Remember, only tag bit is stored in cache. And sometimes 1 (valid) + 1 (dirty) bit too.
Tag bits ARE stored in the cache in a separate tag SRAM array parallel to the data array.
#### Cache mapping types
When CPU accesses memory, it uses the address to decide where in the cache to look. 
There are 3 main mapping types:
##### Direct-mapped - Each memory block maps to exactly one cache line. 
1 set = 1 cache line
very fast
**Address breakdown**: `[Tag | Index | Offset]`
Tag bits are only used for metadata
##### Fully associative - Any memory block can go in any cache line
cache lines belong to a single set. Block can be in any cache line.
No conflict miss.
**Address breakdown**: `[Tag | Offset]`
When looking up in cache, you have to check the tag of every line parallel.
Requires *content-addressable memory (CAM)* structure on top of SRAM

##### Set associative - memory blocks map to a specific set of cache lines
otherwise called 4 way set associativity
Cache is split into sets and **each set contains 4 cache lines**. A memory block can go into any of the 4 lines in its assigned set.
**Address breakdown**: `[Tag | Index (Set) | Offset]`
This is what most modern CPU caches use.
Fewer conflict misses and speed

Example
Cache size = 8KB
Cache line size = 64 bytes
4-way set associativity

Number of cache lines = 8KB/64bytes = 128 lines
Number of sets = 128 / (4 lines/set) = 32 set