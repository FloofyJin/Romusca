Memory reserved for shared purpose is 0x1e00000 with size 0x10000
Memory reserved for rtos is 0x1e010000 with size 0x1ff0000

CPU0 runs petalinux
CPU1 runs RTOS
# RTOS
You must first create platform with cortex1. Ensure you are using the same .xsa file as the one used for creating petalinux project for Application.
You're not running bare-metal "on the fabric." You're running bare-metal on the ARM processor, and the ARM talks to hardware you've built in the fabric.

### Limit where bare metal runs
Go find lscript.ld in your application directory. It should be inside src folder.
Create a new available memory space called `rtos_mem_ps` with  base address 0x1E010000 with size 0x1FF0000. This should match what area of memory is reserved by petalinux.
Set all sections of the memory to use `rtos_mem_ps`

### Tell BSP that CPU1 is an AMP secondary core
1. Go click on Platform project (eg. jinnysus_led)
2. double click on platform.spr to open platform configuration window
3. Look for "ps_cortexa9_1" on the left nav -> "Board Support Package" -> Modify BSP Settings. Go to drivers -> ps7_cortexa9_1. You should  see a configuration name "extra_compiler_flags". Append a space and then add exactly this macro to the existing flags:
```
-DUSE_AMP=1
```
4. Click okay
#### Why this works
SMP (Symmetric Multiprocessing): This is what your phone or laptop does. All CPU cores are bundled together under one operating system. OS treats all cores equally
AMP (Asymmetric Multiprocessing):  This is when different cores are controlled by different operating system. By setting "Define: Use_AMP equals True (1)", we are telling vitis we force compiler to skip these danger lines
```c
#ifndef USE_AMP
    // If USE_AMP is NOT defined, assume we own the whole house!
    Initialize_Global_Caches();
    Overwrite_MMU_Tables();
#endif
```
### Run .elf on only one cpu
Make sure you have clean and built application project. 
Power cycle if need to.
Open up XSCT Console
```tcl
targets 3
dow "D:/{vitis_platform}/{application_name}/Debug/{application_name}.elf"
con
```
Note:
APU Application Processing Unit (target 1)
ARM Cortex-A9 MPCore #0 (target 2)
ARM Cortex-A9 MPCore #1 (target 3)

Note: 
**`target 0`** is the **Whole Chip Level Debugger (or the JTAG Cable / Whole Chain itself)**.
### Servo high inrush current 
Commanding the servo to move from $180^\circ$ to $10^\circ$ will attempt to turn at full torque to bridge the  $170^\circ$ gap as fast as possible. This causes a spike in power draw. This will possibly disconnect USB to UART connection as all the power flows to the servo to meet that demand
TLDR, motors use a lot of energy, have external power source for your motors to prevent brownout.