I wanted to see if it was possible to generate synth waves through digital signal on FPGA. So for this, I used STM32 F410RB from Microchip. This ended up being a huge nightmare because the board doesn't have a built in DAC so I had to use an external analog converter like MCP 4921. Anyhow, that was the least of my worry because the chip also peaked at 50Mhz. This was a huge problem because my cheap oscilloscope wasn't capable of displaying that waveform without breaking.

Analog scopes doesn't use a digital screen, instead it has an electron gun that is physically drawing a line from left to to right. So every iteration will sweep from left to right, leaving a trace of green dot. A digital scope would have no issue displaying a waveform of bandwidth it is rated for. Remember how I said my processor had a clock speed of 48mhz. this means that I could only generate a waveform at that clock speed. Making it slower would interfere with  the ISR (Interrupt Service Routine), bricking the whole program.

### Attenuation
STM32 F410 has an input frequency of 32.768KHz and 16MHz HSI RC. High speed internal clock speed is what the CPU runs on and ultimately what rate limits how fast we can generate our waveform. Each data point is generated through an interrupt clock routine otherwise known as ISR. In a typical system that has a DAC built into the CPU, I would be able to use DMA to stream batches to data through GPIO, however that wasnt option on the specific tool I was working with. In fact, this was a huge problem because I had to flip the chip select on and off on every datapoint through HAL. HAL as it turns out is a blocking code so it interferes with Interrupt. If I were to set the interrupt trigger at a more frequent rate, HAL would break and system would collapse as we lose track of my mem stack.

I ultimately settled on clock period of 6399.
Doing the math, this means 
f_out = f_clk/((prescaler + 1)(period+1) = 160000000/6400 = 2500Hz. 

Essentially increasing the clock speed isnt an option at this point because doing so would make HAL blocking. 2500Hz was what I settled on that worked without much issue.

My Analog scope struggled to put the data points on the screen. Increasing the time/div made the waveform too stretched out (imagine holding a string between your two hands and spinning it around). Decreasing the time/div meant the screen updates at an interval that makes the graph bleep in and out of existence.