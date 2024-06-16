# 矩阵变换原理
前面介绍的坐标系之间的转换方式虽然可行，但是使用起来麻烦。一般实际开发中我们会使用矩阵来进行转换，可以简化我们使用 +、 -、 *、 /进行变换运算的步骤。
在使用矩阵进行计算的时候我们需要注意，webgl中使用的是右手法则，矩阵使用的是列主序！多个矩阵变换时先缩放，再旋转，最后平移。
假设有三个变换矩阵：旋转矩阵 R，平移矩阵 T，缩放矩阵 S，以及顶点向量 P。那么 P 变换到 P1 的顺序一般是通常是第一步缩放，之后旋转，最后平移，即：P1=T×R×S×P
因为这样得到的结果才会符合我们在现实生活中的预期，倒是不可以不按这个顺序。
## 最初的点和向量
前面有说到过齐次坐标，可以用来区分点和向量。齐次坐标使用N+1维矩阵来表示向量或者点。当第N+1维的数为0时，则此时表示的是N维空间中的向量。当第N+1维的数字不为0的时候，则此时表示的是N维空间中的点。
除了上面的作用外，只要会利用到第N+1维数字（后续称为W）的都算是齐次坐标的用处。其中有一个很重要的点，是关于平移变换。前面我们了解到平移变换，是在原向量的基础上加上平移向量，属于加法操作。如果我们想将其转换为左乘一个平移矩阵，那么就需要齐次坐标。
## 常规推导
### 平移变换
下面的计算均采用的行主序的形式！
如果以结果为导向，其实我们很容易就能推导出这个公式。不使用矩阵的方式如下：
```markdown
|x|		|Tx|		|x+Tx|
|y| +	|Ty| = 	|y+Ty|
|z|		|Tz|		|z+Tz|
```
如果我们接入齐次坐标使用矩阵计算方式如下：
```markdown
|1,0,0,Tx|		|x|		|x+Tx|
|0,1,0,Ty| X	|y| = |y+Ty|
|0,0,1,Tz|		|z|		|z+Tz|
|0,0,0,1 |		|1|		|1   |
```
这样就能通过矩阵乘法得到一样的结果。
上面的方式比较简单粗暴，下面我们换一种方式进行推导：
```markdown
## 我们希望通过左乘一个矩阵得到平移转换的结果
|a,b,c,d|		|x|		|x'|
|e,f,g,h| X	|y| = |y'|
|i,j,k,l|		|z|		|z'|
|m,n,o,p|		|w|		|w'|
## 通过矩阵相乘的规则，我们转换后可以得到下面的结果
x' = ax + by + cz + dw
y' = ex + fy + gz + hw
z' = ix + jy + kz + lw
w' = mx + ny + oz + pw
## 此时w不为0，因为这里表示的是点的坐标信息，为了方便我们推导计算这里w就采用正交投影计算方式的值为1
1 = w' = mx + ny + oz + pw
1 = mx + ny + oz + p
## 为了让1 = mx + ny + oz + p成立，我们需要把 m、n、o 置为 0，p 置为 1，因为只有这样设置，才不会受到x,y,z值的影响，从而使等式一直成立。
|a,b,c,d|		|x|		|x'|
|e,f,g,h| X	|y| = |y'|
|i,j,k,l|		|z|		|z'|
|0,0,0,1|		|1|		|1|
## 接着替换其他值，剩下的不能 在使用上面这种方式推导了。我们回到平移本身来，即在对应的坐标值上加减对应的平移距离。以x轴为例
x' = ax + by + cz + d
x' = x + tX
## 因为平移需要原坐标分量加减对应的平移分量，所以a的值为1，b、c的值为0，d就是那个平移分量Tx
|1,0,0,Tx|		|x|		|x'|
|e,f,g,h | X	|y| = |y'|
|i,j,k,l |		|z|		|z'|
|0,0,0,1 |		|1|		|1|
## 以此类推，最终结果如下
|1,0,0,Tx|		|x|		|x'|
|0,1,0,Ty| X	|y| = |y'|
|0,0,1,Tz|		|z|		|z'|
|0,0,0,1 |		|1|		|1 |
```
#### 平移算法实现
```javascript
// WebGL 矩阵是列主序的，每隔 4 个数代表一列
function translation(tx, ty, tz, target){
  target = target || new Float32Array(16);
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
  target[12] = tx;
  target[13] = ty;
  target[14] = tz;
  target[15] = 0;

  return target;
}

```
### 缩放变换
上面这种推导方式，其实不仅仅适用于平移，还可以用于缩放！
```markdown
|a,b,c,d|		|x|		|x'|
|e,f,g,h| X	|y| = |y'|
|i,j,k,l|		|z|		|z'|
|m,n,o,p|		|w|		|w'|

x' = ax + by + cz + dw
y' = ex + fy + gz + hw
z' = ix + jy + kz + lw
w' = mx + ny + oz + pw
## 例如缩放矩阵
|Sx,0, 0, 0|		|x|		|x'|
|0, Sy,0, 0| X	|y| = |y'|
|0, 0, Sz,0|		|z|		|z'|
|0, 0, 0, 1|		|w|		|w'|
```
#### 缩放算法实现
```javascript
// WebGL 矩阵是列主序的，每隔 4 个数代表一列
function scale(sx, sy, sz, target){
    target = target || new Float32Array(16);
    
    // 第一列
    target[0] = sx;
    target[1] = 0;
    target[2] = 0;
    target[3] = 0;
    
    // 第二列
    target[4] = 0;
    target[5] = sy;
    target[6] = 0;
    target[7] = 0;
    
    // 第三列
    target[8] = 0;
    target[9] = 0;
    target[10] = sz;
    target[11] = 0;
    
    // 第四列
    target[12] = 0;
    target[13] = 0;
    target[14] = 0;
    target[15] = 1;
    
    return target;
}

```
### 旋转变换
相对于前面的平移和缩放操作，旋转相对要复杂些，没那么直观了。这里需要使用到三角函数进行计算了。
三维物体的旋转需要知道以下条件：

