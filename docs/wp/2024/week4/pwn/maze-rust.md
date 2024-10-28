---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Maze_Rust

![Maze_Rust](/assets/images/wp/2024/week4/maze-rust_1.png)

IDA逆向看不懂，先当黑盒打（

## 解法一

进入程序，发现这是个简单的迷宫

![迷宫](/assets/images/wp/2024/week4/maze-rust_2.png)

于是可以搓脚本，读取迷宫用算法解迷宫了

成功解出迷宫后，会让我们输入

![输入](/assets/images/wp/2024/week4/maze-rust_3.png)

随便试试可以发现，这是一个system()，可以执行我们输入的东西

贴一个GPT生成的迷宫脚本

```python
#!/usr/bin/env python3
from pwn import *

context(log_level='debug', arch='amd64', os='linux')
context.terminal = ["tmux", "splitw", "-h"]
uu64 = lambda x: u64(x.ljust(8, b'\x00'))
s = lambda x: p.send(x)
sa = lambda x, y: p.sendafter(x, y)
sl = lambda x: p.sendline(x)
sla = lambda x, y: p.sendlineafter(x, y)
r = lambda x: p.recv(x)
ru = lambda x: p.recvuntil(x)

p = process('./Maze_Rust')
elf = ELF('./Maze_Rust')

sla(b'3: Handle The Maze', b'3')
p.recvline()

maze = []
while True:
    line = p.recvline().decode().strip()
    if "quit" in line:
        break
    maze.append(line)

DIRECTIONS = [(-1, 0, 'W'), (1, 0, 'S'), (0, -1, 'A'), (0, 1, 'D')]

def find_positions(maze):
    start = end = None
    for i, row in enumerate(maze):
        if 'P' in row:
            start = (i, row.index('P'))
        if 'G' in row:
            end = (i, row.index('G'))
    return start, end

def can_move(maze, x, y):
    return 0 <= x < len(maze) and 0 <= y < len(maze[0]) and maze[x][y] in ' PG'

def dfs(maze, x, y, end, path, visited, direction_path):
    if (x, y) == end:
        return True

    visited.add((x, y))

    for dx, dy, direction in DIRECTIONS:
        nx, ny = x + dx, y + dy
        if can_move(maze, nx, ny) and (nx, ny) not in visited:
            path.append((nx, ny))
            direction_path.append(direction)
            if dfs(maze, nx, ny, end, path, visited, direction_path):
                return True
            path.pop()
            direction_path.pop()

    return False

def solve_maze(maze):
    start, end = find_positions(maze)
    path = [start]
    direction_path = []
    visited = set()
    if dfs(maze, start[0], start[1], end, path, visited, direction_path):
        return direction_path
    else:
        return None

path = solve_maze(maze)
path_ = "".join(path).lower()
sl(path_)

p.interactive()
```

## 解法二

观察力惊人的我们发现，菜单

![菜单](/assets/images/wp/2024/week4/maze-rust_4.png)

只出现了，1，3，唯独跳过了2，于是好奇心过剩的我们，尝试输入2，得到了一句提示

![提示](/assets/images/wp/2024/week4/maze-rust_5.png)

当然，不知道是什么数字也没事，我们可以掏出IDA，一逆究竟

:::tip
本题使用Rust编写的，在IDA中会显得十分杂乱
:::

Rust编译出来的程序，其主函数在xxxx::main中

![main](/assets/images/wp/2024/week4/maze-rust_6.png)

进入到主函数中，我们通过题目的功能来进行猜测。题目的菜单要求我们输入数字来进行选择，我们找到类似多个if判断选择的地方

![if比较](/assets/images/wp/2024/week4/maze-rust_7.png)

在这段代码中，我们发现程序对v74进行了多次的if比较，猜测它就是我们输入的数字，判断后执行的如`generate_maze`，也符合程序中菜单的功能

通过逆向（或是对绫地宁宁的理解）我们可以知道，输入的数字是0721

![0721](/assets/images/wp/2024/week4/maze-rust_8.png)

在代码中，我们发现程序对DEBUG的一个全局变量做了修改

![DEBUG](/assets/images/wp/2024/week4/maze-rust_9.png)

通过'x'键查找引用

![交叉引用](/assets/images/wp/2024/week4/maze-rust_10.png)

找到了第二处引用的位置，因此在第二次附近，我们猜测就是Backdoor的Stage2

![Stage2](/assets/images/wp/2024/week4/maze-rust_11.png)

激活后门Stage1后，程序会给出提示

![提示](/assets/images/wp/2024/week4/maze-rust_12.png)
![ida反编译看代码](/assets/images/wp/2024/week4/maze-rust_13.png)

我们找到输入的地方，发现输入的字符串最终是v20，并且和后面的东西进行了cmp比较

![cmp](/assets/images/wp/2024/week4/maze-rust_14.png)

:::tip
Rust的字符串比较用上了xmm寄存器，提高效率
:::

跟进查看这两处存的字符

![字符](/assets/images/wp/2024/week4/maze-rust_15.png)

使用shift+e提取内容

![提取1](/assets/images/wp/2024/week4/maze-rust_16.png)
![提取2](/assets/images/wp/2024/week4/maze-rust_17.png)

合起来就是`I'm the best pwner!!!`

于是我们输入

![输入](/assets/images/wp/2024/week4/maze-rust_18.png)

Get Shell
