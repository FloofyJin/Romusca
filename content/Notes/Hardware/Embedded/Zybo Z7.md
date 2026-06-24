processor: XC7Z010

RAM
1. ps7_ddr_0: external DDR chip. Needed for running bigger programs like linux.
2. ps7_ram_0 (on chip/OCM): internal On Chip Memory. Low latency. This isnt like SRAM bc SRAM usually has CPU caches (L1, L2, L3)
3. qspi_linear_0. Acts like a memory mapped storage for the CPU. But isnt fast enough for XIP workload. Must be copied into ram to work

| Region        | Type           | Speed     | Size   | Persistence  | Use case                |
| ------------- | -------------- | --------- | ------ | ------------ | ----------------------- |
| ps7_ddr_0     | External RAM   | Medium    | Large  | Volatile     | Normal apps             |
| ps7_ram_0     | On-chip RAM    | Very fast | Tiny   | Volatile     | Real-time critical code |
| qspi_linear_0 | External Flash | Very slow | Medium | Non-volatile | Boot / storage          |


### Creating Bootloader
1. Create a basic UART hardware platform on Vivado. This should be a .xsa file
2. Go to Vitis, Create a fsbl application. Ensure you are using the .xsa you just generated as hardware specification. Build it to generate fsbl.elf
3. Create  a normal application and ensure you are using the same hardware specification as before. Build it. This will generate application .elf
4. Go to top tool bar, Vitis -> Create Boot image -> zynq. You can select the fsbl system to prefill the import Bif file path and output path. In the bottom, there is an option to add Boot image partition. Ensure you have the fsbl.elf, system.bit file, and application .elf file. Create image. This will create BOOT.bin
5. Then you can program the device. Top tool bar -> Vitis -> Program Flash Memory. Select the BOOT.bin you just generated. select the fsbl.elf from the fsbl application. 
6. Jump the pin back to QSPI mode. reset processor or power off and on the device.