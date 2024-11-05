---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# MY_ARM

静态编译

使用 qemu 进行动态调试，可以参考[这篇文章](https://xz.aliyun.com/t/10214)进行动态调试

程序本身没有加很多混淆，因此其实静态分析也可以

本身使用 TEA 进行加密，并且没有进行任何魔改

唯一需要注意的是有一个函数在 `main` 函数执行前执行了，覆盖了密文数组和密钥数

![main 函数前执行的函数](/assets/images/wp/2024/week5/MY_ARM_1.png)

这个函数是真正运行的，其他几个函数都是用来迷惑的。

写出解密代码

```c
// exp.c
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>
unsigned int delta=0x9e3779b9;
int rounds=32;
unsigned char true_enc[]={0x44,0xcb,0xf8,0xa0,0xcf,0x83,0x2f,0xf8,0xc2,0x48,0x5e,0xa5,0x0a,0xe0,0x26,0x7a,0xc9,0x54,0xe3,0xf1,0x15,0x99,0x7d,0x68,0xe8,0x16,0x88,0xf8,0x86,0x8e,0x87,0x90,0x98,0x62,0xb0,0x3a,0x8b,0xe7,0xcf,0xcb,0x50,0x0f,0x8f,0x57,0x65,0x3c,0x9e,0xc3,0x84,0x2b,0xe9,0xbb,0xa2,0x2c,0x8a,0x12,0xf5,0x03,0x8f,0xdb,0xe2,0xf8,0x82,0x84};
unsigned int true_key[4] = {0x11223344, 0x55667788, 0x9900aabb, 0xccddeeff};
void tea_decrypt(unsigned int *v,unsigned int *k) {
    int v0 = v[0], v1 = v[1];
    int sum = delta * rounds;
    for (int i = 0; i < rounds; i++) {
        v1 -= ((v0 << 4) + k[2]) ^ (v0 + sum) ^ ((v0 >> 5) + k[3]);
        v0 -= ((v1 << 4) + k[0]) ^ (v1 + sum) ^ ((v1 >> 5) + k[1]);
        sum -=delta;
    }
    v[0] = v0;
    v[1] = v1;
}
void tea(unsigned int* v,unsigned int* k){
    for(int i=0;i<16;i+=2){
        tea_decrypt(v+i,k);
    }
}

int main(){
    tea((unsigned int*)true_enc, true_key);
    for(int i=0;i<64;i++){
        printf("%c",true_enc[i]);
    }
    printf("\n");
    return 0;
}
```
