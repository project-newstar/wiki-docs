---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# SecertsOfKawaii

程序在java层有混淆，用jeb可以简单去除，也可以通过断点调试弄清代码执行流程

![JEB](/assets/images/wp/2024/week3/secrets-of-kawaii_1.png)

Java层只有一个rc4，key是rc4k4y，加密后base64一下传到so层，值在so层检查

ida打开发现有upx的字符串，猜测是upx壳

![upx脱壳](/assets/images/wp/2024/week3/secrets-of-kawaii_2.png)

脱壳后

![脱壳后](/assets/images/wp/2024/week3/secrets-of-kawaii_3.png)

一个xxtea，密钥是`meow~meow~tea~~~`

![xxtea](/assets/images/wp/2024/week3/secrets-of-kawaii_4.png)

写出对应的解密脚本：

```c
#include "stdio.h"
#include "string.h"
#include "stdlib.h"
typedef unsigned int uint32_t;

#define size 256

unsigned char sbox[257] = {0};

// 初始化s表
void init_sbox(char *key)
{
    unsigned int i, j, k;
    int tmp;

    for (i = 0; i < size; i++)
    {
        sbox[i] = i;
    }

    j = k = 0;
    for (i = 0; i < size; i++)
    {
        tmp = sbox[i];
        j = (j + tmp + key[k]) % size;
        sbox[i] = sbox[j];
        sbox[j] = tmp;
        if (++k >= strlen((char *)key))
            k = 0;
    }
}

// 加解密函数
void rc4(char *key, char *data)
{
    int i, j, k, R, tmp;

    init_sbox(key);

    j = k = 0;
    for (i = 0; i < strlen((char *)data); i++)
    {
        j = (j + 1) % size;
        k = (k + sbox[j]) % size;

        tmp = sbox[j];
        sbox[j] = sbox[k];
        sbox[k] = tmp;

        R = sbox[(sbox[j] + sbox[k]) % size];

        data[i] ^= R;
    }
}

#define DELTA 0xdeadbeef
#define MX (((z >> 5 ^ y << 3) + (y >> 3 ^ z << 2)) ^ ((sum ^ y) + (key[(p & 3) ^ e] ^ z)))
void btea(uint32_t *v, int n, uint32_t const key[4])
{
    uint32_t y, z, sum;
    unsigned p, rounds, e;
    if (n > 1) /* Coding Part */
    {
        rounds = 6 + 52 / n;
        sum = 0;
        z = v[n - 1];
        do
        {
            sum += DELTA;
            e = (sum >> 2) & 3;
            for (p = 0; p < n - 1; p++)
            {
                y = v[p + 1];
                z = v[p] += MX;
            }
            y = v[0];
            z = v[n - 1] += MX;
        } while (--rounds);
    }
    else if (n < -1)
    {
        n = -n;
        rounds = 6 + 52 / n;
        sum = rounds * DELTA;
        y = v[0];
        do
        {
            e = (sum >> 2) & 3;
            for (p = n - 1; p > 0; p--)
            {
                z = v[p - 1];
                y = v[p] -= MX;
            }
            z = v[n - 1];
            y = v[0] -= MX;
            sum -= DELTA;
        } while (--rounds);
    }
}

char base64[65] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
void decodeBase64(char *str, int len, char **in)
{

    char ascill[129];
    int k = 0;
    for (int i = 0; i < 64; i++)
    {
        ascill[base64[i]] = k++;
    }
    int decodeStrlen = len / 4 * 3 + 1;
    char *decodeStr = (char *)malloc(sizeof(char) * decodeStrlen);
    k = 0;
    for (int i = 0; i < len; i++)
    {
        decodeStr[k++] = (ascill[str[i]] << 2) | (ascill[str[++i]] >> 4);
        if (str[i + 1] == '=')
        {
            break;
        }
        decodeStr[k++] = (ascill[str[i]] << 4) | (ascill[str[++i]] >> 2);
        if (str[i + 1] == '=')
        {
            break;
        }
        decodeStr[k++] = (ascill[str[i]] << 6) | (ascill[str[++i]]);
    }
    decodeStr[k] = '\0';
    *in = decodeStr;
}

int main()
{
    // upx -d 解包libmeow1.so，加密只有一个xxtea，但是被魔改过，对照网上的代码修改可以解密
    // 密文为64位数组，熟悉数据处理的话，直接指针传参就行了
   long long secrets[6] =
        {
            6866935238662214623LL,
            3247821795433987330LL,
            -3346872833356453065LL,
            1628153154909259154LL,
            -346581578535637655LL,
            3322447116203995091LL};
    // 不同编译器long的大小可能不同，用long long表示64位数据
    // 为什么是12？12代表有12段32位数据（也就是6个long long类型数据)，负数时进行解密操作所以传-12
    
    btea((unsigned int *)secrets, -12, ( unsigned int *)"meow~meow~tea~~~");

    char *flag;
    // 解base64
    decodeBase64((char *)secrets, strlen((char *)secrets), &flag);
   
    // 解rc4
    rc4("rc4k4y", (char *)flag);

    // 这里为了方便理解这么些，想方便可以直接puts(flag);
    char *tmp = (char *)flag;
    for (size_t i = 0; i < 48; i++)
    {
        putchar(tmp[i]);
    }
    puts("");
}
```
