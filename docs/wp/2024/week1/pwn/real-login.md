---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Real Login

使用 IDA 反编译。很明显，输入的内容和全局变量 `password` 一致，就能进入 `win` 函数获取 Shell.

```cpp
unsigned __int64 func()
{
  char buf[56]; // [rsp+0h] [rbp-40h] BYREF
  unsigned __int64 v2; // [rsp+38h] [rbp-8h]

  v2 = __readfsqword(0x28u);
  printf("your input: ");
  read(0, buf, 0x30uLL);
  if ( !strncmp(buf, password, 0xAuLL) )
    win();
  return v2 - __readfsqword(0x28u);
}
```

`password` 内容为 `NewStar!!!`

![password 内容](/assets/images/wp/2024/week1/real-login_1.png)

所以 nc 连上后输入 `NewStar!!!` 即可
