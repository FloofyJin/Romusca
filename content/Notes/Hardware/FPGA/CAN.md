Controller Area Network (CAN)
It is a communication bus designed so multiple electronic devices can communicate over just two wires.

You only need CAN_H and CAN_L

CAN sends a broadcast messages:
```
ID = 0x100
Data = [120, 0, 0, 0]
```
Each node sees the message and decides if it cares about the message with the given ID.

### Arbitration
It can decide which bit is stronger if there are multiple messages at the same time.
### Physical signaling
CAN uses differential signaling. Instead of measuring one wire relative to ground, it measures the difference between CAN_H and CAN_L. This makes the protocol resistant  to electrical noise.
### Why
UART is great for CPU communication to one device
CAN is great for CPU communication to many devices

|Feature|SPI|I²C|CAN|
|---|---|---|---|
|Multiple devices|Yes|Yes|Yes|
|Shared bus|Partially|Yes|Yes|
|Broadcast|No|Limited|Native|
|Multi-master|Rare|Supported|Native|
|Collision handling|No|Basic arbitration|Excellent arbitration|
|Distance|Inches/feet|Inches/feet|Tens/hundreds of meters|
|Noise immunity|Low|Low|High|
|Typical use|On one PCB|On one PCB|Between modules/controllers|
