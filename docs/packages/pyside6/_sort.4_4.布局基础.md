# 4. 布局基础
PySide6 提供的几种常用布局方式，比如垂直布局、水平布局、网格布局等。让界面可以随着窗口大小自动适应。

## <font style="color:rgb(51, 51, 51);">QVBoxLayout（垂直布局）</font>
控件从上往下一个个排列。

+ 创建一个 `QVBoxLayout` 对象
+ <font style="color:rgb(51, 51, 51);">把页面中对应的控件一个个 </font>`<font style="color:rgb(51, 51, 51);">addWidget()</font>`<font style="color:rgb(51, 51, 51);"> 进去</font>
+ 把这个布局设置到窗口上：`setLayout(layout)`

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout

app = QApplication(sys.argv)

# 创建一个窗口
window = QWidget()
window.setWindowTitle("QVBoxLayout 示例")
window.resize(300, 200)

# 创建按钮
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")

# 创建垂直布局
layout = QVBoxLayout()
layout.addWidget(btn1)
layout.addWidget(btn2)
layout.addWidget(btn3)

# 把布局设置到窗口
window.setLayout(layout)

window.show()

sys.exit(app.exec())
```

这样是均分垂直空间的，以上面的例子为例每个按钮的间距是一致的，可以通过添加弹簧，将弹簧上下的控件顶住，中间留更多的空间，其他的直接挨在一起。

**常用方法：**

+ `addWidget(widget)`：往布局里添加一个控件。
+ `addStretch()`：在控件之间加“弹簧”，用来撑开空间。 （比如按钮想靠上，下面空一大片，就加个 `addStretch()`）。
+ `setSpacing(value)`：设置控件之间的间距（默认是 6 像素）。

## <font style="color:rgb(51, 51, 51);">QHBoxLayout（水平布局）</font>
控件从左到右一个个排列。

+ 创建一个 `QHBoxLayout` 对象。
+ 把控件用 `addWidget()` 一个个加进去。
+ 把这个布局设置到窗口：`setLayout(layout)`。

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QHBoxLayout

app = QApplication(sys.argv)

# 创建一个窗口
window = QWidget()
window.setWindowTitle("QHBoxLayout 示例")
window.resize(400, 100)

# 创建按钮
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")

# 创建水平布局
layout = QHBoxLayout()
layout.addWidget(btn1)
layout.addWidget(btn2)
layout.addWidget(btn3)

# 设置布局到窗口
window.setLayout(layout)

window.show()
sys.exit(app.exec())
```

## <font style="color:rgb(51, 51, 51);">QGridLayout（网格布局）</font>
类似一个表格一样，控件根据需求放在对应的表格里面。

+ 每个控件都放在某一行、某一列里；
+ 可以控制控件占几行几列；
+ 窗口大小变化时，整张“表格”会自动拉伸，控件位置也会跟着调整。
+ 创建一个 `QGridLayout` 对象。
+ 用 `addWidget(widget, row, column)` 把控件放到指定的行和列。
+ 最后 `setLayout(layout)` 把布局应用到窗口。

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout

app = QApplication(sys.argv)

# 创建窗口
window = QWidget()
window.setWindowTitle("QGridLayout 示例")
window.resize(300, 200)

# 创建按钮
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")
btn4 = QPushButton("按钮 4")

# 创建网格布局
layout = QGridLayout()

# 按照 (行, 列) 来摆放控件
layout.addWidget(btn1, 0, 0)  # 第一行第一列
layout.addWidget(btn2, 0, 1)  # 第一行第二列
layout.addWidget(btn3, 1, 0)  # 第二行第一列
layout.addWidget(btn4, 1, 1)  # 第二行第二列

# 设置布局到窗口
window.setLayout(layout)

