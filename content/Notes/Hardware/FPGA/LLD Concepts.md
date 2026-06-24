Load-Linked or Load-Locked

LLD is part of an atomic memory operation mechanism usually paired with Store Conditional. What this mean is you want to load this value and let no one else modify it.

It is implemented in the CPU. It is used when CPU executes a specific LL/LR instruction. Normal load/store instructions do not use LLD.
#### LL
Load-Linked parser start at the start symbol and try to arrive at that target string. Left-to-right leftmost derivation. This is done by beginning at the start symbol and repeatedly expanding out the leftmost nonterminal until arriving at the target string.
* It will predict and match.
* MIPS, older docs

#### LR
Load-Reserved parser begin at the target string and try to arrive back at the start symbol. Left-to right rightmost derivation. This means it scan from left to right and attempt to construct a rightmost derivation.
* It will shift and reduce.
* RISC-V terminology
Using LR, a core can cache the line. If another core tries to write to it, cancel its reservation. so this means it doesn't lock memory. And it cant do anything to that cache line
```
retry:
    lr.w   t0, (x)      # Load-Reserved
    addi   t1, t0, 1
    sc.w   t2, t1, (x)  # Store-Conditional
    bnez   t2, retry   # retry if failed
```
In this example, core reserves memory line and writes to it. And then in (sc) store conditional, we check if reservation is valid. if not, then it will retry. 
Note: x is the address. 
Note: In load/store context, (x) means to use that address to access memory. Otherwise, (x) just means value stored at the address x

#### What is `sc.w`?
`sc.w rd, rs2, (rs1)`
Store rs2 to memory at address rs1 only if prior lr.w  reservation is still valid.

#### How does Load-Locked work?
1. LLD loads memory address and marks the cache line as marked
2. Some compute happens
3. SC attempts to store. It will succeed if no other core modified that line. will fail otherwise.

### Cache interface
Cache interface for LLD is how cache cooperates with the CPU to support Load-Linked and Load-Reserved operations.

### Eviction Policy
Cache concept unrelated to LLD btw. When cache set is full and a new cache line must be loaded, we use eviction policy to determine what to kick out. Common ones are LRU (Leads Recently Used) and Pseudo-LRU (PLRU) and FIFO (First in, First out)

### Q&A
Q: In a multi-core CPU with coherent caches, how does the cache subsystem interact with Locked-List/Store Conditional (LLD/SC) instructions to guarantee atomicity without locking cache lines?
A: In LLD/LL, the core tracks a reservation using the cache line tag, while the cache itself is unaware of any reservation. The LLD is treated as a normal load by the cache. When another core attempts to write to the same cache line, the coherence protocol (MESI/MOESI) issues invalidations or ownership transfers. When the reserved cache line is invalidated or evicted, the core clears its reservation. As a result, a subsequent store-conditional fails. The cache does not track reservations to keep the design simple and scalable, reusing existing coherence mechanisms.