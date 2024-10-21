---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# flowering-shrubs

使用IDA可以看到程序完全无法分析。

再仔细看汇编可以发现，题目似乎在随机位置处添加了同一个花指令。

因此我们要使用idapython自动去除花指令。

```python
# remove_flower.py
import idc
import idaapi
startaddr=0x1100
endaddr=0x15FF
lis=[0x50, 0x51, 0x52, 0x53, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x5B, 0x48, 0x81, 0xC3, 0x12, 0x00, 0x00, 0x00, 0x48, 0x89, 0x5C, 0x24, 0x18, 0x48, 0x83, 0xC4, 0x18,0xC3]
#这个for循环是关键点，检测以当前地址开始的27个字节是否符合lis列表的内容。
for i in range(startaddr,endaddr):
    flag=True
    for j in range(i,i+27):
        if idc.get_wide_byte(j)!=lis[j-i]:
            flag=False
    if flag==True:
        for addr in range(i,i+27):
            idc.patch_byte(addr,0x90) # 将这部分内容全部nop掉

for i in range(startaddr,endaddr):# 取消函数定义
    idc.del_items(i)
for i in range(startaddr,endaddr):       # 添加函数定义
    if idc.get_wide_dword(i)==0xFA1E0FF3: #endbr64
        idaapi.add_func(i)
```

lis列表中的内容就是花指令的全部内容。

在ida中 file->script file 选择该py文件即可。

或者在file->script command中将上面的代码粘贴进来。

之后再按下F5即可看到清晰的伪代码。

部分函数我进行了重命名。在函数名位置处按下N即可重命名。

![去花指令后反编译](/assets/images/wp/2024/week3/flowering-shrubs_1.png)

关键内容就是encrypt函数。

![encrypt函数](/assets/images/wp/2024/week3/flowering-shrubs_2.png)

这里是用了递归，一共40个字节，每四个字节为1组，一共10组，通过get_next_rand函数得到下一组加密字节。仔细分析一下即可写出脚本。

```python
#solve.py
lis=[0x54,0xf4,0x20,0x47,0xfc,0xc4,0x93,0xe6,0x39,0xe0,
     0x6e,0x00,0xa5,0x6e,0xaa,0x9f,0x7a,0xa1,0x66,0x39,
     0x76,0xb7,0x67,0x57,0x3d,0x95,0x61,0x22,0x55,0xc9,
     0x3b,0x4e,0x4f,0xe8,0x66,0x08,0x3d,0x50,0x43,0x3e]
str="uarefirst."
offset_buf=[0,4,32,12,8,24,16,20,28,36]
#offset_buf就是通过动态调试提取出每一轮get_next_rand函数的返回值得到的
truekey=[]
for i in str:
    truekey.append(ord(i))
def decrypt(offset,key):
    a=lis[offset]
    b=lis[offset+1]
    c=lis[offset+2]
    d=lis[offset+3]
    flagc=((c+key)&0xff)^b
    flagd=c^d
    flaga=a^d^key
    flagb=((b-key)&0xff)^flaga^key
    lis[offset]=flaga
    lis[offset+1]=flagb
    lis[offset+2]=flagc
    lis[offset+3]=flagd
for i in range(10):
    decrypt(offset_buf[i],truekey[i])
print(bytes(lis).decode('utf-8'))
# flag{y0u_C4n_3a51ly_Rem0v3_CoNfu510n-!!}
```
