# 1. 开始

PySide是Qt 官方推出的 Python 版本，可商用。相比较PyQt6 还是更推荐使用官方的PySide6。

## 环境安装
默认你已经有了python环境，接着安装pyside6。

```bash
pip install pyside6
# 也可以使用conda安装
# conda install pyside6
```

安装完成后可以测试一下：

```python
import PySide6.QtCore

# Prints PySide6 version
print(PySide6.__version__)

# Prints the Qt version used to compile PySide6
print(PySide6.QtCore.__version__)
```

这里需要说明下关于**designer.exe、pyside6-rcc.exe、pyside6-uic.exe**在哪的问题：

+ 如果你没有使用conda（python版本管理工具）安装
    - 则在pyside6库的目录下能找到**designer.exe**
    - 在python目录下的Scripts目录中能找到**pyside6-rcc.exe、pyside6-uic.exe**
+ 使用了conda安装
    - anaconda3\Library\bin下能找到**designer.exe**
        * **这个在安装的时候，你如果改了文件夹名字可能对应不上，但是位置关系是这样的**
    - 在codda安装的对应python目录下的Scripts目录中能找到**pyside6-rcc.exe、pyside6-uic.exe**

然后配置vscode：

需要安装**PYQT Integration**插件，然后对这个插件做一些配置，输入上面几个exe的绝对路径。

![](/img/pyside1.png)

![](/img/pyside2.png)

![](/img/pyside3.png)

## 文档工具安装
[https://zealdocs.org/](https://zealdocs.org/)

![](/img/pyside4.png)

![](/img/pyside5.png)

找到QT6 下载下来即可。
