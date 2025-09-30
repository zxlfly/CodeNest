# 5. 布局综合示例

上一节介绍了基础的布局控件，如果只是单一的使用那些控件，界面往往比较单一，在定制化需求下并不符合需求。实际的开发过程中，我们往往需要多层布局嵌套。

1. <font style="color:rgb(51, 51, 51);">创建多个布局，例如：水平布局（QHBoxLayout）和垂直布局（QVBoxLayout）</font>
2. <font style="color:rgb(51, 51, 51);">把控件放入各自的布局</font>
3. <font style="color:rgb(51, 51, 51);">把一个布局</font><font style="color:rgb(51, 51, 51);"> </font>**<font style="color:rgb(51, 51, 51);">嵌套到另一个布局</font>**<font style="color:rgb(51, 51, 51);"> </font><font style="color:rgb(51, 51, 51);">中</font>
4. <font style="color:rgb(51, 51, 51);">设置最外层布局为窗口的布局</font>

```python
import sys
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QHBoxLayout, QLabel

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("多层布局嵌套示例")
window.resize(400, 200)

# 左侧垂直布局（菜单）
left_layout = QVBoxLayout()
left_layout.addWidget(QPushButton("菜单 1"))
left_layout.addWidget(QPushButton("菜单 2"))
left_layout.addWidget(QPushButton("菜单 3"))

# 右侧垂直布局（内容 + 底部按钮）
right_layout = QVBoxLayout()
right_layout.addWidget(QLabel("这里是内容区域"))
bottom_layout = QHBoxLayout()
bottom_layout.addWidget(QPushButton("确认"))
bottom_layout.addWidget(QPushButton("取消"))

# 把底部按钮布局嵌套到右侧布局
right_layout.addLayout(bottom_layout)

# 主水平布局：左边菜单，右边内容
main_layout = QHBoxLayout()
main_layout.addLayout(left_layout)
main_layout.addLayout(right_layout)

window.setLayout(main_layout)
window.show()
sys.exit(app.exec())
```

## 综合示例
1. **<font style="color:rgb(51, 51, 51);">左菜单</font>**<font style="color:rgb(51, 51, 51);">：垂直布局 + 弹簧，让菜单靠上</font>
2. **<font style="color:rgb(51, 51, 51);">右页面</font>**<font style="color:rgb(51, 51, 51);">：堆栈布局，切换不同内容</font>
3. **<font style="color:rgb(51, 51, 51);">页面 1</font>**<font style="color:rgb(51, 51, 51);">：网格布局，控件跨列演示</font>
4. **<font style="color:rgb(51, 51, 51);">页面 2</font>**<font style="color:rgb(51, 51, 51);">：表单布局，左标签右输入框</font>
5. **<font style="color:rgb(51, 51, 51);">页面 3</font>**<font style="color:rgb(51, 51, 51);">：垂直布局 + 水平布局嵌套，底部按钮靠左</font>
6. **<font style="color:rgb(51, 51, 51);">伸缩因子</font>**<font style="color:rgb(51, 51, 51);">：左菜单=1，右页面=4，拉伸窗口时右边占更多空间</font>
7. **<font style="color:rgb(51, 51, 51);">间距 & 边距</font>**<font style="color:rgb(51, 51, 51);">：</font>`<font style="color:rgb(51, 51, 51);">setSpacing()</font>`<font style="color:rgb(51, 51, 51);"> + </font>`<font style="color:rgb(51, 51, 51);">setContentsMargins()</font>`

