---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Zipmaster

拿到附件解压后看到是一个压缩包，是真加密。打开看一下结构

![](/assets/images/wp/2024/week5/Zipmaster_1.png)

发现有四个长度仅为 3 字节大小一样的文件，使用 crc 爆破来得到其中的内容 

CRC 值在压缩包中都可以看到，直接上脚本进行爆破

```
import binascii
import string

def crack_crc():
    print('-------------Start Crack CRC-------------')
    crc_list = [0x35f321cd, 0xa0bb977c, 0x4eb5f650, 0x3c90238]#文件的CRC32值列表，注意顺序
    comment = ''
    chars = string.printable
    for crc_value in crc_list:
        for char1 in chars:
            for char2 in chars:
                for char3 in chars:
                    res_char = char1 + char2 + char3#获取遍历的任意3Byte字符
                    char_crc = binascii.crc32(res_char.encode())#获取遍历字符的CRC32值
                    calc_crc = char_crc & 0xffffffff#将遍历的字符的CRC32值与0xffffffff进行与运算
                    if calc_crc == crc_value:#将获取字符的CRC32值与每个文件的CRC32值进行匹配
                        print('[+] {}: {}'.format(hex(crc_value),res_char))
                        comment += res_char
    print('-----------CRC Crack Completed-----------')
    print('Result: {}'.format(comment))

if __name__ == '__main__':
    crack_crc()
```

得到结果

```
-------------Start Crack CRC-------------
[+] 0x35f321cd: thi
[+] 0xa0bb977c: s_i
[+] 0x4eb5f650: s_k
[+] 0x3c90238: ey!
-----------CRC Crack Completed-----------
Result: this_is_key!
```

使用 this_is_key! 作为密码来解压 3077.zip，得到 114514.zip，发现无密码，可以直接解压。
得到 0721.zip 和 hint.txt。hint.txt 的内容是

```
看起来好像和某个文件是一样的欸
```

看一下 0721.zip 的结构，发现有一个原始大小和压缩包外面的 hint.zip 完全一样的文件，同时看到压缩包使用的加密算法是 ZipCrypto，那么可以使用明文攻击来恢复解密密钥。

![](/assets/images/wp/2024/week5/Zipmaster_2.png)

使用 bkcrack 来进行明文攻击。这里要注意 -c 参数后面写的是破解文件中的明文文件的绝对路径，从压缩包一层开始，我们可以看到在压缩包中还有一层名为 0721 的文件夹，所以这里路径要写 "0721/hint.txt"

![](/assets/images/wp/2024/week5/Zipmaster_3.png)

爆破出密钥之后我们直接构造一个弱密码加密的压缩包，密码是 123456，其中的内容和原来的 0721.zip 完全一样

![](/assets/images/wp/2024/week5/Zipmaster_4.png)

解压 0721.zip 之后得到一个 flag.zip，这个压缩包是个压缩包炸弹，具体原理可以自行搜索，这里我们直接使用 010editor 打开看一下它的文件结构，发现很多 base64 字符串

![](/assets/images/wp/2024/week5/Zipmaster_5.png)

提取出来解密，得到一个新的压缩包

![](/assets/images/wp/2024/week5/Zipmaster_6.png)

同样将 16 进制内容放到 010editor 中另存为一个新的压缩包，在末尾找到 hint

![](/assets/images/wp/2024/week5/Zipmaster_7.png)

这里提到看不到密码，后面给的 f4tj4oGMRuI= 其实是密码的 base64 加密后的字符串，但是解密之后发现密码是不可见字符，无法直接使用它来解压压缩包，写脚本来进行解压

```
import base64
import pyzipper

target_zip = '1.zip'
outfile = './solved'

pwd = base64.b64decode(b'f4tj4oGMRuI=')
with pyzipper.AESZipFile(target_zip, 'r') as f:
    f.pwd = pwd
    f.extractall(outfile)
```

解压后得到一个 Z1 文件，使用记事本打开得到 flag

![](/assets/images/wp/2024/week5/Zipmaster_8.png)