If you made change using `petalinux-package --boot`, you only need new BOOT.BIN. Changes to FPGA bitstream. FSBL, PMU firmware, or U-BOOT requires BOOT.BIN update.

If you made Device Tree changes, just do `petalinux-build` and update image.ub.

If you made kernel config change using `petalinux-config -c kernel`, then update image.ub

If you made rootfs change using `petalinux-config -c rootfs`, then update rootfs.ext4

## Programming on vitis
You can program bare metal in ZYNQ with below code in XSCT Console. If you are running on different core separate, you have target specific one. In my case target 3 is Core1.

APU Application Processing Unit (target 1)
ARM Cortex-A9 MPCore #0 (target 2)
ARM Cortex-A9 MPCore #1 (target 3)

When running petalinux and bare metal, the workflow is usually booting petalinux up via SD then programming CPU1 by downloading my bare metal code.

Asymmetric Multiprocessing (AMP) setup, the boot sequence timing is crucial:
1. When your board turns on, the Zynq's First Stage Bootloader (FSBL) loads and usually programs the FPGA bitstream.
2. PetaLinux boots up on CPU0.
3. You then use Vitis / XSCT to download and force-run your bare-metal code on CPU1.
If vitis reset the system during programming cycle or if petalinux triggers an internal power-management cycle when CPI1 is kicked alive, FPGA fabric bitstream can get cleared or reset. This will wipe the bitstream, routing maps connecting axi_timer_pwm0 logic to physical pin like k16 will vanish. Thats why you need to sometimes reprogram FPGA bitstream.

```tcl
targets 3
rst -processor
stop

# Program the FPGA with your actual wrapper bitstream. This is in your platform
fpga "D:/Work/projects/zybo_z7_projects/lab3/axle_rtos/axle_rtos.runs/impl_1/design_1_wrapper.bit"

# Now download and execute the bare metal code. This is in your application
dow "D:/Work/projects/zybo_z7_projects/lab3_vitis_workspace/axle_rtos_servo_controller_system/Debug/axle_rtos_servo_controller_system.elf"
```