- 旋转轴
- 旋转方向
- 旋转角度
#### 旋转方向的正负
在webgl 中，除裁剪空间之外的大部分功能都使用了右手坐标系。
大拇指X轴，食指Y轴，中指Z轴

- 当物体绕z 轴，从x轴正半轴向y轴正半轴逆时针旋转时，是正向旋转，反之为负。
- 当物体绕x 轴，从y轴正半轴向z轴正半轴逆时针旋转时，是正向旋转，反之为负。
- 当物体绕y 轴，从z轴正半轴向x轴正半轴逆时针旋转时，是正向旋转，反之为负。 可以简单理解为，以某一个轴为轴心旋转，"xyz"靠前的正半轴，转向靠后的正半轴，就是正向旋转，否者就是负向旋转。 绕哪个轴旋转，哪个轴对应的坐标不变
#### 旋转公式
例如让一个顶点A（ax,ay,az）以Z轴为旋转轴，正向旋转β°，到B（bx,by,bz）点，求B的位置。原点为O

- 因为A点已知，所以原点到A和x轴的夹角α，是可以求出来的
- 旋转之后的原点到B和x轴的夹角γ就等于α+β
- 通过三角函数就可以推出bx、by
- bx=cosγ*|OA|
- by=sinγ*|OA|
- 利用和角公式求cosγ和sinγ的值
   - cosγ=cos(α+β)
   - cosγ=cosα_cosβ-sinα_sinβ
   - sinγ=sin(α+β)
   - sinγ=cosβ_sinα+sinβ_cosα
- bx=cosγ*|OA|
- bx=(cosα_cosβ-sinα_sinβ)*|OA|
- bx=cosα_cosβ_|OA|-sinα_sinβ_|OA|
- by=sinγ*|OA|
- by=(cosβ_sinα+sinβ_cosα)*|OA|
- by=cosβ_sinα_|OA|+sinβ_cosα_|OA|
- 因为
   - cosα*|OA|=ax
   - sinα*|OA|=ay
- 所以可以简化bx、by的公式
   - bx=ax_cosβ-ay_sinβ
   - by=ay_cosβ+ax_sinβ

所以左后绕Z轴旋转结果为：

- bx=ax_cosβ-ay_sinβ
- by=ay_cosβ+ax_sinβ
- bz=az

