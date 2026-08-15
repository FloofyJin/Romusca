One of many types of flip flops used to store values.

input: j, k, rstn, and clk 


| rstn | j   | k   | q        |
| ---- | --- | --- | -------- |
| 1    | 0   | 0   | 0        |
| 0    | 0   | 0   | hold val |
| 0    | 0   | 1   | 0        |
| 0    | 1   | 0   | 1        |
| 0    | 1   | 1   | toggle   |
q = (j & ~q) | (~k & q)