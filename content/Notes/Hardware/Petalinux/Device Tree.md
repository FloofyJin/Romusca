### system-user.dtsi
Device tree is a map passed to the Linux kernel during boot. It tells Linux exactly what hardware blocks exist in FPGA fabric or processor silicon.

This tells the Linux kernel that the hardware is alive and ready. Go find the official Linux kernel driver for a Xilinx AXI Timer, load it into memory, and hand over control of the register at 0x42800000 to that driver.
Add this to the end of the file:
```
&axi_timer_0 {
        status = "okay";
};
```