transmitting digital data by changing the phase of radio wave

Assume we have a sine wave as carrier wave. Instead of changing the amplitude or frequency, PSK changes where the wave is in its cycle.

Carrier = high frequency sine wave used to transport information
### How does it work
Suppose carrier is 1MHz, meaning we have 1,000,000 cycles per second
data rate is 1kbps, meaning we have 1,000 bits per second
(one bit lasts 1000 carrier cycles. This means we can send 1000 bits per second)

If we want to send 0 0 1, we get:
```
Bit 0   Bit 0   Bit 1

/¯\_/¯\_/¯\_/¯\_\_/¯\_\_/¯\_\_/¯\
```
Every bit will be encoded from 1000 sets of carrier cycles.

Notice in the middle, we abruptly changed the phase by 180 degrees. this means bit is 1. Bit differential encoder will notice the change in phase and mark that as 1. This means the phase was shift.
Encoder will read  0 in the next 1000 carrier cycle if the waveform remained inverted.
If the waveform inverts again to become normal, then it will read a 1.

Example:
```
[ /¯\_/¯\_/¯\_/¯\_ ]  
[ /¯\_/¯\_/¯\_/¯\_ ]  
[ \_/¯\_\_/¯\_\_/¯ ]  
[ \_/¯\_\_/¯\_\_/¯ ]
```

|Symbol|Phase|Change?|Decoded bit|
|---|---|---|---|
|1|Normal|N/A|(start)|
|2|Normal|No|0|
|3|Inverted|Yes|1|
|4|Inverted|No|0|
### BPSK (Binary PSK)
Simplest version of BPSK:
Bit 0 = phase 0°
Bit 1 = Phase 180°
```
0:  /¯\__/¯\__/¯\__
1:  \__/¯\__/¯\__/¯
```
Receiver compares the incoming signal's phase against a reference and determines whether it represents a 0 or 1
### QPSK (Quadrature PSK)
Bit 00 = phase 45°
Bit 01 = phase 135°
Bit 11 = phase 225°
Bit 10 = phase 315°
Similar to BPSK but can double the data rate without increasing bandwidth

### There's more
| Modulation | Bits/Symbol |
| ---------- | ----------- |
| BPSK       | 1           |
| QPSK       | 2           |
| 8PSK       | 3           |
| 16APSK     | 4           |
| 32APSK     | 5           |
