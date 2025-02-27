---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Dirty_flowers

考查内容是花指令，但是事实上新生在 week2 就学过汇编还是不敢奢望，因此实际考查内容是学习怎么用 `nop` 改汇编指令。

按下 <kbd>⇧ Shift</kbd><kbd>F12</kbd> 查找字符串就可以发现提示。

提示说将 `0x4012f1`\~`0x401302`的指令全部改成 `nop` 指令，随后在函数头位置按下 <kbd>U</kbd> <kbd>P</kbd>.

在此不对这段的花指令再进行解释，自己模拟一遍栈帧操作即可理解。

![花指令](/assets/images/wp/2024/week2/dirty-flowers_1.png)

将从 `push eax` 到 `pop eax` 这一段全部 nop 掉。

![nop](/assets/images/wp/2024/week2/dirty-flowers_2.png)

然后在函数头位置按下 <kbd>U</kbd> <kbd>P</kbd>，再按下 <kbd>F5</kbd>，即可正确反编译。

![反编译结果](/assets/images/wp/2024/week2/dirty-flowers_3.png)

稍微分析一下，将几个函数重命名一下。在函数名位置处按下 <kbd>N</kbd>，进行重命名。

![重命名](/assets/images/wp/2024/week2/dirty-flowers_4.png)

基本思路就是先判断长度是否是 36，再进行加密，最后比较。

点进 `check` 函数可以找到密文，但是点进加密函数却发现 IDA 再次飘红。

![飘红](/assets/images/wp/2024/week2/dirty-flowers_5.png)

可以很容易发现加密函数里面的花指令与主函数的花指令完全一样。因此再操作一遍即可。

![nop](/assets/images/wp/2024/week2/dirty-flowers_6.png)

![反编译结果](/assets/images/wp/2024/week2/dirty-flowers_7.png)

加密函数非常简单。

```python
# exp.py
lis = [0x02, 0x05, 0x13, 0x13, 0x02, 0x1e, 0x53, 0x1f, 0x5c, 0x1a, 0x27, 0x43, 0x1d, 0x36, 0x43,
       0x07, 0x26, 0x2d, 0x55, 0x0d, 0x03, 0x1b, 0x1c, 0x2d, 0x02, 0x1c, 0x1c, 0x30, 0x38, 0x32,
       0x55, 0x02, 0x1b, 0x16, 0x54, 0x0f]
str = "dirty_flower"
flag = ""
for i in range(len(lis)):
    lis[i] ^= ord(str[i % len(str)])
    flag += chr(lis[i])
print(flag)
# flag{A5s3mB1y_1s_r3ally_funDAm3nta1}
```
