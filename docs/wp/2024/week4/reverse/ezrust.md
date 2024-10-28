---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# EZRUST

友情建议一下，最好用IDA8.3及以上分析

通过string找到主逻辑

![主逻辑](/assets/images/wp/2024/week4/ezrust_1.png)

明显看到stdin.read_line输入数据，v6就是密文，后面有个判断前面一大段密文相等的逻辑，还能发现有一个loverust字符串

因为rust语言的特性，很难找到具体功能的实现逻辑在哪，调用链有点复杂，实际的加密逻辑与主逻辑包了非常多层，所以采用动调

![进行基本分析](/assets/images/wp/2024/week4/ezrust_2.png)

进行基本分析后可以得出loverust是加密的关键字串，也可以说是key

可以直接在loverust上下一个硬件断点，然后开始动调

![动调](/assets/images/wp/2024/week4/ezrust_3.png)

可以看到IDA直接断在了加密上

![加密循环](/assets/images/wp/2024/week4/ezrust_4.png)

对函数按x做多次交叉引用可以发现加密循环

![回到加密处](/assets/images/wp/2024/week4/ezrust_5.png)

回到加密处

查看变量可以发现a3就是我们的输入，a1是loverust，v5是指针

![加密逻辑](/assets/images/wp/2024/week4/ezrust_6.png)

这里查看v5的来源，v7值是8-1=7，就是一个key[7 - (i % 8)]的逻辑

也就是loverust是逆序与输入进行异或、

写解密脚本

```python
en=[
    0x12, 0x1f, 0x14, 0x15, 0x1e, 0x0f, 0x5f, 0x39, 0x2b, 0x33, 0x07, 0x41,
    0x3a, 0x4f, 0x5f, 0x03, 0x10, 0x2c, 0x35, 0x06, 0x3a, 0x04, 0x1a, 0x1f,
    0x00, 0x0e
  ]
s=''
key='loverust'
for i in range(len(en)):
  s+=chr(en[i]^ord(key[7 - (i % 8)]))
print(s)
```
