# 2. 常用控件

常用控件介绍。

## QWidget
前面有说到QWidget是QT所有控件（比如按钮、标签、窗口等）的基类，身也可以单独作为一个窗口使用，也可以构建自定义的空控件

## QLabel
用于 显示文字、图片、超链接等内容。

可以借助 HTML 显示混合内容：文字+图片。

```python
from PySide6.QtWidgets import QApplication, QLabel
app = QApplication([])
label = QLabel("PySide6！")
label.setWindowTitle("文本")
label.resize(300, 200)
label.show()
app.exec()
```

| `setScaledContents()`**方法** | **说明** |
| :--- | --- |
| `setText(str)` | 设置显示文本 |
| `setPixmap(QPixmap)` | 设置显示图片 |
| `setAlignment()` | 设置文字对齐方式 |
| `setStyleSheet()` | 设置样式（字体、颜色等） |
| `setScaledContents()` | 设置图片是否自适应标签尺寸 |
| `setOpenExternalLinks(bool)` | 如果渲染那的html内容有a链接，期望能点击的打开的话需要设置这个属性 |


## QPushButton
按钮，用于触发用户交互。可以通过设置 id，然后通过setStyleSheet设置不同状态下的样式。

```python
from PySide6.QtWidgets import QApplication, QPushButton
app = QApplication([])
btn = QPushButton("test")
btn.setWindowTitle("QPushButton")
btn.resize(400, 200)
# 绑定点击事件
def on_click():
    print("点击了！")
btn.show()
app.exec()
```

| `setText(str)` | 设置按钮文字 |
| :--- | :--- |
| `setIcon(QIcon)` | 给按钮添加图标 |
| `setEnabled(bool)` | 设置按钮是否可用 |
| `setCheckable(bool)` | 是否为可切换按钮 |
| `isChecked()` | 返回按钮当前是否被按下 |
| `clicked`<br/> 信号 | 按钮被点击时触发 |
| `toggled`<br/> 信号 | 按钮状态切换时触发（True/False） |


## QLineEdit
单行文本输入框，用于接受用户的文本输入。

```python
from PySide6.QtWidgets import QApplication, QLineEdit
app = QApplication([])
line_edit = QLineEdit()
line_edit.setWindowTitle("QLineEdit")
line_edit.resize(300, 40)
line_edit.show()
app.exec()
```

**支持模式**

| **模式** | **说明** |
| :--- | :--- |
| `QLineEdit.Normal` | 默认模式，正常显示文本 |
| `QLineEdit.Password` | 密码模式，显示为小圆点 |
| `QLineEdit.NoEcho` | 不显示任何输入 |
| `QLineEdit.PasswordEchoOnEdit` | 编辑时显示，失焦后变圆点 |


**常用方法**

| **方法/属性** | **说明** |
| :--- | :--- |
| `setText(str)` | 设置默认文本 |
| `text()` | 获取当前输入的内容 |
| `clear()` | 清空输入框 |
| `setPlaceholderText(str)` | 设置占位符 |
| `setEchoMode(mode)` | 设置显示模式（普通/密码等） |
| `setValidator(obj)` | 设置输入验证规则 |
| `textChanged`<br/> 信号 | 文本内容改变时触发 |
| `returnPressed`<br/> 信号 | 按回车键时触发 |


## ---QTextEdit
多行文本输入框，用于接受用户的多行文本输入。

## QCheckBox
复选框，常用的是两种状态的复选框：选中、没选中。除此之外还支持三种状态的复选框，除了前面的状态外，多了一种状态：部分选中。例如是一个树结构，子节点选择了一部分，此时附件显示部分选中的状态，以及对应的样式。

```python
from PySide6.QtWidgets import QApplication, QWidget, QCheckBox, QVBoxLayout, QLabel
app = QApplication([])
win = QWidget()
win.setWindowTitle("QCheckBox 示例")
label = QLabel("请选择:", win)
label.resize(200, 20)
label.move(20, 80)
checkbox = QCheckBox("test", win)
checkbox.resize(200, 20)
checkbox.move(20, 20)
def on_state_changed(state):
    if state == 2:  # 2 选中
        label.setText("已选中")
    else:  # 0 = 未选中
        label.setText("未选中")
checkbox.stateChanged.connect(on_state_changed)
win.show()
app.exec()
```

