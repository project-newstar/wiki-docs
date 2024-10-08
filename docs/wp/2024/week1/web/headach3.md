---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# headach3

题目源码如下：

```php
<?php
header("fl3g: flag{You_Ar3_R3Ally_A_9ooD_d0ctor}");
echo "My HEAD(er) aches!!!!!<br>HELP ME DOCTOR!!!<br>";
?>
```

打开浏览器开发者工具的「网络」（Network）选项卡，刷新网页，点击第一个请求，查看响应头，可以看到 flag.

<Container type="info">

关于响应头的具体内容，参见 [HTTP 标头](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)、[响应标头](https://developer.mozilla.org/en-US/docs/Glossary/Response_header)。
</Container>
