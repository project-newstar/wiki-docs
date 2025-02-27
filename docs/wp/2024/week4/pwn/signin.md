---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Sign in

用 C++ 写的一个简单小游戏，参考了 fgo 里的职阶克制，得分达到 1145 即可胜利

![运行程序](/assets/images/wp/2024/week4/signin_1.png)

我们发现，程序有存档读档的功能，于是「精通单机」的我们可以想到用 SL 大法来达成目标

具体实施就是**输了就读档，赢了就存档**

```python
#!/usr/bin/env python3
from pwn import *

context(log_level='debug', arch='amd64', os='linux')
uu64 = lambda x: u64(x.ljust(8, b'\x00'))
s = lambda x: p.send(x)
sa = lambda x, y: p.sendafter(x, y)
sl = lambda x: p.sendline(x)
sla = lambda x, y: p.sendlineafter(x, y)
r = lambda x: p.recv(x)
ru = lambda x: p.recvuntil(x)

p = process('./Signin')
p.sendlineafter(b'Enter your name:', b'inkey')
elf = ELF('./Signin')

sorce = 0

def fight():
    global sorce
    sla(b'6. Save file', b'1')
    sla(b'Choose your class:', b'Berserker')
    p.recvline()
    result = b'You beated' in p.recvline()
    ru(b'Now you have ')
    sorce = int(p.recvuntil(b' sorce', drop=True))
    sl(b'')
    sl(b'')
    return result

def save(io):
    io.sendlineafter(b'6. Save file', b'6')
    io.sendline(b'')

def load(io):
    io.sendlineafter(b'6. Save file', b'5')
    io.sendline(b'')

context.log_level = 'info'
load(p)
while True:
    if fight():
        print("win")
        print(f"sorce: {sorce}")
        if sorce > 1145:
            break
        save(p)
    else:
        print("lose")
        print(f"sorce: {sorce}")
        load(p)

print("Got shell")
sl(b"cat /flag")

p.interactive()
```