三态状态码：

+ `0` → 未选中 (Unchecked)
+ `1` → 部分选中 (PartiallyChecked)
+ `2` → 选中 (Checked)

| **方法/属性** | **说明** |
| :--- | :--- |
| `setChecked(True)` | 设置复选框为选中状态 |
| `isChecked()` | 返回当前是否选中（True/False） |
| `setTristate(True)` | 设置三态模式 |
| `stateChanged`<br/> 信号 | 状态变化时触发（0/1/2） |
| `toggled(bool)`<br/> 信号 | 状态切换时触发（True/False） |


## QRadioButton
单选按钮，用于在一组中选择一个选项。

+ `toggled(bool)` 信号在选中/取消时都会触发。
+ 常用读取：`rb.isChecked()`。
+ 同一父容器内的多个 `QRadioButton` 默认就是互斥的：选了一个，其他会自动取消。

```python
from PySide6.QtWidgets import QApplication, QWidget, QRadioButton, QLabel
app = QApplication([])
win = QWidget()
win.setWindowTitle("QRadioButton")
win.resize(320, 160)
label = QLabel("当前选择：-", win)
label.resize(100, 20)
label.move(20, 20)
rb = QRadioButton("选项A", win)
rb.move(20, 60)
def on_toggled(checked):
    if checked:
        label.setText("当前选择：A")
    else:
        label.setText("当前选择：-")
rb.toggled.connect(on_toggled)
win.show()
app.exec()
```

| **类/方法** | **作用** |
| :--- | :--- |
| `QRadioButton.setChecked` | 设为选中/不选中 |
| `QRadioButton.isChecked()` | 判断是否选中 |
| `QRadioButton.toggled` | 选中状态变化信号（bool） |
| `QButtonGroup.addButton` | 把按钮加入组并设置 id |
| `QButtonGroup.checkedId()` | 获取当前选中的 id |
| `QButtonGroup.checkedButton()` | 获取当前选中的按钮对象 |


## QComboBox
下拉框，用于选择列表中的一个选项。它也支持 可编辑模式，用户可以自己输入新内容。可编辑模式下，选择组件可以输入内容，按回车即可加入列表。

```python
from PySide6.QtWidgets import QApplication, QWidget, QComboBox, QLabel
app = QApplication([])
win = QWidget()
win.setWindowTitle("QComboBox")
win.resize(300, 180)
label = QLabel("请选择：", win)
label.move(20, 20)
combo = QComboBox(win)
combo.move(20, 60)
combo.resize(150, 30)
# 添加选项
combo.addItem("苹果")
combo.addItem("香蕉")
combo.addItem("橙子")
# 响应选择变化
def on_changed(text):
    label.setText(f"当前选择：{text}")
combo.currentTextChanged.connect(on_changed)
win.show()
app.exec()
```

| **方法/属性** | **说明** |
| :--- | :--- |
| `addItem(str)` | 添加单个选项 |
| `addItems(list)` | 添加多个选项 |
| `currentIndex()` | 获取当前选项索引（0 开始） |
| `currentText()` | 获取当前选项文本 |
| `setCurrentIndex(i)` | 设置默认选中项 |
| `setEditable(True)` | 设置可编辑模式 |
| `clear()` | 清空所有选项 |
| `currentTextChanged`<br/> 信号 | 当当前选项内容改变时触发 |


## QListWidget
用来展示一列文本项（也可带图标）。 常见需求：添加列表项、响应选中变化、支持多选、读取当前或全部选中项等。

