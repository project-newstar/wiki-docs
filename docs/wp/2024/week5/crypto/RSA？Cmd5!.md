---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# RSA？cmd5！

## 出题思路
rsa 的签名，往往是给接收方 B 确定发送方 A 的身份用的，但如果发送方用不安全的哈希算法来计算信息的信息摘要，那么有可能被中途的窃密者 C 利用而得到明文

## 解析
这里我们得到了通过 c，s，n，e，和平时的 rsa 不同，这里多了 s，让我们看看这个 s 是什么

```
def get_MD5(m0):
    import hashlib
    md5_object = hashlib.md5(m0.encode())  # 创建MD5对象并对文本进行编码
    md5_result = md5_object.hexdigest()  # 获取加密结果
    return md5_result


def get_s(m0, d0, n0):
    hm0 = get_MD5(m0)
    hm1 = bytes_to_long(hm0.encode())
    s0 = pow(hm1, d0, n0)
    return s0
```

计算了 m0 的 md5 ``hm0``，然后将 hm0 转成整数 hm1 进行计算

```math
s = hm_1^{d} \mod n
```

那么我们有 e，理解 rsa 解密原理

```math
e·d \equiv 1 \mod phi \\
s^e \equiv (hm_1^{d})^e \equiv hm_1^{d·e} \equiv hm1^{1+k·phi} \equiv hm1 \mod n = hm1
```

那么再结合题目名字和描述，去 [cmd5.com](cmd5.com) 找 hm1 的结果:

![](/assets/images/wp/2024/week5/RSA？Cmd5!_1.png)

m 为 adm0n12

flag 为:

```
flag = 'flag{th1s_1s_my_k3y:' + m + '0x' + hashlib.sha256(m.encode()).hexdigest() + '}'
```

## Exp

```
from Crypto.Util.number import *
from gmpy2 import *

s = 7270513885194445005322518350289419893608325839878215682947885852347014936106128407554345668066935779849573932055239642406851308417046145495939362638652861562381316163080735160853285303356461796079298817982074998651099375222398758502559657988024308504098238446594559605603104540325738607539729848183025647146
e = 65537
n = 118167767283404647838357773955032661171703847685597271116789633496884884504237966404005641401909577369476550625894333528860763752286157264860218284704704444830864099870199623580368198306940575628872723737071517733553706154898255520538220530675603850372384339470410704813339357637359108745206967929184573003377


def get_flag(m0):  # 请用这个函数来转m得到flag
    import hashlib
    flag = 'flag{th1s_1s_my_k3y:' + m0 + '0x' + hashlib.sha256(m0.encode()).hexdigest() + '}'
    print(flag)


hm_int = pow(s, e, n)
hm_str = long_to_bytes(hm_int).decode()
print(hm_str)  # 86133884de98baada58a8c4de66e15b8

m = 'adm0n12'  # 通过cmd5.com查询到的结果
get_flag(m)
# flag{th1s_1s_my_k3y:adm0n120xbfab06114aa460b85135659e359fe443f9d91950ca95cbb2cbd6f88453e2b08b}
```

神秘数字：33020419294068288558474507763458223726290143000598988310562749956226420170565399347815795