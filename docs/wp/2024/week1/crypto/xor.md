---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# xor

最简单的签到，但对完完全全零基础的同学来说，这道题涉及的知识点可能还不少，我们看题。

```python
from pwn import xor
from Crypto.Util.number import bytes_to_long

key = b'New_Star_CTF'
flag='flag{*******************}'

m1 = bytes_to_long(bytes(flag[:13], encoding='utf-8'))
m2 = flag[13:]

c1 = m1 ^ bytes_to_long(key)
c2 = xor(key, m2)
print('c1=',c1)
print('c2=',c2)
```

首先使用了两个 Python 库，pwntools 是 CTF nc 题的交互好工具<span data-desc>（不仅仅是 pwn 题，密码、Misc 等的交互题也会用到）</span>，pycryptodome 是一个好用的密码学加密库。确保 Python 环境正常后，在终端中分别输入以下命令进行安装：

```bash
pip install pwntools
pip install pycryptodome
```

这些库未来它们会是你的好帮手。这里展现的功能都只是冰山一角，具体功能是什么我们稍后解释。

此处出题人刻意地定义 `key` 为 `bytes` 类型而 `flag` 为 `str` 类型。Python3 重要的特性之一是对字符串和二进制数据流做了明确的区分。文本总是 `Unicode`，由 `str` 类型表示，二进制数据则由 `bytes` 类型表示。Python3 不会以任意隐式的方式混用 `str` 和 `bytes`，你不能拼接字符串和字节流，也无法在字节流里搜索字符串（反之亦然），也不能将字符串传入参数为字节流的函数（反之亦然）。需要进行编码操作才能转换为 `bytes` 类型进行后续的运算。大家可以通过这两篇博客详细了解：

- [浅析 Python3 中的 bytes 和 str 类型](https://www.cnblogs.com/chownjy/p/6625299.html)
- [pwntools: 类型转换](https://blog.csdn.net/m0_53932372/article/details/120171733)

接着是 `bytes_to_long` 函数，从函数名也可以猜出来，这个函数是将 `bytes` 类型转换为数字，具体是怎么转换的？大家可以尝试的将最后的整数变成 16 进制来看，举个例子：

```python
text=b'NewStar'
print(bytes_to_long(text))
# 22066611359080818
print(hex(bytes_to_long(text)))
# 0x4e657753746172
```

从 16 进制来看就很直观了 `0x4e657753746172`，`N` 的 ASCII 值是 $\mathrm{78=0x4e}$，`e` 的 ASCII值是 $\mathrm{101=0x65}$，以此类推，直观来看就是把 16 进制数串连起来，我们就把 `bytes` 类型的 `NewStar` 转成了一个整数。

那么我们终于进入了这道题考查的重点——**异或（XOR）**，在某些书中也称它为「模二加」。异或运算的规则是：

- 当两个输入位不同时，输出为 `1`
- 当两个输入位相同时，输出为 `0`

就像不进位的模2加法一样。异或在编程语言中常用符号 `^` 表示，在数学中常用符号 $\oplus$ 表示。

当两个数异或之后，异或的结果与其中一个数再异或即可得到剩下的一个数字。此处我使用了 2 种方式进行异或：一个是直接用 `^` 对整数进行运算；另一个是用 pwntools 中的 `xor()`，它可以将不同类型和长度的数据进行异或。

既然已知 `key` 的话，利用异或的性质，再异或 1 次即可获得 flag.

```python
from pwn import xor
from Crypto.Util.number import long_to_bytes,bytes_to_long

key = b'New_Star_CTF'

c1 = 8091799978721254458294926060841
c2 = b';:\x1c1<\x03>*\x10\x11u;'

m1 = c1 ^ bytes_to_long(key)
m2 = xor(key, c2)

flag = long_to_bytes(m1) + m2
print(flag)
# flag{0ops!_you_know_XOR!}
```
