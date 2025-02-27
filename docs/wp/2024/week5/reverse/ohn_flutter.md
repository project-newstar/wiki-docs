---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Ohn_flutter!!!

blutter 反编译得到 `asm` 文件夹和 `ida_script` 文件夹，`ida_script` 在 IDA 里先加载 `ida_dart_struct.h` 头文件再运行 `addNames.py` 脚本可得到大部分符号

ASM 里查看 EditView.dart 可发现 `check` 函数单代码全为汇编

```asm
_ check(/* No info */) {
    ** addr: 0x2d50c0, size: 0x74
    0x2d50c0: EnterFrame
        0x2d50c0: stp             fp, lr, [SP, #-0x10]!
        0x2d50c4: mov             fp, SP
    0x2d50c8: AllocStack(0x10)
        0x2d50c8: sub             SP, SP, #0x10
    0x2d50cc: CheckStackOverflow
        0x2d50cc: ldr             x16, [THR, #0x38]  ; THR::stack_limit
        0x2d50d0: cmp             SP, x16
        0x2d50d4: b.ls            #0x2d512c
    0x2d50d8: ldr             x0, [fp, #0x18]
    0x2d50dc: LoadField: r1 = r0->field_1b
        0x2d50dc: ldur            w1, [x0, #0x1b]
    0x2d50e0: DecompressPointer r1
        0x2d50e0: add             x1, x1, HEAP, lsl #32
    0x2d50e4: r0 = LoadClassIdInstr(r1)
        0x2d50e4: ldur            x0, [x1, #-1]
        0x2d50e8: ubfx            x0, x0, #0xc, #0x14
    0x2d50ec: ldr             x16, [fp, #0x10]
    0x2d50f0: stp             x16, x1, [SP]
    0x2d50f4: mov             lr, x0
    0x2d50f8: ldr             lr, [x21, lr, lsl #3]
    0x2d50fc: blr             lr
    0x2d5100: tbnz            w0, #4, #0x2d5118
    0x2d5104: r0 = "Right"
        0x2d5104: add             x0, PP, #0xc, lsl #12  ; [pp+0xc1f0] "Right"
        0x2d5108: ldr             x0, [x0, #0x1f0]
    0x2d510c: LeaveFrame
        0x2d510c: mov             SP, fp
        0x2d5110: ldp             fp, lr, [SP], #0x10
    0x2d5114: ret
        0x2d5114: ret
    0x2d5118: r0 = "wrong"
        0x2d5118: add             x0, PP, #0xc, lsl #12  ; [pp+0xc1f8] "wrong"
        0x2d511c: ldr             x0, [x0, #0x1f8]
    0x2d5120: LeaveFrame
        0x2d5120: mov             SP, fp
        0x2d5124: ldp             fp, lr, [SP], #0x10
    0x2d5128: ret
        0x2d5128: ret
    0x2d512c: r0 = StackOverflowSharedWithoutFPURegs()
        0x2d512c: bl              #0x4cf3ec  ; StackOverflowSharedWithoutFPURegsStub
    0x2d5130: b               #0x2d50d8
  }
```

汇编难以阅读逻辑，在 IDA 里函数列表搜索 `check`，发现了: `ohn_flutter_EditView_MyEditTextState::check_2d50c0@<X0>`

明显是刚刚的 `check` 函数，交叉引用溯源找到主逻辑得到 `ohn_flutter_EditView_MyEditTextState::_anon_closure_2d4f08`

