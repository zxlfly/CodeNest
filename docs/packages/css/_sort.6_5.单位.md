# 单位问题

## 设备物理像素pt

屏幕宽/分辨率，其中每一小份就是1pt

### css像素px

px为一个相对单位，以手机iPhone6为标准，物理像素750，分辨率375，1px=2pt

### 设备像素比(device pixel ratio)

设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。它的值可以按下面的公式计算得到：
`设备像素比 ＝ 物理像素 / 设备独立像素`
在JavaScript中，可以通过`window.devicePixelRatio`获取到当前设备的dpr。而在CSS中，可以通过`-webkit-device-pixel-ratio`，`-webkit-min-device-pixel-ratio`和 `-webkit-max-device-pixel-ratio`进行媒体查询，对不同dpr的设备，做一些样式适配(这里只针对webkit内核的浏览器和webview)。

### %

- 通常认为子元素的百分比完全相对于直接父元素，但是，不总是相对于父元素的对应属性值
- 子元素的 top 和 bottom 如果设置百分比，则相对于直接非 static 定位(默认定位)的父元素的高度
- 子元素的 left 和 right 如果设置百分比，则相对于直接非 static 定位(默认定位的)父元素的宽度
- 但是，绝对定位时，就不一定参照父元素的宽和高了。而是参照最近的定位元素的包含padding的宽和高
- 由于这些原因，实际开发用的相对较少

### css3: vw、vh

- vh :无论视口高度多少，都将视口高均分为100份，每1小份就是1vh，所以，也是相对单位，可随视口大小变化而自动变化。
- vw :无论视口宽度多少，都将视口宽均分为100份，每1小份就是1vw，所以，也是相对单位，可随视口大小变化而自动变化。
- 这里是视口指的是浏览器内部的可视区域大小,所以也可以把他们理解成为一种特殊的百分比。

### rpx

小程序专用，uniapp这种跨端框架目前也是使用的这种单位。
以iPhone6为标准，物理像素750，分辨率375。1rpx=0.5px=1pt。
无论屏幕大小，都将屏幕分成750份，每份就是1rpx。

### em

父元素的字体大小为1em

### rem

以网页根元素`html`元素上设置的默认字体大小为1rem
移动端常见的响应式实现方案就是根据此单位实现的，vw，vh也是可以的。
例子：

```JavaScript
(function flexible (window, document) {
  var docEl = document.documentElement
  function setHtmlFontSize () {
    document.addEventListener('DOMContentLoaded', setHtmlFontSize)
  }
  setHtmlFontSize();
  // 1rem = viewWidth / 750 这里不一定要是750
  function setRemUnit () {
    var rem = docEl.clientWidth / 750
    docEl.style.fontSize = rem + 'px'
  }
  setRemUnit()
  // 窗口变化 重新计算
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })
}(window, document))
```

### 实现小于12px字体大小

```css
-webkit-transform: scale(0.5);  /*定义2D缩放*/
-webkit-transform-origin:left top; /*定义缩放源点为左上角*/
```

### 1px边框问题

在设备像素比大于1的屏幕上，我们写的1px实际上是被多个物理像素渲染，这就会出现1px在有些屏幕上看起来很粗的现象。

#### 设备像素/物理像素

计算机屏幕以像素显示事物。显示器上的单个物理“光点”，能够独立于其邻居显示颜色，称为像素。即屏幕上显示的最小单元，称为“设备像素”。

#### CSS 像素 (px) 设备独立像素

此为逻辑像素，计算机设备中的一个点，css 中设置的像素指的就是该像素。

#### 设备像素比

设备像素比(dpr) = 物理像素/设备独立像素。如 iphone 6 的 dpr 为 2，那么一个设备独立像素便为 4 个物理像素，因此在 css 上设置的 1px 在其屏幕上占据的是 2个物理像素，0.5px 对应的才是其所能展示的最小单位。这就是 1px 在 retina 屏上变粗的原因

#### 解决方案

- viewport 的 initial-scale 属性缩放页面，值为1/dpr
  - 不推荐
- 根据使用媒体查询，根据dpr设置不同的缩放

```css
// 伪类 + transform  也可以使用 border-image、background-image、svg
.border_1px:before{
  content: '';
  position: absolute;
  top: 0;
  height: 1px;
  width: 100%;
  background-color: #000;
  transform-origin: 50% 0%;
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
    .border_1px:before{
        transform: scaleY(0.5);
    }
}
@media only screen and (-webkit-min-device-pixel-ratio:3){
    .border_1px:before{
        transform: scaleY(0.33);
    }
}
```

### 图片模糊问题

针对不同DPR的屏幕，我们需要展示不同分辨率的图片。不然图片会模糊

#### 使用media查询判断不同的设备像素比来显示不同精度的图片

```css
// 只适用于背景图
.avatar{
    background-image: url(bg_1x.png);
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
    .avatar{
        background-image: url(bg_2x.png);
    }
}
@media only screen and (-webkit-min-device-pixel-ratio:3){
    .avatar{
        background-image: url(bg_3x.png);
    }
}
```

#### image-set

```css
// 只适用于背景图
.avatar {
    background-image: -webkit-image-set( "bg_1x.png" 1x, "bg_2x.png" 2x );
}
```

#### srcset

```html
<img src="bg_1x.png" srcset=" bg_2x.png 2x, bg_3x.png 3x">
```

#### 使用window.devicePixelRatio获取设备像素比，遍历所有图片，替换图片地址

```javaScript
const dpr = window.devicePixelRatio;
const images =  document.querySelectorAll('img');
images.forEach((img)=>{
  img.src.replace(".", `@${dpr}x.`);
})
```

#### svg

```html
<img src="conardLi.svg">
<img src="data:image/svg+xml;base64,[data]">
.img {
  background: url(img.svg);
}
```
