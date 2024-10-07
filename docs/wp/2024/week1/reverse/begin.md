---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# begin

首先运行一下这个程序

![此处应该是配图](/assets/images/wp/2024/week1/begin_1.png)

可以发现很多提示，我们根据提示首先使用IDA打开，接下来按下F5得到伪代码

![此处应该是配图](/assets/images/wp/2024/week1/begin_2.png)

根据提示，我们点击flag_part1这个变量，从而得到flag的第一部分

![此处应该是配图](/assets/images/wp/2024/week1/begin_3.png)

如果IDA显示是十六进制数据，则可以在十六进制数据那按下A键，从而得到字符串  
接下来返回主函数界面，可以点击界面栏（好吧我也不知道叫什么名字）中的Pseudocode-A  
再根据提示，按下shift+F12

![此处应该是配图](/assets/images/wp/2024/week1/begin_4.png)

可以看到一个很明显的字符串，点进去，从而得到flag第二部分  
根据提示，在Format上按下x键查看是谁引用了这个字符串

![此处应该是配图](/assets/images/wp/2024/week1/begin_5.png)

再根据提示，在函数名字上按下x键找到是哪个函数引用了这个函数

![此处应该是配图](/assets/images/wp/2024/week1/begin_6.png)

根据提示，这个函数名就是最后一部分，并且在最后加上“}”

![此处应该是配图](/assets/images/wp/2024/week1/begin_7.png)

则最后拼起来的flag是 `flag{Mak3_aN_3Ff0rt_tO_5eArcH_F0r_th3_f14g_C0Rpse}`
