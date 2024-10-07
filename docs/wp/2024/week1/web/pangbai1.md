---
title: WriteUp
titleTemplate: ':title - NewStar CTF 2024'
---

# PangBai 过家家（1）

## 序章

过完开头的剧情，自动跳转到第一关。如果没有跳转或跳转出现问题，可以手动访问路径/start以快速进入关卡界面。

## 第一关

第一关界面如下

![cnily真的好可爱](/assets/images/wp/2024/week1/pangbai1_1.png)

下方文字给出了提示「Header」。打开浏览器的开发者工具，在「网络」（Network）选项卡中找到网页的初始请求，查看响应标头，有一个 Location 字段

![cnily真的好可爱](/assets/images/wp/2024/week1/pangbai1_2.png)

访问这个路径，进入下一关。

## 第二关

题目提示了「Query」和`ask=miao` ，其中「Query」指的就是 GET 请求的请求参数，在URL中路径后面`?`开始就是查询字段，用`&`分隔，遇到特殊字符需要进行 URL Encode 转义。因此我们访问路径`/?ask=miao`即可进入下一关。

## 第三关

第三关给出的提示为：用另一种方法（Method）打声招呼（`say=hello`）吧 ~  
我们在浏览器地址栏输入网址，默认的方法就是 GET，常见的方法还有 POST，在一些表单提交等界面会使用它，在 HTTP 请求报文中就是最开始的那个单词。因此本关用 POST 请求发一个 `say=hello` 的查询即可。  
POST 的查询类型有很多种，通过 HTTP 报文中的 `Content-Type` 指定，以告诉服务端用何种方式解析报文 Body 的内容。

| Content-Type | 描述 |
| --- | --- |
| application/x-www-form-urlencoded | 和 GET 查询字段的写法一样，开头不需要`?`，用`&`符号连接各查询参数，遇到特殊字符需要进行转义。 |
| application/json | Body 给出一个 JSON 格式的数据，服务端会解析它。 |
| multipart/form-data | 表单字段，一般用于有文件等复杂类型的场景。 |

我们可以用任意方式，那么我们选择用`application/x-www-form-urlencoded`发送个`say=hello`的请求包即可。  
使用浏览器的HackBar插件：

![cnily真的好可爱](/assets/images/wp/2024/week1/pangbai1_3.png)

> 注意：如果使用 HackBar 插件，请在 Modify Header 一栏中删除 Cookie 字段（删除后会自动采用浏览器当前的 Cookie），或者请手动更新该字段。因为 Cookie 携带着关卡信息，如果不更新该值，将永远停留在同一关。

你也可以用 BurpSuite、Yakit、VSCode REST Client 插件、curl 等工具进行发送原始 HTTP 报文，然后将返回的 `Set-Cookie` 字段手动存入浏览器的 Cookie 中。

```HTTP
POST /?ask=miao HTTP/1.1
Host: 8.147.132.32:36002
Content-Type: application/x-www-form-urlencoded
Content-Length: 9
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6M30.hc4vKSnI5KZxNFjD27qrms3z6TL6LRnF1qSk_t3ohOI

say=hello
```

## 第四关

来到这一关后由于 302 跳转可能会变成 GET 请求，再次用 POST 请求（携带新 Cookie）访问，得到提示「Agent」和`Papa`，应当想到考查的是 HTTP 请求头中的 `User-Agent` Header. 题目的要求比较严格，`User-Agent` 必须按照标准格式填写（参见 <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent>），因此需携带任意版本号发送一个 POST 请求：

```HTTP
POST /?ask=miao HTTP/1.1
Host: 8.147.132.32:36002
Content-Type: application/x-www-form-urlencoded
User-Agent: Papa/1.0
Content-Length: 9
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6M30.hc4vKSnI5KZxNFjD27qrms3z6TL6LRnF1qSk_t3ohOI

say=hello
```

此时提示需要将`say` 字段改成「玛卡巴卡阿卡哇卡米卡玛卡呣」（不包含引号对`「」`），中文需要转义（HackBar会自动处理中文的转义）。因此最终的报文为：

```HTTP
POST /?ask=miao HTTP/1.1
Host: 8.147.132.32:36002
Content-Type: application/x-www-form-urlencoded
User-Agent: Papa/1.0
Content-Length: 9
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6NH0.MDhNM30leuBXKpPLgqDnzmK3Zf2sAGdx8VtGcMf21kU

say=%E7%8E%9B%E5%8D%A1%E5%B7%B4%E5%8D%A1%E9%98%BF%E5%8D%A1%E5%93%87%E5%8D%A1%E7%B1%B3%E5%8D%A1%E7%8E%9B%E5%8D%A1%E5%91%A3
```

如果使用 Hackbar，配置如下：

![cnily真的好可爱](/assets/images/wp/2024/week1/pangbai1_4.png)

## 第五关

由于 302 跳转的缘故变成了 GET 请求，我们再用 POST 请求（携带新 Cookie）访问，得到的提示为：或许可以尝试用修改（PATCH）的方法提交一个补丁包（`name="file"; filename="*.zip"`）试试。  
这是要求我们使用 PATCH 方法发送一个 ZIP 文件。  
这一关是相对较难的一关，浏览器插件并不支持发送 PATCH 包和自定义文件，必须通过一些发包工具或者写代码来发送该内容。PATCH 包的格式与 POST 无异，使用 `Content-Type: multipart/form-data`发包即可，注意该 Header 的值后面需要加一个`boundary` 表示界定符。例如`Content-Type: multipart/form-data; boundary=abc`，那么在 Body 中，以`--abc`表示一个查询字段的开始，当所有查询字段结束后，用`--abc--`表示结束。

