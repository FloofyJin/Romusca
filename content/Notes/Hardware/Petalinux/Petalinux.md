### Downloading requirements
look up plnx-env-setup.sh on github for the script to install necessary packages
### petalinux manager
Then go to [Xilinx Download page](https://www.xilinx.com/support/download/index.html) to download PetaLinux tools installer.
Opening this up will  give you a .run file. You have to run that to initialize petalinux command.
Note: you might run into an error saying unable to install pylint5.  Just do `sudo apt install pylint`.

==TIP==: petalinux likes shellscript instead of bash so run `sudo ln -sf /bin/bash /bin/sh`

Once required packages are installed, you can run `source ./settings.sh` to add petalinux command to current environment.

Create petalinux project with command: `petalinux-create project --template zynq --name <project name>`
#### Config
Go inside that project and generate kconfig for the hardware description. To do this, first get the .xsa file into the machine you are on.  Then inside the project, `petalinux-config --get-hw-description=/home/spencer/Download/petalinux-tools/`. Program will find the .xsa file if you provide the folder.
Check that all the Hardware Settings are as it should be. You shouldnt need to mess with anything except one thing. Go to "Image Packaging configuration" and uncheck Copy final images by pressing "n". then save/exit.

==TIP==: If you are on virtualbox, you can create a shared folder.  First, go to setting for the vm to enable auto mount on the host folder of choice. Then, create a folder in ubuntu: `mkdir sharedFolder` and `sudo mount -t vboxsf sharedFolder ~/sharedFolder`

==TIP==: You might have issues with permission error during runs. Run this command: `sudo chown -R $USER:$USER

==TIP==: If you get an error along the lines of "libtinfo.so.5: cannot open shared object file", then install it.
```bash
// libtinfo5
wget http://security.ubuntu.com/ubuntu/pool/universe/n/ncurses/libtinfo5_6.3-2ubuntu0.1_amd64.deb
sudo apt install ./libtinfo5_6.3-2ubuntu0.1_amd64.deb

//XSCT
wget http://security.ubuntu.com/ubuntu/pool/universe/n/ncurses/libncurses5_6.3-2ubuntu0.1_amd64.deb
sudo apt install ./libncurses5_6.3-2ubuntu0.1_amd64.deb
```
Try running  `--get-hw-description` command again

#### Kernel config
Run `petalinux-config -c kernel`
### Boot config
Run `petalinux-config -c u-boot`

Boot options -> Boot media -> enable "Support for booting from QSPI flash" and "Support for booting from SD/EMMC"
### File system
Run `petalinux-config -c rootfs`

User packages -> peekpoke 
### Build
clean cache first: `petalinux-build -c u-boot -x distclean`
Then, `petalinux-build`

If you made changes to device tree: 
`petalinux-config --get-hw-description=<new_xsa>`
`petalinux-build -c device-tree`
`petalinux-build`

Proper delete: `petalinux-build -x mrproper`. It removes: old generated DTs, kernel build artifact, stale hardware metadata, cached outputs. This is a proper clean. Only do if necessary.
Then `petalinux-build`
### Ensure all drivers are installed
Make sure you have vivado installed. Go to tools/Xilinx/Vivado/2024.2/data/xicom/cable_drivers/lin64/install_script/install_drivers, then run install_drivers.sh
### Write to board via jtag
Ensure you are sharing USB to the virtualBox if you are using it. Make sure that the USB is connected by verifying /dev/ttyUSB* exist. ttyUSB1 is where you connect putty. Open up putty on /dev/ttyUSB1 with budrate 115200.

`petalinux-boot --jtag --kernel`

This will take a long time. It will appear to freeze or not print anything in console for a long time but thats normal. Once finished, you will see a login and you can login with name "petalinux".
You can provide new password.

You can connect your board to your computer (ideally router). 
### Optional: Access internet even if you dont have router
If you dont have access, you have to connect your board to your computer through ethernet cable. Enable internet access sharing

Control panel -> Network and Internet -> Network and Sharing Center
Click on Internet Connections, name of your home wifi should be highlighted in blue. Go to properties -> sharing -> Allow other network users to connect through this computer's Internet connection. Select Ethernet (whichever one is the name of your ethernet. If it doesnt show up, power off virtualBox).

Your board should now be connected to your computer via 192.168.137.x. You can verify this by checking out ipconfig on your host machine. Mine was 192.168.137.1

Go back to petalinux  terminal, see which connections are available by checking `ifconfig`. I saw that I had enx000a35001e53 pop up as connected. So I ran `sudo udhcpc -i enx000a35001e53`. Then I could  ping google.

#### Creating bootloader
petalinux accepts FAT32 as the bootloader file type so the standard formatting for your sd card or whatever medium of preference is to have 1GB FAT32 for partition0 and the rest in ext4 for the second partition holding the rest of the program.
You can partition the disk using `fdisk` or whatever tool you prefer.

Do remember that you need to set the file types. example:
```
sudo mkfs.vfat -F 32 -n boot /dev/mmcblk0p1
sudo mkfs.ext4 -L root /dev/mmcblk0p2
```

To actually get the bootloader, you need `boot.scr`, `image.ub`, and `BOOT.BIN`. You can get boot.scr and image.ub in your {petalinux project folder}/images/linux folder. You need to generate BOOT.BIN manually by running the command:
```
petalinux-package --boot --fsbl images/linux/zynq_fsbl.elf --fpga images/linux/system.bit --u-boot --force
```

You should drag and drop `boot.scr`, `image.ub`, and BOOT.BIN.
But you should use the `dd` command to disk destroy/write to the second partition:
`sudo dd if="images/linux/rootfs.ext4" of="/dev/sdc2" status=progress`

make sure to unmount before taking out the sdcard:
`sudo umount /dev/sdc1`
`sudo umount /dev/sdc2`

### Setting cpu count through boot arg
reference: https://www.hackster.io/whitney-knitter/zynqberry-u-boot-configuration-in-petalinux-1f7c04

Go to project-spec/meta-user/recipes-bsp/device-tree/files/system-user.dtsi

add the line:
```
/ {
        chosen {
                bootargs = "console=ttyPS0,115200 earlycon root=/dev/ram0 rw maxcpus=1";
        };
};
```

This will make petalinux only use one cpu
### Boot by mounting partition instead of ram
petalinux by default boots from /dev/ram0
I recommend changing where rootfs is stored to /dev/mmcblk0p2 instead of /dev/ram0 by going to `/project-spec/meta-user/recipes-bsp/files/system-user.dtsi`. Change root to  `/dev/mmcblk0p2`.

You also want to change the root filesystem type:
`petalinux-config` -> Image Packaging Configuration ->Root Filesystem type -> EXT4 (SD/eMMC/SATA/USB)

### Correct dnf repo
Then update date time:
check time: `date`
Update time: `sudo date -s "2026-06-14 18:30:00"`
Retry: `sudo dnf makecache`
Try installing pip: `sudo dnf install python3-pip`
#### Might need to do this?
Update repo file
```
sudo vim /etc/yum.repos.d/xilinx.repo
```
paste this:
```
[xilinx-cortexa9]
name=Xilinx CortexA9 Repo
baseurl=https://petalinux.xilinx.com/sswreleases/rel-v2024.2/generic/rpm/cortexa9t2hf_neon
enabled=1
gpgcheck=0

[xilinx-noarch]
name=Xilinx Noarch Repo
baseurl=https://petalinux.xilinx.com/sswreleases/rel-v2024.2/generic/rpm/noarch
enabled=1
gpgcheck=0
```

### Allow wsl to ssh into petalinux connected via eth (one time setup)
Prerequisite is completing [[#Optional Access internet even if you dont have router]]
1. set wsl config to mirror
	C:/Users/Nymph/.wslconfig:
```
[wsl2]
networkingMode=mirrored
```
Change it to:
```
[wsl2]
networkingMode=bridged
vmSwitch=WSL-Bridge
```
2. Go to PowerShell as Administrator, type the command `New-VMSwitch -Name "WSL-Bridge" -NetAdapterName "Ethernet" -AllowManagementOS $true`
	This will create a virtual bridge linked idrectly to the Ethernet port Zybo is connected  to

3. Then restart WSL, `wsl --shutdown`
4. assign static ip to WSL on that subnet. You should have Windows11 host ip as 192.168.137.1, Zybo as `192.168.137.60`, lets give WSL `192.168.137.50`. Use the command `sudo ip addr add 192.168.137.50/24 dev eth0`
5. Bring interface up: `sudo ip link set dev eth0 up`
6. Optionally set default route: `sudo ip route add default via 192.168.137.1`
### Tell BSP that CPU1 is an AMP secondary core
You might get freezes in serial while  trying to run bare metal code while board is running petalinux.
1. Go click on Platform project (eg. jinnysus_led)
2. double click on platform.spr to open platform configuration window
3. Look for "ps_cortexa9_1" on the left nav -> "Board Support Package" -> Modify BSP Settings. Go to drivers -> ps7_cortexa9_1. You should  see a configuration name "extra_compiler_flags". Append a space and then add exactly this macro to the existing flags:
```
-DUSE_AMP=1
```
4. Click okay
### Install arm-xilinx-linux-gnueabi-gcc in WSL
Go to your petalinux project in virtual machine, generate  a Petalinux SDK
```bash
petalinux-build --sdk
```
Then isntall package
```bash
petalinux-package --sysroot
```
You should find a file like `sdk.sh` (typically in images/linux directory)
Copy the `sdk.sh` file to WSL,
```bash
chmod +x sdk.sh
./sdk.sh
```
install somewhere like `/opt/petalinux-sdk`
You can now set up environment for that sdk:
```bash
source /opt/petalinux/2024.2/environment-setup-cortexa9t2hf-neon-xilinx-linux-gnueabi
```
Check that it worked:
```bash
echo $CC
```
should show something like:
```bash
arm-xilinx-linux-gnueabi-gcc
```
You can set up makefile like so:
```
CC ?= arm-xilinx-linux-gnueabi-gcc
CFLAGS=-O2

TARGET=shared_test
SRC=shared_test.c
BOARD=petalinux@192.168.137.60

all:
    $(CC) $(SRC) -o $(TARGET)

deploy:
    scp $(TARGET) $(BOARD):/home/root/

run:
    ssh $(BOARD) "/home/root/$(TARGET)"

test: all deploy run
```
I set BOARD to `petalinux@192.168.137.60` but that should be the host ip address of the board. The ip was manually configured bc my setup discussed in [[#Optional Access internet even if you dont have router]]
