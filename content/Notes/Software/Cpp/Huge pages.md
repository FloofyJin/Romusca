Huge pages memory management optimization used by the OS and CPI MMU (memory management unit) to decrease the number of failed calls AKA misses to the RAM. This is done by increasing the size of the page.

Normal page = 4KB
Huge pages = 2MB
Gigantic page =1GB

Normal 4KB pages:
1GB / 1 KB = 262,144 pages

2MB huge pages:
1GB / 2MB = 512 pages

This means theres less number of pages required for the ram. 
* Less TLB misses
* CPU spends less time handling address translation
* less TLB (Translation Lookaside Buffer)  misses


TLB (Translation lookup buffer) = tiny ultra fast cache inside CPU. It stores recent address translation. So programs dont use physical memory addresses directly; they use virtual addresses. So every time CPU access memory, it must translate virtual address to physical address. The translated address is stored in TLB

Cons:
1. Small amount of data, if process only needs 2kb of data, all 2MB of hugespace will be used
2. Hugepage are good for when data is allocated mostly in a single page. If data A, B are stored in different hugespace, we basically need to look at first hugespace then another one. This is because we need to read hugespace in a huge chunk. We dont want to waste time reading two hugespaces if theyre mostly empty.