window.show()
sys.exit(app.exec())
```

除了上面这样一个萝卜一个坑一样的排列外，还可以手动控制控件占用更多的“格子”。也就是支持控件跨行跨列，适合复杂界面。

addWidget：

+ `**<font style="color:rgb(51, 51, 51);">btn1</font>**`<font style="color:rgb(51, 51, 51);">：控件</font>
+ `**<font style="color:rgb(51, 51, 51);">0, 0</font>**`<font style="color:rgb(51, 51, 51);">：控件的起始位置，</font>`<font style="color:rgb(51, 51, 51);">(row=0, column=0)</font>`<font style="color:rgb(51, 51, 51);">表示放在第 0 行第 0 列。</font>
+ `**<font style="color:rgb(51, 51, 51);">1, 2</font>**`<font style="color:rgb(51, 51, 51);">：控件的跨度，</font>`<font style="color:rgb(51, 51, 51);">(rowSpan=1, columnSpan=2)</font>`<font style="color:rgb(51, 51, 51);">表示：</font>
    - **<font style="color:rgb(51, 51, 51);">跨 1 行</font>**<font style="color:rgb(51, 51, 51);">（高度占 1 行）</font>
    - **<font style="color:rgb(51, 51, 51);">跨 2 列</font>**<font style="color:rgb(51, 51, 51);">（宽度占 2 列）</font>

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout

app = QApplication(sys.argv)

# 创建窗口
window = QWidget()
window.setWindowTitle("QGridLayout 示例")
window.resize(300, 200)

# 创建按钮
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")
btn4 = QPushButton("按钮 4")

# 创建网格布局
layout = QGridLayout()

# 按照 (行, 列) 来摆放控件
layout.addWidget(btn1, 0, 0, 1, 2)  # 跨 1 行 2 列
layout.addWidget(btn3, 1, 0)  # 第二行第一列
layout.addWidget(btn4, 1, 1)  # 第二行第二列
layout.addWidget(btn2, 2, 0, 2, 2)  # 第二行第二列

# 设置布局到窗口
window.setLayout(layout)

window.show()
sys.exit(app.exec())
```

默认情况下每一行每一列的宽高是均分的，如果想调整行、列的宽高可以使用下面的方法：

+ `<font style="color:rgb(51, 51, 51);">setColumnStretch(列号, 权重)</font>`
+ `<font style="color:rgb(51, 51, 51);">setRowStretch(行号, 权重)</font>`

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout

app = QApplication(sys.argv)

# 创建窗口
window = QWidget()
window.setWindowTitle("QGridLayout 示例")
window.resize(300, 200)

# 创建按钮
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")
btn4 = QPushButton("按钮 4")

# 创建网格布局
layout = QGridLayout()

# 按照 (行, 列) 来摆放控件
layout.addWidget(btn1, 0, 0)  # 第一行第一列
layout.addWidget(btn2, 0, 1)  # 第一行第二列
layout.addWidget(btn3, 1, 0)  # 第二行第一列
layout.addWidget(btn4, 1, 1)  # 第二行第二列

layout.setColumnStretch(0, 1)  # 第0列权重=1
layout.setColumnStretch(1, 2)  # 第1列权重=2


# 设置布局到窗口
window.setLayout(layout)

window.show()
sys.exit(app.exec())
```

## <font style="color:rgb(51, 51, 51);">QFormLayout（表单布局）</font>
通用常见的两列布局为主的表单控件，虽然说是两列，但不是强制性的，例如addRow的时候只放一个控件，就成了一列。

1. <font style="color:rgb(51, 51, 51);">创建一个</font><font style="color:rgb(51, 51, 51);"> </font>`<font style="color:rgb(51, 51, 51);">QFormLayout</font>`<font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">对象。</font>
2. <font style="color:rgb(51, 51, 51);">用</font><font style="color:rgb(51, 51, 51);"> </font>`<font style="color:rgb(51, 51, 51);">addRow(标签, 控件)</font>`<font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">来添加一行。</font>
3. <font style="color:rgb(51, 51, 51);">把布局设置到窗口：</font>`<font style="color:rgb(51, 51, 51);">setLayout(layout)</font>`<font style="color:rgb(51, 51, 51);">。</font>

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QFormLayout, QPushButton

app = QApplication(sys.argv)

# 创建窗口
window = QWidget()
window.setWindowTitle("QFormLayout 示例")
window.resize(300, 150)

# 创建表单控件
label_user = QLabel("用户名：")
input_user = QLineEdit()

label_pass = QLabel("密码：")
input_pass = QLineEdit()
input_pass.setEchoMode(QLineEdit.Password)  # 设置密码模式

btn_login = QPushButton("登录")

# 创建表单布局
layout = QFormLayout()
layout.addRow(label_user, input_user)  # 一行：标签 + 输入框
layout.addRow(label_pass, input_pass)
layout.addRow(btn_login)  # 只放一个控件，占满一行

# 设置布局
window.setLayout(layout)

window.show()
sys.exit(app.exec())
```

**常用方法：**

+ `<font style="color:rgb(51, 51, 51);">addRow(QLabel, QWidget)</font>`<font style="color:rgb(51, 51, 51);">：添加一行，左边是说明文字，右边是输入控件。</font>
+ `<font style="color:rgb(51, 51, 51);">addRow(QWidget)</font>`<font style="color:rgb(51, 51, 51);">：只添加一个控件（比如按钮），它会自动横跨两列。</font>
+ `<font style="color:rgb(51, 51, 51);">setLabelAlignment(Qt.Alignment)</font>`<font style="color:rgb(51, 51, 51);">：设置左边标签的对齐方式（比如左对齐、右对齐）。</font>
+ `<font style="color:rgb(51, 51, 51);">setFormAlignment(Qt.Alignment)</font>`<font style="color:rgb(51, 51, 51);">：控制整体表单的对齐方式（居中、靠上等）。</font>

