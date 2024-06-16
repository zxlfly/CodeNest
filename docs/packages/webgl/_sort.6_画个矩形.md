# 画个矩形
## 基本三角形构建矩形
一个矩形由两个共线的三角形组成，即 V0, V1, V2, V3，其中 V0 -> V1 -> V2 代表三角形A，V0 -> V2 -> V3代表三角形B。
组成三角形的顶点要按照一定的顺序绘制。默认情况下，WebGL 会认为顶点顺序为逆时针时代表正面，反之则是背面，区分正面、背面的目的在于，如果开启了背面剔除功能的话，背面是不会被绘制的。
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
		attribute vec4 a_Color;
		varying vec4 v_Color;

		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);
			// 将顶点颜色传递给片元着色器
			v_Color = a_Color;

		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		      //浮点数设置为中等精度
		precision mediump float;
		//全局变量，用来接收 JavaScript传递过来的颜色。
		varying vec4 v_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = v_Color / vec4(255, 255, 255, 1);
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
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		// 将 canvas 尺寸传递给顶点着色器。
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		// 定义组成矩形的两个三角形，共计六个顶点，每个顶点包含2个坐标分量和4个颜色分量。
		let positions = [
			//V0
			30, 30, 0, 255, 0, 1,
			//V1
			30, 300, 0, 255, 0, 1,
			//V2
			300, 300, 0, 255, 0, 1,
			//V0
			30, 30, 255, 255, 0, 1,
			//V2
			300, 300, 255, 255, 0, 1,
			//V3
			300, 30, 255, 255, 0, 1,
		];

		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.enableVertexAttribArray(a_Position);
		gl.enableVertexAttribArray(a_Color);
		// 创建缓冲区
		let buffer = gl.createBuffer();
		// 绑定缓冲区为当前缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// 设置 a_Position 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
		// 设置 a_Color 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
		// 向缓冲区传递数据
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		/*渲染*/
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if (positions.length > 0) {
				gl.drawArrays(gl.TRIANGLES, 0, positions.length / 6);
			}
		}
		render(gl);
	</script>
</html>

```
## 索引方式绘制
我们在绘制一个矩形的时候，实际上只需要 V0, V1, V2, V3 四个顶点即可，但是我们却存储了六个顶点，一旦数据量大起来了，这样浪费的内存空间也会很多。
WebGL 提供gl.drawElements这种方式，可以避免重复定义顶点，进而节省存储空间。
``gl.drawElements(mode, count, type, offset);``

- mode：指定绘制图元的类型，是画点，还是画线，或者是画三角形。
- count：指定绘制图形的顶点个数。
- type：指定索引缓冲区中的值的类型,常用的两个值：gl.UNSIGNED_BYTE和gl.UNSIGNED_SHORT，前者为无符号8位整数值，后者为无符号16位整数。
- offset：指定索引数组中开始绘制的位置，以字节为单位。
### 使用 drawElements 绘制矩形
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
		attribute vec4 a_Color;
		varying vec4 v_Color;

		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);
			// 将顶点颜色传递给片元着色器
			v_Color = a_Color;

		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		      //浮点数设置为中等精度
		precision mediump float;
		//全局变量，用来接收 JavaScript传递过来的颜色。
		varying vec4 v_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = v_Color / vec4(255, 255, 255, 1);
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
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		// 将 canvas 尺寸传递给顶点着色器。
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		//存储顶点信息的数组
		var positions = [
			//V0
			30, 30, 255, 0, 0, 1,
			//V1
			30, 300, 255, 0, 0, 1,
			//V2
			300, 300, 255, 0, 0, 1,
			//V3
			300, 30, 0, 255, 0, 1,
		];
		//存储顶点索引的数组
		var indices = [
			//第一个三角形
			0, 1, 2,
			//第二个三角形
			0, 2, 3,
		];

		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.enableVertexAttribArray(a_Position);
		gl.enableVertexAttribArray(a_Color);
		// 创建缓冲区
		let buffer = gl.createBuffer();
		var indicesBuffer = gl.createBuffer();
		// 绑定缓冲区为当前缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		// 设置 a_Position 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
		// 设置 a_Color 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
		// 向缓冲区传递数据
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(indices),
			gl.STATIC_DRAW
		);
		/*渲染*/
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if (positions.length > 0) {
				gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
			}
		}
		render(gl);
	</script>
</html>

```
## 使用三角带构建矩形
三角带的绘制特点是前后两个三角形是共线的
绘制三角形的数量 = 顶点数 - 2

- 规律： 
   - 第一个三角形：v0>v1>v2
   - 第偶数个三角形：以上一个三角形的第二条边+下一个点为基础，以和第二条边相反的方向绘制三角形
   - 第奇数个三角形：以上一个三角形的第三条边+下一个点为基础，以和第二条边相反的方向绘制三角形