> 这个 Content-Type 下的 Body 字段不需要进行转义，每一个查询内容以一个空行区分元信息和数据（就和 HTTP 报文区分标头和 Body 的那样），如果数据中包含`boundary`界定符的相关内容，可能引起误解，那么可以通过修改`boundary`以规避碰撞情况（因此浏览器发送`mulipart/form-data`的表单时，`boundary`往往有很长的`--` 并且包含一些长的随机字符串。

本题只检查文件名后缀是否为`.zip` 因此如此发包即可：

```HTTP
PATCH /?ask=miao HTTP/1.1
Host: 8.147.132.32:36002
User-Agent: Papa/1.0
Content-Type: multipart/form-data; boundary=abc
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6NX0.xKi0JkzaQ0wwYyC3ebBpjuypRYvrYFICU5LSRLnWq_0
Content-Length: 168

--abc
Content-Disposition: form-data; name="file"; filename="1.zip"

123
--abc
Content-Disposition: form-data; name="say"

玛卡巴卡阿卡哇卡米卡玛卡呣
--abc--
```

返回的内容如下

```HTTP
HTTP/1.1 302 Found
set-cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6Nn0.SlKAeN5yYDF9YaHrUMifhYSrilyjPwd2_Yrywq9ff1Y; Max-Age=86400; Path=/
Location: /?ask=miao
x-powered-by: Hono
Date: Fri, 27 Sep 2024 19:28:30 GMT
```

通过浏览器开发者工具的「存储」（应用程序 » 存储）选项卡编辑 Cookie，将`Set-Cookie`字段的`token`值应用更新。随后再次携带新 Cookie 刷新网页即可。

## 第六关

本题提示内容指出了`localhost`，意在表明需要让服务器认为这是一个来自本地的请求。可以通过设`Host`、`X-Real-IP`、`X-Forwarded-For`、`Referer`等标头欺骗服务器。  
以下任意一种请求都是可以的。

```HTTP
GET /?ask=miao HTTP/1.1
Host: localhost
Referer: http://localhost
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6Nn0.SlKAeN5yYDF9YaHrUMifhYSrilyjPwd2_Yrywq9ff1Y
```

> 如果修改`Host`，你需要确保你的 HTTP 报文是发向靶机的。一些工具会默认自动采用`Host`作为远程地址，或者没有自定义远程地址的功能。

```HTTP
GET /?ask=miao HTTP/1.1
Host: 8.147.132.32:36002
X-Real-IP: 127.0.0.1
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6Nn0.SlKAeN5yYDF9YaHrUMifhYSrilyjPwd2_Yrywq9ff1Y
```

```HTTP
GET /?ask=miao HTTP/1.1
Host: 8.147.132.32:36002
X-Forwarded-For: 127.0.0.1
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6Nn0.SlKAeN5yYDF9YaHrUMifhYSrilyjPwd2_Yrywq9ff1Y
```

随后提示给出了一段话：

> PangBai 以一种难以形容的表情望着你——激动的、怀念的，却带着些不安与惊恐，像落单后归家的雏鸟，又宛若雷暴中遇难的船员。
> 你似乎无法抵御这种感觉的萦绕，像是一瞬间被推入到无法言喻的深渊。尽管你尽力摆脱，但即便今后夜间偶见酣眠，这一瞬间塑成的梦魇也成为了美梦的常客。
> 「像■■■■验体■■不可能■■■■ JWT 这种■■ Pe2K7kxo8NMIkaeN ■■■密钥，除非■■■■■走，难道■■■■■■吗？！」
> 「......」

其中提到了 JWT 和 `Pe2K7kxo8NMIkaeN`，这个数字和字母组成内容推测应当是 JWT 的密钥。JWT 是一个轻量级的认证规范，允许在用户和服务器之间传递安全可靠的信息，但这是基于签名密钥没有泄露的情况下。可以通过 JWT.IO <https://jwt.io> 网站进行在线签名和验证（JWT 并不对数据进行加密，而仅仅是签名，不同的数据对应的羡签名不一样，因此在没有密钥的情况下，你可以查看里面的数据，但修改它则会导致服务器验签失败，从而拒绝你的进一步请求）。  
将我们当前的 Cookie 粘贴入网站：

![cnily真的好可爱](/assets/images/wp/2024/week1/pangbai1_5.png)

Payload，即 JWT 存放的数据，指明了当前的 Level 为`6`，我们需要更改它，将它改为`0`即可。可见左下角显示「Invalid Signautre」，即验签失败，粘贴入签名密钥之后，复制左侧 Encoded 的内容，回到靶机界面应用该 token 值修改 Cookie，再次刷新网页，即到达最终页面。

![cnily真的好可爱](/assets/images/wp/2024/week1/pangbai1_6.png)

> 修改 Level 为`0`而不是`7`，是本题的一个彩蛋。本关卡不断提示「一方通行」，而「一方通行」作为动画番剧《魔法禁书目录》《某科学的超电磁炮》中的人物，是能够稳定晋升为 Level 6 的强者，却被 Level 0 的「上条当麻」多次击败。但即使不了解该内容，也可以通过多次尝试找到 Level 0，做安全需要反常人的思维，这应当作为一种习惯。

## 第〇关·终章

点击提示中的「从梦中醒来」，过完一个片尾小彩蛋即获得 Flag 内容。
