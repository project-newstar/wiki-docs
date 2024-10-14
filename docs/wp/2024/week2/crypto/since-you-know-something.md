---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# Since you konw something

- 题目

```Python
from pwn import xor
#The Python pwntools library has a convenient xor() function that can XOR together data of different types and lengths
from Crypto.Util.number import bytes_to_long

key = ?? #extremely short
FLAG = 'flag{????????}'
c = bytes_to_long(xor(FLAG,key))

print("c={}".format(c))

'''
c=218950457292639210021937048771508243745941011391746420225459726647571
'''
```

又是简单的签到题，出现了上周的老朋友`xor()`。

此题注释非常重要，希望新生能够充分地利用泄露的信息，即flag的前一部分

这道题可以关注的地方是flag的格式是明确的`flag{……`，结合注释，key极短，直接把`c`和`flag{` xor一下看看

```Python
from pwn import xor
from Crypto.Util.number import long_to_bytes

flag_head = 'flag{'
c=218950457292639210021937048771508243745941011391746420225459726647571
guess_key = xor(long_to_bytes(c),flag_head)
print(guess_key)
'''
b"nsnsnL2gVcf/xKa}1MQ8z@m'aa1`t"
'''
```

可以看到，key的前一部分是ns重复，不难猜测key就是'ns'

```Python
from pwn import xor
from Crypto.Util.number import long_to_bytes
c=218950457292639210021937048771508243745941011391746420225459726647571
key='ns'
flag = xor(long_to_bytes(c),key)
print(flag)
#b'flag{Y0u_kn0w_th3_X0r_b3tt3r}'
```

希望大家都能签到成功喵。
