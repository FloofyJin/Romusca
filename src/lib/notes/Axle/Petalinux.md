Look at [[Design]] for a better understanding how how petalinux, ROS2, and bare metal connect.

Program in petalinux opens a udp socket bridge to receive messages at an interval of 1000ms. This allows us to not overload the cpu with useless information while still being able to maintain near accurate position of the arm.

Step 1:
Open shared memory on /dev/mem. 
Step 2:
Create mmap on the pre-determined shared memory address that we agreed upon with bare metal program. In this case, it is 0x1FF00000 with size 0x100000.
Step 3:
receive socket message, validate that the received packet size is correct and that the sequence is incrementing
Step 4:
Write to the shared memory with the data received from socket. Ensure you are only writing to shared memory if any of the angles changed, otherwise do nothing.