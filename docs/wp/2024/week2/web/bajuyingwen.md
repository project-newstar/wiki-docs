---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# 你能在一秒内打出八句英文吗

经典脚本题，思路：先获取页面中需要输入的英文文本，再提交你获得的的文本。

这里推荐模拟 POST 请求，直接来看 EXP：

```python
import requests
from bs4 import BeautifulSoup

session = requests.Session()

url = "http://127.0.0.1/start"
response = session.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    text_element = soup.find('p', id='text')
    if text_element:
        value = text_element.get_text()
        print(f"{value}")
        submit_url = "http://127.0.0.1/submit"
        payload = {'user_input': value}
        post_response = session.post(submit_url, data=payload)
        print(post_response.text)
else:
    print(f"{response.status_code}")
```

`requests` 库可以很方便的进行会话控制，`BeautifulSoup` 可以帮你快速定位文本位置。剩下就是 POST 请求 + 打印回显。

当然，解法很多，你也可以使用 `Selenium` 等库模拟浏览器操作，又或者装一些浏览器插件凭手速把文本直接复制过去再提交，随你喜欢。
