#### INITRD
RAM at boot. Everything under "/" lives in memory. Limited space
#### INITRAMFS
Filesystem lives inside kernel image (image.ub). Fully RAM based. even more single image than INITRD
#### UBIFS
Root fileystem stored on raw NAND flash. Persistent storage
#### NFS
Root filesystem is on network server. Your board mounts "/" over ethernet on boot
#### EXT4
Root filesystem on normal Linux fileystem on disk. stored on SD card partition like /dev/mmcblk0p2. Persistent storage