```python
from PySide6.QtWidgets import QApplication, QWidget, QListWidget, QLabel
app = QApplication([])
win = QWidget()
win.setWindowTitle("QListWidget")
win.resize(360, 260)
label = QLabel("当前选择：-", win)
label.move(20, 20)
label.resize(300, 24)
lst = QListWidget(win)
lst.move(20, 60)
lst.resize(200, 160)
# 添加列表项
lst.addItem("苹果")
lst.addItem("香蕉")
lst.addItems(["橙子", "梨子", "葡萄"])
# 选中变化信号（当前行变化）
def on_current_row_changed(row):
    item = lst.currentItem()
    label.setText(f"当前选择：{item.text() if item else '-'} (row={row})")
lst.currentRowChanged.connect(on_current_row_changed)
# 也可用：lst.itemSelectionChanged.connect(回调)  # 当选中集合变化时触发
win.show()
app.exec()
```

| **方法/属性/信号** | **说明** |
| :--- | :--- |
| `addItem(str)`<br/> / `addItems(list)` | 添加一项 / 多项 |
| `insertItem(row, str)` | 在指定行插入 |
| `takeItem(row)` | 移除并返回该行项 |
| `clear()` | 清空所有项 |
| `count()` | 列表项数量 |
| `currentItem()`<br/> / `currentRow()` | 当前选中项 / 行索引 |
| `selectedItems()` | 返回所有被选中的项（多选） |
| `setSelectionMode(mode)` | 选择模式（单选/多选…） |
| `item(i)` | 获取第 i 行的项 |
| `itemSelectionChanged`<br/> 信号 | 选中集合变化（多选常用） |
| `currentRowChanged(int)`<br/> 信号 | 当前行改变（单选常用） |
| `itemDoubleClicked(QListWidgetItem)` | 双击项时触发 |


## ---QTreeWidget


## QSpinBox & QDoubleSpinBox
专门用于数值输入的控件

+ `QSpinBox` → 输入整数
+ `QDoubleSpinBox` → 输入浮点数（小数）

相比 `QLineEdit`，它们更安全，因为只能输入合法范围内的数值，还带上下箭头方便调整。

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QSpinBox
app = QApplication([])
win = QWidget()
win.setWindowTitle("QSpinBox")
win.resize(300, 150)
label = QLabel("选择的整数：0", win)
label.move(20, 20)
label.resize(200, 24)
spin = QSpinBox(win)
spin.move(20, 60)
spin.resize(100, 30)
def on_value_changed(value):
    label.setText(f"选择的整数：{value}")
spin.valueChanged.connect(on_value_changed)
# 设置范围
spin.setRange(0, 100)   # 只能输入 0~100
spin.setValue(10)       # 默认值
win.show()
app.exec()
```

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QDoubleSpinBox
app = QApplication([])
win = QWidget()
win.setWindowTitle("QDoubleSpinBox")
win.resize(300, 150)
label = QLabel("选择的小数：0.00", win)
label.move(20, 20)
label.resize(200, 24)
dspin = QDoubleSpinBox(win)
dspin.move(20, 60)
dspin.resize(120, 30)
def on_value_changed(value):
    label.setText(f"选择的小数：{value:.2f}")
dspin.valueChanged.connect(on_value_changed)
# 设置范围和精度
dspin.setRange(0.0, 10.0)   # 只能输入 0.0~10.0
dspin.setSingleStep(0.1)    # 每次增减 0.1
dspin.setDecimals(2)        # 保留 2 位小数
dspin.setValue(1.5)         # 默认值
win.show()
app.exec()
```

| **方法/属性** | **说明** |
| :--- | :--- |
| `setRange(min, max)` | 设置数值范围 |
| `setMinimum(value)` | 设置最小值 |
| `setMaximum(value)` | 设置最大值 |
| `setValue(value)` | 设置默认值 |
| `value()` | 获取当前数值 |
| `setSingleStep(step)` | 设置步长（一次加减多少） |
| `setDecimals(n)` | 设置小数位数（仅 QDoubleSpinBox） |
| `valueChanged`<br/> 信号 | 数值变化时触发（传递 int/float） |


## QSlider & QDial
`QSlider`（滑块）和 `QDial`（旋钮）都是数值输入控件，都支持 范围、步长、当前值 的设置，并通过 `valueChanged` 信号向外传递数据。

**QSlider**

+ `QSlider(Qt.Horizontal/Qt.Vertical)` 控制方向
+ `setRange(min, max)`、`setValue(v)`、`setSingleStep()`、`setPageStep()`
+ `valueChanged(int)` 信号：数值变化时触发

