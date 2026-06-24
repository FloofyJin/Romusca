Memory-Mapped I/O (MMIO)

This means some regions of the CPU's physical *address space* are not actually RAM, but instead correspond to device registers. When the CPU reads or writes to those addresses, it is directly talking to a device instead of memory. 

This is about the *address space* used for communication between the CPU and peripherals, not disk or storage mapping.

In older computers (ISA bus era), devices were physically wired to fixed address ranges or I/O port numbers. Those mappings were hardwired into the bus and couldn’t be changed without redesigning hardware.

Modern computers use PCI Express (PCIe), where each device includes Base Address Registers (BARs). 
Each BAR tells the BIOS/UEFI how much address space the device needs and whether it expects memory-mapped or I/O-mapped access.

x86 supports both port-mapped I/O (PMIO) and memory-mapped I/O (MMIO).
ARM uses only MMIO.

#### How do modern computers connect to devices via PCIe?
1. When the BIOS/UEFI boots, it *enumerates* all PCIe devices by walking the PCIe bus hierarchy.
2. For each device, it reads its PCIe *configuration space* (typically 256 bytes for PCI, 4 KB for PCIe). This contains the vendor ID, device ID, class code, BARs, capabilities, and status bits.
3. Each Base Address Register (BAR) tells the system what size of memory window the device needs for its control registers.
4. The firmware picks a free region of the system’s *physical address space* (not RAM) and writes that base address into the device’s BAR register.
5. The PCIe *root complex* and *chipset* are configured to route all CPU accesses in that address range to the corresponding device.

#### BAR (Base Address Register)
A 32-bit or 64-bit register inside the device’s configuration space. It declares the size and type of address space the device needs. The BIOS/UEFI writes a base address to it. 
For example: “Okay device, your registers will appear starting at address 0xFC00_0000.” 

Any CPU access to 0xFC00_0000–0xFC00_0FFF will then be forwarded to that device through the PCIe fabric.

#### Address decoding
The CPU itself doesn’t keep a “map” of MMIO regions. Instead, the **chipset / root complex** contains hardware tables (configured by firmware) that define which physical address ranges belong to DRAM and which belong to devices. 
When the CPU issues a load/store, that address goes to the chipset, which decides whether to send it to RAM or to a PCIe device.

