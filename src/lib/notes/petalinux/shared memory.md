example path: /home/spencer/Downloads/petalinux-tool/JinnysusPetalinux/project-spec/meta-user/recipes-bsp/device-tree/files/system-conf.dtsi
```
/include/ "system-conf.dtsi"
/ {
        chosen {
                bootargs = "console=ttyPS0,115200 earlycon root=/dev/mmcblk0p2 rw rootwait maxcpus=1";
        };

	reserved-memory {
                #address-cells = <1>;
                #size-cells = <1>;
                ranges;

                shared_mem: buffer@1ff00000 {
                        no-map;
                        reg = <0x1ff00000 0x100000>;
                };

                rtos_mem: rtos@1e000000 {
                        no-map;
                        reg = <0x1e000000 0x1f00000>;
                };
        };
};
```
You want to reserve memory in the petalinux so it can be used for shared memory access or whatever you want.
`petalinux-build` and verify with `dmesg | grep reserved`

You can read and write to memory too in petalinux
eg.
```c
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>

#define SHARED_ADDR 0x1E00000UL
#define MAP_SIZE    0x10000   // 4 KB page

int main()
{
    printf("Opening /dev/mem...\n");

    int fd = open("/dev/mem", O_RDWR | O_SYNC);
    if (fd < 0) {
        fprintf(stderr, "Failed to open /dev/mem: %s\n", strerror(errno));
        return 1;
    }

    printf("Mapping physical address 0x%08lX...\n", (unsigned long)SHARED_ADDR);
    void *map_base = mmap(
        NULL,
        MAP_SIZE,
        PROT_READ | PROT_WRITE,
        MAP_SHARED,
        fd,
        SHARED_ADDR
    );

    if (map_base == MAP_FAILED) {
        fprintf(stderr, "mmap failed: %s\n", strerror(errno));
        close(fd);
        return 1;
    }

    printf("Mapping successful at virtual address %p\n", map_base);
    volatile uint32_t *shared = (volatile uint32_t *)map_base;
    printf("Previous test value...\n");
    printf("%08X\n", shared[0]);

    printf("Writing test value...\n");
    shared[0] = 123456789;

    printf("Reading back value...\n");

    uint32_t value = shared[0];
    printf("Value read from shared memory: %u (0x%X)\n", value, value);

    if (value == 123456789) {
        printf("SUCCESS: shared memory write/read works\n");
    } else {
        printf("WARNING: value mismatch (possible cache/MMU issue)\n");
    }

    printf("Cleaning up...\n");

    if (munmap(map_base, MAP_SIZE) != 0) {
        fprintf(stderr, "munmap failed: %s\n", strerror(errno));
    }
    close(fd);
    return 0;
}
```
## Cache coherency
Because we are writing in CPU0 and reading in CPU1, we are bound to run into memory coherency issues. This occurs when we write from one core but the data doesnt get flushed down to DDR level where it can be picked up by another core. We can imagine Core0 has its own L1 and L2, Core1 has its own L1 and L2. They share the same DDR memory. 

```
CPU0 core
   │
   ▼
L1 DCache (32KB, private to CPU1, fastest ~1 cycle)
   │
   ▼
SCU (Snoop Control Unit - mediates between CPUs)
   │
   ▼
L2 Cache / PL310 (512KB, shared between CPU0 and CPU1, ~10 cycles)
   │
   ▼
DDR memory (slowest, ~100+ cycles)
```

Usually all data is pushed to DDR in Core1 when writing but sometimes you might need to do
```c
#define SHARED_ADDR 0x1FF00000UL
#define MAP_SIZE        0x100000
msync(map_base, MAP_SIZE, MS_SYNC);
```
`MS_SYNC` blocks proceeding execution until the flush is complete before returning.

Reading is where I had the most issue bc Core1 has to fetch all the way from DDR instead of L1 or L2 which might be stale. The easiest way  to do is this set TLB attribute to Device memory or Strongly ordered so it wont cache any data.

Setting TLB attribute:
```c
#define SHARED_MEM_BASE 0x1FF00000

#define STRONGLY_ORDERED 0x0C02 // strongly ordered
#define DEVICE_MEMORY 0x0C06 // device memory (also uncached)
#define NORM_NONCACHE 0x11DE2 // normal non-cacheable

Xil_SetTlbAttributes(SHARED_MEM_BASE, DEVICE_MEMORY);
```

Below are likely unneeded if you set TLB attribute but still adding it here for reference:
Invalidate Data Cache (L1)
```c
Xil_DCacheInvalidateRange(SHARED_MEM_BASE, SHAREABLE_DEVICE);
```

Invalidate L2 Cache
```c
/* PL310 L2 cache controller registers */
#define L2CC_BASE            0xF8F02000
#define L2CC_INVLD_PA_OFF    0x0770
#define L2CC_CACHE_SYNC_OFF  0x0730

static void L2CacheInvalidateShared(u32 adr, u32 len)
{
    const u32 cacheline = 32U;
    u32 end = adr + len;
    adr &= ~(cacheline - 1U);

    while (adr < end) {
        Xil_Out32(L2CC_BASE + L2CC_INVLD_PA_OFF, adr);
        Xil_Out32(L2CC_BASE + L2CC_CACHE_SYNC_OFF, 0);
        adr += cacheline;
    }
    __asm__ volatile("dsb" ::: "memory");
}

L2CacheInvalidateShared(SHARED_MEM_BASE, SHAREABLE_DEVICE);
```