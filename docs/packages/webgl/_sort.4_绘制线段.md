# 绘制线段
经过前面的学习，我们已经基本知道了webgl开发的基本流程和要素，以及如何通过缓冲区向着色器传递数据。
这节将讲解最后一种基本图元线段。
线段图元分为三种：

- LINES：基本线段。
- LINE_STRIP：带状线段。
- LINE_LOOP：环状线段。

## LINES 图元
绘制每一条线段都需要明确指定构成线段的两个端点。
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader/x-vertex">
		attribute vec4 a_Position;
		void main(){
		    gl_Position=a_Position;
		    gl_PointSize=20.0;
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		void main(){
		    gl_FragColor=vec4(1,1,0,1);
		}
	</script>
	<script type="module">
		import { initShaders } from "../js/utils.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		//顶点数据
		let points = [0, 0.2];
		//缓冲对象
		const vertexBuffer = gl.createBuffer();
		//绑定缓冲对象
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		//写入数据
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(points),
			gl.STATIC_DRAW
		);
		//获取attribute 变量
		const a_Position = gl.getAttribLocation(program, "a_Position");
		//修改attribute 变量
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
		//赋能-批处理
		gl.enableVertexAttribArray(a_Position);
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		//绘制顶点
		gl.drawArrays(gl.POINTS, 0, 1);
		// WebGLBuffer缓冲区中的数据在异步方法里不会被重新置空。
		setTimeout(() => {
			points.push(-0.2, -0.1);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(points),
				gl.STATIC_DRAW
			);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.POINTS, 0, 2);
		}, 1000);
		setTimeout(() => {
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.POINTS, 0, 2);
			gl.drawArrays(gl.LINES, 0, 2);
		}, 2000);
	</script>
</html>

```
## LINE_STRIP
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader/x-vertex">
		//浮点数设置为中等精度
		precision mediump float;
		//接收 JavaScript 传递过来的点的坐标（X, Y）
		attribute vec2 a_Position;
		// 接收canvas的尺寸。
		attribute vec2 a_Screen_Size;
		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和 设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);
			gl_PointSize = 5.0;

		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		precision mediump float;
		//全局变量，用来接收 JavaScript传递过来的颜色。
		uniform vec4 u_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = u_Color / vec4(255, 255, 255, 1);
			// 点的最终颜色。
			gl_FragColor = color;
		}
	</script>
	<script type="module">
		import { initShaders, randomColor } from "../js/utils.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		// 随机生成一个颜色。
		let color = randomColor();
		// 找到着色器中的全局变量 u_Color;
		let u_Color = gl.getUniformLocation(program, "u_Color");
		// 将随机颜色传递给给全局变量
		gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
		// 获取 canvas 尺寸。
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		// 将 canvas 尺寸传递给顶点着色器。
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		let positions = [];

		let a_Position = gl.getAttribLocation(program, "a_Position");

		gl.enableVertexAttribArray(a_Position);

		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

		//设置清屏颜色为黑色。
		gl.clearColor(0, 0, 0, 1);

		canvas.addEventListener("click", (e) => {
			positions.push(e.pageX, e.pageY);

			if (positions.length > 0) {
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(
					gl.ARRAY_BUFFER,
					new Float32Array(positions),
					gl.STATIC_DRAW
				);

				render(gl);
			}
		});

		/*渲染*/
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if (positions.length > 0) {
				gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 2);
			}
		}
		render(gl);
	</script>
</html>

```
## LINE_LOOP
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>webgl</title>
	</head>

	<body>
		<canvas id="canvas"></canvas>
	</body>
	<!-- 顶点着色器 -->
	<script id="vertexShader" type="x-shader/x-vertex">
		//浮点数设置为中等精度
		precision mediump float;
		//接收 JavaScript 传递过来的点的坐标（X, Y）
		attribute vec2 a_Position;
		// 接收canvas的尺寸。
		attribute vec2 a_Screen_Size;
		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和 设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);
			gl_PointSize = 5.0;

		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		precision mediump float;
		//全局变量，用来接收 JavaScript传递过来的颜色。
		uniform vec4 u_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = u_Color / vec4(255, 255, 255, 1);
			// 点的最终颜色。
			gl_FragColor = color;
		}
	</script>
	<script type="module">
		import { initShaders, randomColor } from "../js/utils.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		// 随机生成一个颜色。
		let color = randomColor();
		// 找到着色器中的全局变量 u_Color;
		let u_Color = gl.getUniformLocation(program, "u_Color");
		// 将随机颜色传递给给全局变量
		gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
		// 获取 canvas 尺寸。
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		// 将 canvas 尺寸传递给顶点着色器。
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		let positions = [];

		let a_Position = gl.getAttribLocation(program, "a_Position");

		gl.enableVertexAttribArray(a_Position);

		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

		//设置清屏颜色为黑色。
		gl.clearColor(0, 0, 0, 1);

		canvas.addEventListener("click", (e) => {
			positions.push(e.pageX, e.pageY);

			if (positions.length > 0) {
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(
					gl.ARRAY_BUFFER,
					new Float32Array(positions),
					gl.STATIC_DRAW
				);

				render(gl);
			}
		});

		/*渲染*/
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if (positions.length > 0) {
				gl.drawArrays(gl.LINE_LOOP, 0, positions.length / 2);
			}
		}
		render(gl);
	</script>
</html>

```
## 在第一个例子中提到的同步异步问题
例如当我们在每次鼠标点击的位置绘制一个点的时候，如果我们没有用数组存储每次点击的数据，使用存储的数据绘制时，每次点击绘制之前点击绘制的点会消失。这个就是同步绘图！
### 原理
了解canvas 2d可能会认为无法画出多点是gl.clear(gl.COLOR_BUFFER_BIT) 清理画布导致，因为我们在用canvas 2d 做动画时，其中就有一个ctx.clearRect() 清理画布的方法。
但是在webgl中去掉gl.clear()方法，并不会和我们预期一样，任然是整个画面重绘了，并没有之前的记录。只是底层的背景颜色没了。
gl.drawArrays方法和canvas 2d 里的ctx.draw方法是不一样的，ctx.draw真的像画画一样，一层一层的覆盖图像。
gl.drawArrays方法只会同步绘图，走完了js 主线程后，再次绘图时，就会从头再来。因此，异步执行的drawArrays方法也会把画布上的图像都刷掉。
webgl 的同步绘图的现象，其实是由webgl 底层内置的颜色缓冲区导致的。  
这个颜色缓冲区会在电脑里占用一块内存。在我们使用webgl 绘图的时候，是先在颜色缓冲区中画出来。  
在我们想要将图像显示出来的时候，那就照着颜色缓冲区中的图像去画，这个步骤是webgl 内部自动完成的，我们只要执行绘图命令即可。  
颜色缓冲区中存储的图像，只在当前线程有效。比如我们先在js 主线程中绘图，主线程结束后，会再去执行信息队列里的异步线程。在执行异步线程时，颜色缓冲区就会被webgl 系统重置。

## 总结
上面三个例子其实可以用一样的的代码，第一个例子是为了引出同步异步渲染的问题。大家可以修改下类型尝试下。

