Bootloader is stored in system memory

When program boots up, it goes through ROM bootloader -> Secondary Program Loader (SPL) -> Custom Bootloader

### Where is it stored
Bootloader is likely stored in internal FLASH. But your bootloader will likely need to copy the application (stored in external FLASH like sd card) into internal RAM (SRAM) or internal FLASH.
Chip will continue to stream data into SRAM/internal FLASH on a need basis bc they cant hold the entire application all at once. If SRAM/internal FLASH isnt enough, you might also need to add DRAM.

S/DRAM is volatile (data lost when power is removed). It is also faster than FLASH

fastest to slowest: SRAM > DRAM > internal FLASH > SSD > external FLASH > HDD
You can only erase-before-write for FLASH

### Updating bootloader
You don't want to flash the SD card data every single time the console turns on, as that would wear out your internal Flash memory. Instead, you use a small header at the beginning of your update file (e.g., `UPDATE.BIN`).
1. When you compile your new firmware, you include a **Version Number** (e.g., `v1.2.0`) and a **Checksum** (CRC32) at a specific offset in the file.
2. Your bootloader (stored at `0x0800 0000`) starts first. It initializes the SD card and looks for `UPDATE.BIN`
3. It reads the version number from the SD card. If value is greater, it will update.

### Booting process
Booting example (petalinux):
```
Power On
   ↓
BootROM
   ↓
Read BOOT.BIN from partition 1
   ↓
FSBL initializes hardware
   ↓
U-Boot runs
   ↓
U-Boot reads boot.scr from partition 1
   ↓
U-Boot loads image.ub into DDR
   ↓
Linux kernel starts
   ↓
Kernel reads:
root=/dev/mmcblk0p2
   ↓
Kernel mounts partition 2 as /
   ↓
Linux userspace starts
```
Petalinux typically reads from partition1 containing BOOT.BIN and partition2 containing rootfs.ext4

It is possible to use petalinux by mounting /dev/ram0. In this case, U-Boot loads image.ub to DDR, linux kernel starts and sees image.ub, then kernel extracts roots from initrootfs inside DDR.

```
image.ub =
	kernel (zImage)
	+ device tree
	+ initramfs  (root filesystem archive)
```
embedded initramfs data = the filesystem archive inside `image.ub`  
initramfs = the mechanism / format  
root filesystem = the unpacked result at runtime