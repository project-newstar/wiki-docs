---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# 不用谢喵

请看之前week3参考文档所提供的链接的第一张图

<https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation>

![AES相关流程](/assets/images/wp/2024/week3/buyongxiemiao_1.png)

总体流程即AES_CBC加密，AES_ECB解密

ECB是最简单的块密码加密模式，加密前根据加密块大小（如AES为128位）分成若干块，之后将每块使用相同的密钥单独加密，解密同理。

CBC模式对于每个待加密的密码块在加密前会先与前一个密码块的密文异或然后再用加密器加密。第一个明文块与一个叫初始化向量(IV)的数据块异或。

所以这题所用方式解完密之后的信息，和明文的唯一区别就在于：有没有和前一个密码块的密文异或，这里密文都给了，IV也给了，异或一下即可。

$part1=D(c_0)⊕IV$

$part2=D(c_1)⊕c_0$

```python
from Crypto.Util.number import long_to_bytes as l2b , bytes_to_long as b2l

c = 0xf2040fe3063a5b6c65f66e1d2bf47b4cddb206e4ddcf7524932d25e92d57d3468398730b59df851cbac6d65073f9e138
d = 0xf9899749fec184d81afecd35da430bc394686e847d72141b3a955a4f6e920e7d91cb599d92ba2a6ba51860bb5b32f23b

part1=l2b( b2l(l2b(c)[0:16]) ^ b2l(l2b(d)[16:32]))
part2=l2b( b2l(l2b(c)[16:32]) ^ b2l(l2b(d)[32:48]))

print(part1+part2)
```

出题人的初衷的是让大家不用key解，因为需要用到key的部分都帮大家用好了，所以不用谢。

结果居然被新生非预期了，我自己都忘记我设置的key是啥了，他居然能猜出来😅，下次一定要随机生成key！
