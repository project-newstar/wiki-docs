---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# UPX

## 脱壳

使用 IDA 查看文件，发现主函数很复杂。

![很复杂的主函数](/assets/images/wp/2024/week2/upx_1.png)

这时根据文件的名称和提示，和 UPX 相关联。直接搜索 UPX，可以得知它是可执行程序文件压缩器，是一种压缩壳。在程序启动时先执行 UPX 的代码，把压缩后的原文件解压后，再把控制流转到原文件。然后这里可以使用 DIE 进行查看，特征也显示为 UPX.

![DIE 的查看结果](/assets/images/wp/2024/week2/upx_2.png)

因此可以采用工具尝试能不能直接脱壳，或者使用手动脱壳的办法进行脱壳。

因为这里没有进行更改，所以可以直接使用工具 <https://github.com/upx/upx/releases/> 进行脱壳，然后发现文件的体积变大了。

![UPX 命令行程序脱壳的结果](/assets/images/wp/2024/week2/upx_3.png)

再次使用 IDA 打开脱壳后的程序，发现主函数逻辑很清晰，反汇编的结果也很明确了。

![脱壳后的 IDA View](/assets/images/wp/2024/week2/upx_4.png)
![脱壳后的反编译结果](/assets/images/wp/2024/week2/upx_5.png)

## 分析

查看这里的 `main` 函数，发现提示很明确。这里首先通过 `__isoc99_scanf` 输入内容，利用 `%22s` 和后续 for 循环中的比较，也提示输入的 flag 长度是 22 字节。然后后面输入 `s` 和 `key` 经过了 `RC4` 的函数，然后把输入 `s` 和 `data` 进行比较。

直接搜索 RC4，查阅相关文章，可以得知它是一种流加密算法，它通过字节流的方式依次加密明文中的每一个字节，解密的时候也是依次对密文中的每一个字节进行解密。这里直接点击 RC4 函数，查看其内部是怎么实现的。

在下面可以看到 RC4 函数的实现，它实现调用 `init_sbox` 函数对于 `a2`，也就是上面从 `main` 函数传入的 `key` 进行一系列处理，然后获取 `a1`，也就是从 `main` 函数传入的输入 `s`，然后在 for 循环中，循环遍历 `a1` 的每一位，然后使用一个异或进行处理。

![RC4 函数的实现](/assets/images/wp/2024/week2/upx_6.png)

因此我们可以理清楚这个程序的逻辑，我们首先进行了输入，然后程序将我们的输入和内置的密钥及进行 RC4 加密，然后将加密的结果和内置的数据进行比较，如果一样的话，说明我们的输入是正确的。

因此分别点击 `main` 函数中的 `key` 和 `data` 变量，找到了内置的密钥和比对密文，之后就可以写脚本获取 flag 了。

点击 `key` 一直进行寻找发现了密钥 `NewStar`.

![key 变量](/assets/images/wp/2024/week2/upx_7.png)

点击 `data` 发现这里没有值。

![没有值的 data 变量](/assets/images/wp/2024/week2/upx_8.png)

然后对 `data` 按 `x` 进行交叉引用，发现存在另外的函数也用到了 `data` 这个数据。

![data 的交叉引用](/assets/images/wp/2024/week2/upx_9.png)

直接点击这个使用 `data` 数据的函数 `before_main` 中，可以发现这里对 `data` 进行了赋值操作。

![before_main 函数里的赋值操作](/assets/images/wp/2024/week2/upx_10.png)

这里再次交叉引用 `before_main` 函数，可以发现它在 `.init_array` 段被调用。这个段里存放着的是在 `main` 函数执行前执行的代码，可以搜索相关资料进一步掌握。这里只需要知道它是在 `main` 函数之前被调用的，那么它就是最后进行比对的密文，我们直接拿出来就行。

![.init_array 段](/assets/images/wp/2024/week2/upx_11.png)

## 方法一

既然已经获取了密文和密钥，那么我们完全可以套用 RC4 的算法来解密。因为 RC4 是流密码，它的本质就是异或，而 `a ^ b = c`，`c ^ b = a`，由此可以直接把内置的密文作为输入，然后使用算法进行解密。

```C
#include <stdio.h>
#include <string.h>

unsigned char sbox[256] = {0};
const unsigned char* key = (const unsigned char*)"NewStar";
unsigned char data[22] = {-60, 96,  -81, -71, -29, -1,  46,  -101, -11,  16,  86,
                          81,  110, -18, 95,  125, 125, 110, 43,   -100, 117, -75};

void swap(unsigned char* a, unsigned char* b) {
    unsigned char tmp = *a;
    *a = *b;
    *b = tmp;
}

void init_sbox(const unsigned char key[]) {
    for (unsigned int i = 0; i < 256; i++) sbox[i] = i;
    unsigned int keyLen = strlen((const char*)key);
    unsigned char Ttable[256] = {0};
    for (int i = 0; i < 256; i++) Ttable[i] = key[i % keyLen];
    for (int j = 0, i = 0; i < 256; i++) {
        j = (j + sbox[i] + Ttable[i]) % 256;
        swap(&sbox[i], &sbox[j]);
    }
}

void RC4(unsigned char* data, unsigned int dataLen, const unsigned char key[]) {
    unsigned char k, i = 0, j = 0, t;
    init_sbox(key);
    for (unsigned int h = 0; h < dataLen; h++) {
        i = (i + 1) % 256;
        j = (j + sbox[i]) % 256;
        swap(&sbox[i], &sbox[j]);
        t = (sbox[i] + sbox[j]) % 256;
        k = sbox[t];
        data[h] ^= k;
    }
}

int main(void) {
    unsigned int dataLen = sizeof(data) / sizeof(data[0]);
    RC4(data, dataLen, key);
    for (unsigned int i = 0; i < dataLen; i++) {
        printf("%c", data[i]);
    }
    return 0;
}
```

