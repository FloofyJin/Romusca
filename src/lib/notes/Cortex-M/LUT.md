LUTs are tiny SRAM-based logic blocks that implement Boolean functions by treating the inputs as an address into a small truth table. 

BRAMs are dedicated SRAM memories with built-in address decoding and read/write circuitry, designed to efficiently store and retrieve large amounts of data.

USES: Implement combinational logic (compute, conditions, Boolean functions, muxes, decoders)

In a typical setup, it takes in 6 address bit input and returns 64 bit output where all the bits correspond to to all 64 addresses in the LUT.

6-bit LUT has 64 address. So it will output a value stored at one of the 64 addresses.

It returns 1 or 0 because address holds one bit

It is physically implemented with SRAM but not thought of as storage.

Lookup is constant time but is not optimal where large memories need to be saved bc each LUT stores little. You can try to combine multiple LUTS using routing and mux logic but thats time intensive and uses large area.
## Block RAM
Same idea as LUT but mock bigger. When a lookup table becomes large, BRAM is usually much more efficient than implementing the same behavior with networks of LUTs.

In a 512x8 ROM, you have:
- 512 address
- each address storing 8 bits

When trying to read from the BRAM, address is sent to BRAM and selected. No mux tree is built.
This is done through an address decoder.
Each bit in BRAM is stored inside tiny SRAM circuit on the chip because there is no separate memory called BRAM on a board.
It looks like this:
`Address -> Address Decoder -> SRAM Array -> Output Register`

USES: Store large amounts of data (RAM, ROM, FIFOs, lookup tables, frame buffers)

## Flip-flops
It stores values in a temporary register during run time.

USES: Store small amounts of state (registers, FSM state, pipeline stages)