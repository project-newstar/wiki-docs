---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Lock

由于程序告诉你每次输入对了多少个字符，所以可以逐位爆破。Cython 是一个把 Python 转化为 C 语言的项目，其逆向极为复杂，出题人也并不能完全掌握，所以这里不讲解。

EXP：

```python
import check

password = "00000000000000000000"
table = "123456789abcdef"
ret = check.check(password)

password_list = list(password)

for i in range(20):
    for j in range(16):
        newpassword_list = password_list.copy()
        newpassword_list[i] = table[j]
        newpassword = ''.join(newpassword_list)
        # print(newpassword)
        newret = check.check(newpassword)
        if newret == ret + 1:
            password_list[i] = table[j]
            ret = newret
            break
        elif newret == ret:
            continue
        elif newret == ret - 1:
            break

print(newpassword)
```
