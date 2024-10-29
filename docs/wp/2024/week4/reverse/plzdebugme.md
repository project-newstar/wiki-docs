---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# PlzDebugMe

本题推荐使用 frida，因为 frida 的 spawn 模式是没有 ptrace 特征的，如果是正常修改其实也是可以的，但是比较麻烦（so 和 dex 都要改）。

软件有虚拟机检测，右键复制为 frida 代码

![jadx 右键](/assets/images/wp/2024/week4/plzdebugme_1.png)

```javascript
Java.perform(function(){
let MainActivity = Java.use("work.pangbai.debugme.MainActivity");
MainActivity["isEmu"].implementation = function () {
    console.log(`MainActivity.isEmu is called`);
   // let result = this["isEmu"]();
   // console.log(`MainActivity.isEmu result=${result}`);
    return 0;
};
})
// 返回 false 去掉虚拟机检测
```

```java
if (MainActivity$$ExternalSyntheticBackport0.m(valueOf)) {
    new MaterialAlertDialogBuilder(this)
        .setTitle((CharSequence) "CheckResult")
        .setPositiveButton((CharSequence) "确定", (DialogInterface.OnClickListener) null)
        .setMessage((CharSequence) "不准拿空的骗我哟")
        .create().show();
    return;
} else if (check(new FishEnc(g4tk4y()).doEnc(valueOf))) {
    new MaterialAlertDialogBuilder(this)
        .setTitle((CharSequence) "CheckResult")
        .setPositiveButton((CharSequence) "确定", (DialogInterface.OnClickListener) null)
        .setMessage((CharSequence) "Congratulations ! ! ! \n你最棒了啦\n")
        .create().show();
    return;
} else {
    new MaterialAlertDialogBuilder(this)
        .setTitle((CharSequence) "CheckResult")
        .setPositiveButton((CharSequence) "确定", (DialogInterface.OnClickListener) null)
        .setMessage((CharSequence) "Wrong \n好像哪里有点问题呢\n")
        .create().show();
    return;
}
```

可以看出 key 是在 `g4tk4y` 调用后得到的，`FishEnc` 里是个 Blowfish，数据经过加密后传入 so 层检验最后显示结果。

```javascript
MainActivity["g4tk4y"].implementation = function () {
    console.log(`MainActivity.g4tk4y is called`);
    let result = this["g4tk4y"]();
    console.log(`MainActivity.g4tk4y result=${result}`);
    return result;
};
```

可以获得返回值 `jRLgC/Pi` 这是Key。

IDA 打开 so 查看，是个自写的加密，加密方式与 `status` 的值有关，`status` 是 Java 层的静态变量，通过 JNI 的 `GetStaticIntField` 获取的。

![so](/assets/images/wp/2024/week4/plzdebugme_2.png)

交叉引用 `qword_3800` 发现是 `Java_work_pangbai_debugme_MainActivity_g4tk4y` 初始化的字段，`status` 对应 java 层 `work/pangbai/tool/App` 类的静态变量 `status`.

![status](/assets/images/wp/2024/week4/plzdebugme_3.png)

在 jadx 里可以发现 `status = getApplicationInfo().flags & 2`. 由位运算知识可知 `status` 为 0 或者 1，编写脚本尝试即可。

静态分析很难获得 key<span data-desc>（其实也可以得到）</span>，本题在 `init_array` 设置了初始化函数来改变 key，并且 Base64 进行了换位和换表魔改，总之就是很麻烦。

```c
#include "stdio.h"
#include "string.h"

unsigned char mm[] = {0x08,0x55,0x5f,0x9c,0x70,0x19,0x56,0x40,0x04,0x69,0x67,0x58,0x85,0x52,0x3e,0xc1,0x4c,0x2d,0xdc,0x75,0xaf,0x6e,0xf0,0x06,0xa5,0x5d,0x7b,0x6e,0x2a,0xae,0x7e,0xe3,0xfd,0xfe,0xb9,0xf1,0xac,0x6b,0x96,0x06,0x43,0xbf,0x21,0x4a,0x12,0xf5,0xdb,0x47};
#define ROR(v, n) (v >> n | v << (32 - n))
#define ROL(v, n) (v << n | v >> (32 - n))
void decrypt(char *in, int num, int status)
{
    // 简单的异或和循环移位
    unsigned int *p = (unsigned int *)(in);

    p[0] ^= p[num - 1];
    p[0] = status ? ROL(p[0], num) : ROR(p[0], num);
    p[0] ^= p[num - 1];

    for (int i = num - 2; i >= 0; --i)
    {
        p[i + 1] ^= p[i];
        p[i + 1] = status ? ROL(p[i + 1], (i + 1)) : ROR(p[i + 1], (i + 1));
        p[i + 1] ^= p[i];
    }

    puts(in);
}

int main()
{
       int status = 0;
    decrypt(mm, 12, status);
 }
// XMvFLgfEmEZFtNLkyupZSOEncBR/BVaqzil47iBYYFE=
```

拿 key 和密文去 CyberChef 解密即可：[Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)Blowfish_Decrypt(%7B'option':'UTF8','string':'jRLgC/Pi'%7D,%7B'option':'Hex','string':''%7D,'ECB','Raw','Raw')&input=WE12RkxnZkVtRVpGdE5Ma3l1cFpTT0VuY0JSL0JWYXF6aWw0N2lCWVlGRT0).

Ans: `flag{U_@r4_r4v4r54_m@s74r}`