**QDial**

+ `QDial` 的 API 与 `QSlider` 很相似
+ `setNotchesVisible(True)` 显示刻度

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QSlider, QDial
from PySide6.QtCore import Qt
app = QApplication([])
win = QWidget()
win.setWindowTitle("滑块与旋钮联动")
win.resize(400, 240)
label = QLabel("值：20", win)
label.move(20, 20)
label.resize(200, 24)
slider = QSlider(Qt.Horizontal, win)
slider.move(20, 60)
slider.resize(300, 30)
slider.setRange(0, 100)
slider.setValue(20)
dial = QDial(win)
dial.move(20, 110)
dial.resize(120, 120)
dial.setRange(0, 100)
dial.setValue(20)

def set_from_slider(v):
    if dial.value() != v:
        dial.setValue(v)
    label.setText(f"值：{v}")

def set_from_dial(v):
    if slider.value() != v:
        slider.setValue(v)
    label.setText(f"值：{v}")

slider.valueChanged.connect(set_from_slider)
dial.valueChanged.connect(set_from_dial)

win.show()
app.exec()
```

| **控件** | **常用方法/属性** | **说明** |
| :--- | :--- | :--- |
| 共同 | `setRange(min, max)` | 设置数值范围 |
| 共同 | `setValue(v) / value()` | 设置/获取当前值 |
| 共同 | `setSingleStep(step)` | 单步增量（键盘方向键/鼠标滚轮） |
| 共同 | `setPageStep(step)` | 翻页步长（PageUp/PageDown） |
| QSlider | `setOrientation(Qt.Horizontal/Vertical)` | 方向 |
| QSlider | `setTickPosition(...)`<br/>、`setTickInterval(n)` | 刻度位置/间隔 |
| QDial | `setNotchesVisible(True)` | 显示刻度 |
| 共同信号 | `valueChanged(int)` | 值变化时触发 |
| 共同信号 | `sliderPressed/sliderReleased`<br/>（仅 QSlider） | 拖动按下/松开（可用于延迟更新） |


## QProgressBar
进度条控件，用来展示任务的执行进度，可以显示 百分比，也可以设置为 不确定模式（显示一个“忙碌状态”）。

```python
from PySide6.QtWidgets import QApplication, QWidget, QProgressBar
app = QApplication([])
win = QWidget()
win.setWindowTitle("QProgressBar")
win.resize(300, 120)
progress = QProgressBar(win)
progress.move(20, 40)
progress.resize(250, 30)
# 设置范围和初始值
progress.setRange(0, 100)   # 范围 0~100
progress.setValue(30)       # 当前值
win.show()
app.exec()
```

| **方法/属性** | **说明** |
| :--- | :--- |
| `setRange(min, max)` | 设置最小值和最大值 |
| `setMinimum(value)` | 设置最小值 |
| `setMaximum(value)` | 设置最大值 |
| `setValue(value)` | 设置当前值 |
| `value()` | 获取当前值 |
| `reset()` | 重置进度条 |
| `setTextVisible(bool)` | 是否显示百分比文字 |
| `setFormat(str)` | 设置文字格式，如 `"完成 %p%"` |


## ---QTabWidget
QTabWidget：选项卡窗口，用于将内容分组到多个选项卡页中。

## ---QFileDialog
QFileDialog：文件对话框，用于选择文件和目录。

## ---QMenuBar & QMenu
QMenuBar 和 QMenu：菜单栏和菜单，用于组织和呈现应用程序的菜单选项。

## ---QToolBar
QToolBar：工具栏，用于快速访问应用程序中的常用功能。

## ---QStatusBar
QStatusBar：状态栏，用于显示应用程序的状态信息。

## ---QMessageBox
QMessageBox：消息框，用于显示提示、警告和错误消息。

## ---QGraphicsView & QGraphicsScene
QGraphicsView 和 QGraphicsScene：用于处理 2D 图形和图形场景的组件。

## ---QCalendarWidget
QCalendarWidget：日历控件，用于显示和选择日期。

