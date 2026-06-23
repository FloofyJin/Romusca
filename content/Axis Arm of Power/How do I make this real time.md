I have written about how its all connected in [[Design]].

All data passed through shared memory will be read as an object of type `shared_data_t`. The object contains checksum and and sequence counter. This ensures we aren't reading stale data and no corruption has occurred.
```c
# shared_data.h
typedef struct {
    uint32_t magic;          // always SHARED_MAGIC, written once at init
    uint32_t seq;            // incremented every write by CPU0
    uint32_t servo_target[6];
    uint32_t checksum;       // seq ^ servo_target[0] ^ 0xCAFEBABE
} shared_data_t;
```

Ensure TLB rule is set up such that program doesnt cache any of its data reads from L1 and L2 cache. Typically you will need to do `Xil_DCacheInvalidate()` to invalidate L1 cache but TLB rule handles all of that and more.

The servo MG996 accepts pwm signals from  0.5ms  to 2.5ms for its angle. It looks something like this:
0.5ms   = 0 degrees
1.25ms = 90 degrees
2.5ms   = 180 degrees
However, my program doesnt take time as input; instead, it uses ticks. My Processing System runs at 50MHz clock so there are 25,000 ticks for every 0.5ms interval. With this information, I can derive this equation:
```
(uint32_t)(25000.0f + (angle / 180.0f) * 100000.0f)
```
Using xil_io, I can write directly AXI. Base address for the servo controller for me was `0x43C00000`. Each input is offset by 4.
With all this, we can read from shared memory, set Translation Lookaside Buffer, and control the servo.