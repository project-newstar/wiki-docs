---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ez_debug

## 解法一：使用 IDA

步入 `main` 函数，发现给的 decrypt 提示

![IDA 界面 1](/assets/images/wp/2024/week1/ez-debug_1.png)

步入 you 函数，在循环处下断点

![IDA 界面 2](/assets/images/wp/2024/week1/ez-debug_2.png)

按下 <kbd>F9</kbd> 开始调试，然后按下 <kbd>F8</kbd> 单步，循环结束点击 `v5`

![IDA 界面 3](/assets/images/wp/2024/week1/ez-debug_3.png)

## 解法二：使用 xdbg

拖入 xdbg64，搜索字符串，发现 decrypt flag，下断点，按下 <kbd>F9</kbd> 即可

![xdbg 界面](/assets/images/wp/2024/week1/ez-debug_4.png)
