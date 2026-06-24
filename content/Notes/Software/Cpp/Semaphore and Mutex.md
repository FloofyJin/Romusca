#### Mutex (Mutual Exclusion Lock)
Protects shared resource so only one thread can access at a time.

In FreeRTOS, we use `xSemaphoreTake()` and `xSemaphoreGive`. Its called semaphore even though its used as mutex

#### Semaphore
It is a signaling mechanism between tasks or interrupts. It counts the available events/resources. Binary semaphore is how we can use it as mutex. Semaphore by itself doesnt allow a single thread to take ownership unless you design it to act like that. It holds

### Questions
Q: Why not use binary sempahore isntead of a mutex?
A: Mutex supports priority inheritance and ownerhsip semantics which semaphore dont

