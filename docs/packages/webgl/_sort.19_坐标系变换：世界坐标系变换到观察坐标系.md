# 坐标系变换：世界坐标系变换到观察坐标系.md
观察空间就是相机或者说人眼看到的3D空间，是整个3D空间的一部分。这一变换的过程主要是将模型的顶点从世界坐标变换到观察坐标。
## 视图变换
这个过程通常被称为视图变换，变换矩阵称为视图矩阵。在做视图变换之前，我们会在世界坐标系中指定相机（人眼）的位置Pe，以及相机头顶的方向Ue。然后根据这些条件求出变换矩阵。
求解思路和之前推导通用公式的方法一致

- 求出观察坐标系原点在世界坐标系中的位置
- 求出观察坐标系的基向量在世界坐标系中的表示
## 观察坐标系原点在世界坐标系中的位置
其实这个位置就是相机的位置。如果现在我们在世界坐标系下有一个点P0，我们想求这个点在观察者坐标系中的位置P1，那么P1 = M x P0。其中M就是视图矩阵。
我们现在已知的条件

- 观察坐标系原点在世界坐标系中的位置Pe
- 观察坐标系的 Z 轴在世界坐标系中的表示
   - 就是相机或者说人眼看的方向的反方向
- 顶点在世界坐标系中的位置P0

通过这些条件结合前面提到的求解方法，是不能直接求出视图矩阵的，但是我们可以换个思路，可以根据现有条件求出观察坐标系转换到世界坐标系的矩阵，然后通过逆矩阵的方式求出我们需要的视图矩阵。
## 逆变换
前面已经介绍过逆矩阵了，假设有一顶点在坐标系A中坐标 P0，经过矩阵变换 M 后顶点在坐标系 B 中的坐标 P1，即P1=M×P0，那么M^−1×P1=P0，其中M^−1为M的逆矩阵（互逆）。
## 观察坐标系转换到世界坐标系的矩阵
我们已经知道的几个条件：

- 假设相机在世界坐标系中的位置 Pe (ex, ey, ez)。
- 看向目标位置为T (tx,ty,tz)。
- 摄像机上方方向向量 upDirection 为(ux, uy, uz)。

求解思路：首先已知Y原点和观察的点，可以求出Z轴基向量，然后Z轴和Y轴叉乘也就是和相机上方向向量，得到X轴基向量，由于Y轴使我们一开始的假设的它不一定和Z轴垂直，所以需要再通过Z轴和X轴的叉乘来求Y轴。最终通过归一化求得我们需要的基向量。
将我们已知的条件带入公式中：
```markdown
| xx, yx , zx, ex1|
| xy, yy , zy, ey1|
| xz, zy , zz, ez1|
|   0, 0 ,  0,   1|
```
结果就是观察坐标系转换到世界坐标系的矩阵。然后求它的逆矩阵得到视图矩阵。
疑问？：为什么要求逆矩阵，按照前面说的第一次求出的矩阵不就是可以将世界坐标系转换到观察坐标系的矩阵吗。
## 算法实现
**求出Z 轴基向量**
```javascript
function lookAt(cameraPosition, target, upDirection){
    var zAxis  = (Vector3.subtractVectors(cameraPosition, target)).normalize();
}
```
**根据 zAxis 和 upDireciton 求出 X 轴基向量**
```javascript
var xAxis = (Vector3.cross(upDirection, zAxis)).normalize();
```
**处理 zAxis 和 upDirection 平行的情况**
```javascript
if(xAxis.length() == 0){
    if (Math.abs(upDirection.z == 1)) {
      zAxis.x += 0.0001;
    } else {
      zAxis.z += 0.0001;
    }
    zAxis.normalize();
    xAxis = Vector3.cross(upDirection, zAxis).normalize();
}
```
**根据 zAxis 和 xAxis ，重新计算Y轴基向量 yAxis**
```javascript
var yAxis = (Vector3.cross(zAxis, xAxis)).normalize();
```
**最后套入公式矩阵**
```javascript
var target = new Float32Array(16);

// 第一列，x 轴基向量
target[0] = xAxis.x;
target[1] = xAxis.y;
target[2] = xAxis.z;
target[3] = 0;

// 第二列，y 轴基向量
target[4] = yAxis.x;
target[5] = yAxis.y;
target[6] = yAxis.z;
target[7] = 0;

// 第三列，z 轴基向量
target[8] = zAxis.x;
target[9] = zAxis.y;
target[10] = zAxis.z;
target[11] = 0;

// 第四列，坐标系原点位置
target[8] = cameraPosition.x;
target[9] = cameraPosition.y;
target[10] = cameraPosition.z;
target[11] = 1;

return target;

```
