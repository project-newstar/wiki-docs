---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Gdb

先拖入 IDA 分析：

```c
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  size_t v3; // rax
  size_t v4; // rax
  int fd; // [rsp+0h] [rbp-460h]
  char s[9]; // [rsp+7h] [rbp-459h] BYREF
  _DWORD v8[12]; // [rsp+10h] [rbp-450h] BYREF
  __int64 v9; // [rsp+40h] [rbp-420h]
  __int64 v10; // [rsp+48h] [rbp-418h]
  char buf[1032]; // [rsp+50h] [rbp-410h] BYREF
  unsigned __int64 v12; // [rsp+458h] [rbp-8h]

  v12 = __readfsqword(0x28u);
  strcpy(s, "0d000721");
  strcpy((char *)v8, "mysecretkey1234567890abcdefghijklmnopqrstu");
  HIBYTE(v8[10]) = 0;
  v8[11] = 0;
  v9 = 0LL;
  v10 = 0LL;
  printf("Original: %s\n", s);
  v3 = strlen(s);
  sub_1317(s, v3, v8);
  printf("Input your encrypted data: ");
  read(0, buf, 0x200uLL);
  v4 = strlen(s);
  if ( !memcmp(s, buf, v4) )
  {
    printf("Congratulations!");
    fd = open("/flag", 0);
    memset(buf, 0, 0x100uLL);
    read(fd, buf, 0x100uLL);
    write(1, buf, 0x100uLL);
  }
  return 0LL;
}
```

可以看到程序逻辑是对一串字符串执行了加密操作，然后需要我们输入加密后的内容

对于加密函数，可以发现完全看不懂<span data-desc>（其实我是故意的🥰）</span>

所以我们选择动调查看加密后的内容

键入 `gdb ./gdb` 并运行，先运行程序，用 `b *$rebase(0x1836)` 下断点（断在call 加密函数处）

![GDB 界面](/assets/images/wp/2024/week1/gdb_1.png)

运行到加密函数处，可以发现，rdi 寄存器存的是要加密的内容，rsi 存的是加密的 key

先复制下要加密内容的地址

- `0x7fffffffd717`

然后使用 `ni` 指令步进

此时字符串已经完成了加密，我们使用 `tel 0x7fffffffd717` 指令查看字符串的内容

![字符串的内容](/assets/images/wp/2024/week1/gdb_2.png)

`b'\x5d\x1d\x43\x55\x53\x45\x57\x45'` 便是加密后的内容，使用 Python 脚本发送即可

```python
#!/usr/bin/env python3
from pwn import *

p = process('./gdb')
elf = ELF('./gdb')

data = b'\x5d\x1d\x43\x55\x53\x45\x57\x45'
p.sendline(data)

p.interactive()
```
