SRAM = 32KB
FLASH = 128KB
OTP memory = 512 bytes
When application firmware starts, it looks at memory addr `0x08008000`.
Memory map and register boundary addresses are in Reference Manual

MSP means Main Stack Pointer

0x08008000 is initial stack pointer (MSP)
0x08008004 is reset handler (entry point)

To get the value at  initial stack pointer, i can do `*(uint32_t) FLASH_APP_ADDR` where `FLASH_APP_ADDR = 0x08008000`

Firmware must start with a stack pointer located in SRAM. And SRAM starts at 0x20000000. so to ensure that pointer `0x08008000` is point to SRAM, we have to verify that on startup.

This is the flow on bootup

We have bootloader FLASH located at `0x08008000`. This mem address is important because it also points to the beginning of SRAM. Typically it points to somewhere  between 0x200000000 to 0x20008000. Basically it always starts with 0x200...

#### SRAM
This stores the data that changes during execution

FLASH
This stores instructions including compiled firmware. Flash is non-volatile. and slow to write. And you must erase everything before writing. 

### Bootloader
When you go from bootloader to application, you have switch the "stack" you are looking at. This is done by using a `__set_MSP(mem)` function. mem is the address of the SRAM. which is conveniently also `*(uint32_t *) 0x8008000). MSP is Main Stack Pointer. so using MSP will allow us to set the stack pointer to look at SRAM.

In bootloader, you want to ensure that FLASH memory address is looking at 0x20000000 to 0x20008000. To do so, you should make reset_handler() a callable function. Then set MSP to the address of the memory where your application is stored on.
```
MEMORY
{
RAM (xrw) : ORIGIN = 0x20000000, LENGTH = 32K
FLASH (rx) : ORIGIN = 0x8000000, LENGTH = 64K
PROGRAM (rx) : ORIGIN = 0x8018000, LENGTH = 64K
}
```
For instance, if you have this, you should set the MSP to 0x8018000 as that is where I put all my programs and functions.

### Vector table
0x08008000 Initial MSP value  
0x08008004 Reset_Handler address  
0x08008008 NMI_Handler  
0x0800800C HardFault_Handler

Vector table is a look up table where we map memory address to function.