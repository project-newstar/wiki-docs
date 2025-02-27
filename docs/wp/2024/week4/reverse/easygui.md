---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# easygui

建议新生在做这道题时了解一下 Windows 的消息循环机制。

首先使用 IDA 打开程序。

![sub_140001490](/assets/images/wp/2024/week4/easygui_1.png)

`sub_140001490` 这个函数就是回调函数，点进即可发现主要逻辑。

![反调试](/assets/images/wp/2024/week4/easygui_2.png)

首先有一个反调试函数，可以让 `IsDebuggerPresent` 函数返回值 patch 成 `0`，或者直接 nop 掉这个函数的调用。

![主逻辑](/assets/images/wp/2024/week4/easygui_3.png)

在这部分就是读取文本框的字符串，然后加密比较的环节。

点进 `encrypt` 函数可以加密算法比较复杂。

```c
unsigned __int64 __fastcall sub_140001000(__int64 a1, int a2, void *a3)
{
  signed __int64 v4; // rbx
  int v6; // edi
  signed __int64 v7; // rsi
  signed __int64 i; // rcx
  signed __int64 j; // rdx
  signed __int64 k; // r11
  unsigned __int8 v11; // r9
  unsigned __int8 v12; // r10
  char v13; // cl
  char v14; // r8
  __int16 v15; // kr00_2
  __int64 v16; // r14
  int v17; // ebx
  int v18; // ecx
  __int64 v19; // rdx
  __int64 v20; // rax
  __int64 v21; // rdx
  int v22; // r8d
  _BYTE *v23; // rcx
  unsigned __int64 result; // rax
  int v25; // r8d
  signed __int64 m; // r10
  int v27; // r9d
  char v28[16]; // [rsp+20h] [rbp-E0h] BYREF
  __int128 v29[16]; // [rsp+30h] [rbp-D0h] BYREF
  char Src[304]; // [rsp+130h] [rbp+30h] BYREF
  char v31[256]; // [rsp+260h] [rbp+160h] BYREF

  v4 = a2;
  memset(Src, 0, 0x12Cui64);
  v6 = 0;
  v7 = v4;
  if ( v4 > 0 )
  {
    for ( i = 0i64; i < v4; ++i )
      Src[i] = *(a1 + 2 * i);
  }
  v29[0] = _mm_load_si128(&xmmword_1400033C0);
  v29[1] = _mm_load_si128(&xmmword_1400033D0);
  v29[2] = _mm_load_si128(&xmmword_140003390);
  v29[3] = _mm_load_si128(&xmmword_1400033E0);
  v29[4] = _mm_load_si128(&xmmword_1400033B0);
  v29[5] = _mm_load_si128(&xmmword_140003400);
  v29[6] = _mm_load_si128(&xmmword_1400033F0);
  v29[7] = _mm_load_si128(&xmmword_1400033A0);
  if ( v4 > 0 )
  {
    for ( j = 0i64; j < v4; ++j )
      Src[j] = *(v29 + Src[j]);
    for ( k = 0i64; k < v4; k += 4i64 )
    {
      v11 = Src[k + 3];
      v12 = Src[k + 2];
      v13 = (Src[k] >> 3) | (32 * v11);
      v14 = 32 * Src[k + 1];
      Src[k + 1] = (32 * Src[k]) | (Src[k + 1] >> 3);
      v15 = 32 * v12;
      Src[k + 2] = v14 | HIBYTE(v15);
      Src[k] = v13;
      Src[k + 3] = v15 | (v11 >> 3);
    }
  }
  v16 = 256i64;
  strcpy(v28, "easy_GUI");
  v17 = 0;
  memset(v31, 0, sizeof(v31));
  v18 = 0;
  v19 = 0i64;
  do
  {
    *(v29 + v19) = v18;
    v20 = v18 & 7;
    ++v19;
    ++v18;
    Src[v19 + 303] = v28[v20];
  }
  while ( v18 < 256 );
  v21 = 0i64;
  do
  {
    v22 = *(v29 + v21);
    v17 = (v22 + v31[v21] + v17) % 256;
    v23 = v29 + v17;
    result = *v23;
    *(v29 + v21++) = result;
    *v23 = v22;
    --v16;
  }
  while ( v16 );
  v25 = 0;
  if ( v7 > 0 )
  {
    for ( m = 0i64; m < v7; ++m )
    {
      v6 = (v6 + 1) % 256;
      v27 = *(v29 + v6);
      v25 = (v27 + v25) % 256;
      *(v29 + v6) = *(v29 + v25);
      *(v29 + v25) = v27;
      Src[m] ^= *(v29 + (v27 + *(v29 + v6)));
    }
    return memcpy(a3, Src, v7);
  }
  return result;
}
```

总体的加密算法逻辑是这样的，首先对所有字符进行查表代换，之后每四个字节为一组，每组整体循环右移 3 位，最后使用 RC4 算法进行加密。

在 `encrypt` 函数之后就是密文比较，由于 VS 的优化导致比较难提取数据，最后写出解密脚本。

