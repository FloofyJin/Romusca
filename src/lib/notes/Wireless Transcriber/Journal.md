### Entry #1
Initial goal was to use stm32 for the display with Zybo supplying input. However, this feels less and less like a good plan as I dived deeper into its capability. STM32 with its stlink provides direct access to computer out of the box while ZYNQ doesn't have the same support. Xilinx also has a higher bandwidth since its clock runs faster. I've already tested its ability to draw using MCP4921 so I know it wont be a significant change for me to change the drawing module. 

Original plan:
Zybo Z7 -> ~~~ CC1101 air communication ~~~ -> STM32 F410RB -> DAC -> oscilloscope
Flaws with plan: 
- Zybo Z7 runs at 125Mhz while stm32 runs CPU at 100Mhz
- I cant utilize FPGA fabric
- Cortex M4 is limited by breaking Interrupt service routine when writing. I can utilize DMA but I can't rely on it.
- Need to find a workaround to connect zybo z7 with puter

New plan:
Computer -> (stlink) -> stm32 F410RB -> ~~~ (CC1101 air communication) ~~~ -> Zybo Z7 -> oscilloscope

With this, I can fully utilize the FPGA fabric. And on the stm32 side, I can upload video or image by rasterizing the image into wireframe or vector first. Zybo will maintain a copy of whatever it received in an array. It will continue to draw on the scope as fast as it can regardless of what it receives. This in itself has self healing capability since any corrupt bytes will be replaced in the next cycle when it received the correct data.

---
## Index
- [[Accessing the antenna module]]
- [[CC1101]]
- [[Debugging signals through ILA]]
- [[Transmission speed]]