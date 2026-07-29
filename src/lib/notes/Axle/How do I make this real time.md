I am currently facing a huge issue.
I am writing servo data to shared memory which has to be picked up by bare metal program running some servo loop to wipe cache and read. This is quite inefficient because reading does not happen synchronously or at a regular interval.

I have this code to write to shared memory every one second.
```c
    for(int i = 0; i < 20; i++)
{
    shared->servo_target[0] = i;
    printf("write %d\n", i);
    sleep(1);
}
```
output:
```
JinnysusPetalinux:~$ sudo ./servoTest
Opening /dev/mem...
Mapping physical address 0x1E000000...
Moving servo
write 0
New angle: 0
write 1
write 2
write 3
write 4
write 5
write 6
write 7
write 8
write 9
write 10
write 11
New angle: 11
write 12
write 13
write 14
write 15
New angle: 15
write 16
write 17
write 18
write 19
New angle: 19
```
This is unacceptable. All the new angles print statements are what the servo program reads. Despite reading at 100ms, it is still only picking up 4 of the 20 writes.

### TLB
As it turns out, data is not immediately flushed down to the DDR level by core0 and stale data is read by core1. This resulted in stale data to be read by the bare metal application until eventual consistency is established.

Easy solution on the petalinux side was to utilize a `memsync()` to ensure whatever the program sees matches what exists in the DDR memory.

Bare metal application posed a bit more trouble as no matter what I did from disabling or enabling Data line cache to L2 cache seemed to do the job. As I later find out. Flushing only makes sense when you are writing to memory, but for reading, you have to set up a caching rule via TLB (Translation Lookaside Buffer) to Device memory,  strongly ordered, or normal. All 3 of those works fine as they set the rule such that no caching is done, order is not a big issue for me since all 3 servos work independently. Doing this ensures that all reads from the memory doesn't come from L1 or L2, but straight from the source of truth: DDR.