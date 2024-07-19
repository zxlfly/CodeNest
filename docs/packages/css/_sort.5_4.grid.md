# grid

Grid 布局则是将容器划分成**行**和**列**，产生单元格，然后指定**项目所在**的单元格，可以看作是二维布局

## 容器采用网格布局的区域

容器里面的水平区域称为**行（row）**，垂直区域称为**列（column）**，行和列交叉区域称为**单元格（cell）**；划分网格的线称为**网格线（grid line）**

### 容器属性

- `display: grid`指定一个容器采用网格布局。
  - 默认情况下，容器元素都是块级元素，但也可以设成行内元素。
- `grid-template-columns`定义每一列的列宽
  - `grid-template-columns:100px 100px 100px; // 显示为三列每一列宽度100px`
- `grid-template-rows`定义每一行的行高
  - `grid-template-columns:repeat(3,100px); //同上`
  - `repeat()`简化重复的值
  - 接受两个参数，第一个参数是重复的次数（上例是3），第二个参数是所要重复的值。
- `auto-fill`关键.
  - 有时，单元格的大小是固定的，但是容器的大小不确定，这个属性就会自动填充
  - `grid-template-columns: repeat(auto-fill, 100px);`
  - 表示每列宽度100px，然后自动填充，直到容器不能放置更多的列。
- `fr` 关键字
  - 比例关系，fraction ，意为"片段"，表示某一行或列在总宽度和总高度中占的份数
  - `grid-template-columns:repeat(4,1fr); // 宽度平均分成四等份`
  - `grid-template-columns:1fr 2fr 3fr; // 列宽这样是分成6份各占 1 2 3 份`
  - 可以与绝对长度的单位结合使用`grid-template-columns: 150px 1fr 2fr;`
    - 表示，第一列的宽度为150像素，第二列的宽度是第三列的一半。
- `minmax()`接受两个参数，分别为最小值和最大值，表示长度就在这个范围之中。
  - `grid-template-columns: 1fr 1fr minmax(100px, 1fr);`
  - 表示列宽不小于100px，不大于1fr。
- `auto` 关键字,表示由浏览器自己决定长度。
  - ``grid-template-columns: 100px auto 100px;`
- 网格线的名称
  - 网格线．可以用方括号定义网格线名称，方便以后给盒子定位使用
  - `grid-template-columns: [c1] 100px [c2] 100px [c3] 100px [c4];`
  - 网格布局允许同一根线有多个名字
- `row-gap`属性设置行与行的间隔（行间距）
- `column-gap`属性设置列与列的间隔（列间距）
- `gap`属性是`column-gap`和`row-gap`的合并简写形式
- `grid-template-areas`属性
  - 网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。`grid-template-areas`属性用于定义区域。
  - 比如可以用来给网页区域命名，`grid-template-areas: "header header header" "main main sidebar" "footer footer footer";`
  - 注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为区域名-start，终止网格线自动命名为区域名-end。比如，区域名为header，则起始位置的水平网格线和垂直网格线叫做header-start，终止位置的水平网格线和垂直网格线叫做header-end。
  - 如果某些区域不需要利用，则使用"点"（.）表示。
- `grid-auto-flow`属性
  - 分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行
  - `grid-auto-flow： row`先行后列
  - `grid-auto-flow： row dense`先行后列,并且尽可能紧密填满，尽量不出现空格
  - `grid-auto-flow： column`先列后行
  - `grid-auto-flow： column dense`先列后行,并且尽可能紧密填满，尽量不出现空格
- `justify-items`属性设置单元格内容的水平位置（左中右）
- `align-items`属性设置单元格内容的垂直位置（上中下）
  - 这两个属性的写法完全相同，都可以取下面这些值。
    - start：对齐单元格的起始边缘。
    - end：对齐单元格的结束边缘。
    - center：单元格内部居中。
    - stretch：拉伸，占满单元格的整个宽度（默认值）。
- `place-items`上面两个属性的合并简写形式
- `justify-content`属性是整个内容区域在容器里面的水平位置（左中右）
- `align-content`属性是整个内容区域的垂直位置（上中下）
  - 这两个属性的写法完全相同，都可以取下面这些值。'
    - start - 对齐容器的起始边框。
    - end - 对齐容器的结束边框。
    - center - 容器内部居中。
    - stretch - 项目大小没有指定时，拉伸占据整个网格容器。
    - space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
    - space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔。
    - space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。
- `place-content`上面两个属性的合并简写形式
- `grid-auto-columns grid-auto-rows`有时候，一些项目的指定位置，在现有网格的外部。这时，浏览器会自动生成多余的网格，以便放置项目。这两个属性就是用来设置，浏览器自动创建的多余网格的列宽和行高。
  - 用法与`grid-template-columns`和`grid-template-rows`完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。
- `grid-template`属性是`grid-template-columns`、`grid-template-rows`和`grid-template-areas`这三个属性的合并简写形式。
- `grid`属性是`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、`grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`这六个属性的合并简写形式。

### 项目属性

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。

- `grid-column-start`属性：左边框所在的垂直网格线
- `grid-column-end`属性：右边框所在的垂直网格线
- `grid-row-start`属性：上边框所在的水平网格线
- `grid-row-end`属性：下边框所在的水平网格线
- `span`关键字
  - 上面四个属性都可以使用，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。
除开制定了位置的项目，其他项目默认由浏览器自动布局，这时它们的位置由容器的grid-auto-flow属性决定，这个属性的默认值是row
- `grid-column`属性是`grid-column-star`t和`grid-column-end`的合并简写形式，
- `grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式。
- `grid-area`指定项目放在哪个区域
  - 还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的合并简写形式，直接指定项目的位置。
  - `grid-area: <row-start> / <column-start> / <row-end> / <column-end>;`
- `justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。
- `align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。
  - 这两个属性都可以取下面四个值。
    - start：对齐单元格的起始边缘。
    - end：对齐单元格的结束边缘。
    - center：单元格内部居中。
    - stretch：拉伸，占满单元格的整个宽度（默认值）。
- `place-sel`f属性是`align-self`属性和`justify-self`属性的合并简写形式。