```c
#include<stdio.h>
#include<string.h>
#include<stdlib.h>
void shiftright(unsigned char* input) {
    unsigned char a, b, c, d;
    a = input[0];
    b = input[1];
    c = input[2];
    d = input[3];
    unsigned char a2, b2, c2, d2;
    a2 = (a << 3) | (b >>5 );
    b2 = (b << 3) | (c >> 5);
    c2 = (c << 3) | (d >> 5);
    d2 = (d << 3) | (a >> 5);
    input[0] = a2;
    input[1] = b2;
    input[2] = c2;
    input[3] = d2;
}
void subbytes_reverse(unsigned char* input, int length) {
    char table_reverse[] = { 18, 66, 86, 4, 12, 35, 16, 124, 21, 84, 109, 22, 64, 108, 34, 70, 93, 106, 46, 23, 62, 37, 58, 47, 73, 126, 27, 68, 61, 123, 117, 14, 3, 20, 80, 127, 118, 38, 36, 105, 79, 43, 45, 103, 29, 100, 48, 26, 67, 0, 115, 53, 104, 9, 97, 17, 92, 49, 8, 33, 42, 51, 87, 72, 119, 44, 11, 15, 54, 91, 90, 57, 94, 101, 121, 25, 114, 116, 122, 65, 88, 31, 24, 5, 2, 82, 30, 50, 112, 28, 63, 81, 113, 77, 85, 60, 96, 98, 71, 39, 40, 10, 52, 120, 69, 74, 78, 13, 55, 75, 99, 56, 7, 59, 83, 111, 1, 125, 19, 110, 6, 95, 41, 89, 102, 107, 76, 32 };
    for (int i = 0; i < length; i++) {
        input[i] = table_reverse[input[i]];
    }
}
void rc4_init(unsigned char* s, unsigned char* key, int Len_k)
{
    int i = 0, j = 0;
    char k[256] = { 0 };
    unsigned char tmp = 0;
    for (i = 0; i < 256; i++) {
        s[i] = i;
        k[i] = key[i % Len_k];
    }
    for (i = 0; i < 256; i++) {
        j = (j + s[i] + k[i]) % 256;
        tmp = s[i];
        s[i] = s[j];
        s[j] = tmp;
    }
}
void rc4_crypt(unsigned char* Data, int Len_D, unsigned char* key, int Len_k)
{
    unsigned char s[256];
    rc4_init(s, key, Len_k);
    int i = 0, j = 0, t = 0;
    int k = 0;
    unsigned char tmp;
    for (k = 0; k < Len_D; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        tmp = s[i];
        s[i] = s[j];
        s[j] = tmp;
        t = (s[i] + s[j]) % 256;
        Data[k] = Data[k] ^ s[t];
    }
}
void decrypt() {
    unsigned char char_array[] = { 0xdf ,0xc7         ,0x4d         ,0x14         ,0xc1         ,0xec         ,0x08         ,0xe4         ,0x5f         ,0x3f         ,0x03         ,0xb4         ,0x90         ,0x4a         ,0xb9         ,0x8f         ,0x8f         ,0xfa         ,0x71         ,0x43         ,0xc7         ,0xf1         ,0x9d         ,0xdd         ,0x4f         ,0xc0         ,0x12         ,0x44         ,0x5c         ,0x9d         ,0x88         ,0x36         ,0x2d         ,0x16         ,0x1d         ,0xed         ,0xbc         ,0xef         ,0xbb         ,0x5b         ,0x9f         ,0x77         ,0xeb         ,0x58 };
    unsigned char key[] = "easy_GUI";
    int keylength = 8;
        int length=strlen((const char*)char_array);
    rc4_crypt(char_array, length, key, keylength);
    for (int i = 0; i < length; i += 4) {
        shiftright(char_array + i);
    }
    subbytes_reverse(char_array, length);
    printf("%s",char_array);
}
int main(){
        decrypt();
        return 0;
}
// flag{GU!_r3v3R5e_3nG1n3er1ng_i5_v3ry_s1mpl3}
```

其中 `subbytes_reverse` 函数中的 `table_reverse` 表可以由下面这段代码得到

```python
table = [49, 116, 84, 32, 3, 83, 120, 112, 58, 53, 101, 66, 4, 107, 31, 67, 6, 55, 0, 118, 33, 8, 11, 19, 82, 75, 47, 26, 89, 44, 86, 81, 127, 59, 14, 5, 38, 21, 37, 99, 100, 122, 60, 41, 65, 42, 18, 23, 46, 57, 87, 61, 102, 51, 68, 108, 111, 71, 22, 113, 95, 28, 20, 90, 12, 79, 1, 48, 27, 104, 15, 98, 63, 24, 105, 109, 126, 93, 106, 40, 34, 91, 85, 114, 9, 94, 2, 62, 80, 123, 70, 69, 56, 16, 72, 121, 96, 54, 97, 110, 45, 73, 124, 43, 52, 39, 17, 125, 13, 10, 119, 115, 88, 92, 76, 50, 77, 30, 36, 64, 103, 74, 78, 29, 7, 117, 25, 35]
table_reverse = [0] * 128
for i in range(128):
    table_reverse[table[i]] = i
print(table_reverse)
'''
[18, 66, 86, 4, 12, 35, 16, 124, 21, 84, 109, 22, 64, 108, 34, 70, 93, 106, 46, 23, 62, 37, 58, 47, 73, 126, 27, 68, 61, 123, 117, 14, 3, 20, 80, 127, 118, 38, 36, 105, 79, 43, 45, 103, 29, 100, 48, 26, 67, 0, 115, 53, 104, 9, 97, 17, 92, 49, 8, 33, 42, 51, 87, 72, 119, 44, 11, 15, 54, 91, 90, 57, 94, 101, 121, 25, 114, 116, 122, 65, 88, 31, 24, 5, 2, 82, 30, 50, 112, 28, 63, 81, 113, 77, 85, 60, 96, 98, 71, 39, 40, 10, 52, 120, 69, 74, 78, 13, 55, 75, 99, 56, 7, 59, 83, 111, 1, 125, 19, 110, 6, 95, 41, 89, 102, 107, 76, 32]
'''
```

最后的 flag: `flag{GU!_r3v3R5e_3nG1n3er1ng_i5_v3ry_s1mpl3}`

![flag](/assets/images/wp/2024/week4/easygui_4.png)
