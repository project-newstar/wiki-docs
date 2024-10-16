---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Pangbai 泰拉记（1）

函数表给了，方便做题

主函数是一个很简单的 flag 异或一个 key，但是在主函数前，有个前置函数，会对 key 进行修改

![主函数](/assets/images/wp/2024/week2/pangbai-terra1_1.png)

找到前置函数，可以对 key 按 <kbd>X</kbd> 进行交叉引用，或者直接在函数表表里找有个 `main0`

![前置函数](/assets/images/wp/2024/week2/pangbai-terra1_2.png)

前置函数里写了两个很经典的反调试

![反调试相关代码](/assets/images/wp/2024/week2/pangbai-terra1_3.png)

逻辑是：当检测到你调试的时候，你的 key 会被异或替换成错误的 key，但是如果你正常运行，key 会被替换异或成正确的 key

- 解法 1：直接把反调试函数 `nop` 掉，不太推荐，对汇编不太熟悉的话会报错

- 解法 2：改跳转<span data-desc>（推荐解法）</span>

  ![改跳转法](/assets/images/wp/2024/week2/pangbai-terra1_4.png)

  断到这里的时候，改 `jz` 为 `jnz` 或者，改 ZF 寄存器，就可以跳到正确的 key，得到正确的 flag

- 解法 3：装自动绕过反调试插件，小幽灵

  ![插件法](/assets/images/wp/2024/week2/pangbai-terra1_5.png)

  得到正确的 flag 和 key，如果还没学到调试的话，其实看逻辑应该也可能解出这题
