---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Game

<Container type='tip'>

本题主要考查 `pwntools` 库中 `recv` 和 `send` 的使用
</Container>

## 解法一

在 5 秒时间内，只能输入小于等于 10 的数，使这些数字相加大于 999.

所以手动输入就不可能了（当然也可以搞个宏什么的？）。

写 Python 脚本即可。

```python
from pwn import *

p = remote("ip", port)
for i in range(112):
    p.sendlineafter(b': ', b'9')

p.interactive()
```

## 解法二

另一种解法，可以利用 `scanf` 函数的 `%d` 格式解析特性。

`scanf` 在解析 `%d` 遇到非数字的时候，会停止解析，但不会抛出异常，会直接返回目前的结果。

比如下面这个语句：

```c
scanf("%d", &value);
```

假设 `value` 原本是 `10`，如果输入 `1a` ，那么会解析到 `1` 的输入，而忽略后面的`a`，这时候 `value` 会被变成 `1`.

如果不输入数字，直接输入 `a` ，这时候，`scanf` 什么数字也解析不到，也就无法对 `value` 做修改。是的，这时候 `value` 的值没有变！并且由于这个解析的异常，会导致**输入缓冲区无法被刷新**，也就是说**下一次调用的时候，下一个 `scanf` 会从 `a` 开始解析**。

这么一想，那么我只需要输入寥寥几个字符，比如： `10a` ，第一次调用 `scanf` 会解析出 `10`，并且给结果加上 `10`. 后面每次循环，`scanf` 会从剩下的 `a` 的位置进行解析，但是由于不是数字会被忽略，所以这个多出来的 `a` 就一直在！并且 `value` 的值没有变，保留上一次的 `10`. 因此，`scanf` 永远无法跳过这个 `a` 字符，最终就导致一直加 `10`，知道结果大于 `999`.
