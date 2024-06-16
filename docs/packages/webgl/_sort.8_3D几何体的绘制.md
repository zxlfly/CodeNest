# 3D几何体的绘制
与前面的章节不同，这里顶点信息需要包含Z轴坐标。webgl的坐标X 轴向右为正，Y 轴向上为正，Z 轴沿着屏幕往里为正。X、Y、Z 三个坐标分量的的范围是【-1，1】，即一个边长为 2 的正方体，原点在正方体中心。
前面章节我们经常在顶点着色器中使用内置属性 gl_Position，并且在为 gl_Position 赋值之前做了一些坐标系转换（屏幕坐标系转换到裁剪坐标系）操作。
本节我们不着重讲解坐标系变换，在 JavaScript 中直接采用裁剪坐标系坐标来表示顶点位置。
## 用三角形构建正方体
一个立方体由6个面组成，每个面由两个三角形组成，每个三角形有三个顶点，所有一共由3*2*6 = 36个顶点组成的。但是这36个顶点中有很多重复的（顶点一旦有一个信息不同，就不是同一个顶点。比如顶点纹理坐标 uv、顶点法线，顶点颜色等）。
### 绘制一个矩形压压惊

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
		attribute vec2 a_position;
		attribute vec4 a_color;
		varying vec4 v_color;

		void main() {
			gl_Position = vec4(a_position, 0, 1);
			v_color = a_color;
		}
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		precision mediump float;
		varying vec4 v_color;

			void main(){
				gl_FragColor = v_color;
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

		//顶点信息
		var positions = [
			//V0
			-0.2, 0.2, 1, 0, 0, 1,
			//V1
			0.2, -0.2, 0, 1, 0, 1,
			//V2
			-0.2, -0.2, 0, 1, 0, 1,
			//V3
			-0.2, 0.2, 1, 1, 0, 1,
			//V4
			0.2, 0.2, 1, 0, 0, 1,
			//V5
			0.2, -0.2, 0, 0, 1, 1,
		];
		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(positions),
			gl.STATIC_DRAW
		);
		var positionLocation = gl.getAttribLocation(program, "a_position");
		var a_colorLocation = gl.getAttribLocation(program, "a_color");
		gl.enableVertexAttribArray(positionLocation);
		gl.enableVertexAttribArray(a_colorLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0);
		gl.vertexAttribPointer(a_colorLocation, 4, gl.FLOAT, false, 24, 8);

		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, positions.length / 6);
	</script>
</html>

```

### 彩色立方体
立方体是 3 维形体，所以它们的顶点坐标需要从 2 维扩展成 3 维，除了 x、y 坐标，还需要深度值： z 轴坐标。
这个例子中使用八个顶点，因为八个顶点就可以构成一个立方体了，但是有个问题因为共用所以颜色不能做到每个面一个颜色，会渐变，因为共用顶点的属性会在绘制过程中进行插值，从而产生渐变效果。
然后是顶点索引三十六个，因为一个面由两个三角形组成，一个三角形需要三个顶点，一共六个面。在写这个顶点索引的是要一定要注意，要以眼睛在面的前面的视角来写顶点索引，不能用透视的视角来写！因为在绘制立方体时，WebGL会根据视角来决定顶点的绘制顺序，如果使用透视的视角，会导致绘制结果不正确。
#### 简视图
```javascript
// Create a cube
//    v4----- v7
//   /|      /|
//  v0------v3|
//  | |     | |
//  | |v5---|-|v6
//  |/      |/
//  v1------v2
```
#### 8个顶点
```javascript
    //正方体 8 个顶点的坐标信息
let x = 0.5;
let y = 0.5;
let z = 0.5;
let vertices = [
     // 前面
    -x,y,z, //0
		-x,-y,z,//1
		x,-y,z,//2
		x,y,z,//3
    // 后面
    -x,y,-z,//4
		-x,-y,-z,//5
		x,-y,-z,//6
		x,y,-z,//7
];
```
#### 六个面包含的顶点索引
```javascript
const indices = [
 // 前面
1, 1, 1,1, // 点 0 白
1, 0, 1,1, // 点 1 品红
1, 0, 0,1, // 点 2 红
1, 1, 0,1, // 点 3 黄
// 后面
0, 1, 0,1, // 点 4 绿色
0, 1, 1,1, // 点 5 青色
0, 0, 1,1, // 点 6 蓝色
0, 0, 0,1, // 点 7 黑色
];

