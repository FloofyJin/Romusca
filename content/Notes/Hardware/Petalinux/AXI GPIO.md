I wondered for a very long time how AXI GPIO works, it turns out to be a lot simpler than I thought.
You can drag and drop AXI GPIO component into Vivado Block Diagram. Go to IP Configuration and set the width of the output, and "All Outputs". This will allow you to ouput bits from GPIO.

You might have multiple AXI GPIO on the board, how do you know which one is which when programming in bare metal? Go back to Vivado and open up Address Editor, you should see all the IPs and its master base address. That will be the base address of AXI GPIO.
You can verify this by checking the constant definitions in 
```
export/{platform_name}/sw/{platform_name}/standalone_domain/bspinclude/include/xparameters.h
```

you can also see all the GPIOs in 
```
ps7_cortexa9_1/standalone_domain/bsp/ps7_cortexa9_1/libsrc/gpio_v4_12/src/xgpio_g.c
```

Initialize and write to GPIO like:
```c
XGpio Servo0;
XGpio_Initialize(&Servo0, XPAR_AXI_GPIO_1_DEVICE_ID);
XGpio_DiscreteWrite(&Servo0, 1, 50000);
```