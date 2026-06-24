HAL - Hardware Abstract Layer
MSP - MCU Support package

HAL sets up SysTick, NVIC priority grouping, peripherals

### MCU
MSP sets up low level hardware configuration, board specific setup, clock enables for system blocks, and GPIO AF routing.
This is where you enable UART/SPI/I2C. You have to look at the alternate functions table to figure out which pins you have to enable to make this work.

If you are enabling USART, you have to configure the instance with BaudeRate, CLKPolarity, CLKPhase, CLKLastBit, Mode, Parity, StopBit, and WordLength.
