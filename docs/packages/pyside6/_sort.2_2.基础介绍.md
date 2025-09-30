# 2. 基础介绍

编写一个hello world，介绍下基本的用法

## hello world
在使用的过程中不清楚的可以查看官方的文档：[https://doc.qt.io/qtforpython/](https://doc.qt.io/qtforpython/)，或者使用zeal。  
在浏览器中搜索的时候可以带上上面的域名直接在这个网站中搜索：QPushButton site:doc.qt.io

```python
from PySide6.QtWidgets import QApplication, QLabel
# 全局一个，初始化应用环境
app = QApplication()
# 创建一个标签控件
label = QLabel("Hello, PySide6!")
# 显示标签
label.show()
# 进入应用的主循环
app.exec()
```

**QApplication**是整个应用的核心对象，他负责管理所有窗口的生命周期、事件循环、通信。一个应用只能有一个 `QApplication` 实例。

效果如下：

![](https://cdn.nlark.com/yuque/0/2025/png/26796231/1756967794271-b60ab738-19bc-43b9-8631-5779e6a903f1.png)

这个现实效果看起来很拥挤，我们常见的应用都会有各自的页面布局，我们这种单文件写的效果也可以实现。

```python
from PySide6.QtWidgets import QApplication, QWidget
app = QApplication()
window = QWidget()
window.setWindowTitle("这是一个 QWidget 窗口")
window.resize(300, 200)
window.show()
app.exec()
```

## 窗口
上面示例中的窗口是应用界面的重要组成单位，主要有两种：

+ `QWidget`：是QT所有控件（比如按钮、标签、窗口等）的基类，身也可以单独作为一个窗口使用
+ `QMainWindow`：带有菜单栏、工具栏、状态栏等结构的主窗口

如果界面结构刚好使用`QMainWindow`,那么可以直接使用，如果不一样，可以使用`QWidget`来实现。

窗口是否显示出来需要通过方法来控制，常见方法如下：

| **<font style="color:rgb(51, 51, 51);">方法</font>** | **<font style="color:rgb(51, 51, 51);">作用</font>** |
| --- | :--- |
| `<font style="color:rgb(51, 51, 51);">.show()</font>` | <font style="color:rgb(51, 51, 51);">显示窗口</font> |
| `<font style="color:rgb(51, 51, 51);">.hide()</font>` | <font style="color:rgb(51, 51, 51);">隐藏窗口</font> |
| `<font style="color:rgb(51, 51, 51);">.close()</font>` | <font style="color:rgb(51, 51, 51);">关闭窗口并退出</font> |
| `<font style="color:rgb(51, 51, 51);">.isVisible()</font>` | <font style="color:rgb(51, 51, 51);">判断是否可见</font> |
| `<font style="color:rgb(51, 51, 51);">setWindowTitle("标题")</font>` | <font style="color:rgb(51, 51, 51);">设置窗口标题</font> |
| `<font style="color:rgb(51, 51, 51);">resize(width, height)</font>` | <font style="color:rgb(51, 51, 51);">设置初始窗口大小</font> |
| `<font style="color:rgb(51, 51, 51);">setFixedSize(width, height)</font>` | <font style="color:rgb(51, 51, 51);">设置固定窗口大小</font> |


## <font style="color:rgb(51, 51, 51);">事件循环（Event Loop）</font>
事件循环本质就是一个不停循环，它会不停检查用户是否有操作，有没有要处理的事情。例如用户点击了一个按钮，然后要触发一个事件，这种能力都是依托事件循环实现的。

QT内部有一个事件队列，事件循环就是负责调度处理这个队列里的事件任务。

前面的例子中执行到**app.exec()**，就启动了事件循环，事件循环是阻塞的，只有调用了**app.quit()**才会退出，一般是用户主动触发，例如关闭了窗口。

## 信号与槽
### 基础用法
这是一种事件响应的方式，发布订阅的模式。

| **<font style="color:rgb(51, 51, 51);">名称</font>** | **<font style="color:rgb(51, 51, 51);">含义</font>** |
| :--- | :--- |
| <font style="color:rgb(51, 51, 51);">信号</font> | <font style="color:rgb(51, 51, 51);">一个事件的通知，比如按钮被点击（clicked）等</font> |
| <font style="color:rgb(51, 51, 51);">槽函数</font> | <font style="color:rgb(51, 51, 51);">响应这个事件的函数或方法（是否有参数根据实际实现的内容而定）</font> |
| <font style="color:rgb(51, 51, 51);">connect</font> | <font style="color:rgb(51, 51, 51);">把信号和槽函数关联系起来（可以是一对一、一对多、多对一），一旦信号发出就触发槽函数</font> |


**很多控件都有信号**，我们以`QPushButton` 为例：

```python
from PySide6.QtWidgets import QApplication, QPushButton
import sys
app = QApplication(sys.argv)
# 创建按钮
btn = QPushButton("点击开始")
# 槽函数  也可以以匿名函数的形式直接写到connect那一步
def toggle_text():
    if btn.text() == "点击开始":
        btn.setText("已点击")
    else:
        btn.setText("点击开始")
# 绑定 clicked 信号到槽函数
btn.clicked.connect(toggle_text)
btn.show()
app.exec()
```

一个按钮可以绑定多个槽函数，多个按钮也可以绑定一个槽函数。

### 信号传递数据
信号不仅可以触发事件，还可以携带数据。例如一些自带该功能的控件：

| **<font style="color:rgb(51, 51, 51);">控件</font>** | **<font style="color:rgb(51, 51, 51);">信号</font>** | **<font style="color:rgb(51, 51, 51);">数据</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(51, 51, 51);">QCheckBox</font> | `<font style="color:rgb(51, 51, 51);">stateChanged(int)</font>`<br/><font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">/</font><font style="color:rgb(51, 51, 51);"> </font>`<font style="color:rgb(51, 51, 51);">toggled(bool)</font>` | <font style="color:rgb(51, 51, 51);">勾选状态</font> |
| <font style="color:rgb(51, 51, 51);">QLineEdit</font> | `<font style="color:rgb(51, 51, 51);">textChanged(str)</font>` | <font style="color:rgb(51, 51, 51);">当前文本</font> |
| <font style="color:rgb(51, 51, 51);">QSlider</font> | `<font style="color:rgb(51, 51, 51);">valueChanged(int)</font>` | <font style="color:rgb(51, 51, 51);">当前数值</font> |


```python
from PySide6.QtWidgets import QApplication, QWidget, QCheckBox, QVBoxLayout

def checkbox_toggled(state):
    print("勾选状态：", state)  # state 是 True 或 False

app = QApplication([])

win = QWidget()

checkbox = QCheckBox("是否同意协议", win)
checkbox.toggled.connect(checkbox_toggled)

win.show()

app.exec()
```

### 内置的槽函数
有一些控件自带了槽函数，例如：

+ `<font style="color:rgb(51, 51, 51);">QLabel.setText()</font>`
+ `<font style="color:rgb(51, 51, 51);">QLineEdit.clear()</font>`
+ `<font style="color:rgb(51, 51, 51);">QPushButton.setEnabled()</font>`
+ <font style="color:rgb(51, 51, 51);">......</font>

这些内置方法可以像自己写的函数一样，直接 `.connect(...)` 使用

```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QVBoxLayout

app = QApplication([])

win = QWidget()
win.setWindowTitle("内置槽函数示例")

label = QLabel("原始文字", win)
label.move(30, 30)
btn = QPushButton("点击我修改文字", win)
btn.move(30, 100)

# 使用 QLabel 的 setText 方法作为槽函数
btn.clicked.connect(lambda: label.setText("你好"))

win.show()

app.exec()
```

### <font style="color:rgb(51, 51, 51);">自定义信号的创建与触发</font>
除了前面介绍的是内置的信号和槽机制外，我们也可以自定信号，然后在合适的时机触发（emit）它。

#### 1.自定义信号
需要使用**Signal**来自定义信号，支持带参数。

+ <font style="color:rgb(51, 51, 51);">自定义信号必须是 </font>`<font style="color:rgb(51, 51, 51);">Signal(...)</font>`<font style="color:rgb(51, 51, 51);"> 类型</font>
+ <font style="color:rgb(51, 51, 51);">自定义信号必须放在 </font>**<font style="color:rgb(51, 51, 51);">QObject </font>**<font style="color:rgb(51, 51, 51);">的子类中</font>
+ <font style="color:rgb(51, 51, 51);">触发信号时使用 </font>`<font style="color:rgb(51, 51, 51);">.emit(...)</font>`<font style="color:rgb(51, 51, 51);"> 方法，参数类型要匹配</font>
+ <font style="color:rgb(51, 51, 51);">可以不在一个线程中，例如在单独处理数据的线程中处理完毕后，通知主线程</font>
+ <font style="color:rgb(51, 51, 51);">模块间的通信也更为方便，不需要直接调用彼此的函数</font>

```python
from PySide6.QtCore import Signal, QObject
class MyWorker(QObject):
    # 自定义一个信号，不带参数
    nothing = Signal()
    # 自定义一个带字符串参数的信号
    data = Signal(int)
```

#### 2.发出信号
只需要调用`emit`就可以发送这个自定义信号

##### 不带参数
```python
from PySide6.QtCore import Signal, QObject
class MyWorker(QObject):
    # 自定义一个信号，不带参数
    nothing = Signal()

def handle_signal():
    print("信号已触发")


obj = MyWorker()
obj.nothing.connect(handle_signal)  # 绑定槽函数
obj.nothing.emit()  # 发送信号
```

##### 带参数
```python
from PySide6.QtCore import Signal, QObject
class MyWorker(QObject):
    data = Signal(int)  # 带int参数的信号


def handle_signal(text):
    print("收到消息：", text)


com = MyWorker()
com.data.connect(handle_signal)
com.data.emit(11)  # 手动发送信号
```

#### 3.综合示例
用户手动触发在子线程中处理的示例

```python
from PySide6.QtCore import QObject, Signal, QThread, Slot
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QPushButton
import sys
import time

class Worker(QObject):
    progress = Signal(str)
    result_ready = Signal(int)
    finished = Signal()

    @Slot()
    def do_work(self):
        for i in range(5):
            time.sleep(1)
            self.progress.emit(f"处理中... {i+1}/5")
        self.result_ready.emit(42)
        self.finished.emit()

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PySide6 自定义信号 - 可重复运行")
        self.setGeometry(300, 300, 400, 200)

        self.label = QLabel("点击【开始任务】按钮")
        self.button = QPushButton("开始任务")
        self.button.clicked.connect(self.start_task)

        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.button)
        self.setLayout(layout)

        self.is_running = False

    def start_task(self):
        if self.is_running:
            return
        self.is_running = True

        self.label.setText("任务进行中...")
        self.button.setEnabled(False)

        # 每次都创建新的线程和 worker
        self.thread = QThread()
        self.worker = Worker()
        self.worker.moveToThread(self.thread)

        self.thread.started.connect(self.worker.do_work)
        self.worker.progress.connect(self.on_progress)
        self.worker.result_ready.connect(self.on_result_ready)
        self.worker.finished.connect(self.on_finished)
        self.worker.finished.connect(self.thread.quit)
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)  # 自动清理

        self.thread.start()

    def on_progress(self, msg):
        self.label.setText(msg)

    def on_result_ready(self, value):
        print(f"收到结果: {value}")

    def on_finished(self):
        self.label.setText("任务已完成！")
        self.button.setEnabled(True)
        self.is_running = False

app = QApplication(sys.argv)
window = MainWindow()
window.show()
sys.exit(app.exec())
```