- 所以顶点顺序很重要
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
		attribute vec4 a_Color;
		varying vec4 v_Color;

		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);
			// 将顶点颜色传递给片元着色器
			v_Color = a_Color;

		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		      //浮点数设置为中等精度
		precision mediump float;
		//全局变量，用来接收 JavaScript传递过来的颜色。
		varying vec4 v_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = v_Color / vec4(255, 255, 255, 1);
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
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		// 将 canvas 尺寸传递给顶点着色器。
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		// 定义组成矩形的两个三角形，共计六个顶点，每个顶点包含2个坐标分量和4个颜色分量。
		let positions = [
			//V0
			30, 300, 255, 0, 0, 1,
			//V1
			300, 300, 255, 0, 0, 1,
			//V2
			30, 30, 255, 0, 0, 1,
			//V3
			300, 30, 0, 255, 0, 1,
		];

		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.enableVertexAttribArray(a_Position);
		gl.enableVertexAttribArray(a_Color);
		// 创建缓冲区
		let buffer = gl.createBuffer();
		// 绑定缓冲区为当前缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// 设置 a_Position 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
		// 设置 a_Color 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
		// 向缓冲区传递数据
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		/*渲染*/
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if (positions.length > 0) {
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 6);
			}
		}
		render(gl);
	</script>
</html>

```
## 三角扇绘制矩形
三角扇是围绕着第一个顶点作为公共顶点绘制三角形的
绘制三角形的数量 = 顶点数 - 2
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
		attribute vec4 a_Color;
		varying vec4 v_Color;

		void main(){
			// 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
			vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
			// canvas的 Y 轴坐标方向和设备坐标系的相反。
			position = position * vec2(1.0, -1.0);
			// 最终的顶点坐标。
			gl_Position = vec4(position, 0.0, 1.0);
			// 将顶点颜色传递给片元着色器
			v_Color = a_Color;

		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		      //浮点数设置为中等精度
		precision mediump float;
		//全局变量，用来接收 JavaScript传递过来的颜色。
		varying vec4 v_Color;

		void main(){
			// 将颜色处理成 GLSL 允许的范围[0， 1]。
			vec4 color = v_Color / vec4(255, 255, 255, 1);
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
		//声明颜色 rgba
		gl.clearColor(0, 0, 0, 1);
		//刷底色
		gl.clear(gl.COLOR_BUFFER_BIT);
		let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
		// 将 canvas 尺寸传递给顶点着色器。
		gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

		// 定义组成矩形的两个三角形，共计六个顶点，每个顶点包含2个坐标分量和4个颜色分量。
		var positions = [
			//V0
			165, 165, 255, 255, 0, 1,
			//V1
			30, 30, 255, 0, 0, 1,
			//V2
			30, 300, 255, 0, 0, 1,
			//V3
			300, 300, 255, 0, 0, 1,
			//V4
			300, 30, 0, 255, 0, 1,
			//V1
			30, 30, 255, 0, 0, 1,
		];

		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.enableVertexAttribArray(a_Position);
		gl.enableVertexAttribArray(a_Color);
		// 创建缓冲区
		let buffer = gl.createBuffer();
		// 绑定缓冲区为当前缓冲
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		// 设置 a_Position 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
		// 设置 a_Color 属性从缓冲区读取数据方式
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
		// 向缓冲区传递数据
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		/*渲染*/
		function render(gl) {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if (positions.length > 0) {
				gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);
			}
		}
		render(gl);
	</script>
</html>

```
## 顶点顺序
无论是使用三角扇还是基本三角形，又或者是三角带绘制的时候，一定要保证顶点顺序是逆时针。如果三角形的顶点顺序不是逆时针，在开启背面剔除功能后，不是逆时针顺序的三角形是不会被绘制的。
可以改变顶点顺序然后使用：

- gl.enable(gl.CULL_FACE);开启背面剔除功能
- gl.cullFace(gl.FRONT);开启正面剔除功能

