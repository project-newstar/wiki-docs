---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ez_debug

## 解法一：使用 IDA

步入 `main` 函数，发现给的 decrypt 提示。如果不知道关键函数可以前后都点一点，发现主要正常的逻辑是在 `you` 函数里面

![IDA 界面 1](/assets/images/wp/2024/week1/ez-debug_1.png)

双击 `you` 函数，在相关位置下断点。点击旁边的圆圈就可以下断点了，或者按下 <kbd>F2</kbd>，之后按 <kbd>F9</kbd> 或者在上方选择「Select debugger」进入调试

![IDA 界面 2](/assets/images/wp/2024/week1/ez-debug_2.png)

这里在循环处下断点或者在 decrypt 处下断点

![IDA 界面 3](/assets/images/wp/2024/week1/ez-debug_3.png)

然后开始调试，跳出弹窗让我们输入 flag

![IDA 界面 4](/assets/images/wp/2024/week1/ez-debug_4.png)

因为没有设置长度限制，所以随便输入一些东西就好了，然后就会进入下一步

![IDA 界面 5](/assets/images/wp/2024/week1/ez-debug_5.png)

回到 IDA 界面，可以看到程序在断点处自动停止了

![IDA 界面 6](/assets/images/wp/2024/week1/ez-debug_6.png)

`you` 函数是一个解密函数，接下来按下 <kbd>F8</kbd> 进行单步调试，检查所有变量后发现每过一个循环，`v5` 的值会变化，且有类似 flag 的产物，所以等单步把循环过完之后，直接双击 `v5`，查看变量

![IDA 界面 7](/assets/images/wp/2024/week1/ez-debug_7.png)

![IDA 界面 8](/assets/images/wp/2024/week1/ez-debug_8.png)

## 解法二：使用 xdbg

拖入 xdbg64，搜索字符串

![xdbg 界面 1](/assets/images/wp/2024/week1/ez-debug_9.png)

搜索 `de` 或者 `flag`，发现 `decrypt flag`

![xdbg 界面 2](/assets/images/wp/2024/week1/ez-debug_10.png)

在 decrypt 处按 <kbd>F2</kbd> 下断点

![xdbg 界面 3](/assets/images/wp/2024/week1/ez-debug_11.png)

然后按下 <kbd>F9</kbd>，随便输入一些字符即可

![xdbg 界面 4](/assets/images/wp/2024/week1/ez-debug_12.png)

继续按下 <kbd>F9</kbd>

![xdbg 界面 5](/assets/images/wp/2024/week1/ez-debug_13.png)
