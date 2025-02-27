---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Labyirinth

题目描述如下：

> 听好了：9 月 23 日，NewStar2024 就此陷落。每抹陷落的色彩都将迎来一场漩涡，为题目带来全新的蜕变。
>
> 你所熟知的一切都将改变，你所熟悉的 flag 都将加诸隐写的历练。
>
> 至此，一锤定音。
> 尘埃，已然落定。
> `#newstar#` `#LSB#` `#听好了#`

其中提到了 LSB，即**最低有效位隐写**

使用 StegSolve 工具，查看 RGB 任一 0 通道得到二维码，扫描得到 flag

![StegSolve 得到二维码](/assets/images/wp/2024/week1/labyrinth_1.png)
