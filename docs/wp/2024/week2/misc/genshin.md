---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 你也玩原神吗？

题目描述如下

> 如果你玩原神，那么你看得懂这些提瓦特文字吗?

打开附件，发现 GIF 有白色一闪而逝

可以利用一些[网站](https://tool.lu/gifsplitter/)或工具分离 GIF 的帧，可以发现某一帧是特殊字符

![特殊字符](/assets/images/wp/2024/week2/genshin_1.gif)

联系题目描述，找到[提瓦特文字对照表](https://www.miyoushe.com/ys/article/30743427)

左下角文字解密后是 `doyouknowfence`，提示是「栅栏密码」，右下角文字就是密文

用栅栏密码解密工具解出来，得到 flag

<Container type='quote'>

其实可以肉眼看出来，提瓦特字母一般是反转了 180° 的艺术字<s>（我知道你肯定能用这个做出来，因为——你也玩原神！）</s>
</Container>
