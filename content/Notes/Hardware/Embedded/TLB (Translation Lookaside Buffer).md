Normal memory: It's like having a personal desk (L1 cache) and shared office shelf (L2 cache). CPU grabs data from memory. It can prefetch speculative if it thinks it will grab it soon. If it needs to grab A, B, and C, it can also grab them in whatever order is fastest.

Device memory: Its like a live security camera feed. There's no caching. Every time CPU fetches, it looks at the most current state. It can glance at the data in whichever order is convenient. This is efficient for cases where you need to read peripheral registers. This is because reading a status register might clear an interrupt flag, so the CPU must never serve a cached copy.

Strongly ordered: It's like a bank teller window. Every execution must fully complete before next one starts. No caching. No reordering. No speculation. CPU can stall until DDR confirms operation.

### TLR setting in Zybo Z7
```c
#define STRONGLY_ORDERED 0x0C02 // strongly ordered
#define DEVICE_MEMORY 0x0C06 // device memory (also uncached)
#define NORM_NONCACHE 0x11DE2 // normal non-cacheable
```
### SCTLR
**SCTLR** stands for **System Control Register**. It's a special register inside the Cortex-A9 core that controls global CPU features with individual on/off bits

Bit 0  (M) — MMU on/off
Bit 2  (C) — L1 Data cache on/off
Bit 11 (Z) — Branch prediction on/off
Bit 12 (I) — L1 Instruction cache on/off

When doing `Xil_DCacheEnable()`, it set bit 2 to 1. We can confirm by this:
```c
uint32_t sctlr;
__asm__ volatile("mrc p15, 0, %0, c1, c0, 0" : "=r"(sctlr));
xil_printf("Dcache=%s\r\n", (sctlr & (1<<2)) ? "ON" : "OFF");
```
### What is ordering?
Ordering means: does the CPU execute memory reads and writes in the exact sequence your code specifies, or does it rearrange them for speed?

Say your code does:
```c
shared->command = MOVE;      // write A
shared->angle = 90;          // write B
shared->ready = 1;           // write C
```

You'd expect DDR to see A, then B, then C in that order. But with **normal memory**, the CPU and memory subsystem are free to rearrange these. DDR might actually receive them as B, C, A because maybe B's cache line was already in the write buffer, C happened to hit an open DDR bank, and A had to wait for a bus arbitration cycle.