最后可以根据这个关系推导旋转矩阵
```markdown
## 绕Z轴旋转
|cos(θ), -sin(θ), 0, 0|
|sin(θ), cos(θ) , 0, 0|
|   0  ,      0 , 1, 0|
|   0  ,      0 , 0, 1|
## 绕Y轴旋转
|1,   0   ,     0 ,  0|
|0, cos(θ),-sin(θ),  0|
|0, sin(θ), cos(θ),  0|
|0,   0   ,     0 ,  1|
## 绕X轴旋转
| cos(θ), 0 , sin(θ), 0|
|   0   , 1 ,  0    , 0|
|-sin(θ), 0 , cos(θ), 0|
|   0   , 0 ,  0    , 1|
```
同理可得绕 x 轴，y 轴的旋转矩阵，绕任意角的旋转可以分解到这三个标准旋转上进行求解。但是由于矩阵的乘法交换律一般是不满足的，所以分解成XYZ旋转之后算出来的结果可能不符合预期。
## 通用的推导思路
对模型的平移、旋转、缩放其实可以看做对原来坐标系的对应操作，得到一个新的坐标系。我们可以通过求出新坐标系原点在原坐标系下的坐标以及新坐标系的基向量相对于原坐标系下的值来进行求解。
基向量是指坐标系中各个坐标轴正方向的单位向量，假设 Ux 代表 X 轴的单位向量，那么 Ux = (1, 0, 0)，同理， Uy = (0, 1, 0)，Uz = (0, 0, 1)。
```markdown
## 新坐标系下基向量在原坐标系中的值
| Uxx, Uyx , Uzx,|
| Uxy, Uyy , Uzy,|
| Uxz, Uzy , Uzz,|
## 新坐标系原点在原坐标系中的值
（Ox1, Oy1, Oz1）
## 最终公式
| Uxx, Uyx , Uzx, Ox1|
| Uxy, Uyy , Uzy, Oy1|
| Uxz, Uzy , Uzz, Oz1|
|   0,   0 ,   0,   1|
```
### 平移变换

- Tx 代表沿着 X 轴方向的位移量。
- Ty 代表沿着 Y 轴方向的位移量。
- Tz 代表沿着 Z 轴方向的位移量。

由于没有进行旋转和缩放操作，所以新坐标系的基向量和原坐标系一样
带入公式：
```markdown
|1,0,0,Tx|		|x|		|x'|
|0,1,0,Ty| X	|y| = |y'|
|0,0,1,Tz|		|z|		|z'|
|0,0,0,1 |		|1|		|1 |
```
### 缩放变换
基向量S的变化就是乘以对应的缩放值，原点没变化。
带入公式：
```markdown
|Sx,0, 0, 0|		|x|		|x'|
|0, Sy,0, 0| X	|y| = |y'|
|0, 0, Sz,0|		|z|		|z'|
|0, 0, 0, 1|		|w|		|w'|
```
### 旋转变换
例如沿着Z轴逆时针旋转θ°，通过三角函数我们可以求出新基向量U的对应的值：
Ux = (cos(θ), sin(θ), 0 )
Uy = (-sin(θ), cos(θ) ,  0 )
Uz = (   0  ,      0 ,    1  )
带入公式：
```markdown
|cos(θ), -sin(θ), 0, 0|
|sin(θ), cos(θ) , 0, 0|
|   0  ,      0 , 1, 0|
|   0  ,      0 , 0, 1|
```
其他轴旋转方式推导类似，结果和前面常规推导的一样。
## 任意轴旋转变换
前面的推导方式都是绕坐标轴进行旋转，但实际上我们往往需要绕空间中某一根轴旋转，绕任意轴旋转的矩阵求解比较复杂。下面我们采用一种绕原点任意轴旋转，然后平移的方式来实现。
只考虑旋转的情况下，我们可以对变换进行分解，首先旋转为绕一个过原点的任意向量旋转，后续如果不是过原点的向量，我们在之前的基础上进行位移即可。
例如原点为O，旋转轴方向上面的单位向量为OA，旋转的角度为β，C为原坐标系中的一点，旋转之后到了C1，来求这个旋转公式。

