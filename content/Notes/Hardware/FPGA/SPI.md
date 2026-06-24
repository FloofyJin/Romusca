Serial Port Interface is a protocol for communicating between multiple devices. This network has slave and master. In this situation, there can theoretically be infinite number of slaves since MISO line connects to MOSI line of subsequent slave in the network.

MOSI - Master Out Slave In
MISO - Master In Slave Out
CS - Chip Select
CLK - clock

#### Chip Select or Slave Select
chip select is how we identify devices in a multiple device network. Most Chip select pins are active low.
In Daisy chain, all peripherals share the same CS line. Active low CS means data is actively transmitting.
#### Clock Phase
Clocks naturally idle at either a high or a low. In SPI protocol, we keep track of this by noting the clock phase. All the devices on the network agree on this phase before any communication can happen. 
Clock phase = 0 means it starts at 0
Clock phase = 1 means it starts at 1

#### Clock polarity
We know Clock can idle at either 0 or 1. This means we need a way to agree on whether to read on rising leading or trailing edge. Note how I didn't say rising/falling edge. That is not relevant here since we only care about when we are reading data depending on the clock phase we just talked about.
Clock polarity = 0 means leading edge
Clock polarity = 1 means trailing edge

Clock phase = 0 and Clock polarity = 0, we are reading on rising edge
Clock phase = 0 and Clock polarity = 1, we are reading on falling edge
Clock phase = 1 and Clock polarity = 0, we are reading on falling edge
Clock phase = 1 and Clock polarity = 1, we are reading on rising edge

Other communication protocols:
* [[I2C]]
* [[SCP]]