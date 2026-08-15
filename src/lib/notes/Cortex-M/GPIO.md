GPIOx->BSRR
Write only operation to set or reset register. Must use or to not overwrite unwanted bits. Atomic

GPIOx->IDR
Read register

RCC->AHB1ENR
Enable GPIO clock enable

GPIOx->MODER
Set GPIO mode

GPIOx->PUPDR
Set PULLUP/PULLDOWN/NOPULL on pin

GPIOx->OTYPER
Set GPIO output type register

GPIOx->ODR
Set GPIO output data register pin to 1 or 0. Read/Write operation. Not atomic