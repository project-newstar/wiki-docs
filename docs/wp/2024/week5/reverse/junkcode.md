---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# jun...junkcode?

打开题目，在这里发现了明显的花指令（jz - jnz）：

![花指令](/assets/images/wp/2024/week5/junkcode_1.png)

「去花」后：

![去完花指令](/assets/images/wp/2024/week5/junkcode_2.png)

恍然大悟！（然后发现这整段加密逻辑都是假的 QAQ）

关注 `sub_4017A9` 这个函数<span data-desc>（这些 API 均能在微软官方文档找到用法）</span>：

![sub_4017A9 函数](/assets/images/wp/2024/week5/junkcode_3.png)

这里就能发现一些问题：比如在之前的代码中，还没有映射过任何文件，这里怎么就取消映射了？

查看一下反复出现的 `qword_408A20` 的交叉引用：

![查看交叉引用](/assets/images/wp/2024/week5/junkcode_4.png)

可以看到它在 `sub_401550` 这个函数中反复出现，检查一下这个函数：

![sub_401550函数](/assets/images/wp/2024/week5/junkcode_5.png)

根据之前的分析，已经能推测出 `sub_401550` 肯定早在 `sub_4017A9` 之前就已经执行了，并且不难看出，`sub_401550` 中文件映射对象打开失败的逻辑对应父进程，打开成功的对应子进程

父进程向 `qword_408A20` 写入了如下内容：

| 地址/偏移        | 含义 |
|-----------------|-----|
| `408A20[0]`     | 父进程的进程 ID |
| `408A20[0] + 1` | 父进程 `sub_4017A9` 函数返回地址的地址 |
| `408A20[0] + 2` | `4201097` |

子进程根据这个文件映射修改父进程 `sub_4017A9` 的返回地址为 `4201097`（对应 `401A89h`）

::: info 关于反调试
这里要子进程调试父进程，如果在这之前父进程被其他进程调试了，子进程就无法附加调试，那自然无法执行正确的逻辑。
:::

可知，父进程在执行完 `sub_4017A9` 获取输入后，就跳转至 `401A89` 处继续执行

![sub_4017A9函数](/assets/images/wp/2024/week5/junkcode_6.png)

从这里重新让 IDA 识别为代码，并反编译：

![反编译真正的加密逻辑](/assets/images/wp/2024/week5/junkcode_7.png)

看到了真正的加密逻辑，这段加密执行完后，跳转到了 `main` 函数里的判断部分

据此写出解密代码：

```c
#include <cstdio>
int main() {
  flag[] = {0x34,0x6c,0x60,0x33,0x15,0x3b,0x74,0x38,0x5e,0x6a,0x53,0x5,0x31,0x1c,0x43,0x35,0x53,0x58,0x4a,0x12,0x39,0x3b,0x35,0x5e,0x3a,0x21,0x8,0x1b,0x44,0,0x7c,0x26,0x6e,0x5d,0x54,0xc,0x1,0x7,0,0x1f,0x52,0x1b}
  for (int i = 41; i >= 0; i--)
    flag[41 - i] ^= flag[i * 2 % 42];
  puts(flag);
}
// flag{G00d_jOb_!_7h1s_i5_nOt_0nIy_junkc0d3}
```

到这里，还剩下最后一个问题：`sub_401550` 是怎么被执行的？

查看一下 `sub_401550` 的交叉引用：

![查看交叉引用](/assets/images/wp/2024/week5/junkcode_8.png)

再往前跟踪几个函数<span data-desc>（篇幅有限，不列出来了）</span>，能发现上面的函数最终在程序初始化阶段被 `sub_401BC0` 调用，然后才执行的 `main` 函数<span data-desc>（所以要是你比较闲，从程序入口节点步进也是能调出来的）</span>

![sub_401180](/assets/images/wp/2024/week5/junkcode_9.png)