```
#### 八个顶点的颜色
```javascript
const colors = [
  1, 0, 0, 1, // 红色
  0, 1, 0, 1, // 绿色
  0, 0, 1, 1, // 蓝色
  1, 1, 0, 1, // 黄色
  1, 0, 1, 1, // 品色
  0, 1, 1, 1,  // 青色
  1, 0, 1, 1, // 品色
  0, 1, 1, 1  // 青色
]
```
#### 完整代码

- 首先需要确定八个顶点的信息
- 然后是根据顶点位置信息确定顶点索引
   - 在 WebGL 中，通过将缓冲区对象绑定到 gl.ELEMENT_ARRAY_BUFFER 目标上，可以告诉 WebGL 系统该缓冲区对象的内容是顶点索引数据。
   - 注意数据类型对应关系，具体的可以看常见api文档中的描述
- 颜色也可以和顶点信息放一起，分开不是必须的
- 然后通过缓存区写入数据渲染
- 关于动画这里暂时不做了解，后面会对坐标系相关的做详细描述
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
		      //接收 JavaScript 传递过来的点的坐标（X, Y, Z）
		      attribute vec3 a_Position;
		      // 接收顶点颜色
		      attribute vec4 a_Color;
		      varying vec4 v_Color;
		      uniform mat4 u_Matrix;

		      void main(){
		          gl_Position = u_Matrix * vec4(a_Position, 1);
		          // 将顶点颜色插值处理传递给片元着色器
		          v_Color = a_Color;
		          gl_PointSize = 5.0;
		      }
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		      precision mediump float;
		      varying vec4 v_Color;

		      void main(){
		          // 点的最终颜色。
		          gl_FragColor = v_Color;
		      }
	</script>
	<script src="../js//matrix.js"></script>
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
		//正方体 8 个顶点的坐标信息
		let x = 1;
		let y = 1;
		let z = 1;
		// prettier-ignore
		let vertices =  new Float32Array([
			 // 前面
			-x,y,z, 
			-x,-y,z,
			x,-y,z, 
			x,y,z,
			// 后面
			-x,y,-z,
			-x,-y,-z,
			x,-y,-z,
			x,y,-z,
		]);
		// prettier-ignore
		const indices = new Int8Array([
			0, 1, 2, 0, 2, 3, //前面
			7, 6, 5,7, 5, 4,//后面
			4, 5, 1,4, 1,0,//左面
			3, 2, 6,3, 6, 7, //右面
			4, 0, 3,4, 3,7, //上面
			1, 5,6,1,6,2,  // 下面
		]);
		// prettier-ignore
		const  colors = new Float32Array([
			1, 0, 0, 1, // 红色
			0, 1, 0, 1, // 绿色
			0, 0, 1, 1, // 蓝色
			1, 1, 0, 1, // 黄色
			1, 0, 1, 1, // 品色
			0, 1, 1, 1,  // 青色
			1, 0, 1, 1, // 品色
			0, 1, 1, 1  // 青色
		]);
		// 数组类型：           占的字节数
		// Int8Array;         // 1
		// Uint8Array;        // 1
		// Uint8ClampedArray; // 1
		// Int16Array;        // 2
		// Uint16Array;       // 2
		// Int32Array;        // 4
		// Uint32Array;       // 4
		// Float32Array;      // 4
		// Float64Array;      // 8
		var SIZE = vertices.BYTES_PER_ELEMENT;
		// 创建缓存对象
		const vertexBuffer = gl.createBuffer();
		const colorBuffer = gl.createBuffer();
		const indexBuffer = gl.createBuffer();
		// 找到着色器中的全局变量 u_Color;
		let u_Matrix = gl.getUniformLocation(program, "u_Matrix");
		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, SIZE * 3, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, SIZE * 4, 0);
		gl.enableVertexAttribArray(a_Color);
		gl.clearColor(0, 0, 0, 1);
		//隐藏背面
		gl.enable(gl.CULL_FACE);

		var aspect = canvas.width / canvas.height;
		//计算正交投影矩阵
		var projectionMatrix = matrix.ortho(
			-aspect * 4,
			aspect * 4,
			-4,
			4,
			100,
			-100
		);
		var deg2radians = window.lib3d.math.deg2radians;
		var dstMatrix = matrix.identity();
		/*渲染*/
		function render() {
			xAngle += 1;
			yAngle += 1;
			//先绕 Y 轴旋转矩阵。
			matrix.rotationY(deg2radians(yAngle), dstMatrix);
			//再绕 X 轴旋转
			matrix.multiply(
				dstMatrix,
				matrix.rotationX(deg2radians(xAngle), tmpMatrix),
				dstMatrix
			);
			//模型投影矩阵。
			matrix.multiply(projectionMatrix, dstMatrix, dstMatrix);

			gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
			if (!playing) {
				return;
			}
			requestAnimationFrame(render);
		}

		var playing = false;
		var xAngle = 0;
		var yAngle = 0;
		var dstMatrix = matrix.identity();
		var tmpMatrix = matrix.identity();
		document.body.addEventListener("click", function () {
			playing = !playing;
			render();
		});
		render();
	</script>
</html>

```
## 用三角形绘制球体
将球体按照经纬度进行划分计算顶点，首先按纬度将球体分成n份，然后按经度将球分为m份，m和n相交的点就是顶点，且同一个纬度下的圆面顶点的y值是相同的。
实现一个创建球体的函数，根据传入的半径、纬度划分数和经度划分数，生成球体的顶点坐标和索引。