## <font style="color:rgb(51, 51, 51);">QStackedLayout（堆栈布局）</font>
常见的那种同一时刻只能显示一个页面的的布局方式，就是堆栈布局。一般通过按钮、菜单或信号切换显示的页面。

+ <font style="color:rgb(51, 51, 51);">创建一个 </font>`<font style="color:rgb(51, 51, 51);">QStackedLayout</font>`<font style="color:rgb(51, 51, 51);"> 对象</font>
+ <font style="color:rgb(51, 51, 51);">用</font><font style="color:rgb(51, 51, 51);"> </font>`<font style="color:rgb(51, 51, 51);">addWidget(widget)</font>`<font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">添加多个页面</font>
+ <font style="color:rgb(51, 51, 51);">用 </font>`<font style="color:rgb(51, 51, 51);">setCurrentIndex(index)</font>`<font style="color:rgb(51, 51, 51);"> 或 </font>`<font style="color:rgb(51, 51, 51);">setCurrentWidget(widget)</font>`<font style="color:rgb(51, 51, 51);"> 切换显示</font>

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QStackedLayout, QPushButton, QLabel

app = QApplication(sys.argv)

window = QWidget()
window.setWindowTitle("QStackedLayout 示例")
window.resize(300, 200)

# 主布局
main_layout = QVBoxLayout()

# 创建堆栈布局
stack_layout = QStackedLayout()

# 创建页面
page1 = QLabel("这是页面 1")
page2 = QLabel("这是页面 2")
page3 = QLabel("这是页面 3")

# 添加页面到堆栈
stack_layout.addWidget(page1)
stack_layout.addWidget(page2)
stack_layout.addWidget(page3)

# 创建按钮切换页面
btn1 = QPushButton("显示页面 1")
btn2 = QPushButton("显示页面 2")
btn3 = QPushButton("显示页面 3")

btn1.clicked.connect(lambda: stack_layout.setCurrentIndex(0))
btn2.clicked.connect(lambda: stack_layout.setCurrentIndex(1))
btn3.clicked.connect(lambda: stack_layout.setCurrentIndex(2))

# 把按钮和堆栈布局放到主布局
main_layout.addWidget(btn1)
main_layout.addWidget(btn2)
main_layout.addWidget(btn3)
main_layout.addLayout(stack_layout)

window.setLayout(main_layout)
window.show()
sys.exit(app.exec())
```

## <font style="color:rgb(51, 51, 51);">控件伸缩因子与间距控制</font>
前面布局中，默认控件都能自动排好位置。但是实际开发过程中，我们会有定制化的需求，不可能都是这样规规矩矩的。所以这时候就需要**伸缩因子（Stretch Factor）** 和 **间距控制（Spacing / Margin）**。

1. **<font style="color:rgb(51, 51, 51);">伸缩因子（Stretch Factor）</font>**<font style="color:rgb(51, 51, 51);">：决定控件占用剩余空间的比例</font>
2. **<font style="color:rgb(51, 51, 51);">控件间距（Spacing）</font>**<font style="color:rgb(51, 51, 51);">：控制控件之间的距离</font>
3. **<font style="color:rgb(51, 51, 51);">布局边距（Margin）</font>**<font style="color:rgb(51, 51, 51);">：控制布局与窗口边缘的距离</font>
4. **<font style="color:rgb(51, 51, 51);">弹簧控件（Stretch / Spacer）</font>**<font style="color:rgb(51, 51, 51);">：快速把控件推到某一边</font>

### <font style="color:rgb(51, 51, 51);">弹簧控件（Stretch / Spacer）</font>
前面其实已经用到过弹簧了。它可以把控件推到一边

+ `<font style="color:rgb(51, 51, 51);">addStretch()</font>`<font style="color:rgb(51, 51, 51);">：在布局中添加一个弹簧</font>
+ <font style="color:rgb(51, 51, 51);">弹簧会占用剩余空间，把控件挤到另一边</font>

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QHBoxLayout

app = QApplication(sys.argv)

# 主窗口
window = QWidget()
window.setWindowTitle("addStretch 演示")
window.resize(600, 200)

# 水平布局
hbox = QHBoxLayout()

# 左边按钮
btn1 = QPushButton("按钮1")
hbox.addWidget(btn1)

# 中间空隙：比例1
hbox.addStretch(1)

# 中间按钮
btn2 = QPushButton("按钮2")
hbox.addWidget(btn2)

# 右边空隙：比例2
hbox.addStretch(2)

# 右边按钮
btn3 = QPushButton("按钮3")
hbox.addWidget(btn3)

# 应用布局
window.setLayout(hbox)

window.show()
sys.exit(app.exec())
```