```c
__int64 __usercall ohn_flutter_EditView_MyEditTextState::_anon_closure_2d4f08@<X0>(
        __int64 a1@<X2>,
        __int64 a2@<X3>,
        __int64 a3@<X4>,
        __int64 a4@<X5>,
        __int64 a5@<X6>,
        __int64 a6@<X7>,
        __int64 a7@<X8>)
{
  __int64 v7; // x15
  __int64 v8; // x22
  __int64 v9; // x26
  _QWORD *v10; // x27
  unsigned __int64 v11; // x28
  __int64 v12; // x29
  __int64 v13; // x30
  __int64 v14; // x29
  _QWORD *v15; // x15
  __int64 v16; // x0
  __int64 v17; // x1
  __int64 v18; // x0
  __int64 v19; // x2
  __int64 KeyStub_2fe3bc; // x0
  _QWORD *v21; // x15
  __int64 v22; // x0
  _QWORD *v23; // x15
  __int64 IVStub_2fe1b8; // x0
  _QWORD *v25; // x15
  __int64 v26; // x0
  __int64 AESStub_2fe1ac; // x0
  _QWORD *v28; // x15
  __int64 v29; // x0
  __int64 EncrypterStub_2d5468; // x0
  _QWORD *v31; // x15
  __int64 v32; // x0
  __int64 *v33; // x15
  __int64 base64; // x0
  __int64 v35; // x16
  __int64 *v36; // x15
  __int64 v37; // x1
  __int64 v38; // x2
  __int64 v39; // x3
  __int64 v40; // x4
  __int64 v41; // x5
  __int64 v42; // x6
  __int64 v43; // x7
  __int64 v44; // x8
  __int64 v45; // x0
  _QWORD *v46; // x15
  __int64 v47; // x1
  __int64 v48; // x0

  *(_QWORD *)(v7 - 16) = v12;
  *(_QWORD *)(v7 - 8) = v13;
  v14 = v7 - 16;
  v15 = (_QWORD *)(v7 - 80);
  v16 = *(_QWORD *)(v14 + 16);
  v17 = *(unsigned int *)(v16 + 23) + (v11 << 32);
  if ( (unsigned __int64)v15 <= *(_QWORD *)(v9 + 56) )
    StackOverflowSharedWithoutFPURegsStub_4cf3ec(v16, v17, a1, a2, a3, a4, a5, a6, a7);
  v18 = *(unsigned int *)(v17 + 15) + (v11 << 32);
  v19 = *(unsigned int *)(v17 + 11) + (v11 << 32);
  *(_QWORD *)(v14 - 8) = v19;
  *v15 = *(unsigned int *)((char *)&dword_14 + *(unsigned int *)(v19 + 15) + (v11 << 32) + 3) + (v11 << 32);
  v15[1] = v18;
  *(_QWORD *)(v14 - 16) = ohn_flutter_doi_::jumppp_2fe3c8();
  KeyStub_2fe3bc = AllocateKeyStub_2fe3bc();
  *(_QWORD *)(v14 - 24) = KeyStub_2fe3bc;
  *v21 = v10[6202];
  v21[1] = KeyStub_2fe3bc;
  v22 = encrypt_encrypt_Encrypted::ctor_fromUtf8_2fe1c4();
  *v23 = v10[6203];
  *(_QWORD *)(v14 - 32) = dart_core_Object::toString_3421e0(v22);
  IVStub_2fe1b8 = AllocateIVStub_2fe1b8();
  *(_QWORD *)(v14 - 40) = IVStub_2fe1b8;
  *v25 = *(_QWORD *)(v14 - 32);
  v25[1] = IVStub_2fe1b8;
  v26 = encrypt_encrypt_Encrypted::ctor_fromUtf8_2fe1c4();
  AESStub_2fe1ac = AllocateAESStub_2fe1ac(v26);
  *(_QWORD *)(v14 - 32) = AESStub_2fe1ac;
  *v28 = *(_QWORD *)(v14 - 24);
  v28[1] = AESStub_2fe1ac;
  v29 = encrypt_encrypt_AES::ctor_2d5474();
  EncrypterStub_2d5468 = AllocateEncrypterStub_2d5468(v29);
  *(_DWORD *)(EncrypterStub_2d5468 + 7) = *(_QWORD *)(v14 - 32);
  v31[1] = *(_QWORD *)(v14 - 16);
  v31[2] = EncrypterStub_2d5468;
  *v31 = *(_QWORD *)(v14 - 40);
  v32 = encrypt_encrypt_Encrypter::encrypt_2d51f0();
  *(_QWORD *)(v14 - 16) = *(unsigned int *)(*(_QWORD *)(v14 - 8) + 15LL) + (v11 << 32);
  *v33 = v32;
  base64 = encrypt_encrypt_Encrypted::get_base64_2d5134();
  v35 = *(_QWORD *)(v14 - 16);
  *v36 = base64;
  v36[1] = v35;
  v45 = ohn_flutter_EditView_MyEditTextState::check_2d50c0(base64, v37, v38, v39, v40, v41, v42, v43, v44);
  v47 = *(_QWORD *)(v14 - 16);
  *(_DWORD *)(v47 + 19) = v45;
  if ( (*(unsigned __int8 *)(v45 - 1) & ((unsigned __int64)*(unsigned __int8 *)(v47 - 1) >> 2) & HIDWORD(v11)) != 0 )
    WriteBarrierWrappersStub_4cdd20();
  v48 = *(unsigned int *)((char *)&qword_18 + *(unsigned int *)(*(_QWORD *)(v14 - 8) + 15LL) + (v11 << 32) + 7)
      + (v11 << 32);
  *v46 = v10[62];
  v46[1] = v48;
  flutter_src_widgets_editable_text_TextEditingController::text_assign_2d5054();
  return v8;
}
```

查看 `ohn_flutter_doi_::jumppp_2fe3c8()`，里面的函数调用了 `ohn_flutter_drink_drink::encrypt_2fe460` 是一个单独加密

