I found that simply initializing a timer and trying to use it will have ghost behaviors: sometimes generating pwm and sometimes not
```bash
&Timer = 0x1E01C17C
SP = 0x1E01C178
BaseAddress = 0x42800000
IsReady = 286331153
IsPwmEnabled = 1
sizeof(XTmrCtr) = 44
```
If you create timer in stack, you might run issue with reading stale data in memory because timer initialization doesnt reset all the bits. Temporary fix is to do `memset(&Timer, 0, sizeof(Timer));` right after initializing Timer:
```c
    XTmrCtr Timer;
	memset(&Timer, 0, sizeof(Timer));
```
Permanent fix is to add this line to XTmrCtr_CfgInitialize():
```c
InstancePtr->IsPwmEnabled = FALSE;
InstancePtr->IsStartedTmrCtr0 = 0;
InstancePtr->IsStartedTmrCtr1 = 0;
```