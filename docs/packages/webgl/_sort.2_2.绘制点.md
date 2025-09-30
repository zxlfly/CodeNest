# 2.绘制点
## 入门基础用法
- 在html中建立canvas 画布
- 在js中获取canvas画布
- 使用canvas 获取webgl 绘图上下文
- 在script中建立顶点着色器和片元着色器，glsl es
- 在js中获取顶点着色器和片元着色器的文本
- 初始化着色器
- 指定将要用来清空绘图区的颜色
- 使用之前指定的颜色，清空绘图区
- 绘制顶点
## 编写着色器
可以是字符串的形式；也可以写在script中需要修改type属性，不能让浏览器当做js执行；也可以从远程获取。
### 顶点着色器
```glsl
void main(){
  //声明顶点位置
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  //声明待绘制的点的大小。
  gl_PointSize = 5.0;
}
```
### 片元着色器
```glsl
void main(){
    //设置像素的填充颜色为红色。
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}

```
上面例子中用到的内置属性：

- **gl_Position**：**顶点的裁剪坐标系坐标**，包含 X, Y, Z，W 四个坐标分量，顶点着色器接收到这个坐标之后，对它进行透视除法，即将各个分量同时除以 W，转换成 NDC 坐标，NDC 坐标每个分量的取值范围都在【-1, 1】之间，GPU 获取这个属性值作为顶点的最终位置进行绘制。
   - GLSL 中 gl_Position 所接收的坐标所在坐标系是裁剪坐标系 ，不同于我们的浏览器窗口坐标系。所以当我们赋予 gl_Position 位置信息的时候，需要对其进行转换才能正确显示。
- **gl_FragColor**：**片元（像素）颜色**，包含 R, G, B, A 四个颜色分量，且每个分量的取值范围在【0,1】之间，GPU 获取这个值作为像素的最终颜色进行着色。
   - gl_FragColor，属于 GLSL 内置属性，用来设置片元颜色，包含 4 个分量 (R, G, B, A)，各个颜色分量的取值范围是【0，1】，也不同于我们常规颜色的【0，255】取值范围，所以当我们给 gl_FragColor 赋值时，也需要对其进行转换。平常我们所采用的颜色值（R, G, B, A），对应的转换公式为： (R值/255，G值/255，B值/255，A值/1）。拿红色举例，在CSS中，红色用 RGBA 形式表示是（255，0，0，1），那么转换成 GLSL 形式就是(255 / 255, 0 / 255, 0 / 255, 1 / 1)，转换后的值为（1.0, 0.0, 0.0, 1.0)。
- **gl_PointSize**：**绘制到屏幕的点的大小**，需要注意的是，gl_PointSize只有在绘制图元是点的时候才会生效。当我们绘制线段或者三角形的时候，gl_PointSize是不起作用的
- **vec4**：**包含四个浮点元素的容器类型**，vec 是 vector（向量）的单词简写，vec4 代表包含 4 个浮点数的向量。此外，还有 vec2、vec3 等类型，代表包含2个或者3个浮点数的容器。
## 编写HTML
这里需要注意下，虽然canvas 2d 画布和webgl 画布使用的坐标系都是二维直角坐标系，但是它们坐标原点、y 轴的坐标方向，坐标基底都不一样了。
#### canvas 2d画布的坐标系

- canvas 2d 坐标系的原点在左上角。
- canvas 2d 坐标系的y 轴方向是朝下的。
- canvas 2d 坐标系的坐标基底有两个分量，分别是一个像素的宽和一个像素的高，即1个单位的宽便是1个像素的宽，1个单位的高便是一个像素的高。
#### webgl的坐标系