在 `ohn_flutter_drink_drink::_encryptUint32List_2fe5ec` 可以看到如下特征

```c
v15 = 52
v19 = v15 / v17 + 6;

LODWORD(v33) = v30
+ ((((*(__int64 *)(v13 - 72) >> 5) ^ (4 * v42)) + ((v42 >> 3) ^ (16 * *(_QWORD *)(v13 - 72)))) ^ ((*(_QWORD *)(v13 - 96) ^ v42) + (*(_DWORD *)(*(_QWORD *)(v13 + 16) + 4 * (*(_QWORD *)(v13 - 80) & 3LL ^ (unsigned int)*(_QWORD *)(v13 - 88)) + 23) ^ *(_QWORD *)(v13 - 72))));
```

一眼就发现是 XXTEA

查看 `ohn_flutter_doi_::jumppp_2fe3c8` 下面的逻辑

- `KeyStub_2fe3bc` `IVStub_2fe1b8` ``AESStub_2fe1ac`

明显是 AES 加密特征

最后是 `base64` 和 `check`

```c
__int64 __usercall ohn_flutter_EditView_MyEditTextState::check_2d50c0@<X0>(
        __int64 a1@<X0>,
        __int64 a2@<X1>,
        __int64 a3@<X2>,
        __int64 a4@<X3>,
        __int64 a5@<X4>,
        __int64 a6@<X5>,
        __int64 a7@<X6>,
        __int64 a8@<X7>,
        __int64 a9@<X8>)
{
  __int64 v9; // x15
  __int64 v10; // x21
  __int64 v11; // x26
  __int64 v12; // x27
  __int64 v13; // x28
  __int64 v14; // x29
  __int64 v15; // x30
  __int64 v16; // x29
  _QWORD *v17; // x15
  __int64 v18; // x1
  __int64 v19; // x0

  *(_QWORD *)(v9 - 16) = v14;
  *(_QWORD *)(v9 - 8) = v15;
  v16 = v9 - 16;
  v17 = (_QWORD *)(v9 - 32);
  if ( (unsigned __int64)v17 <= *(_QWORD *)(v11 + 56) )
    StackOverflowSharedWithoutFPURegsStub_4cf3ec(a1, a2, a3, a4, a5, a6, a7, a8, a9);
  v18 = *(unsigned int *)(*(_QWORD *)(v16 + 24) + 27LL) + (v13 << 32);
  v19 = (unsigned int)*(_QWORD *)(v18 - 1) >> 12;
  *v17 = *(_QWORD *)(v16 + 16);
  v17[1] = v18;
  if ( ((*(__int64 (**)(void))(v10 + 8 * v19))() & 0x10) != 0 )
    return *(_QWORD *)(v12 + 49656);
  else
    return
```

`check` 函数里的判断函数没办法直接查看需要动调，同时其他加密的密钥和 IV 也无法直接得到。

在 `ohn_flutter_EditView_MyEditTextState::_anon_closure_2d4f08` 函数开头下断点，然后用 IDA 单步调试在判断处拿到密文，Key 和 IV 都可以轻易拿到，XXTEA 的 Key 在那个加密的特征处（进行 `&3` 运算的附近）也可以拿到

```c
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
typedef unsigned int uint32_t;
#define DELTA 0x9e3779b9
#define MX (((z>>5^y<<2) + (y>>3^z<<4)) ^ ((sum^y) + (key[(p&3)^e] ^ z)))
// 容易魔改
void btea(uint32_t * v, int n, uint32_t const key[4]) {
// v 为数据，n 为数据长度 (负时为解密)，key 为密钥
    uint32_t y,  z, sum;  unsigned p, rounds, e;
    if (n > 1)
    /* Coding Part */
    {
        rounds = 6 + 52 / n;
        sum = 0;
        z = v[n - 1];
        do {
            sum += DELTA;
            e = (sum >> 2) & 3;
            for (p = 0; p < n - 1; p++) {
                y = v[p + 1];
                z = v[p] += MX;
            }
            y = v[0];
            z = v[n - 1] += MX;
        } while (-- rounds );
    } else if (n < -1)
    /* Decoding Part */
    {
        n = -n;
        rounds = 6 + 52 / n;
        sum = rounds * DELTA;
        y = v[0];
        do {
            e = (sum >> 2) & 3;
            for (p = n - 1; p > 0; p--) {
                z = v[p - 1];
                y = v[p] -= MX;
            }
            z = v[n - 1];
            y = v[0] -= MX;
            sum -= DELTA;
        } while (-- rounds );
    }
}

// base64 加密
char base64[65] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
void encodeBase64(char* str,int len,char** in){

    // 读取 3 个字节 zxc，转换为二进制 01111010 01111000 01100011
    // 转换为 4 个 6 位字节，011110 100111 100001 100011
    // 不足 8 位在前补 0，变成 00011110 00100111 00100001 00100011
    // 若剩余的字节数不足以构成 4 个字节，补等号
    int encodeStrLen = 1 + (len/3)*4 ,k=0;
    encodeStrLen += len%3 ? 4 : 0;
    char* encodeStr = (char*)(malloc(sizeof(char)*encodeStrLen));
    for(int i=0;i<len;i++){
        if(len - i >= 3){
            encodeStr[k++] = base64[(unsigned char)str[i]>>2];
            encodeStr[k++] = base64[((unsigned char)str[i]&0x03)<<4 | (unsigned char)str[++i]>>4];
            encodeStr[k++] = base64[((unsigned char)str[i]&0x0f)<<2 | (unsigned char)str[++i]>>6];
            encodeStr[k++] = base64[(unsigned char)str[i]&0x3f];
        }else if(len-i == 2){
            encodeStr[k++] = base64[(unsigned char)str[i] >> 2];
            encodeStr[k++] = base64[((unsigned char)str[i]&0x03) << 4 | ((unsigned char)str[++i] >> 4)];
            encodeStr[k++] = base64[((unsigned char)str[i]&0x0f) << 2];
            encodeStr[k++] = '=';
        }else{
            encodeStr[k++] = base64[(unsigned char)str[i] >> 2];
            encodeStr[k++] = base64[((unsigned char)str[i] & 0x03) << 4];                                                                                                              // 末尾补两个等于号
            encodeStr[k++] = '=';
            encodeStr[k++] = '=';
        }
    }
    encodeStr[k] = '\0';
    *in = encodeStr;
}

/**
 * 解码既编码的逆过程，先找出编码后的字符在编码之前代表的数字
 * 编码中将 3 位个字符变成 4 个字符，得到这 4 个字符的每个字符代表的原本数字
 * 因为在编码中间每个字符用 base64 码表进行了替换，所以这里要先换回来
 * 在对换回来的数字进行位运算使其还原成 3 个字符
 */
void decodeBase64(char* str,int len,char** in){

    char ascill[129];
    int k = 0;
    for(int i=0;i<64;i++){
        ascill[base64[i]] = k++;
    }
    int decodeStrlen = len / 4 * 3 + 1;
    char* decodeStr = (char*)malloc(sizeof(char)*decodeStrlen);
    k = 0;
    for(int i=0;i<len;i++){
        decodeStr[k++] = (ascill[str[i]] << 2) | (ascill[str[++i]] >> 4);
        if(str[i+1] == '='){
            break;
        }
        decodeStr[k++] = (ascill[str[i]] << 4) |  (ascill[str[++i]] >> 2);
        if(str[i+1] == '='){
            break;
        }
        decodeStr[k++] = (ascill[str[i]] << 6) | (ascill[str[++i]]);
    }
    decodeStr[k] = '\0';
    *in = decodeStr;
}

int main(){
// 本题需要使用 blutter 析 so 文件，具体教程可以百度
// 密文在 Java 层 "/oIHOyDg6s6yqVd26AnYJ6u2YjPcMhawTe93+AJPAUiwGZM4KWvXjsib1tcnZHSnglaaVpbcOaTtNoMCr5od2A=="
// Key 和 IV 都很容易得到，拿去 AES 解密

char mm[]="v9JIAiQs2XJBl49MyDo4dEMac6RvSLxy+YKcj6OdvpcQB3pt";
char *mm1;
char *mm2;

decodeBase64(mm,strlen(mm),&mm2);
// 动调出key
char key[]="ohn_flutterkkkkk";
// XXTEA解密
// -(strlen(mm)/4*3/4) 是根据 base64 的长度计算 mm2 的真实长度再取反，取反代表解密模式
btea((uint32_t*)mm2,-(strlen(mm)/4*3/4),(uint32_t*)key);
puts(mm2);
}
```

<Container type='tip'>

上面代码中提到的 AES 解密，可参见 [CyberChef Recipe](<https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)AES_Decrypt(%7B'option':'UTF8','string':'12345678901234561234567890123456'%7D,%7B'option':'UTF8','string':'1234567890123456'%7D,'CBC','Raw','Raw',%7B'option':'Hex','string':''%7D,%7B'option':'Hex','string':''%7D)&input=L29JSE95RGc2czZ5cVZkMjZBbllKNnUyWWpQY01oYXdUZTkzK0FKUEFVaXdHWk00S1d2WGpzaWIxdGNuWkhTbmdsYWFWcGJjT2FUdE5vTUNyNW9kMkE9PQ>).
</Container>

**Ans:** `flag{U_@r4_F1u774r_r4_m@ster}`
