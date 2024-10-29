---
titleTemplate: ':title | 快速入门 - NewStar CTF'
---

# VSCode Python 环境配置

请先确保你已经安装了 [Python](https://www.python.org/) 和 [VSCode](https://code.visualstudio.com/).

建议在 VSCode 中登录账号，以便在云端保存你的配置。

## 安装 Python 插件

在 VSCode 左侧栏中点击「扩展」（Extension）按钮，安装插件

搜索 `Chinese`，安装简体中文语言包，随后重启 VSCode。

搜索 `Python`，安装以下插件：

- Python Extension Pack
- Python Debugger

搜索 `Pylance`，安装该插件。

## 配置运行环境

在「扩展」中搜索 `Code Runner`，安装该插件。随后点击 VSCode 左下角的齿轮按钮，选择「设置」，搜索 `Code-runner Run in Terminal`，勾选对应的配置。

用 VSCode 打开一个文件夹，随便创建一个 Python 文件（以 `.py` 后缀，会自动识别为 Python 文件），输入以下代码：

```python
print("Hello, World!")
```

::: warning 注意
记得保存文件（快捷键 <kbd>^ Ctrl</kbd><kbd>S</kbd>）。VSCode 标签页上若显示圆点，则表示该文件已更改但未保存。可以在设置中搜索 `Auto Save`，选择自动保存的模式。
:::

点击编辑器右上角的运行 <kbd>▷</kbd> 按钮，可在 VSCode 内置终端中看到输出。

::: tip
VSCode 中有许多命令，按下 <kbd>F1</kbd> 或者 <kbd>^ Ctrl</kbd><kbd>⇧ Shift</kbd><kbd>P</kbd>，可以调出命令输入框<span data-desc>（以 `>` 开头表示命令，否则表示搜索文件）</span>。

例如，你可以输入 `settings` `format` 等关键词，使用对应的功能。
:::
