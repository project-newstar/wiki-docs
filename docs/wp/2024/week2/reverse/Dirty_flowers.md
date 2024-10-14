## Dirty_flowers

考察内容是花指令，但是事实上新生在week2就学过汇编还是不敢奢望，因此实际考察内容是学习怎么nop改汇编指令。

按下shift+F12查找字符串就可以发现提示。

提示说将0x4012f1-0x401302的指令全部改成nop指令，随后在函数头位置按下U和P。

在此不对这段的花指令再进行解释，自己模拟一遍栈帧操作即可理解。



将从push eax到pop eax这一段全部nop掉。



然后在函数头位置按下U加P。再按下F5，即可正确反编译。



稍微分析一下，将几个函数重命名一下。

重命名方法：在函数名位置处按下n，进行重命名。



基本思路就是先判断长度是否是36，再进行加密，最后比较。

点进check函数可以找到密文，但是点进加密函数却发现IDA再次飘红。



可以很容易发现加密函数里面的花指令与主函数的花指令完全一样。因此再操作一遍即可。





加密函数非常简单。

```Python
#exp.py
lis=[0x02,0x05,0x13,0x13,0x02,0x1e,0x53,0x1f,0x5c,0x1a,0x27,0x43,0x1d,0x36,0x43,0x07,0x26,0x2d,0x55,0x0d,0x03,0x1b,0x1c,0x2d,0x02,0x1c,0x1c,0x30,0x38,0x32,0x55,0x02,0x1b,0x16,0x54,0x0f]
str="dirty_flower"
flag=""
for i in range(len(lis)):
    lis[i]^=ord(str[i%len(str)])
    flag+=chr(lis[i])
print(flag)
#flag{A5s3mB1y_1s_r3ally_funDAm3nta1}
```