```python
import sys
from PySide6.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel, QLineEdit,
    QVBoxLayout, QHBoxLayout, QGridLayout, QFormLayout, QStackedLayout
)
from PySide6.QtCore import Qt

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("🎨 美化的综合示例")
window.resize(900, 650)

# 设置主窗口的现代化样式
window.setStyleSheet("""
    QWidget {
        background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                    stop:0 #2c3e50, stop:0.5 #34495e, stop:1 #2c3e50);
        color: white;
        font-family: 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
    }
    
    QLabel {
        color: #ecf0f1;
        font-size: 14px;
        font-weight: bold;
    }
    
    QLineEdit {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(52, 152, 219, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        color: white;
        font-size: 14px;
        selection-background-color: #3498db;
    }
    
    QLineEdit:focus {
        border: 2px solid #3498db;
        background: rgba(255, 255, 255, 0.15);
    }
""")

# 统一的按钮样式
button_style = """
    QPushButton {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(52, 152, 219, 0.8), stop:1 rgba(41, 128, 185, 0.8));
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
        padding: 12px 20px;
        min-height: 20px;
    }
    QPushButton:hover {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(52, 152, 219, 1.0), stop:1 rgba(41, 128, 185, 1.0));
        border: 2px solid rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
    }
    QPushButton:pressed {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(41, 128, 185, 0.8), stop:1 rgba(39, 174, 96, 0.8));
        transform: translateY(1px);
    }
"""

# 特殊按钮样式（提交、登录等）
action_button_style = """
    QPushButton {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(39, 174, 96, 0.8), stop:1 rgba(46, 204, 113, 0.8));
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
        padding: 12px 20px;
        min-height: 20px;
    }
    QPushButton:hover {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(39, 174, 96, 1.0), stop:1 rgba(46, 204, 113, 1.0));
        border: 2px solid rgba(255, 255, 255, 0.4);
    }
    QPushButton:pressed {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(46, 204, 113, 0.8), stop:1 rgba(39, 174, 96, 0.8));
    }
"""

# 危险按钮样式（取消等）
cancel_button_style = """
    QPushButton {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(231, 76, 60, 0.8), stop:1 rgba(192, 57, 43, 0.8));
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
        padding: 12px 20px;
        min-height: 20px;
    }
    QPushButton:hover {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(231, 76, 60, 1.0), stop:1 rgba(192, 57, 43, 1.0));
        border: 2px solid rgba(255, 255, 255, 0.4);
    }
    QPushButton:pressed {
        background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 rgba(192, 57, 43, 0.8), stop:1 rgba(231, 76, 60, 0.8));
    }
"""

# ---------------- 左侧菜单（垂直布局） ----------------
menu_layout = QVBoxLayout()

# 添加菜单标题
menu_title = QLabel("📝 菜单导航")
menu_title.setStyleSheet("""
    QLabel {
        font-size: 18px;
        font-weight: bold;
        color: #ecf0f1;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        margin-bottom: 10px;
    }
""")
menu_title.setAlignment(Qt.AlignCenter)
menu_layout.addWidget(menu_title)

btn_page1 = QPushButton("📄 表单页面")
btn_page2 = QPushButton("🔑 登录页面")
btn_page3 = QPushButton("⚙️ 设置页面")

# 为菜单按钮设置样式
for btn in [btn_page1, btn_page2, btn_page3]:
    btn.setStyleSheet(button_style)
    btn.setMinimumHeight(50)

menu_layout.addWidget(btn_page1)
menu_layout.addWidget(btn_page2)
menu_layout.addWidget(btn_page3)
menu_layout.addStretch()  # 弹簧占剩余空间，菜单靠上

# ---------------- 中间堆栈布局 ----------------
stack_layout = QStackedLayout()

# ---------- 页面 1：网格布局 ----------
page1 = QWidget()
page1.setStyleSheet("""
    QWidget {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        margin: 10px;
    }
""")

grid_layout = QGridLayout()
grid_layout.setSpacing(15)
grid_layout.setContentsMargins(30, 30, 30, 30)

# 添加页面标题
page1_title = QLabel("📄 用户信息表单")
page1_title.setStyleSheet("""
    QLabel {
        font-size: 20px;
        font-weight: bold;
        color: #ecf0f1;
        padding: 15px;
        margin-bottom: 20px;
    }
""")
page1_title.setAlignment(Qt.AlignCenter)
grid_layout.addWidget(page1_title, 0, 0, 1, 2)

grid_layout.addWidget(QLabel("👤 姓名："), 1, 0)
name_input = QLineEdit()
name_input.setPlaceholderText("请输入您的姓名")
grid_layout.addWidget(name_input, 1, 1)

grid_layout.addWidget(QLabel("🎂 年龄："), 2, 0)
age_input = QLineEdit()
age_input.setPlaceholderText("请输入您的年龄")
grid_layout.addWidget(age_input, 2, 1)

submit_btn = QPushButton("✔️ 提交信息")
submit_btn.setStyleSheet(action_button_style)
grid_layout.addWidget(submit_btn, 3, 0, 1, 2)  # 跨两列

page1.setLayout(grid_layout)

# ---------- 页面 2：表单布局 ----------
page2 = QWidget()
page2.setStyleSheet("""
    QWidget {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        margin: 10px;
    }
""")

form_layout = QFormLayout()
form_layout.setSpacing(20)
form_layout.setContentsMargins(30, 30, 30, 30)

# 添加页面标题
page2_title = QLabel("🔑 用户登录")
page2_title.setStyleSheet("""
    QLabel {
        font-size: 20px;
        font-weight: bold;
        color: #ecf0f1;
        padding: 15px;
        margin-bottom: 20px;
    }
""")
page2_title.setAlignment(Qt.AlignCenter)
form_layout.addRow(page2_title)

username_input = QLineEdit()
username_input.setPlaceholderText("请输入用户名")
form_layout.addRow(QLabel("👤 用户名："), username_input)

password_input = QLineEdit()
password_input.setPlaceholderText("请输入密码")
password_input.setEchoMode(QLineEdit.Password)
form_layout.addRow(QLabel("🔒 密码："), password_input)

login_btn = QPushButton("🚀 登录")
login_btn.setStyleSheet(action_button_style)
form_layout.addRow(login_btn)

page2.setLayout(form_layout)

# ---------- 页面 3：垂直 + 水平嵌套 ----------
page3 = QWidget()
page3.setStyleSheet("""
    QWidget {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        margin: 10px;
    }
""")

v_layout = QVBoxLayout()
v_layout.setSpacing(20)
v_layout.setContentsMargins(30, 30, 30, 30)

page3_title = QLabel("⚙️ 系统设置")
page3_title.setStyleSheet("""
    QLabel {
        font-size: 20px;
        font-weight: bold;
        color: #ecf0f1;
        padding: 15px;
        margin-bottom: 20px;
    }
""")
page3_title.setAlignment(Qt.AlignCenter)
v_layout.addWidget(page3_title)

setting_info = QLabel("🔧 这里可以设置系统参数和首选项")
setting_info.setStyleSheet("""
    QLabel {
        font-size: 16px;
        color: #bdc3c7;
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        margin: 10px 0;
    }
""")
setting_info.setAlignment(Qt.AlignCenter)
v_layout.addWidget(setting_info)

v_layout.addStretch()

h_bottom = QHBoxLayout()
confirm_btn = QPushButton("✅ 确认")
confirm_btn.setStyleSheet(action_button_style)
h_bottom.addWidget(confirm_btn)

h_bottom.addStretch()  # 弹簧，让按钮分开

cancel_btn = QPushButton("❌ 取消")
cancel_btn.setStyleSheet(cancel_button_style)
h_bottom.addWidget(cancel_btn)

v_layout.addLayout(h_bottom)
page3.setLayout(v_layout)

# ---------------- 把页面加入堆栈 ----------------
stack_layout.addWidget(page1)
stack_layout.addWidget(page2)
stack_layout.addWidget(page3)

# ---------------- 按钮切换页面 ----------------
btn_page1.clicked.connect(lambda: stack_layout.setCurrentIndex(0))
btn_page2.clicked.connect(lambda: stack_layout.setCurrentIndex(1))
btn_page3.clicked.connect(lambda: stack_layout.setCurrentIndex(2))

# ---------------- 主布局（左菜单 + 堆栈页面） ----------------
main_layout = QHBoxLayout()
main_layout.addLayout(menu_layout, 1)  # 左边菜单伸缩因子=1
main_layout.addLayout(stack_layout, 4)  # 右边页面伸缩因子=4
main_layout.setSpacing(20)  # 控件间距
main_layout.setContentsMargins(20, 20, 20, 20)  # 窗口边距

# ---------------- 给整体的Widget设定布局器 ----------------
window.setLayout(main_layout)

window.show()
sys.exit(app.exec())
```

