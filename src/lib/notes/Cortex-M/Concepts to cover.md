MCU architecture like ARM or RISC5
GPIO pins, PWM, ADC/DAC specs cus MCU will have these on-board
debugger techniques (JTAG/SWD)
cs stuff like ADT/data structs
I2C or UART or SPI
How to handle interrupts and design for it
blocking vs non blocking code
OS, networking, boot process
create a bootloader

1. What are the basic data types in C
	char: 1byte
	short: 2byte
	int: 4 byte
	long: 4 or 8 (platform dependent)
	long long: 8
	float: 4 bytes
	double: 8 bytes
	long double: 10-16 bytes (platform dependent)
2. Explain the concept of pointers in c.
	1. asterisk is used to denote a memory address if used  on the left hand side. If used on the right hand side, its used dereference a pointer; which means to turn a memory address back to the value stored within in. & symbol is used to pass memory address of variable. & on the left hand side declares a reference so that the variable shares the same memory as the original. Any changes to reference will modify the original.
3. Difference between "static" and "auto" variables 
	1. auto variables allocate on stack. It will reinitialize on every call. By default, every variable is auto unless marked `static`
	2. Static variables are allocated once in the entire program execution and retained between function calls. Static var in interrupts are dangerous bc they can cause race condition if used in both ISR and main thread.
4. Explain static function
	1. static function has internal linkage so it is only visible inside current source file. This means other files cannot see the static function. static does not make it global. it actually makes function local to the file.
	2. Calling a static function multiple times in the same file will use the same function in memory without creating a new copy every call
5. Purpose of "volatile" in C
	1. You use volatile to optimize variable that will likely be updated frequently. So you want to set a variable "volatile" if you want the program to always fetch from the source instead of looking at a local copy of it.
6. What are bitwise operators and why are theyre important in embedded programming 
	1. Bitwise operators let us manipulate bits. They are especially useful for toggling pins, timers, and interrupt pins. They are used in everything from keeping track of states and messing with memories.
7. Explain the concept of bit-fields in C structure
	1. Bit-fields let you store data using specific number of bits inside a structure. You can do this in C by creating a struct and assigning bit size to every variable. This means all the fields into bytes.
	2. bit-fields are useful in embedded C programming bc you can convert hardware registers directly into usable data/variables if you know what each bit represents
8. What are inline functions, and when should they be used in embedded systems?
	1. inline functions is literally a modifier on function that is used for compiler to replace the function with operation. This removes function call overhead. 
	2. Inline functions in headers must be static to avoid multiple definition.
	3. Typically used in small function. Inlining large functions increases code size. Large inline function can blow up flash storage. Recursive functions cannot be inlined.
9. Explain the Harvard architecture and how it is different from von Neumann architecture 
	1. In Von Neumann architecture, same bus is used for memory and instructions/data bc program and data are stored in the same address space. When CPU runs a program, it fetches instruction and access data in the same bus. This causes a bottleneck.
	2. In Harvard architecture, data memory and instruction memory are separate and use separate bus. This is faster than Von Neumann bc CPU can fetch instruction and read/write at the same time.
	3. NOTE: ARM Cortex-M has 3 buses that use Harvard architecture: I-bus, D-bus, and system Bus. Even tho they use different bus, they share the same memory map. By that i mean all the memory addresses are chronological. Eg. 0x0 for flash, 0x20000000 for SRAM, etc.
10. What is a watchdog timer, and why is it important in embedded systems?
	1. Watchdog timer will periodically trigger by continuously counting down and resetting.
	2. If a task hangs, watchdog will timeout and cause a system reset. It allows system to self recover if system stops working. it catches dead locks, stack overflow, and corruption
11. Explain the concept of memory-mapped  I/O
	1. peripherals like GPIO, UART, SPI, Timers, and ADC are controlled by register. In memory mapped IO, these peripherals are mapped into the same address space as normal memory. So if you change value in memory address, you are also controlling the state of the peripheral like turning them on or off.
	2. It allows registers to be accessed using pointers, structures, and standard load/store operations.
12) What is a race condition? What causes it and how to avoid it?
	1) it happens when two or more pieces of code access the same shared resource at the same time. This is typical when you use interrupts or different threads.
	2) You can prevent this by using `__disable_irq()` for certain operations or mutex or atomic operations.
13) What happens in a startup code?
	1) In startup, a reset+handler() gets called. It does this by loading Initial stack pointer and reset handler address from vector table.
	2) typical sequences goes like this: Set stack pointer, initialize .data section, clear .bss section, configure system clock, initialize C runtime, call main()