<font style="color:rgb(51, 51, 51);">hbox.addStretch(1)、hbox.addStretch(2) 将空闲部分划分为3块，然后比例是1：2</font>

### <font style="color:rgb(51, 51, 51);">控件伸缩因子（Stretch Factor）</font>
伸缩因子决定了 控件在布局中分配剩余空间的比例。

+ <font style="color:rgb(51, 51, 51);">水平布局里：影响控件的宽度</font>
+ <font style="color:rgb(51, 51, 51);">垂直布局里：影响控件的高度</font>
+ <font style="color:rgb(51, 51, 51);">网格布局里：可以用 </font>`<font style="color:rgb(51, 51, 51);">setRowStretch()</font>`<font style="color:rgb(51, 51, 51);"> 和 </font>`<font style="color:rgb(51, 51, 51);">setColumnStretch()</font>`<font style="color:rgb(51, 51, 51);"> 调整行列比例</font>

#### <font style="color:rgb(51, 51, 51);">示例：水平布局中伸缩因子</font>
```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QHBoxLayout
import sys

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("控件伸缩因子示例")

btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")

layout = QHBoxLayout()
layout.addWidget(btn1, 1)  # 伸缩因子=1
layout.addWidget(btn2, 2)  # 伸缩因子=2
layout.addWidget(btn3, 1)  # 伸缩因子=1

window.setLayout(layout)
window.show()
sys.exit(app.exec())
```

#### <font style="color:rgb(51, 51, 51);">示例：垂直布局中伸缩因子</font>
```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QSizePolicy
from PySide6.QtCore import Qt
import sys

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("垂直布局控件高度伸缩因子示例")
window.resize(300, 600)  # 增加窗口高度，便于观察高度变化

btn1 = QPushButton("按钮 1\n(伸缩因子=1)")
btn2 = QPushButton("按钮 2\n(伸缩因子=2)\n高度是其他按钮的2倍")
btn3 = QPushButton("按钮 3\n(伸缩因子=1)")

# 设置按钮的尺寸策略，使其能够垂直扩展
btn1.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Expanding)
btn2.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Expanding)
btn3.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Expanding)

# 设置最小高度，确保按钮有基本可见性
btn1.setMinimumHeight(50)
btn2.setMinimumHeight(50)
btn3.setMinimumHeight(50)

layout = QVBoxLayout()
layout.addWidget(btn1, 1)  # 伸缩因子=1，高度占比1/4
layout.addWidget(btn2, 2)  # 伸缩因子=2，高度占比2/4（一半）
layout.addWidget(btn3, 1)  # 伸缩因子=1，高度占比1/4

window.setLayout(layout)
window.show()
sys.exit(app.exec())
```

#### 示例：<font style="color:rgb(51, 51, 51);">网格布局中伸缩因子</font>
```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout, QSizePolicy
from PySide6.QtCore import Qt
import sys

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("网格布局行列伸缩比例示例")
window.resize(500, 400)  # 设置窗口大小便于观察行列比例变化

# 创建6个按钮，排列成2x3的网格
btn1 = QPushButton("按钮 1\n(第1行第1列)")
btn2 = QPushButton("按钮 2\n(第1行第2列)")
btn3 = QPushButton("按钮 3\n(第1行第3列)")
btn4 = QPushButton("按钮 4\n(第2行第1列)")
btn5 = QPushButton("按钮 5\n(第2行第2列)")
btn6 = QPushButton("按钮 6\n(第2行第3列)")

# 设置按钮的尺寸策略，使其能够扩展
for btn in [btn1, btn2, btn3, btn4, btn5, btn6]:
    btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
    btn.setMinimumSize(80, 60)  # 设置最小尺寸

# 创建网格布局
layout = QGridLayout()

# 将按钮添加到网格布局中
layout.addWidget(btn1, 0, 0)  # 第1行第1列
layout.addWidget(btn2, 0, 1)  # 第1行第2列
layout.addWidget(btn3, 0, 2)  # 第1行第3列
layout.addWidget(btn4, 1, 0)  # 第2行第1列
layout.addWidget(btn5, 1, 1)  # 第2行第2列
layout.addWidget(btn6, 1, 2)  # 第2行第3列

# 设置行的伸缩比例：第1行和第2行的比例为1:2
layout.setRowStretch(0, 1)    # 第1行伸缩因子=1
layout.setRowStretch(1, 2)    # 第2行伸缩因子=2（高度是第1行的2倍）

# 设置列的伸缩比例：三列的比例为1:2:1
layout.setColumnStretch(0, 1) # 第1列伸缩因子=1
layout.setColumnStretch(1, 2) # 第2列伸缩因子=2（宽度是其他列的2倍）
layout.setColumnStretch(2, 1) # 第3列伸缩因子=1

window.setLayout(layout)
window.show()
sys.exit(app.exec())
```