- webgl坐标系的坐标原点在画布中心。
- webgl坐标系的y 轴方向是朝上的。
- webgl坐标基底中的两个分量分别是半个canvas的宽和canvas的高，即1个单位的宽便是半个个canvas的宽，1个单位的高便是半个canvas的高。
```html
<body>
  <!-- 顶点着色器源码 -->
  <script type="shader-source" id="vertexShader">
    void main(){
    //声明顶点位置
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    //声明要绘制的点的大小。
    gl_PointSize = 10.0;
    }
  </script>

  <!-- 片元着色器源码 -->
  <script type="shader-source" id="fragmentShader">
    void main(){
    //设置像素颜色为红色
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
    }
  </script>
	<!-- 绘制的地方 -->
  <canvas id="canvas"></canvas>
</body>

```
## 编写JavaScript
### 获取绘制webgl的canvas
```javascript
var canvas = document.querySelector('#canvas');
var gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");

```
### 创建色器对象
```javascript
// 获取顶点着色器源码
var vertexShaderSource = document.querySelector('#vertexShader').innerHTML;
// 创建顶点着色器对象
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
// 将源码分配给顶点着色器对象
gl.shaderSource(vertexShader, vertexShaderSource);
// 编译顶点着色器程序
gl.compileShader(vertexShader);

// 获取片元着色器源码
var fragmentShaderSource = document.querySelector('#fragmentShader').innerHTML;
// 创建片元着色器程序
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// 将源码分配给片元着色器对象
gl.shaderSource(fragmentShader, fragmentShaderSource);
// 编译片元着色器
gl.compileShader(fragmentShader);

```
### 创建着色器程序
```javascript
//创建着色器程序
var program = gl.createProgram();
//将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
//将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
//链接着色器程序
gl.linkProgram(program);

```
### 启用着色器程序
在一个webgl的程序中，program可以有多个，在使用某个 program 绘制之前，我们要先启用它。
```javascript
// 使用刚创建好的着色器程序。
gl.useProgram(program);
```
## 绘制
```javascript
//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);

//绘制点。
gl.drawArrays(gl.POINTS, 0, 1);

```
### gl.drawArrays
``void gl.drawArrays(mode, first, count);``

- 参数：
   - mode，代表图元类型。
   - first，代表从第几个点开始绘制。
   - count，代表绘制的点的数量。
## 基础的封装
从下一节开始不会再写这些代码
这上面很多代码在后续使用中会反复的用到所以需要简单的封装处理下
```javascript
// 获取着色器代码
const vsSource = document.getElementById('vertexShader').innerText;
const fsSource = document.getElementById('fragmentShader').innerText;

function initShaders(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  //启动程序对象
  gl.useProgram(program);
  return program;
}
function createProgram(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  return program
}

function loadShader(gl, type, source) {
  //根据着色类型，建立着色器对象
  const shader = gl.createShader(type);
  //将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  //编译着色器对象
  gl.compileShader(shader);
  //返回着色器对象
  return shader;
}

function randomColor() {
	return {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		a: Math.random() * 1,
	};
}
```

