---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# begin

首先运行一下这个程序

![运行程序](/assets/images/wp/2024/week1/begin_1.png)

可以发现很多提示，我们根据提示首先使用 IDA 打开，接下来按下 <kbd>F5</kbd> 得到伪代码

![IDA 界面 1](/assets/images/wp/2024/week1/begin_2.png)

根据提示，我们点击 `flag_part1` 这个变量，从而得到 flag 的第一部分

![IDA 界面 2](/assets/images/wp/2024/week1/begin_3.png)

如果 IDA 显示是十六进制数据，则可以在十六进制数据那按下 <kbd>A</kbd>，从而得到字符串

接下来返回主函数界面，可以点击标签栏中的 Pseudocode-A

再根据提示，按下 <kbd>⇧ Shift</kbd><kbd>F12</kbd>

![IDA 界面 3](/assets/images/wp/2024/week1/begin_4.png)

可以看到一个很明显的字符串，点进去，从而得到 flag 第二部分

根据提示，在 Format 上按下 <kbd>X</kbd> 查看是谁引用了这个字符串

![IDA 界面 4](/assets/images/wp/2024/week1/begin_5.png)

再根据提示，在函数名字上按下x键找到是哪个函数引用了这个函数

![IDA 界面 5](/assets/images/wp/2024/week1/begin_6.png)

根据提示，这个函数名就是最后一部分，并且在最后加上 `}`

![IDA 界面 6](/assets/images/wp/2024/week1/begin_7.png)

则最后拼起来的 flag 是 `flag{Mak3_aN_3Ff0rt_tO_5eArcH_F0r_th3_f14g_C0Rpse}`