## 方法二

上面是写代码进行解密，还可以直接在动调中把输入替换为密文，也可以进行解密。

首先在输入后和比对时按 <kbd>F2</kbd> 下断点。

![下断点](/assets/images/wp/2024/week2/upx_12.png)

然后进行动调，首先随便输入数据，然后程序在断点处停下（这里颜色改变了，说明断在这里了），输入 `s` 也显示我们输入的数据。

![我们的输入](/assets/images/wp/2024/week2/upx_13.png)

![IDA 中看到的 s 内的值](/assets/images/wp/2024/week2/upx_14.png)

然后先点击 data，找到 data 数据。然后使用 `sheift + e` 直接取出 data 的相关数据。

![data 数据](/assets/images/wp/2024/week2/upx_15.png)

然后可以先找到输入 `s` 的起始地址（`0x56201B813040` 需要你自己动调时的地址），然后使用 `shift + F2` 调出 `IDAPython`脚本窗口，然后使用 python 脚本进行修改，最后点击 Run 进行执行。然后可以发现左侧的输入 `s` 数据改变了。

![修改 s 的数据](/assets/images/wp/2024/week2/upx_16.png)

```python
from ida_bytes import *
# addr = 0x56201B813040  # 这里需要填写自己动调时得到的地址
enc = [0xC4, 0x60, 0xAF, 0xB9, 0xE3, 0xFF, 0x2E, 0x9B, 0xF5, 0x10,
       0x56, 0x51, 0x6E, 0xEE, 0x5F, 0x7D, 0x7D, 0x6E, 0x2B, 0x9C,
       0x75, 0xB5]
for i in range(22):
    patch_byte(addr + i, enc[i])
print('Done')
```

或者可以手动 **右键 » Patching » Change byte** 进行修改。

![手动修改 s 的数据 1](/assets/images/wp/2024/week2/upx_17.png)

![手动修改 s 的数据 2](/assets/images/wp/2024/week2/upx_18.png)

修改完之后，使用快捷键 <kbd>F9</kbd> 让程序直接运行，然后它会断在我们之前下的第二个断点处。

![断在第二个断点处](/assets/images/wp/2024/week2/upx_19.png)

这时再看我们的输入 `s`，会发现它经过 RC4 的再次加密（其实是解密，因为 RC4 是流密码，加密解密的流程一摸一样），呈现出来了 flag.

![解密后的 flag](/assets/images/wp/2024/week2/upx_20.png)

这里按 `a` 就可以转化为字符串的形式，这个就是最后的 flag 了。

![flag](/assets/images/wp/2024/week2/upx_21.png)

## 方法三

上面可以知道 RC4 流密码的最后一步就是异或了，那么我们可以在动调的过程中，把这个异或的值拿出来，然后直接把密文和这个异或的数据进行异或即可。

这里先找到 RC4 的加密函数处，在这个最后一步的异或处按 Tab 转化为汇编窗格形式。

![RC4 的加密函数](/assets/images/wp/2024/week2/upx_22.png)

然后在这个汇编的异或处下断点。下面展示了两种汇编代码的视图方式，可以按空格进行相互转换。

![汇编的视图方式 1](/assets/images/wp/2024/week2/upx_23.png)

![汇编的视图方式 2](/assets/images/wp/2024/week2/upx_24.png)

这里不知道两个参数 `al` 和 `[rbp+var_9]` 分别代表什么，因此我们可以先直接动调，断在这里的时候再去看看数值。这里动调需要注意，因为 RC4 根据输入的字符个数进行逐个加密的，所以我们需要输入和密文长度相等的字符长度，也就是 22 个字符才可以获得完整的异或值。

这里发现 `al` 存储的就是我们的输入数据（我这里输入 22 个字符 `a`，它的十六进制就是 `0x61`），然后由此可以知道 `[rbp+var_9]` 存储的就是需要异或的值。因为它经过了22次循环，所以每次异或的值都可能不一样，但是都只在一个函数中，`rbp` 的值应该不变，所以可以直接使用条件断点的方式，把 `[rbp+var_9]` 中的值取出来，或者也可以在下面的 `mov [rdx], al` 中下条件断点，把异或后的 `al` 值提取出来