## 上面过程完整代码
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
		<style>
			* {
				padding: 0;
				margin: 0;
			}
		</style>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader-x-vertex">
		void main(){
		  //声明顶点位置
		  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
		  //声明待绘制的点的大小。
		  gl_PointSize = 5.0;
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader-x-fragment">
		  void main(){
		    //设置像素的填充颜色为红色。
		    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
	</script>
	<script type="module">
		var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const vsSource = document.getElementById("vertexShader").innerText;
		const fsSource = document.getElementById("fragmentShader").innerText;
		var gl =
			canvas.getContext("webgl") ||
			canvas.getContext("experimental-webgl");
		var program = initShaders(gl, vsSource, fsSource);
		//设置清空画布颜色为黑色。
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		//用上一步设置的清空画布颜色清空画布。
		gl.clear(gl.COLOR_BUFFER_BIT);

		//绘制点。
		gl.drawArrays(gl.POINTS, 0, 1);

		function initShaders(gl, vsSource, fsSource) {
			//创建程序对象
			const program = gl.createProgram();
			//建立着色对象
			const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
			const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
			//把顶点着色对象装进程序对象中
			gl.attachShader(program, vertexShader);
			//把片元着色对象装进程序对象中
			gl.attachShader(program, fragmentShader);
			//连接webgl上下文对象和程序对象
			gl.linkProgram(program);
			//启动程序对象
			gl.useProgram(program);

			return program;
		}
		function createProgram(gl, vsSource, fsSource) {
			//创建程序对象
			const program = gl.createProgram();
			//建立着色对象
			const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
			const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
			//把顶点着色对象装进程序对象中
			gl.attachShader(program, vertexShader);
			//把片元着色对象装进程序对象中
			gl.attachShader(program, fragmentShader);
			//连接webgl上下文对象和程序对象
			gl.linkProgram(program);
			return program;
		}

		function loadShader(gl, type, source) {
			//根据着色类型，建立着色器对象
			const shader = gl.createShader(type);
			//将着色器源文件传入着色器对象中
			gl.shaderSource(shader, source);
			//编译着色器对象
			gl.compileShader(shader);
			//返回着色器对象
			return shader;
		}
	</script>
</html>

```
## 点的动态绘制
上面的例子只是一个静态的点，下面实现在鼠标点击过的位置绘制一个点的效果，而且这个点的颜色是随机的。
这里就需要通过 JavaScript 往着色器程序中传入顶点位置和颜色数据，从而改变点的位置和颜色。
### 改写着色器程序
#### 顶点着色器
```glsl
//设置浮点数精度为中等精度
precision mediump float;
//接收点在 canvas 坐标系上的坐标 (x, y)
attribute vec2 a_Position;
//接收 canvas 的宽高尺寸
attribute vec2 a_Screen_Size;
void main(){
  //将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
  // 将(x,y) 转化到【0, 1】区间，再将 【0, 1】之间的值乘以 2 转化到 【0, 2】区间，
  // 之后再减去 1 ，转化到 【-1, 1】之间的值，即 NDC 坐标
  // 后面会使用矩阵变换来实现
  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0; 
  position = position * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0, 1);
  // 点的大小
  gl_PointSize = 5.0;
}
```
#### 片元着色器
```glsl
//设置浮点数精度为中等精度
precision mediump float;
//接收 JavaScript 传过来的颜色值（RGBA）。
// 
uniform vec4 u_Color;
void main(){
    //将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
   vec4 color = u_Color / vec4(255, 255, 255, 1);
   gl_FragColor = color; 
}
```

- attribue 变量：只能在顶点着色器中定义。
- uniform 变量：既可以在顶点着色器中定义，也可以在片元着色器中定义。
- 最后一种变量类型 varing 变量：它用来从顶点着色器中往片元着色器传递数据。使用它我们可以在顶点着色器中声明一个变量并对其赋值，经过插值处理后，在片元着色器中取出插值后的值来使用。
### JavaScript改写
增加了为着色器中变量进行赋值的代码。
动态绘制点的逻辑是：

- 声明一个数组变量 points，存储点击位置的坐标。
- 绑定 canvas 的点击事件。
- 触发点击操作时，把点击坐标添加到数组 points 中。
- 遍历每个点执行 drawArrays(gl.Points, 0, 1) 绘制操作。
```javascript
// ......
//找到顶点着色器中的变量a_Position
var a_Position = gl.getAttribLocation(program, 'a_Position');
//找到顶点着色器中的变量a_Screen_Size
var a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
//找到片元着色器中的变量u_Color
var u_Color = gl.getUniformLocation(program, 'u_Color');
//为顶点着色器中的 a_Screen_Size 传递 canvas 的宽高信息
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
//存储点击位置的数组。
var points = [];
canvas.addEventListener('click', e => {
   var x = e.pageX;
   var y = e.pageY;
   var color = randomColor();
   points.push({ x: x, y: y, color: color })
   gl.clearColor(0, 0, 0, 1.0);
   //用上一步设置的清空画布颜色清空画布。
  	gl.clear(gl.COLOR_BUFFER_BIT);
   for (let i = 0; i < points.length; i++) {
     var color = points[i].color;
     //为片元着色器中的 u_Color 传递随机颜色
     gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
     //为顶点着色器中的 a_Position 传递顶点坐标。
     gl.vertexAttrib2f(a_Position, points[i].x, points[i].y);
     //绘制点
     gl.drawArrays(gl.POINTS, 0, 1);
   }
 })
 // 设置清屏颜色
 gl.clearColor(0, 0, 0, 1.0);
 // 用上一步设置的清空画布颜色清空画布。
 gl.clear(gl.COLOR_BUFFER_BIT);


```
## 鼠标绘制不同颜色的点完整代码
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
		<style>
			* {
				padding: 0;
				margin: 0;
			}
		</style>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader-x-vertex">
		//设置浮点数精度为中等精度
		precision mediump float;
		//接收点在 canvas 坐标系上的坐标 (x, y)
		attribute vec2 a_Position;
		//接收 canvas 的宽高尺寸
		attribute vec2 a_Screen_Size;
		void main(){
		  //将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
		  // 将(x,y) 转化到【0, 1】区间，再将 【0, 1】之间的值乘以 2 转化到 【0, 2】区间，
		  // 之后再减去 1 ，转化到 【-1, 1】之间的值，即 NDC 坐标
		  // 后面会使用矩阵变换来实现
		  vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
		  position = position * vec2(1.0, -1.0);
		  gl_Position = vec4(position, 0, 1);
		  // 点的大小
		  gl_PointSize = 5.0;
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader-x-fragment">
		//设置浮点数精度为中等精度
		precision mediump float;
		//接收 JavaScript 传过来的颜色值（RGBA）。
		//
		uniform vec4 u_Color;
		void main(){
		    //将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
		   vec4 color = u_Color / vec4(255, 255, 255, 1);
		   gl_FragColor = color;
		}
	</script>
	<script type="module">
		var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const vsSource = document.getElementById("vertexShader").innerText;
		const fsSource = document.getElementById("fragmentShader").innerText;
		var gl =
			canvas.getContext("webgl") ||
			canvas.getContext("experimental-webgl");
		var program = initShaders(gl, vsSource, fsSource);
		//找到顶点着色器中的变量a_Position
		var a_Position = gl.getAttribLocation(program, "a_Position");
		//找到顶点着色器中的变量a_Screen_Size
		var a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		//找到片元着色器中的变量u_Color
		var u_Color = gl.getUniformLocation(program, "u_Color");
		//为顶点着色器中的 a_Screen_Size 传递 canvas 的宽高信息
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
		//存储点击位置的数组。
		var points = [];
		canvas.addEventListener("click", (e) => {
			var x = e.pageX;
			var y = e.pageY;
			var color = randomColor();
			points.push({ x: x, y: y, color: color });
			gl.clearColor(0, 0, 0, 1.0);
			//用上一步设置的清空画布颜色清空画布。
			gl.clear(gl.COLOR_BUFFER_BIT);
			for (let i = 0; i < points.length; i++) {
				var color = points[i].color;
				//为片元着色器中的 u_Color 传递随机颜色
				gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
				//为顶点着色器中的 a_Position 传递顶点坐标。
				gl.vertexAttrib2f(a_Position, points[i].x, points[i].y);
				//绘制点
				gl.drawArrays(gl.POINTS, 0, 1);
			}
		});
		// 设置清屏颜色
		gl.clearColor(0, 0, 0, 1.0);
		// 用上一步设置的清空画布颜色清空画布。
		gl.clear(gl.COLOR_BUFFER_BIT);

		function initShaders(gl, vsSource, fsSource) {
			//创建程序对象
			const program = gl.createProgram();
			//建立着色对象
			const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
			const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
			//把顶点着色对象装进程序对象中
			gl.attachShader(program, vertexShader);
			//把片元着色对象装进程序对象中
			gl.attachShader(program, fragmentShader);
			//连接webgl上下文对象和程序对象
			gl.linkProgram(program);
			//启动程序对象
			gl.useProgram(program);

			return program;
		}
		function createProgram(gl, vsSource, fsSource) {
			//创建程序对象
			const program = gl.createProgram();
			//建立着色对象
			const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
			const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
			//把顶点着色对象装进程序对象中
			gl.attachShader(program, vertexShader);
			//把片元着色对象装进程序对象中
			gl.attachShader(program, fragmentShader);
			//连接webgl上下文对象和程序对象
			gl.linkProgram(program);
			return program;
		}

		function loadShader(gl, type, source) {
			//根据着色类型，建立着色器对象
			const shader = gl.createShader(type);
			//将着色器源文件传入着色器对象中
			gl.shaderSource(shader, source);
			//编译着色器对象
			gl.compileShader(shader);
			//返回着色器对象
			return shader;
		}
		function randomColor() {
			return {
				r: Math.random() * 255,
				g: Math.random() * 255,
				b: Math.random() * 255,
				a: Math.random(),
			};
		}
	</script>
</html>

```
## 总结
### GLSL

- gl_Position： 内置变量，用来设置顶点坐标。
- gl_PointSize： 内置变量，用来设置顶点大小。
- vec2：2 维向量容器，可以存储 2 个浮点数。
- gl_FragColor： 内置变量，用来设置像素颜色。
- vec4：4 维向量容器，可以存储 4 个浮点数。
- precision：精度设置限定符，使用此限定符设置完精度后，之后所有该数据类型都将沿用该精度，除非单独设置。
- 运算符：向量的对应位置进行运算，得到一个新的向量。
   - vec * 浮点数： vec2(x, y) * 2.0 = vec(x * 2.0, y * 2.0)。
   - vec2 * vec2：vec2(x1, y1) * vec2(x2, y2) = vec2(x1 * x2, y1 * y2)。
   - 加减乘除规则基本一致。但是要注意一点，如果参与运算的是两个 vec 向量，那么这两个 vec 的维数必须相同。
### JavaScript
#### 程序如何连接着色器程序

- createShader：创建着色器对象
- shaderSource：提供着色器源码
- compileShader：编译着色器对象
- createProgram：创建着色器程序
- attachShader：绑定着色器对象
- linkProgram：链接着色器程序
- useProgram：启用着色器程序
#### 如何往着色器中传递数据

- getAttribLocation：找到着色器中的 attribute 变量地址。
- gl.vertexAttrib3f(location,v0,v1,v2) 方法是一系列修改着色器中的attribute 变量的方法之一，它还有许多同族方法gl.vertexAttrib*
   - gl.vertexAttrib1f(location,v0)
   - gl.vertexAttrib2f(location,v0,v1)
   - gl.vertexAttrib3f(location,v0,v1,v2)
   - gl.vertexAttrib4f(location,v0,v1,v2,v3)
   - 它们都可以改变attribute 变量的前n 个值。
   - 比如 vertexAttrib1f() 方法自定一个矢量对象的v0值，v1、v2 则默认为0.0，v3默认为1.0，其数值类型为float 浮点型。
- getUniformLocation：找到着色器中的 uniform 变量地址。
- uniform4f：给uniform变量传递四个浮点数。它还有许多同族方法gl.uniform* 系列函数
   - gl.uniform1f(uniformLocation, value); 
   - gl.uniform1i(uniformLocation, value); 
   - gl.uniform2f(uniformLocation, x, y); 
   - gl.uniform3f(uniformLocation, x, y, z); 
   - gl.uniform4f(uniformLocation, x, y, z, w); 
   - gl.uniformMatrix4fv(uniformLocation, false, matrix);
   - 和上面的规则一样
### webgl绘制

- drawArrays: 用指定的图元进行绘制。
### webgl图元

- gl.POINTS: 将绘制图元类型设置成点图元。

