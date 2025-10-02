---
titleTemplate: ":title | 参考文档 - NewStar CTF 2025"
---

<script setup>
import Container from '@/components/docs/Container.vue'
import Link from '@/components/docs/Link.vue'
import { ElTag, ElCollapse, ElCollapseItem, ElTooltip } from 'element-plus'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/collapse/style/css'
import 'element-plus/es/components/collapse-item/style/css'
import 'element-plus/es/components/tooltip/style/css'

const openCollapse = []
</script>

# Week 2

Week2 是大家从零到一的迈进，你将在这一周接触到主流 CTF 比赛的题目风格。<span data-desc>（这并不意味着难度很高）</span>

## Pwn

### no shell
#### 沙箱（sandbox）
<Container type='info'>

沙箱<span data-desc>（Sandbox）</span>是一种隔离的执行环境，通过虚拟化或模拟技术，限制程序对真实系统资源的访问。

</Container>
简单来说，就是设定了特殊的规则，指定了程序能做什么或者不能做什么。


一般我们可以用 seccomp-tools 能查看程序的沙箱

```shell
seccomp-tools dump <program>
```

得到如下样子的回显

```plaintext
line  CODE  JT   JF      K
=================================
 0000: 0x20 0x00 0x00 0x00000004  A = arch
 0001: 0x15 0x00 0x02 0xc000003e  if (A != ARCH_X86_64) goto 0004
 0002: 0x20 0x00 0x00 0x00000000  A = sys_number
 0003: 0x15 0x00 0x01 0x0000003b  if (A != execve) goto 0005
 0004: 0x06 0x00 0x00 0x00000000  return KILL
 0005: 0x06 0x00 0x00 0x7fff0000  return ALLOW
```

大概就是说 ban 了 `execve` 系统调用（关于系统调用，师傅们应该在 syscall 题目中领略过了）
ban 了 `execve` 后，`system()` 函数就不能使用了，如果需要得到 flag 需要其他的办法。

#### ORW

ORW 指的是 `open，read，write` 三个函数，后引申为有和这三个函数类似功能的一切函数组合。

对 C 语言有过了解的同学，可能会知道如何在 C 语言中对文件进行读写操作。

假设当前目录有一个 secret 文本文件，在同目录下，编写这样一个 C 语言程序

```cpp
# include <stdio.h>
# include <unistd.h>
# include <fcntl.h>

char buf[100];

int main() {
    int fd = open("secret", 0); // [!code highlight]
    read(fd, buf, 100);
    write(1, buf, 100);
    return 0;
}
```

编译，运行，成功读出了 secret 的内容。

同样的，只需要在 ROP 模拟这个文件读写的过程，就能成功读出 flag 文件的内容。

#### 参数传递

本题是 amd64 架构的题目，前六个参数分别用 `rdi，rsi，rdx，rcx，r8，r9` 这六个寄存器传递，函数返回值会储存在 `rax` 中。

可以利用 `pop rdi；ret` 这样的 gadget 去控制参数，但是如果要将 `rax` 传递到其他寄存器可以找找 mov 类型的指令。


## Web
### 小E的管理系统

<Container type='info'>

本题考查了对于联合注入的理解，以及渗透测试过程中的「Fuzzing」如何进行。

</Container>

**SQL 注入中的 fuzz**

在进行 SQL 注入之前，首要任务是进行信息侦察，这通常被称为「Fuzzing」<span data-desc>（模糊测试）</span>。

指的是，通过系统性地向目标参数提交包含特殊字符、SQL 关键词和函数的 payload，并观察应用的响应。响应的变化<span data-desc>（如页面内容不同、HTTP 状态码改变、返回错误信息）</span>是判断是否存在过滤或漏洞的关键依据。

我们可以通过 fuzz 字典以及相应的抓包软件来进行 fuzz，接下来使用 yakit 配合字典进行，其中用到的字典会贴在文章末尾。

首先识别到注入点为 `id`。

![注入点](/assets/images/guide/2025/week2/xiaoEdeguanlixitong_1.png)

选中数字部分，插入字典，选择临时字典<span data-desc>（用的文件就选择文件字典）</span>。

![插入字典](/assets/images/guide/2025/week2/xiaoEdeguanlixitong_2.png)

点击发送请求，可以看到返回的请求中有不同的响应码。

![观察返回请求](/assets/images/guide/2025/week2/xiaoEdeguanlixitong_3.png)

