Software that sits between different parts of a system that helps them communicate or coordinate without each part needing to know the low level details of the other.

For example, in a robot, we have 3 processes:
* process to read sensors
* control motors
* does path planning
instead of every component manually handling sockets, threads, serialization, and synchronization, middleware provides a common layer that handles communication for them.

Eg. ROS 2 (Robot Operating System 2)
* One node publishes camera data
* Another node subscribes to it
Middleware handles messages passing underneath