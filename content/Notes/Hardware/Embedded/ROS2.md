Robot Operating System 2
It is a collection of libraries, tools, and communication framework that allows us to build robot software.

There are different nodes that communication with each other.
For instance, you can have Camera node, Vision node, Planner node, Servo node. Each node is a process. 

Topics are the most common communication method in ROS2.
Topic publish data to Nodes.
For instance, if `/joint_state` is a node, topic will publish message to `/joint_state`.
Node might contain different states of a robot, once it receives message from topic, it will modify that state internally.

Rviz is a topic that subscribes the node, meaning it will receive message whenever message is published.

### Messages
There are different standard message formats.
eg.
- `sensor_msgs/JointState`
- `sensor_msgs/Image`
- `geometry_msgs/Twist`
- `std_msgs/String`

Just to get an idea, `sensor_msgs/JointState` has the fields:
```c
name[]
position[]
velocity[]
effort[]
```
### Services
Services are Request-response communication. Client requests Server and Server responds back.
### Actions
Actions are for long-running tasks. You have a task to move an arm to position over 5 seconds, you can get progress updates.
You can also set goal and result at the end.
