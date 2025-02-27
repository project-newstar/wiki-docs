---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# PangBai 过家家（3）

<Container type="quote">

本题预计解数很多，校内赛道没达到预期。
</Container>

如果你用了 DIE，那应该会看到 PyInstaller 字样，这是一个 Python 库，能把 `.py` 脚本打包成 `.exe`. 如果你用 IDA 直接分析，里面大量的 Python 字样也是它的显著特征。当然，直接用 IDA 是难以分析 Python 脚本逻辑的。

对于此种程序，解包方法很多，大家可以上网查关键词 PyInstaller 解包，资料也很多。我使用的是 PyInstaller Extractor.

解包后得到一个目录。

![解包后获取的目录](/assets/images/wp/2024/week3/pangbai3_1.png)

对于这个题，我们没有加密，也没有魔改 magic，也没有在库里面藏东西，所以说我们只关心和程序同名的 `NotNormalExe.pyc`. 反编译他看逻辑即可。

<Container type="quote">

为什么一个脚本语言存在编译？这个过程叫预编译，如果感兴趣可以去查资料。
</Container>

反编译方法也有很多，如在线网站，或各种脚本，如 [tool.lu/pyc](https://tool.lu/pyc/).

此处由于字节码的版本较高，前面会反编译出错，此时大家可以直接猜这是异或，或者用另一款工具 pycdas 去看机器码，然后找到关键的异或逻辑。

![反编译结果](/assets/images/wp/2024/week3/pangbai3_2.png)

本题其实对于没接触过的人来说主打一个猜，还有查询资料的能力。

如果上面的东西没看懂，[这篇文章](https://blog.csdn.net/qq_51116518/article/details/138270490)可能会帮助你。
