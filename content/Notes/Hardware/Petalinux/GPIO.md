## Use sysfs GPIO
Figure out what GPIO pins are registered:
```
dmesg | grep gpio
```
You should see a message like "gpio gpiochip0: registered GPIOs 512 to 515 on 41200000.gpio".
You can toggle the pins like so
```
echo 512 /sys/class/gpio/export
echo out > /sys/class/gpio/gpio512/direction
echo 1 > /sys/class/gpio/gpio512/value
echo 0 > /sys/class/gpio/gpio512/value
```

gpiochip0 is AXI GPIO peripheral
gpiochip1 is PS GPIO controller

## Use libgpiod
Enable libgpiod-tools
On build machine, Go to project-spec/meta-user/conf/petalinuxbsp.conf -> Add line 
```
IMAGE_INSTALL:append = " libgpiod-tools"
```
rebuild `petalinux-build`

On petalinux, see which pins are available:
```
sudo gpioinfo
```
Try changing the pins:
```
sudo gpioset gpiochip0 0=1
```
### Flicker LED pin
```c
#include <gpiod.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    printf("opening chip...\n");

    struct gpiod_chip *chip = gpiod_chip_open_by_name("gpiochip0");
    if (!chip) {
        perror("chip open failed");
        return 1;
    }

    printf("chip opened\n");

    struct gpiod_line *line = gpiod_chip_get_line(chip, 0);
    if (!line) {
        perror("line get failed");
        return 1;
    }

    printf("line acquired\n");

    if (gpiod_line_request_output(line, "test", 0) < 0) {
        perror("line request failed");
        return 1;
    }

    printf("starting blink loop\n");

    while (1) {
        gpiod_line_set_value(line, 1);
        usleep(500000);
        gpiod_line_set_value(line, 0);
        usleep(500000);
    }

    return 0;
}
```
Command: `arm-xilinx-linux-gnueabi-gcc demo.c -o demoo -lgpiod`
You can build directly inside petalinux