# 小E的秘密计划

> 本题主要考察对于各种泄露的利用，包括备份泄露，git泄露，DS_Store泄露

结合 html 提示进行备份扫描，下载 `www.zip` 文件

`git log` 查看 git 提交记录，得知其中的 `.git` 中有个删除的 branch，里面可能有账号密码

![git-log](/assets/images/wp/2025/week3/web_xiaoe_1.png)

只需要 `git reflog` 即可看到被删除 branch 的 hash

然后恢复即可

```sh
git branch test <hash>
git checkout test
```

你也可以使用 VSCode 快捷地检出创建的分支，寻找被删除的密码

![git-reflog](/assets/images/wp/2025/week3/web_xiaoe_2.png)

使用泄露的账密登录进 dashboard 之后，结合提示，扫描发现 `.DS_Store`

然后利用 Dump all 或者其他 DS_Store 泄露利用工具下载 flag