这其中，不同相应代表不同的结果，200 代表通过并且正常响应，403 代表被过滤，500 代表没被过滤但是数据库执行时出错了。<span data-desc>（同类型题目不一定有相同的返回值，但是大致流程相同）</span>

我们可以通过观察 fuzz 结果推断出题目过滤情况。确定题目过滤方式后，可以针对性的进行绕过。

绕过部分可以上网搜索，参考资料 [SQL注入 | Lazzaro](https://lazzzaro.github.io/2020/05/16/web-SQL%E6%B3%A8%E5%85%A5/)。

根据不同注入方式，使用对应路线或编写脚本即可。

推荐自动化测试与绕过工具：SQLmap。

<ElCollapse class='vp-collapse' v-model='openCollapse'>
<ElCollapseItem name='acknowledge-list'>
<template #title>
  <strong>字典</strong><span data-desc v-text='openCollapse.includes("acknowledge-list") ? "（点此收起）" : "（点此展开）"'></span>
</template>

```plaintext
length 
Length
+
handler
like
LiKe
select
SeleCT 
sleep
SLEEp
database
DATABASe
delete
having
or
oR
as
As
-~
BENCHMARK
limit
LimIt
left
Left
select
SELECT
insert
insERT
INSERT
right
#
--+
INFORMATION
--
;
!
%
+
xor
<>
(
>
<
)
.
^
=
AND
ANd
BY
By
CAST
COLUMN
COlumn
COUNT
Count
CREATE
END
case
'1'='1
when
admin'
"
length 
+
REVERSE
ascii
ASSIC
ASSic
select 
database
left
right
union
UNIon
UNION
"
'
&
&&
||
oorr
/
//
//*
*/*
/**/
anandd
GROUP
HAVING
IF
INTO
JOIN
LEAVE
LEFT
LEVEL
sleep
LIKE
NAMES
NEXT
NULL
OF
ON
|
infromation_schema
user
OR
ORDER
ORD
SCHEMA
SELECT
SET
TABLE
THEN
UNION
UPDATE
USER
USING
VALUE
VALUES
WHEN
WHERE
ADD
AND
prepare
set
update
delete
drop
inset
CAST
COLUMN
CONCAT
GROUP_CONCAT
group_concat
CREATE
DATABASE
DATABASES
alter
DELETE
DROP
floor
join
rand()
substr(
substring(
mid(
rand(
information_schema.tables
TABLE_SCHEMA
%df
concat_ws()
concat
char(
hex(
ascii(
LIMIT
ORD
ON
extractvalue
order 
CAST()
by
ORDER
OUTFILE
RENAME
REPLACE
SCHEMA
SELECT
SET
updatexml
SHOW
SQL
TABLE
THEN
TRUE
instr
benchmark
format
bin
substring
ord
UPDATE
VALUES
VARCHAR
VERSION
WHEN
WHERE
/*
`
 
,
users
%0a
%0A
%0b
mid
for
BEFORE
REGEXP
RLIKE
in
sys schemma
SEPARATOR
XOR
CURSOR
FLOOR
sys.schema_table_statistics_with_buffer
INFILE
count
%0c
from
%0d
%a0
=
@
else
%27
%23
%22
%20
%0a
```

</ElCollapseItem>
</ElCollapse>

### 白帽小 K 的故事（1）

小 K 系列第一弹！

本题需要选手能够理解项目设计中「接口」的意义。在一般的大型项目设计中，会反复利用到「接口」这一概念，理解接口的功能，找到存在漏洞的接口，是 web 手在渗透测试中需要拥有的技能。

题目中的提示已经相当详实，希望各位能够跳出对陈题中文件上传的固有印象，思考本题在文件上传题目中展现出的独特点。

### 真的是签到诶！

你可以使用 Cyberchef 中 To Hex -> Find/Replace -> From Hex 的流程来某个字节进行特例化修改。

## Crypto

### FHE:0 and 1

<Container type='info'>

本题的考点是具体分析加密的结构。

</Container>

仔细考察一下数据的结构，比如大小，奇偶性...
另外你很有可能得到的并不是p，而是p的倍数。

### RSA_revenge

仔细观察一下类似

$$m^p \pmod{pq}$$

的结构

### 群论小测试

<Container type='info'>

考点是一点点抽象代数。

</Container>

给的乘法表是混淆过的，但有些特征肯定是不变的，比如是否交换......