这里就不提供示例了。
## 绘制圆形
圆形也是通过三角形绘制的，将圆形分割成以圆心为共同顶点的若干个三角形，三角形数越多，圆形越平滑。
```html
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
        attribute vec4 a_Color;
        varying vec4 v_Color;

        void main(){
            // 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
            vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
            // canvas的 Y 轴坐标方向和设备坐标系的相反。
            position = position * vec2(1.0, -1.0);
            // 最终的顶点坐标。
            gl_Position = vec4(position, 0.0, 1.0);
            // 将顶点颜色传递给片元着色器
            v_Color = a_Color;

        }
    </script>
    <!-- 片元着色器 -->
    <script id="fragmentShader" type="x-shader/x-fragment">
        //浮点数设置为中等精度
        precision mediump float;
        //全局变量，用来接收 JavaScript传递过来的颜色。
        varying vec4 v_Color;

        void main(){
            // 将颜色处理成 GLSL 允许的范围[0， 1]。
            vec4 color = v_Color / vec4(255, 255, 255, 1);
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
        //声明颜色 rgba
        gl.clearColor(0, 0, 0, 1);
        //刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);
        // 获取 canvas 尺寸。
        let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
        // 将 canvas 尺寸传递给顶点着色器。
        gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

        // 定义组成矩形的两个三角形，共计四个顶点，每个顶点包含2个坐标分量和4个颜色分量，其中 V0,V1,V2代表左下角三角形，V1,V2,V3代表右上角三角形。
        let positions = createCircleVertex(100, 100, 50, 50);

        let a_Position = gl.getAttribLocation(program, "a_Position");
        let a_Color = gl.getAttribLocation(program, "a_Color");

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);
        // 创建缓冲区
        let buffer = gl.createBuffer();
        // 绑定缓冲区为当前缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // 设置 a_Position 属性从缓冲区读取数据方式
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
        // 设置 a_Color 属性从缓冲区读取数据方式
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
        // 向缓冲区传递数据
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        );
        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);

        /*渲染*/
        function render(gl) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);
        }
        render(gl);
        // x：圆心的 x 坐标
        // y：圆心的 y 坐标
        // radius：半径
        // n：三角形的数量
        function createCircleVertex(x, y, radius, n) {
            let positions = [x, y, 255, 255, 0, 1];
            for (let i = 0; i <= n; i++) {
                let angle = (i * Math.PI * 2) / n;
                positions.push(
                    x + radius * Math.sin(angle),
                    y + radius * Math.cos(angle),
                    255,
                    0,
                    0,
                    1
                );
            }
            return positions;
        }
    </script>
</html>
```
## 绘制环形
建立两个圆，一个内圆，一个外圆，划分n个近似于扇形的三角形，每个三角形的两条边都会和内圆和外圆相交，产生四个交点，这四个交点组成一个近似矩形，然后将近似矩形划分成两个三角形
```html
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
        attribute vec4 a_Color;
        varying vec4 v_Color;

        void main(){
            // 将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围。
            vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
            // canvas的 Y 轴坐标方向和设备坐标系的相反。
            position = position * vec2(1.0, -1.0);
            // 最终的顶点坐标。
            gl_Position = vec4(position, 0.0, 1.0);
            // 将顶点颜色传递给片元着色器
            v_Color = a_Color;

        }
    </script>
    <!-- 片元着色器 -->
    <script id="fragmentShader" type="x-shader/x-fragment">
        //浮点数设置为中等精度
        precision mediump float;
        //全局变量，用来接收 JavaScript传递过来的颜色。
        varying vec4 v_Color;

        void main(){
            // 将颜色处理成 GLSL 允许的范围[0， 1]。
            vec4 color = v_Color / vec4(255, 255, 255, 1);
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
        //声明颜色 rgba
        gl.clearColor(0, 0, 0, 1);
        //刷底色
        gl.clear(gl.COLOR_BUFFER_BIT);
        // 获取 canvas 尺寸。
        let a_Screen_Size = gl.getAttribLocation(program, "a_Screen_Size");
        // 将 canvas 尺寸传递给顶点着色器。
        gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

        // 定义组成矩形的两个三角形，共计四个顶点，每个顶点包含2个坐标分量和4个颜色分量，其中 V0,V1,V2代表左下角三角形，V1,V2,V3代表右上角三角形。
        let vertex = createRingVertex(100, 100, 20, 80, 100);
        let positions = vertex.positions;

        let a_Position = gl.getAttribLocation(program, "a_Position");
        let a_Color = gl.getAttribLocation(program, "a_Color");

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);
        // 创建缓冲区
        let buffer = gl.createBuffer();
        // 绑定缓冲区为当前缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // 设置 a_Position 属性从缓冲区读取数据方式
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
        // 设置 a_Color 属性从缓冲区读取数据方式
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
        // 向缓冲区传递数据
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        );

        //定义绘制索引数组
        let indices = vertex.indices;
        //创建索引缓冲区
        let indicesBuffer = gl.createBuffer();
        //绑定索引缓冲区
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        //向索引缓冲区传递索引数据
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            gl.STATIC_DRAW
        );

        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);

        /*渲染*/
        function render(gl) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        }
        render(gl);
        // x：圆心的 x 坐标
        // y：圆心的 y 坐标
        // innerRadius：内圆半径
        // outerRadius：外圆半径
        // n：三角形的数量
        function createRingVertex(x, y, innerRadius, outerRadius, n) {
            let positions = [];
            let color = randomColor();
            for (let i = 0; i <= n; i++) {
                if (i % (n / 4) == 0) {
                    color = randomColor();
                }
                let angle = (i * Math.PI * 2) / n;
                positions.push(
                    x + innerRadius * Math.sin(angle),
                    y + innerRadius * Math.cos(angle),
                    color.r,
                    color.g,
                    color.b,
                    1
                );
                positions.push(
                    x + outerRadius * Math.sin(angle),
                    y + outerRadius * Math.cos(angle),
                    color.r,
                    color.g,
                    color.b,
                    1
                );
            }
            let indices = [];
            for (let i = 0; i < n; i++) {
                let p0 = i * 2;
                let p1 = i * 2 + 1;
                let p2 = (i + 1) * 2 + 1;
                let p3 = (i + 1) * 2;
                if (i == n - 1) {
                    p2 = 1;
                    p3 = 0;
                }
                indices.push(p0, p1, p2, p2, p3, p0);
            }
            return { positions: positions, indices: indices };
        }
    </script>
</html>
```
