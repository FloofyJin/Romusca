shift register used to convert serial data into parallel data

Idea is that you serial in data one bit at a time.
Then after some clock cycle, you can read multiple bits at once

Image a 4 bit SIPO register, it can store 4 bits at a time before it needs to be read.
streaming data: 1 -> 0 -> 1 -> 1
cycle 1: 1 0 0 0
cycle 2: 0 1 0 0
cycle 3: 1 0 1 0
cycle 4: 1 1 0 1
parallel read: 1 1 0 1