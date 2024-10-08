---
titleTemplate: ':title | WriteUp - NewStar CTF 2024'
---
<script setup>
import Container from '@/components/docs/Container.vue'
</script>

# 会赢吗？

<Container type='tip'>

本题考查的是网页和 JavaScript 的基础知识。
</Container>

JavaScript 是现代网络开发中最重要的编程语言之一，它的历史充满了快速迭代、竞争、以及变革。它最早诞生于 1995 年，由 Brendan Eich 在短短 10 天内开发，并逐步演变成为如今的标准化、多功能的编程语言。

## 第一关

按下 <kbd>F12</kbd>，使用开发者工具查看源码

![第一关](/assets/images/wp/2024/week1/huiyingma_1.png)

## 第二关

控制台是开发者调试 JavaScript 代码的利器，允许开发者在无需修改源代码的情况下，直接执行和测试代码。这种即时反馈机制使得开发者可以迅速验证假设、检查问题或尝试新的代码逻辑。

仔细看源代码：

```html
<script>
    async function revealFlag(className) {
        try {
            const response = await fetch(`/api/flag/${className}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`恭喜你！你获得了第二部分的 flag: ${data.flag}\n……\n时光荏苒，你成长了很多，也发生了一些事情。去看看吧：/${data.nextLevel}`);
            } else {
                console.error('请求失败，请检查输入或服务器响应。');
            }
        } catch (error) {
            console.error('请求过程中出现错误:', error);
        }
    }

    // 控制台提示
    console.log("你似乎对这门叫做4cqu1siti0n的课很好奇？那就来看看控制台吧！");
</script>
```

根据控制台的提示，只需要执行 `revealFlag('4cqu1siti0n')`（`className` 的值为 `4cqu1siti0n`）即可获得第二关的 flag。

![第二关](/assets/images/wp/2024/week1/huiyingma_2.png)

## 第三关

根据源代码：

```html
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('seal_him');
        const stateElement = document.getElementById('state');
        const messageElement = document.getElementById('message');

        form.addEventListener('submit', async function (event) {
            event.preventDefault();


            if (stateElement.textContent.trim() !== '解封') { // [!code highlight]
                messageElement.textContent = '如何是好？';
                return;
            }

            try {
                const response = await fetch('/api/flag/s34l', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ csrf_token: document.getElementById('csrf_token').value })
                });

                if (response.ok) {
                    const data = await response.json();
                    messageElement.textContent = `第三部分Flag: ${data.flag}, 你解救了五条悟！下一关: /${data.nextLevel || '无'}`;
                } else {
                    messageElement.textContent = '请求失败，请重试。';
                }
            } catch (error) {
                messageElement.textContent = '请求过程中出现错误，请重试。';
            }
        });
    });
</script>
```

修改前端，按下按钮得到一部分 flag.

![第三关 1](/assets/images/wp/2024/week1/huiyingma_3.png)

![第三关 2](/assets/images/wp/2024/week1/huiyingma_4.png)

## 第四关

源码中有 `<noscript>` 标签，可以使用浏览器插件或者浏览器设置禁用 JavaScript.

![第三关 1](/assets/images/wp/2024/week1/huiyingma_5.png)

![第三关 2](/assets/images/wp/2024/week1/huiyingma_6.png)

![第三关 3](/assets/images/wp/2024/week1/huiyingma_7.png)

当然也可以直接根据前端逻辑去发送请求。

---

将 Flag 各个部分拼起来，随后 Base64 解密即可。