- 参数 radius 表示球体的半径。
- 参数 latitudeSegments 表示球体在纬度方向上的划分数，可以理解为纬度线的数量。（包括两个极点）
   - 纬度角theta的计算是基于均匀分段的方法
- 参数 longitudeSegments 表示球体在经度方向上的划分数，可以理解为经度线的数量。（围绕中心的圆的数量）
   - 经度角phi的计算也是基于均匀分段的方法

该函数首先计算每个纬度线和经度线之间的夹角 theta和 phi。
然后通过两层嵌套循环，依次计算每个顶点的坐标，并将其保存在 positions 数组中。
顶点索引的计算，从第一个纬度开始循环遍历，根据当前纬度的圆面和下一个纬度圆面上的顶点进行连接画矩形

- 从第一个纬度开始循环遍历（从北极开始）：
   - 对于每个纬度圆面上的点，连接它与下一个纬度圆面上对应位置的点。
- 确定相邻纬度圆面上的点的索引：
   - 假设当前纬度圆面上有longitudeSegments个点，它们的索引从0到longitudeSegments+1。
   - 下一个纬度圆面上对应位置的点索引与当前纬度圆面上点的索引之间的关系是：下一个点的索引 = 当前点的索引 + 每个圆面的顶点数（longitudeSegments+1）。
   - 注意：需要考虑到相邻纬度圆面上的最后一个点与当前纬度圆面上的第一个点相连的情况，以确保球体封闭。
- 生成矩形：
   - 对于每个相邻的点，形成一个矩形，连接它们的顶点索引，这样就得到了两个三角形。