- 首先需要求出OC向量在旋转轴向量OA这个方向上的分量OB
   - OC点乘OA得到OB的大小然后再乘以OA向量得到OB
      - OB = OC·OA x OA
- 同时BC向量垂直于OB，BC向量等于OC-OB
   - BC=OC-OB
- 通过OA和BC的叉乘求出一个垂直与他们的向量BZ
   - BZ = OA x BC
     =OA x OC - OA x OB
     =OA x OC - 0
     =OA x OC
- 利用三角函数求出BC1
   - BC1 = BZ*sinβ + BC*cosβ
- 通过向量加法求OC1
   - OC1 = OB + BC1
	= OC·OA x OA + (BZ*sinβ + BC*cosβ)
	= OC·OA x OA + OA x OC*sinβ + (OC-(OC·OA x OA))*cosβ
- 假设旋转轴向量为OA = (tx,ty,yz)
- 求新坐标系基向量U(Ux,Uy,Uz)在原坐标系中的坐标位置
- Ux
   - tx²(1-cosβ)+cosβ
   - tx*ty(1-cosβ)+tzsinβ
   - tx*tz(1-cosβ)-tysinβ
- Uy
   - tx*ty(1-cosβ)-tzsinβ
   - ty²(1-cosβ)+cosβ
   - ty*tz(1-cosβ)+txsinβ
- Uz
   - tx*tz(1-cosβ)+tysinβ
   - ty*tz(1-cosβ)-txsinβ
   - tz²(1-cosβ)+cosβ
- 然后将这些求出的参数带入通用的推导思路中求出的公式中就可以得到绕任意轴旋转的公司，如果不是过原点的旋转轴，就再加上一个平移变换即可。
```
## 最终公式
| tx²(1-cosβ)+cosβ		, tx*ty(1-cosβ)-tzsinβ , tx*tz(1-cosβ)+tysinβ, Ox1|
| tx*ty(1-cosβ)+tzsinβ, ty²(1-cosβ)+cosβ 		 , ty*tz(1-cosβ)-txsinβ, Oy1|
| tx*tz(1-cosβ)-tysinβ, ty*tz(1-cosβ)+txsinβ , tz²(1-cosβ)+cosβ		 , Oz1|
|   								 0,   								 0 ,   							0		 ,   1|
```
#### 任意轴旋转算法实现

1. 计算轴向量的模长，并将轴向量归一化，得到单位向量
2. 根据轴向量的坐标计算一些中间变量，如xx、yy、zz等
3. 计算旋转角度的cos和sin值
4. 根据轴角旋转公式，计算目标矩阵中每个元素的值
5. 最后四行用于设置目标矩阵的最后一列和最后一行
```javascript
/**
 * 
 * @param axis 轴向量，包含三个分量x、y和z，表示旋转的轴
 * @param angle 旋转角度，单位为弧度
 * @param target 可选参数，如果提供了目标矩阵，则在该矩阵上进行旋转；如果未提供，则会创建一个新的矩阵用于存储旋转结果
 * @returns target
 */
function axisRotation(axis, angle, target){
    var x = axis.x;
    var y = axis.y;
    var z = axis.z;
    var l = Math.sqrt(x * x + y * y + z * z);
    x = x / l;
    y = y/ l;
    z = z /l;
    var xx = x * x;
    var yy = y * y;
    var zz = z * z;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var oneMCos = 1 - cos;
    
    target = target || new Float32Array(16);
    
    target[0] = xx + (1 - xx) * cos;
    target[1] = x * y * oneMCos + z * sin;
    target[2] = x * z * oneMcos - y * sin;
    target[3] = 0;
    
    target[4] = x * y * oneMCos - z * sin;
    target[5] = yy + (1 - yy) * cos;
    target[6] = y * z * oneMCos + x * sin;
    target[7] = 0;
    
    target[8] = x * z  * oneMCos + y * sin;
    target[9] = y * z * oneMCos - x * sin;
    target[10] = zz + (1 - zz) * cos;
    target[11] = 0;
    
    target[12] = 0;
    target[13] = 0;
    target[14] = 0;
    target[15] = 1;
    
    return target;
}

```
