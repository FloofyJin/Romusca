Processing System (PS) is the ARM processor subsystem inside Zynq chip. It contains hardware like CPU, DDR controller, UART, SPI, I2C, Ethernet, PLL, Timers, Interrupt, etc. They are physical circuits built into the silicon.

How does it generate clock?
It uses crystal oscillator running at 33.3Mhz to create PS PLL which can be any clock speed like 100MHz or 10MHz.

Register Transfer Level (PL) is a custom hardware that I can program using Verilog unlike PS which is engraved into the silicon.

How does it generate clock?
For instance, i can have an `always_ff @(posedge clk)` block that counts up on  clock cycle. But it need clk. The clk can come directly from board's oscillator, PS PLL,  or MMCM/PL Clocking Wizard. For Zybo-z7, board has a separate 125MHz oscillator connected to PL that can be enabled via .xdc  file. Once enabled, you can use it for RTL purposes.
```
set_property -dict { PACKAGE_PIN K17   IOSTANDARD LVCMOS33 } [get_ports { sysclk }]; #IO_L12P_T1_MRCC_35 Sch=sysclk
create_clock -add -name sys_clk_pin -period 8.00 -waveform {0 4} [get_ports { sysclk }];
```