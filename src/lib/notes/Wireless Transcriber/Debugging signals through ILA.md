You can set up debug signal in our code with annotations
```
(* mark_debug = "true" *) logic signal;
```
After synthesizing, open up the synthesized design and "Set Up Debug". You can add or remove debug cores in the panel that pops p and generate. Then run implementation and debug. Now, programming  device will open up a panel 
![[res/Pasted image 20260726174915.png]]

You can trigger for when a signal hits a certain value. For my case, I made the debugger trigger at b_rx_done=1. This is the point where it received entire packet from the chip and has settled back down.
![[res/Pasted image 20260802175957.png]]