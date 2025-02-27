---
titleTemplate: ":title | WriteUp - NewStar CTF 2024"
---

# AmazingGame

安卓私有目录位于 `/data/user/0/<包名>` 下

安卓的 `shared_prefs` 一般用来存放软件配置数据

修改文件即可更改已通过的关卡数据

通过第一关后，关掉游戏<span data-desc>（这点很重要）</span>

ADB 链接手机执行

```shell
adb shell
run-as com.pangbai.projectm
cd shared_prefs
cat net.osaris.turbofly.JumpyBall.xml
```

```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <boolean name="cockpitView" value="true" />
    <int name="unlockedsolotracks" value="2" />
    <int name="unlockedtracks" value="2" />
    <int name="best0m0" value="130" />
    <int name="unlockedships" value="1" />
    <int name="userid" value="9705893" />
</map>
```

软件有 23 个关卡，我们把关卡解锁数改为 23

正常来说应该用 `adb push` 来修改文件，这里我们为了方便直接把 2 替换成 23

```shell
sed -i 's/2/23/g' net.osaris.turbofly.JumpyBall.xml
```

打开游戏发现关卡全部解锁，随便游玩 23 关，等游戏结束即可获得 flag
