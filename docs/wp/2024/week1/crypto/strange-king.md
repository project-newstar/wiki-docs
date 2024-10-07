---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Strange King

ksjr{EcxvpdErSvcDgdgEzxqjql}  
根据题目描述不难猜到是魔改的凯撒密码，我感觉提示非常简单且好猜。题目描述中的数字**5**就是**初始偏移量**。"每天进步一些"代表**偏移量在递增**，对26取模后会到原点，偏移量每次增加是26的因子，此处是2。  
（况且出题人连{}都没删掉，把ksjr和flag对照起来看也能看出来了吧！可以说是非常简单的古典密码了）  
根据以上信息即可解出flag  

```python
def caesar(c, shift):
    result = ""
    for i in c:
        if i.isalpha():
            start = ord('A') if i.isupper() else ord('a')
            result += chr((ord(i) - start - shift) % 26 + start)
        else:
            result += i
        shift += 2
    return result

c = 'ksjr{EcxvpdErSvcDgdgEzxqjql}'
shift = 5 

flag = caesar(c, shift)
print("flag:",flag)
```
