FLASH and RAM are defined in the linker (.ld) file.

### Syntax to keep mind
`. = ALIGN(4)`
Alignment will move the current location counter (`.`)  to the next 4-bytes boundary. Why 4 bytes? because Cortex-M is 32bit and prefers word alignment. one word is 32bits or 4 bytes. This will just move the address cursor to next byte memory divisible by 4.
For example if current address is `0x20002`, it would become `0x20004`. 
For example if current address is `0x20008` it would remain the same at `0x2008`.

`_sdata = .;`
Creates a linker symbol marking where .data begins in RAM. Startup code uses this. 

`*(.data)` or `*(.data*)`
This tells the linker to place all `.data` sections from all object files and place them here.

#### Patterns
`*(.data)` matches all input section named `.data`
`*(.data*)` matches all input section named `.data`, `.data.foo`, `.data123`, etc
`.data` means output section name
`*(.data)` means input section to pull in. The apostrophe in front is a wild card. For instance, if you have `file1.o(.data)`, it means from input object file file1.o, pull its .data section and include it here in the final image. `file1.o` would be a  file created as a result of compiling.
`> RAM` means run address (VMA) is in RAM. Run address is runtime data
`AT> FLASH` means Load Address (LMA) is in FLASH. Load address is the initial bytes
`>RAM AT> FLASH` means run from RAM and load from FLASH. In other words, i am loading data from FLASH to RAM and running it

`__attribute ((section("...")))`
section attribute allows compiler to place annotated function or variable. It is a **placement directive**.
`unsigned char __attribute__((section(".myBufSectionRAM"))) buf_ram[128];`
will allow the compiler to generate an object file entry like:
`buf_ram -> input section ".myBufSectionRAM"`
This entry is what the linker script uses to places `buf_ram` from object file into `.myBufSectionRAM`