```javascript
function createSphere(radius, latitudeSegments, longitudeSegments) {
	let positions = [];
	let indices = [];
	for (let i = 0; i <= latitudeSegments; i++) {
		// 纬度切分的角度,这里默认0度对应的极点在Y轴的正半轴
		let theta = (i * Math.PI) / latitudeSegments;
		// 当前圆面的Y值，利用三角函数计算
		let y = Math.cos(theta) * radius;
		// 当前圆面的半径
		let r = Math.sin(theta) * radius;
		for (let j = 0; j <= longitudeSegments; j++) {
			// 经度切分的角度，这里默认0度在X轴的正半轴
			let phi = (j * 2 * Math.PI) / longitudeSegments;
			// 计算X的值,这里使用r，因为我们需要的是和圆面相交点的坐标信息
			// 同一个phi、r下计算一个圆面的顶点信息
			let x = Math.cos(phi) * r;
			// 计算Z的值
			let z = Math.sin(phi) * r;
			positions.push(
				x,
				y,
				z,
				// 透明度为1的随机颜色
				Math.random(),
				Math.random(),
				Math.random(),
				1
			);
			// i < latitudeSegments因为从第一个圆面开始与下一个圆面的顶点进行计算的，所以不需要到最后一个
			// j < longitudeSegments因为第一个和最后一个是同一个顶点
			// if (i < latitudeSegments && j < longitudeSegments) {
			// 	// 当前圆面第一个顶点
			// 	// j为当前圆面的顶点索引，然后需要加上前面有几个圆面的顶点，从而计算出顶点索引
			// 	// longitudeSegments+1是因为，遍历的时候从0开始的，实际的圆面有latitudeSegments+1个
			// 	let first = i * (longitudeSegments + 1) + j;
			// 	// 下一个圆面的顶点
			// 	// 已经知道了当前圆面的顶点，下一个圆面的直接加上一个圆面的顶点数即可
			// 	let second = first + longitudeSegments + 1;
			// 	// 到这里已经知道了打头的两个顶点，然后就可以知道他们下一个相邻的顶点，+1即可
			// 	// 生成两个三角形的索引，逆时针连接
			// 	indices.push(first, first + 1, second + 1);
			// 	indices.push(first, second + 1, second);
			// }
		}
	}
	for (let i = 0; i < latitudeSegments; i++) {
		for (let j = 0; j < longitudeSegments; j++) {
			// 当前圆面第一个顶点
			// j为当前圆面的顶点索引，然后需要加上前面有几个圆面的顶点，从而计算出顶点索引
			// longitudeSegments+1是因为，遍历的时候从0开始的，实际的圆面有latitudeSegments+1个
			let first = i * (longitudeSegments + 1) + j;
			// 下一个圆面的顶点
			// 已经知道了当前圆面的顶点，下一个圆面的直接加上一个圆面的顶点数即可
			let second = (i + 1) * (longitudeSegments + 1) + j;
			// 到这里已经知道了打头的两个顶点，然后就可以知道他们下一个相邻的顶点，+1即可
			// 生成两个三角形的索引，逆时针连接
			indices.push(first, first + 1, second + 1);
			indices.push(first, second + 1, second);
		}
	}
	return { positions, indices };
}
```
### 完整代码
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
		      //接收 JavaScript 传递过来的点的坐标（X, Y, Z）
		      attribute vec3 a_Position;
		      // 接收顶点颜色
		      attribute vec4 a_Color;
		      varying vec4 v_Color;
		      uniform mat4 u_Matrix;

		      void main(){
		          gl_Position = u_Matrix * vec4(a_Position, 1);
		          // 将顶点颜色插值处理传递给片元着色器
		          v_Color = a_Color;
		          gl_PointSize = 5.0;
		      }
	</script>
	<!-- 片元着色器 -->
	<script id="fragmentShader" type="x-shader/x-fragment">
		//浮点数设置为中等精度
		      precision mediump float;
		      varying vec4 v_Color;

		      void main(){
		          // 点的最终颜色。
		          gl_FragColor = v_Color;
		      }
	</script>
	<script src="../js/matrix.js"></script>
	<script type="module">
		import { initShaders, randomColor, createSphere } from "../js/utils.js";
		const canvas = document.querySelector("#canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// 获取着色器文本
		const vsSource = document.querySelector("#vertexShader").innerText;
		const fsSource = document.querySelector("#fragmentShader").innerText;
		//三维画笔
		const gl = canvas.getContext("webgl");
		gl.enable(gl.CULL_FACE); //背面剔除
		//初始化着色器
		const program = initShaders(gl, vsSource, fsSource);
		const { positions, indices: inds } = createSphere(2, 10, 20);
		//正方体 8 个顶点的坐标信息
		// prettier-ignore
		let vertices =  new Float32Array(positions);
		// prettier-ignore
		const indices = new Int8Array(inds);
		// prettier-ignore
		// 数组类型：           占的字节数
		// Int8Array;         // 1
		// Uint8Array;        // 1
		// Uint8ClampedArray; // 1
		// Int16Array;        // 2
		// Uint16Array;       // 2
		// Int32Array;        // 4
		// Uint32Array;       // 4
		// Float32Array;      // 4
		// Float64Array;      // 8
		var SIZE = vertices.BYTES_PER_ELEMENT;
		// 创建缓存对象
		const vertexBuffer = gl.createBuffer();
		const colorBuffer = gl.createBuffer();
		const indexBuffer = gl.createBuffer();
		// 找到着色器中的全局变量 u_Color;
		let u_Matrix = gl.getUniformLocation(program, "u_Matrix");
		let a_Position = gl.getAttribLocation(program, "a_Position");
		let a_Color = gl.getAttribLocation(program, "a_Color");

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, SIZE * 7, 0);
		gl.enableVertexAttribArray(a_Position);

		// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		// gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, SIZE * 7, SIZE * 3);
		gl.enableVertexAttribArray(a_Color);
		gl.clearColor(0, 0, 0, 1);
		//隐藏背面
		gl.enable(gl.CULL_FACE);

		var aspect = canvas.width / canvas.height;
		//计算正交投影矩阵
		var projectionMatrix = matrix.ortho(
			-aspect * 4,
			aspect * 4,
			-4,
			4,
			100,
			-100
		);
		var deg2radians = window.lib3d.math.deg2radians;
		var dstMatrix = matrix.identity();
		/*渲染*/
		function render() {
			xAngle += 1;
			yAngle += 1;
			//先绕 Y 轴旋转矩阵。
			matrix.rotationY(deg2radians(yAngle), dstMatrix);
			//再绕 X 轴旋转
			matrix.multiply(
				dstMatrix,
				matrix.rotationX(deg2radians(xAngle), tmpMatrix),
				dstMatrix
			);
			//模型投影矩阵。
			matrix.multiply(projectionMatrix, dstMatrix, dstMatrix);

			gl.uniformMatrix4fv(u_Matrix, false, dstMatrix);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
			if (!playing) {
				return;
			}
			requestAnimationFrame(render);
		}

		var playing = false;
		var xAngle = 0;
		var yAngle = 0;
		var dstMatrix = matrix.identity();
		var tmpMatrix = matrix.identity();
		document.body.addEventListener("click", function () {
			playing = !playing;
			render();
		});
		render();
	</script>
</html>

```
#### 这段球体的实现代码有bug，如果例如如果传入的参数是1，20，20则绘制出来的球体有问题
