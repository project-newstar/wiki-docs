## Pangbai泰拉记（1）

函数表给了，方便做题

主函数是一个很简单的flag异或一个key，但是在主函数前，有个前置函数，会对key进行修改

![image (28)](assets/images/wp/2024/week2/image (28).png)

找到前置函数，可以对key按x进行交叉引用，或者直接在函数表表里找有个main0

![image (29)](assets/images/wp/2024/week2/image (29).png)

前置函数里写了两个很经典的反调试

![image (30)](assets/images/wp/2024/week2/image (30).png)

逻辑是，当检测到你调试的时候，你的key会被异或替换成错误的key，但是如果你正常运行，key会被替换异或成正确的key。

解法1：直接把反调试函数nop掉，不太推荐，对汇编不太熟悉的话会报错

解法2（推荐解法）：改跳转

![image (31)](assets/images/wp/2024/week2/image (31).png)

断到这里的时候，改jz为jnz或者，改ZF寄存器，就可以跳到正确的key，得到正确的flag

解法3：装自动绕过反调试插件，小幽灵

![image (32)](assets/images/wp/2024/week2/image (32).png)

正确的flag和key，如果还没学到调试的话，其实看逻辑应该也可能出这题。