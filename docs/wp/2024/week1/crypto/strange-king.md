---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Strange King

题目描述如下：

> 某喜欢抽锐刻 5 的皇帝想每天进步一些，直到他娶了个模，回到原点，全部白给😅
> 这是他最后留下的讯息：`ksjr{EcxvpdErSvcDgdgEzxqjql}`，flag 包裹的是可读的明文

不难猜到是魔改的凯撒密码。题目描述中的数字 5 就是**初始偏移量**。「每天进步一些」代表**偏移量在递增**，对 26 取模后会到原点，偏移量每次增加是 26 的因子，此处是 2.

<Container type="quote">

况且出题人连 `{}` 都没删掉，把 `ksjr` 和 `flag` 对照起来看也能看出来了吧！可以说是非常简单的古典密码了）
</Container>

根据以上信息即可解出 flag

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
print("flag:", flag)
```
