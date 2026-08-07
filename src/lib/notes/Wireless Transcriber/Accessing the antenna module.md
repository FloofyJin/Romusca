Definition: command to trigger some action. It can be like turning on tv or increasing volume.

In the context of the chip I'm using, you can "strobe" reset to reset the chip. You can strobe to flush the register on the chip. Table 42 on page 67 provides more information.

Possible strobe commands: SRES, SFSTXON, SXOFF, SCAL, SRX, STX, SIDLE, SWOR, SPWD, SFRX, SFTX, SWORRST, and SNOP.
### 3 SPI Access Types
**Register  write**: you first send address, then data.
Eg. Writing to register:
address = 0x02
data = 0x06

Eg. writing to FIFO
address = 0x7F
length = 0x2     (meaning 2 * 8 bits)
data = 0x06

**Register read**: You send address, then wait for all 8 bits to receive.
Eg. reading from register.
You must get an address that has R/W=1 and burst bit 0 or 1 depending on whether its between 0x30 and 0x3D.
So, if reading  from address, address = 0x02, you will actually send 0x82 the chip.

Eg. Reading from FIFO
FIFO read always happens by sending 0xFF. Then the next 8bits will be data.

**Command strobe**: Send command to do have the chip do a certain action.
0x35 means start transmitting

### Command table
Here's a helpful table for what your sending 8bits should look like if you are talking to CC1101

|                      | R/W | Burst | Addr      | Note                                                                               |
| -------------------- | --- | ----- | --------- | ---------------------------------------------------------------------------------- |
| Config write         | 0   | 0     | 0x00-0x2E | (BURST=0 means register access)(BURST=1 means read/write block, auto incrementing) |
| Config read          | 1   | 0     | 0x00-0x2E | (BURST=0 means register access)(BURST=1 means read/write block, auto incrementing) |
| Command strobe       | 0   | 0     | 0x30-0x3D | (BURST=0 meaning strobe)(BURST=1 means status register AKA read)                   |
| Status register read | 1   | 1     | 0x30-0x3D | (BURST=0 meaning strobe)(BURST=1 means status register AKA read)                   |
| TX FIFO write        | 0   | 0/1   | 0x3F      | (BURST=0 means single byte)(BURST=1 means multi byte)                              |
| RX FIFO read         | 1   | 0/1   | 0x3F      | (BURST=0 means single byte)(BURST=1 means multi byte)                              |
Note: very command is 8bits, so you need to OR the R/W, Burst, and Addr to know what you should send.

NOTE: When sending a command/address bytes to the chip, SPI will lower the CS line. When this happens, there is a period of time (8cycles for 8 bits) where MISO line is free. Chip will send status bytes during this period.
This status register is used for debugging purposes:

| bit 7    | CHIP_RDYn            | 0 = crystal running, chip ready                       |
| -------- | -------------------- | ----------------------------------------------------- |
| but 6:4  | STATE[2:0]           | main state machine                                    |
| bits 3:0 | FIFO_BYTES_AVAILABLE | RX: bytes waiting \| TX: bytes free (saturates at 15) |
FIFO STATE:

| State | meaning          |
| ----- | ---------------- |
| 000   | IDLE             |
| 001   | RX               |
| 010   | TX               |
| 011   | FSTXON           |
| 100   | CALIBRATE        |
| 101   | SETTLING         |
| 110   | RXFIFO_OVERFLOW  |
| 111   | TXFIFO_UNDERFLOW |
