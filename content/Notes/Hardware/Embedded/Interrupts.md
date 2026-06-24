Interrupts on MCU can be given priority. You can set callback options for interrupts but all the pins of the same number use the same EXTI line regardless of whether its GPIOA, GPIOB, GPIOC, or GPIOD

ISR means Interrupt Service Routine
When interrupt occurs, microcontroller runs the interrupt service routine.

ET1 - enable timer 1 interrupt
eX1 - enable external 1 interrupt
EA - global enable/disable
ES - enable serial port interrupt

### Blocking code
Some functions like HAL are blocking:
* HAL_SPI_Transmit() -> takes time
* HAL_UART_Transmit() -> very slow
“Blocking” is about waiting for something.

### How interrupt can mess up your program
Assume a scenario where ISR_callBack_handler() gets executed every 44khz (22 µs). And I have a SPI_transmit() (takes 50µs) function in main(). Issue occurs when ISR gets executed really really fast. And if the ISR keeps updating values faster than the main() can consume, there is an issue. Data gets overwritten even before main has used it yet, so it fails to figure out what needs to be transmitted. People say this is data overwrite

Assume another scenario where ISR_callBack_handler() calls SPI_transmit() function inside of it. interrupt gets called and SPI starts being transmitted. But second interrupt gets called before the first one finishes. CPU cannot re-enter the same ISR bc the first one is pending. This slowdown will continue to stack.