---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# Ezencypt

打开 MainActivity 查看 Onclick 逻辑，`Enc enc = new Enc(tx)`，加密逻辑在 `Enc`

![定位到 Enc](/assets/images/wp/2024/week2/ezencrypt_1.png)

Enc 的构造函数里进行了第一次加密，代码可以看出是 ECB 模式的 AES，密钥是 MainActivity 的 title.

`doEncCheck` 函数进行加密数据检查，有 native 标签说明函数是 C 语言编写的，主体在 so 文件。

IDA 打开 so 文件，找到 `doEncCheck` 的实现

![找到 doEncCheck 的实现](/assets/images/wp/2024/week2/ezencrypt_2.png)

发现数据经过 `enc` 函数的加密，再在循环里检验

![native 层 enc 函数](/assets/images/wp/2024/week2/ezencrypt_3.png)

`enc` 里一个异或加密，一个 RC4，key是 `xork`

思路全部清楚了，写解密脚本:

```C
#include "stdio.h"
#include "string.h"

char xork[] = "meow";
#define size 256

unsigned char sbox[257] = {0};

// 初始化 s 盒
void init_sbox(char *key) {
    unsigned int i, j, k;
    int tmp;

    for (i = 0; i < size; i++) {
        sbox[i] = i;
    }

    j = k = 0;
    for (i = 0; i < size; i++) {
        tmp = sbox[i];
        j = (j + tmp + key[k]) % size;
        sbox[i] = sbox[j];
        sbox[j] = tmp;
        if (++k >= strlen((char *)key)) k = 0;
    }
}

// 加解密函数
void encc(char *key, char *data) {
    int i, j, k, R, tmp;

    init_sbox(key);

    j = k = 0;
    for (i = 0; i < strlen((char *)data); i++) {
        j = (j + 1) % size;
        k = (k + sbox[j]) % size;

        tmp = sbox[j];
        sbox[j] = sbox[k];
        sbox[k] = tmp;

        R = sbox[(sbox[j] + sbox[k]) % size];

        data[i] ^= R;
    }
}

void enc(char *in) {
    int len = strlen(in);
    for (int i = 0; i < len; ++i) {
        in[i] ^= xork[i % 4];
    }
    encc(xork, in);
}

int main() {
    unsigned char mm[] = {0xc2, 0x6c, 0x73, 0xf4, 0x3a, 0x45, 0x0e, 0xba, 0x47, 0x81, 0x2a,
                          0x26, 0xf6, 0x79, 0x60, 0x78, 0xb3, 0x64, 0x6d, 0xdc, 0xc9, 0x04,
                          0x32, 0x3b, 0x9f, 0x32, 0x95, 0x60, 0xee, 0x82, 0x97, 0xe7, 0xca,
                          0x3d, 0xaa, 0x95, 0x76, 0xc5, 0x9b, 0x1d, 0x89, 0xdb, 0x98, 0x5d};
    enc(mm);
    for (size_t i = 0; i < 44; i++) {
        putchar(mm[i]);
    }
    puts("");
}
```

将 so 层解密后的数据<span data-desc>（输出）</span>用 CyberChef 进行 Base64 和 AES 解密就行了：[Recipe](<https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)AES_Decrypt(%7B'option':'UTF8','string':'IamEzEncryptGame'%7D,%7B'option':'Hex','string':''%7D,'ECB','Raw','Raw',%7B'option':'Hex','string':''%7D,%7B'option':'Hex','string':''%7D)>).

![CyberChef](/assets/images/wp/2024/week2/ezencrypt_4.png)