![动调查看 al](/assets/images/wp/2024/week2/upx_25.png)

对于在 `[rbp+var_9]` 下条件断点，首先寻找这个数据的地址。点击进去可以发现数据存储在栈上，当前的数据为 `0xA2`.

![[rbp+var_9] 的内容](/assets/images/wp/2024/week2/upx_26.png)

然后回来，在断点处 **右键 » Edit breakpoint**，然后点击三个点就可调出 IDAPython 的窗口，然后我这里使用 Python 脚本，所以在下面选择语言为 Python.

![调出 IDAPython 窗口 1](/assets/images/wp/2024/week2/upx_27.png)

![调出 IDAPython 窗口 2](/assets/images/wp/2024/week2/upx_28.png)

然后在 Script 中写入 IDAPython 脚本，点击左右两边的 OK 即可。

![IDAPython 脚本](/assets/images/wp/2024/week2/upx_29.png)

```python
import ida_bytes
# addr = 0x7FFE7DB58887 # 这里也是一样，需要自己动调找相应的地址
print(get_byte(addr), end=',')
```

<span data-desc>（可以忽略的一步）</span>最后在下面 retn 中下断点，防止 for 循环结束后直接退出，这一步没有太大的必要，只是方便后续的数据查看。

![retn 下断点](/assets/images/wp/2024/week2/upx_30.png)

然后最为关键的就是在下面 Output 栏中打印的数据了，可以看到打印出了每次异或的值，但是因为断点的时候第一数据已经运行到了，所以没有第一个数据，但是我们之前查看 `[rbp+var_9]` 的时候观察到了，所以自己把这个 `0xA2` 给加上即可。

![异或的值](/assets/images/wp/2024/week2/upx_31.png)

然后直接把之前获得的密文和这个数据进行异或即可。

```python
xor_data = [0xa2, 12, 206, 222, 152, 187, 65, 196, 140,
            127, 35, 14, 5, 128, 48, 10, 34, 59, 123, 196, 74, 200]
enc = [0xC4, 0x60, 0xAF, 0xB9, 0xE3, 0xFF, 0x2E, 0x9B, 0xF5, 0x10,
       0x56, 0x51, 0x6E, 0xEE, 0x5F, 0x7D, 0x7D, 0x6E, 0x2B, 0x9C,
       0x75, 0xB5]
for i in range(len(enc)):
    enc[i] ^= xor_data[i]
print(''.join(chr(e) for e in enc))
```

这里我们还可以在下一条语句 `mov [rdx], al` 中下条件断点

![下条件断点](/assets/images/wp/2024/week2/upx_32.png)

```python
import idc
al = idc.get_reg_value("rax")
print(al, end=',')
```

然后得到了假数据经过异或后的数据，然后我们可以利用异或的特性获得 flag.

![假数据](/assets/images/wp/2024/week2/upx_33.png)

```python
input_data = 'aaaaaaaaaaaaaaaaaaaaaa'
after_xor = [195, 109, 175, 191, 249, 218, 32, 165, 237, 30,
             66, 111, 100, 225, 81, 107, 67, 90, 26, 165, 43, 169]
enc = [0xC4, 0x60, 0xAF, 0xB9, 0xE3, 0xFF, 0x2E, 0x9B, 0xF5, 0x10,
       0x56, 0x51, 0x6E, 0xEE, 0x5F, 0x7D, 0x7D, 0x6E, 0x2B, 0x9C,
       0x75, 0xB5]
for i in range(len(enc)):
    enc[i] ^= after_xor[i] ^ ord(input_data[i])
print(''.join(chr(e) for e in enc))
```

## 方法四

这里观察主函数，发现存在 `exit` 函数，它的功能就是关闭所有文件，终止正在执行的进程，中间的status 参数就是退出码，可以通过 `echo $?` 来进行获取。

![exit 函数相关代码](/assets/images/wp/2024/week2/upx_34.png)

然后观察 `status` 就是循环的下标，因此可以知道它是单字节判断的，若是某个字节判断错了就直接退出，同时返回第几个字节判断错了。由此根据退出码，我们可以直接进行爆破处理。

这里就是进行爆破的代码，`tqdm` 只是为了直观显示，可以删去相关代码。

```python
from pwn import *
from tqdm import tqdm
context(arch='amd64', os='linux', log_level="error")

str = string.printable
flag = b"a"*22
tmp = 0

for i in tqdm(range(len(flag))):
    for j in str.encode():
        p = process("./upx")
        new_flag = flag[:i] + chr(j).encode() + flag[i+1:]
        p.sendafter(b"input your flag:\n", new_flag)
        p.wait()
        exit_code = p.poll()
        p.close()
        # 判断退出码是否变化，最后 flag 正确是退出码为 0(return 0)，所以需要另外处理
        if exit_code > tmp or (exit_code == 0 and tmp != 0):
            flag = new_flag
            tmp = exit_code
            break
print(f"[*] Successfully get the flag : {flag}")
```

然后爆破一分钟左右就跑出结果了。

![爆破结果](/assets/images/wp/2024/week2/upx_35.png)
