---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# simpleAndroid

得到一个 apk 文件，它是 Android 的安装包，类似于zip格式的压缩文件。这里使用 jadx 进行打开，首先找到 AndroidManifest.xml 文件，里面标识了 app 一开始显示的 Activity。

![找到Activity](/assets/images/wp/2024/week3/simpleandroid_1.png)

然后发现它是先经过了 `checkRoot.check()` 的判断，返回正确结果后跳转到 `CheckActivity` 这个里面。

![跳转到CheckActivity](/assets/images/wp/2024/week3/simpleandroid_2.png)

再进去查看这里的 `check()` 函数，发现它就是一个 root 检测，通过使用 `which su` 来进行检测。

![check()函数](/assets/images/wp/2024/week3/simpleandroid_3.png)

对于静态分析而言，可以不用管上面对于 root 的检测，然后直接查看 `CheckActivity` 这一个类，发现这里就是对于输入进行检测的地方，首先通过`isValidInput` 对输入的格式进行检测，然后通过 `CheckData` 来进行比较，查看这个方法，发现它是 native 层的，因此需要看 so 文件。

![CheckActivity](/assets/images/wp/2024/week3/simpleandroid_4.png)

更改后缀名为 .zip 或者直接打开压缩包的方法打开，可以看到这里存在 so 文件，这里有四种架构，是由相同的源码编译而来，可以选一个反编译效果比较好的架构进行静态分析，这里选择的架构是`x86_64`。

![so文件](/assets/images/wp/2024/week3/simpleandroid_5.png)

然后直接用 IDA 打开 so 文件，首先在函数名称列表中搜索 java，没有发现和 `CheckData` 相关的函数名称，由此怀疑不是静态注册，而是动态注册。

![函数列表](/assets/images/wp/2024/week3/simpleandroid_6.png)

因此直接搜索 `JNI_OnLoad`，发现在这里动态注册的 `CheckData` 函数，下面就是函数的位置，点击就可以看到函数了。

![JNI_OnLoad](/assets/images/wp/2024/week3/simpleandroid_7.png)

点击 `CheckData` 函数，首先修改相关参数，这里前面两个参数都是自带的，第三个参数才是我们在 java 中传入的 `String` 类型的 `input`，在这里就是 `jstring` 类型。

![jstring](/assets/images/wp/2024/week3/simpleandroid_8.png)

然后分析下面的内容。这里分为两部分来看，上面的部分就是对 `UseLess` 中的 `CHAR_DATA` 进行修改，下面就是把输入作为参数传入 `func` 函数中，然后拿到返回值。

![CheckData](/assets/images/wp/2024/week3/simpleandroid_9.png)

这里再看一下 java 层的 `UseLess` 类。然后根据 `CHAR_DATA` 的数据和下面 `func` 的代码，可以知道这是进行 base64 的变换，而由于上面 so 对于 `CHAR_DATA` 进行了更改，所以这里是换表的 base64 变换。

![UseLess](/assets/images/wp/2024/week3/simpleandroid_10.png)

那么上面的内容就理清楚了，我们的输入首先经过了 base64 的变化，然后来到了下面的代码。然后经过分析，这里就是首先前后交换位置，然后进行循环右移4位的操作，最后和密文进行比较。

![func](/assets/images/wp/2024/week3/simpleandroid_11.png)

然后我们直接从后往前进行逆运算即可。

```python
import base64
enc = [0xB2, 0x74, 0x45, 0x16, 0x47, 0x34, 0x95, 0x36, 0x17, 0xF4, 
  0x43, 0x95, 0x03, 0xD6, 0x33, 0x95, 0xC6, 0xD6, 0x33, 0x36, 
  0xA7, 0x35, 0xE6, 0x36, 0x96, 0x57, 0x43, 0x16, 0x96, 0x97, 
  0xE6, 0x16]
for i in range(len(enc)):
    enc[i] = (enc[i] << 4 | enc[i] >> 4) & 0xff
for i in range(len(enc)//2):
    tmp = enc[i]
    enc[i] = enc[len(enc) - i - 1]
    enc[len(enc) - i - 1] = tmp
cipher = ''.join([chr(e) for e in enc])
new_table = "BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/A"
old_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
print(base64.b64decode(cipher.translate(str.maketrans(new_table, old_table))))
```
