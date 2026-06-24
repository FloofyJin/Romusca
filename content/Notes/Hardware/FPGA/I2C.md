Otherwise called I "squared" C for you normies out there. 2 lines. Its much simpler than [[SPI]].

SDA - data line
CLK - Clock for transmitting data. SDA only rises while CLK is low.

Data is typically transferred 8 bit at a time (altho I've been told some systems use 10). This is how data transfer is made:
Master sends 8 bit information to all the slaves in the network. This 8 bit data is structured such that the first 7 bit refers to the unique address of the slave. Since there's 7 bits, there can be up to 2^7 -1 slaves in the network. Each slave gets a unique address. the last bit determines whether its a read or write. 0 refers to a write. 1 refers to a read.

The slave that the address belongs to will response with an ACK. Then the master will send 8 address of the memory on that slave it wants to read/write from. The slave will then response with ACK again. Then if its a write operation, the master will send data to slave. If its a read operation, the master will repeat the device address sequence after the sending the register address, this will notify the slave that it wants to read and respond  back with data.

Read/write sequence ends when clk goes up and SDA goes high soon after.

![[Pasted image 20250918010337.png]]
![[Pasted image 20250918010354.png]]

Reference:
* https://www.ti.com/lit/pdf/slva704

Other communication protocols:
* [[SPI]]
* [[SCP]]