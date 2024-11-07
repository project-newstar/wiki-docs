---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# drink_tea

逆向的第一步永远都是先用 DIE 查看文件基本信息，发现无壳，文件为 64 位，用 IDA64 打开

![DIE](/assets/images/wp/2024/week2/drink_tea_1.png)

主函数的逻辑很简单，就是先判读输入字符串的长度是否为 32，然后再和 key 进入一个加密函数

![主函数](/assets/images/wp/2024/week2/drink_tea_2.png)

而这个加密就是大名鼎鼎的 TEA 算法，以后我们几乎会在所有比赛看到这个算法以及它的变形

![TEA](/assets/images/wp/2024/week2/drink_tea_3.png)

解密脚本：

```c
#include <stdio.h>
#include <stdint.h>

// 解密函数
void decrypt (uint32_t* v, uint32_t* k) {
    uint32_t v0 = v[0], v1 = v[1], i;
    uint32_t delta = 2654435769;
    uint32_t sum = (32)*delta;
    uint32_t k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3];
    for (i = 0; i < 32; i++) { // 解密时将加密算法的顺序倒过来，+= 变为 -=
        v1 -= ((v0 << 4) + k2) ^ (v0 + sum) ^ ((v0>>5) + k3);
        v0 -= ((v1 << 4) + k0) ^ (v1 + sum) ^ ((v1>>5) + k1);
        sum -= delta;
    }
    v[0] = v0; v[1] = v1; // 解密后再重新赋值
}


unsigned char keys[] = "WelcomeToNewStar";
unsigned char cipher[] = { 0x78,0x20,0xF7,0xB3,0xC5,0x42,0xCE,0xDA,0x85,0x59,0x21,0x1A,0x26,0x56,0x5A,0x59,0x29,0x02,0x0D,0xED,0x07,0xA8,0xB9,0xEE,0x36,0x59,0x11,0x87,0xFD,0x5C,0x23,0x24 };
int main()
{
    unsigned char a;
    uint32_t *v = (uint32_t*)cipher;
    uint32_t *k = (uint32_t*)keys;
    // v 为要加密的数据是 n 个 32 位无符号整数
    // k 为加密解密密钥，为 4 个 32 位无符号整数，即密钥长度为 128 位

    for (int i = 0; i < 8; i += 2)
    {
        decrypt(v + i, k);
        // printf("解密后的数据：%u %u\n", v[i], v[i+1]);
    }

    for (int i = 0; i < 32; i++) {
        printf("%c", cipher[i]);
    }

    return 0;
}
```
