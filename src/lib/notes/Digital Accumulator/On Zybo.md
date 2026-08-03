Zybo runs on both FPGA and PL fabric. For most of our applications, we will only need to utilize PL since we dont want to rely on interrupts or other AXI implementations. RTL through PL should be suitable for programming oscillation logic.
## graph tables
The most typical way to display waveform is to get predefined shape in Matlab or python then import it to verilog project as a .mem file.
## DAC
In DAC module, need to trigger it through FPGA clock which will run at a constant speed of 125MHz.

Our DAC should be able to bring sclk and cs up and down. This means our effective data transfer speed is  125MHz / 2. So at best, we can transfer data at a rate of 60.25MHz.
But we want to target ~20MHz since that is the clock speed our MCP4921 takes so we create a custom tick that triggers every 3 clock cycle.
All in all, what happens if that in every 3 clock cycle, i will update DAC. DAC  needs to go and down so realistically a full data transfer happens every 6 clock cycle.

Since SPI is a serial communication protocol, we send one bit at a time. So essentially, we will receive data and save it in internal register and transmit one bit at a time. Once we used up all the bits, we receive and replace the internal register.

FOR MCP4921, it  wants to receive serial data that when concatenated would be in 16 bit increments. 
{4 special bits, 12 data bits}

Ohh what are the 4 special bits?
A/B channel
Buffer
Gain
Shutdown

### Clean up noise
I used the average of finite impulse response to reduce noise. The way that FIR works is by keeping a history of N different time points, multiplying by some coefficient, and adding them back up. Since we are finding the impulse response of an input, it means we would get an equation like this `(n-2) * 1/3 + (n-1) * 1/3 + (n) * 1/3` for finding the average. It's incredibly helpful for reducing noise in a system like this.
![[res/Pasted image 20260721211915.png]]