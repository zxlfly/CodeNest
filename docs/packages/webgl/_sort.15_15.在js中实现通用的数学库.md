# 15.在js中实现通用的数学库
前面学习了基本的入门数学知识，这里手动实现一个js库来强化学习下。实际工作中我一般直接使用第三方的工具库，比如Threejs框架中就内置了 matrix 和 vector 的操作类。
## GLSL 中采用的是列主序
按照存储方式分为行主序和列主序：

- 行主序是指将矩阵按行存储，每行元素存储在一起。
- 列主序是指将矩阵按列存储，每列元素存储在一起。

因为GLSL中采用的是列主序，所以在js中我们也采用列矩阵的形式，这样方便数据的传递。
最后在传递数据的时候需要将对应矩阵转换为[类型化数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Typed_arrays)，例如前面例子中使用的的Float32Array等等。
## 实现数学库中的方法
图形学中我们使用方阵来表示变换居多，因为我们要在3D场景坐标系中变换，所以需要使用四阶方阵。
## 向量
用的比较多的是 3 维、4 维向量，3 维向量多用来表示顶点坐标(X, Y, Z)，4维向量通常表示齐次坐标，如(X, Y, Z, W)，以及颜色信息(R, G, B, A)。 
### 三维向量
```javascript
class Vector3 {
	// 初始化默认为0
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	// 设置各个分量
	setX(value) {
		this.x = value || 0;
		return this;
	}
	setY(value) {
		this.y = value || 0;
		return this;
	}
	setZ(value) {
		this.z = value || 0;
		return this;
	}
	// 归一化
	// 求出向量的长度（模），然后将各个分量除以模
	normalize() {
		var length = Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z
		);
		if (length > 0.00001) {
			return new Vector3(
				this.x / length,
				this.y / length,
				this.z / length
			);
		}
		return new Vector3();
	}
	// 向量与向量相加
	// 各个分量相加
	static addVectors(vec1, vec2) {
		let x = vec1.x + vec2.x;
		let y = vec1.y + vec2.y;
		let z = vec1.z + vec2.z;
		return new Vector3(x, y, z);
	}
	// 当前向量加上另一个向量
	// 各个分量相加
	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
		return this;
	}
	// 向量与向量相减
	// 各个分量相减
	static subVectors(vec1, vec2) {
		let x = vec1.x - vec2.x;
		let y = vec1.y - vec2.y;
		let z = vec1.z - vec2.z;
		return new Vector3(x, y, z);
	}
	// 当前向量减去另一个向量
	// 各个分量相减
	sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
		return this;
	}
	// 向量与标量相乘
	// 各个分量乘以标量
	static multiplyScalar(vec1, salar) {
		let x = vec1.x * salar;
		let y = vec1.y * salar;
		let z = vec1.z * salar;
		return new Vector3(x, y, z);
	}
	// 向量与向量相乘
	// 数学中没有这一说法，这里是为了方便计算向量各个分量的乘积
	// 在GLSL 中 vec4 和 vec4 相乘返回的新向量就是将各个分量相乘，在计算光照时经常用到
	static multiplyVector(vec1, vec2) {
		let x = vec1.x * vec2.x;
		let y = vec1.y * vec2.y;
		let z = vec1.z * vec2.z;
		return new Vector3(x, y, z);
	}
	// 点乘
	// 点乘就是将向量的各个分量相乘然后再相加，返回的结果是一个标量
	static dot(vec1, vec2) {
		return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
	}
	// 叉乘
	//设有两个向量 a = (x0, y0, z0) 和 b = (x1, y1, z1)
	// a x b = (y0 * z1 - z0 * y1, z0 * x1 - x0 * z1,x0 * y1 - y0 * x1)
  static cross(vec1, vec2) {
		var x = vec1.y * vec2.z - vec2.y * vec1.z;
		var y = vec2.x * vec1.z - vec1.x * vec2.z;
		var z = vec1.x * vec2.y - vec1.y * vec2.x;
		return new Vector3(x, y, z);
	}
}
```
四维的和三维的差别不大，就不贴代码了。
## 矩阵
以四阶方阵为例
```javascript
class Matrix {
  // 创建矩阵默认自动生成一个单位矩阵
  constructor(target) {
    if (Array.isArray(target) && target.length == 16) {
      target = new Float32Array(target);
    } else {
      target = new Float32Array(16);

      // 第一列
      target[0] = 1;
      target[1] = 0;
      target[2] = 0;
      target[3] = 0;
      // 第二列
      target[4] = 0;
      target[5] = 1;
      target[6] = 0;
      target[7] = 0;
      // 第三列
      target[8] = 0;
      target[9] = 0;
      target[10] = 1;
      target[11] = 0;
      // 第四列
      target[12] = 0;
      target[13] = 0;
      target[14] = 0;
      target[15] = 1;
    }
    return target;
  }
  //矩阵和矩阵相加
  static add(m1, m2) {
    let res = new Matrix();
    for (let i = 0; i < m1.length; i++) {
      res[i] = m1[i] + m2[i];
    }
    return res;
  }
  //矩阵和矩阵相减
  static subtract(m1, m2) {
    let res = new Matrix();
    for (let i = 0; i < m1.length; i++) {
      res[i] = m1[i] - m2[i];
    }
    return res;
  }
  // 矩阵和矩阵相乘
  // 列主序，所以是m1的列乘以m2的行
  static multiply(m1, m2) {
    let res = new Matrix();
    for (let i = 0; i < m1.length; i += 3) {
      res[i] =
        m1[i] * m2[0] +
        m1[i + 1] * m2[4] +
        m1[i + 2] * m2[8] +
        m1[i + 3] * m2[12];
      res[i + 1] =
        m1[i] * m2[1] +
        m1[i + 1] * m2[5] +
        m1[i + 2] * m2[9] +
        m1[i + 3] * m2[13];
      res[i + 2] =
        m1[i] * m2[2] +
        m1[i + 1] * m2[6] +
        m1[i + 2] * m2[10] +
        m1[i + 3] * m2[14];
      res[i + 3] =
        m1[i] * m2[3] +
        m1[i + 1] * m2[7] +
        m1[i + 2] * m2[11] +
        m1[i + 3] * m2[15];
    }
  }
  // 转置矩阵
  static transpose(m) {
    let res = new Matrix();
    //转置矩阵的第一列
    res[0] = m[0];
    res[1] = m[4];
    res[2] = m[8];
    res[3] = m[12];
    //转置矩阵的第二列
    res[4] = m[1];
    res[5] = m[5];
    res[6] = m[9];
    res[7] = m[13];
    //转置矩阵的第三列
    res[8] = m[2];
    res[9] = m[6];
    res[10] = m[10];
    res[11] = m[14];
    //转置矩阵的第四列
    res[12] = m[3];
    res[13] = m[7];
    res[14] = m[11];
    res[15] = m[15];
    return res;
  }
  // 和标量相乘
  static multiplyScalar(m,s){
    let res = new Matrix()
    for(let i = 0; i < m.length,i++){
      res[i] = m[i]*s
    }
    return res
  }
  // 这个超过前面介绍的范围了
  // 逆矩阵
  // 求出余子式矩阵。
  // 为余子式矩阵增加符号。
  // 转置第二步的矩阵。
  // 将第三步得出的矩阵乘以 1/行列式。
}
```


