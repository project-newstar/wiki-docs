---
# title: 故事新编
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 故事新编

## 故事新编 1

维吉尼亚密码的加密算法，只要认出来就可以秒。如果你有认真了解过维吉尼亚的加密算法，那么你应该会觉得这段加密非常眼熟；如果你熟练掌握了 AI 的使用，你也可以直接问 AI 这段加密算法像什么。

对于维吉尼亚密码的解密，这里方法并不单一，仅给出一个[可用网址](https://www.guballa.de/vigenere-solver)，用于爆破维吉尼亚密码。

## 故事新编 2

自动密钥密码，与故事新编 1 相类似。在阅读代码之后应该会发现这和维吉尼亚密码非常相似，可以去搜索一下维吉尼亚密码的变种；当然你也可以依靠 AI.

对于自动密钥密码的解密，可以依靠上面的网址修改 Cipher Variant 为 autokey，也可以在网络上找到脚本手撕。

<Container type='info'>

参考链接：[Cryptanalysis of the Autokey Cipher](http://www.practicalcryptography.com/cryptanalysis/stochastic-searching/cryptanalysis-autokey-cipher/)
</Container>
