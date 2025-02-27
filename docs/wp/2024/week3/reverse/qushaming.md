---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# 取啥名好呢

先静态分析程序，`mian`<span data-desc>（没有打错字）</span>函数是根据不同的信号进行不同的处理

![mian（是的我没打错）函数](/assets/images/wp/2024/week3/qushaming_1.png)

`main` 函数从这里开始，下面有很多分支跳转，暂时不放出来

![main函数](/assets/images/wp/2024/week3/qushaming_2.png)

使用动态调试，在 IDA 中打开 `main` 函数<span data-desc>（Linux动态调试取消地址空间随机化还没去找怎么做，这里用鼠标慢慢划找到的代码）</span>，在 `00005643EA39A9CF cmp eax, 4` 处下断，看看 eax 的值是多少，跳转到哪个分支<span data-desc>（这里想下断点看看是因为没找到 env 的值是什么情况，当时猜测是一个 0，这一步是验证一下猜想）</span>

![动调起来](/assets/images/wp/2024/week3/qushaming_3.png)

要输入 flag，先随便输入一个

![输入 flag](/assets/images/wp/2024/week3/qushaming_4.png)

运行到断点处，看到 eax 的值是 0，然后单步执行一下，运行到此处，报错 `got SIGSEGV signal`

![报错](/assets/images/wp/2024/week3/qushaming_5.png)

再次按下 <kbd>F9</kbd>，运行，选 `yes`

![选 yes](/assets/images/wp/2024/week3/qushaming_6.png)

运行到此处，这两步做了个指针的赋值，转换到 C 语言就是 `qword_562D6BA47060 = &dword_562D6BA47068`

```asm
.text:0000562D6BA443C9 lea     rax, dword_562D6BA47068
.text:0000562D6BA443D0 mov     cs:qword_562D6BA47060, rax
```

![指针赋值](/assets/images/wp/2024/week3/qushaming_7.png)

这时候可以去查一下 `got SIGSEGV signal` 错误的信号，是 11，转头去静态分析里面看看这个信号的处理函数，在 `func2` 里面，`longjmp` 和 `setjmp` 是对应的函数，运行完后会回到 `main` 函数的 `setjmp` 下面

![func2](/assets/images/wp/2024/week3/qushaming_8.png)

看了下静态分析的汇编代码，好像也没啥内容了，`longjmp` 执行后会继续执行下一个 `switch`，代码运行如下，相当于给指针赋值为 233，即静态分析中的

![longjmp](/assets/images/wp/2024/week3/qushaming_9.png)

在动态调试里面直接F9运行一下吧，又报错了 `got SIGILL signal`，信号是 4，去静态分析里看看，没啥重要的函数，只有一个 `longjmp`

![报错](/assets/images/wp/2024/week3/qushaming_10.png)

![longjmp](/assets/images/wp/2024/week3/qushaming_11.png)

回到 `main` 函数继续调试，运行到此处又报错 `got SIGFPE signal`，其中这一块前面还有一部分重要的操作，在静态分析中体现如下

![报错](/assets/images/wp/2024/week3/qushaming_12.png)

![对应的操作](/assets/images/wp/2024/week3/qushaming_13.png)

看看汇编，用一个数除以 0 报错，查看信号码是 8，在静态分析中执行 `func1`，查看静态分析的代码：

![func1](/assets/images/wp/2024/week3/qushaming_14.png)

![func1](/assets/images/wp/2024/week3/qushaming_15.png)

看到这里就没有调试的必要了，加密逻辑也很简单，先使用 `flag+4068` 里面的值（233），然后每一位都和下标进行异或

`enc` 的值如下：

![enc](/assets/images/wp/2024/week3/qushaming_16.png)

编写解密代码：

```c
#include<stdio.h>
#include<string.h>
int main() {
    unsigned char enc[] =
    {
      0x4F, 0x54, 0x48, 0x53, 0x60, 0x45, 0x37, 0x1A, 0x28, 0x41,
      0x26, 0x16, 0x3B, 0x45, 0x14, 0x47, 0x0E, 0x0C, 0x70, 0x3B,
      0x3C, 0x3D, 0x70
    };
    char flag[24] = "\0";
    int key = 233;
    // 解密过程
    for (int i = 0; i < 23; i++) {
        flag[i] = enc[i] ^ i;
        flag[i] -= key;
    }
    printf("%s", flag);
    return 0;
}
```

flag 为 `flag{WH47_C4N_1_54y???}`