14) What is .bss
	1) .bss is a segment that is mapped into memory that holds uninitialized variables. And it reserves space at runtime so executable isnt bloated
15) HEAP
	1) User allocate/deallocate memory with malloc, new, free, delete
16) How does a cpu handle an interrupt?
	1) CPU temporary stops current program and runs an interrupt handler. cpu  will finish current execution before doing interrupt
17) what is an interrupt latency? How can it be measured?
	1) Interrupt latency is the time between when an interrupt even occurs when the CPU begins executing the Interrupt Service Routine. 
	2) Latency = IRQ event -----> first ISR instruction
	3) to measure, you toggle a GPIO and you can find the time between signal and GPIO change
18) What is a software/hardware interrupt?
	1) Hardware interrupt is done by timer overflow, UART receive, GPIO pin change, etc.
	2) Software interrupt is done intentionally by the software. Example is via doing this: `__asm("SVC #0");`
	3) IRQ just means interrupt request which is usually a hardware signal
19) what is the difference between a breakpoint and watchpoint?
	1) Pause will stop execution at a specific line in the code
	2) Watchpoint stops execution when a specific memory location changes or is accessed
20) What is meant by board bringup activity?
	1) Its the process of getting a newly designed hardware board to power up and run its first working firmware. Its the phase where hardware and firmware engineers verify the board actually works as intended
21) Explain a scenario where you have used a logic analyzer
	1) Logic analyzers capture and analyze digital signal over time. Its useful for debugging SPI, I2C, or UART
22) How does DMA work
	1) CPU configures DMA to transfer data from peripheral to memory, memory to memory, or memory to peripheral. You can tell DMA to do a job and it will take care of it.
23) How to minimize power
	1) MCU has power modes like sleep, stop, or stand-by. You can lower the CPU speed.
24) Describe Mutex and Semaphore
	1) Semaphore doesnt have ownership associated with it. and it keeps track of the list of services that want to access it. Mutex only gives lock to one thread.
25) Sync and Parallel data collection
	1) This is how you collect data from SPI and I2C. You use timers and DMAs. On a single core system, you can collect data in parallel with DMA. you use a timer to create synchronization to ensure DMA collects data at the correct time. In synchronous data collection, data is collected at a fixed predictable time interval. In parallel data collection, data sources are sampled simultaneously.
26) What is AXI in RTL
	1) AXI (Advanced eXtensible Interface) is a high performance bus protocol from ARM. It defines how block communicate on a chip. It sepates read and writes into independent channels.
	2) It allows burst transaction. Instead of one address per data beat, you send one address and then AWLEN+1 data beats follow. AWADDR = 0x1000, AWLEN = 3  →  transfers data 0x1004, 0x1008, 0x100C
27) A CPU with DDR memory uses a PLL-based clock generator. If the reference clock drifts slightly, how does the PLL + VCO combination maintain data integrity at the DDR interface?
	1) ==Crystal Oscillator (XTAL)== creates reference clock -> PLL -> VCO -> DDR Clock
	2) ==VCO== is part of the PLL. PLL = Phase detector -> charge pump -> loop filter -> VCO.
	3) Phase detector compares the reference to the divided down VCO output. If it is different, then error signal is made. Charge Pump converts error signal into current that charges/discharges capacitor. It does this to adjust VCO output frequency. 
	4) ==Loop filter== smooths to remove jitter
	5) PLL adjusts the VCO to maintain the correct DDR clock frequency
28) If a DDR4 system runs at 2400 MT/s, and the PLL has a loop bandwidth that is too narrow, what problems might arise?
	1) ==Loop bandwidth== determines how fast the PLL can react to changes in the reference clock
	2) Narrow Loop bandwidth  basically means PLL is sluggish bc it cant track fast moving phase or frequency changes in the reference.
	3) Over many cycles, this correction lag can exceed the setup/hold window of the DDR interface, causing bit errors.
29) How would clock jitter in a PLL affect setup/hold times in a high-speed DDR system?
	1) In jitter, edges arrive slightly earlier or later than expected.
	2) Setup time -> data must be stable before clock edge
	3) Hold time -> data must remain stable after the clock edge
	4) If PLL jitter causes clock edge to arrive earlier, data may not be stable, this is setup violation
	5) If PLL jitter causes clock edge to arrive later,  data transition may happen before clock edge. But it should happen before. This is hold violation
30) Why can’t you just keep increasing DDR speed indefinitely by boosting the PLL clock multiplier?
31) In what way does voltage scaling interact with clock speed, VCO operation, and DDR timing margins?
32) What is GSPI
33) what is flash/RPC