### <font style="color:rgb(51, 51, 51);">控件间距（Spacing）</font>
+ `layout.setSpacing(value)`：设置 控件之间的间距
+ <font style="color:rgb(51, 51, 51);">默认间距一般是 6 像素，如果觉得太紧或者太松，可以自己调整</font>

```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout, QSizePolicy
from PySide6.QtCore import Qt
import sys

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("控件间距(Spacing)设置示例")
window.resize(400, 300)  # 设置窗口大小便于观察间距效果

# 创建4个按钮用于演示间距效果
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")
btn4 = QPushButton("按钮 4")

# 设置按钮的尺寸策略，使其能够扩展
for btn in [btn1, btn2, btn3, btn4]:
    btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
    btn.setMinimumSize(80, 60)  # 设置最小尺寸

# 创建网格布局
layout = QGridLayout()

# 将按钮添加到网格布局中（2x2排列）
layout.addWidget(btn1, 0, 0)  # 第1行第1列
layout.addWidget(btn2, 0, 1)  # 第1行第2列
layout.addWidget(btn3, 1, 0)  # 第2行第1列
layout.addWidget(btn4, 1, 1)  # 第2行第2列

# 设置控件间距
layout.setSpacing(20)  # 设置间距为20像素（默认一般是6像素）

# 可以通过修改这个值来观察间距变化：
# layout.setSpacing(6)   # 默认间距
# layout.setSpacing(10)  # 较小间距
# layout.setSpacing(30)  # 较大间距

window.setLayout(layout)
window.show()
sys.exit(app.exec())
```

### <font style="color:rgb(51, 51, 51);">布局边距（Margin）</font>
+ `<font style="color:rgb(51, 51, 51);">layout.setContentsMargins(left, top, right, bottom)</font>`<font style="color:rgb(51, 51, 51);">：设置 </font>**<font style="color:rgb(51, 51, 51);">布局与窗口边缘的空白</font>**

```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout, QSizePolicy
from PySide6.QtCore import Qt
import sys

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("布局边距(Margin)设置示例")
window.resize(450, 350)  # 设置窗口大小便于观察边距效果

# 创建4个按钮用于演示边距效果
btn1 = QPushButton("按钮 1")
btn2 = QPushButton("按钮 2")
btn3 = QPushButton("按钮 3")
btn4 = QPushButton("按钮 4")

# 设置按钮的尺寸策略，使其能够扩展
for btn in [btn1, btn2, btn3, btn4]:
    btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
    btn.setMinimumSize(80, 60)  # 设置最小尺寸
    
# 为了更好地观察边距效果，给按钮设置背景色
btn1.setStyleSheet("background-color: lightblue;")
btn2.setStyleSheet("background-color: lightgreen;")
btn3.setStyleSheet("background-color: lightyellow;")
btn4.setStyleSheet("background-color: lightpink;")

# 创建网格布局
layout = QGridLayout()

# 将按钮添加到网格布局中（2x2排列）
layout.addWidget(btn1, 0, 0)  # 第1行第1列
layout.addWidget(btn2, 0, 1)  # 第1行第2列
layout.addWidget(btn3, 1, 0)  # 第2行第1列
layout.addWidget(btn4, 1, 1)  # 第2行第2列

# 设置布局边距：左、上、右、下
layout.setContentsMargins(30, 20, 40, 25)  # 左:30px, 上:20px, 右:40px, 下:25px

# 也可以设置控件间距（与边距不同）
layout.setSpacing(10)  # 控件之间的间距

# 可以尝试不同的边距设置：
# layout.setContentsMargins(0, 0, 0, 0)     # 无边距
# layout.setContentsMargins(10, 10, 10, 10) # 均匀边距
# layout.setContentsMargins(50, 10, 10, 50) # 左右不对称边距

window.setLayout(layout)
window.show()
sys.exit(app.exec())
```

## <font style="color:rgb(51, 51, 51);">多层布局嵌套</font>
**<font style="color:rgb(51, 51, 51);"></font>**

