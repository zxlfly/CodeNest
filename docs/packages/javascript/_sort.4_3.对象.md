# 对象

## 语法

有两种定义方式  
对象的文字语法：

```js
var obj = {
    key:val,
    ...
}
```

构造形式：

```js
var obj = new Object()
obj.key=val
```

## 类型

对象是js的基础。在js中一共有六中主要类型（不考虑es6+）

- string
- number
- boolean
- null
- undefined
- object
前五种都不是对象。null有时候会被当做一种对象类型，但这是语言本身的bug，即``typeof null``为object，这是因为在底层，不同的对象都表示为二进制，js中前三位都是0的话就会被判断为object类型，null的二进制表示全是0，所以才会返回object。  
我们常见的**JavaScript中万物皆是对象**，这显然是**错误的**。  
js中有许多特殊的对象子类型，我们可以称之为复杂基本类型。  
函数就是对象的一个子类型，从技术的角度可以说是一个可以调用的对象。本质上函数和普通的对象一样，所以可以像操作其他对象一样操作函数，比如当做一个参数。  
数组也是对象的一种类型，具备一些额外的行为。数组的组织方式比一般的对象要稍微复杂些。

### 内置对象

js中还有一些对象的子类型，通常被称为内置对象。（下面是一些常见的，[标准内置](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)的不止这些）

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- Math
- RegExp
- Error
这些内置对象从表现形式来看像其他语言中的类型或者类。但是在js中，他们实际只是一些**内置的函数**。这些函数可以当做构造函数来使用，从而构造一个对应子类型的新对象。

```js
var str = '我是字符串'
typeof str//string
//instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
str instanceof String//false

var strobj = new String('我是字符串')
typeof strobj//object
strobj instanceof String//true
```

str变量是一个string类型，并不是一个对象，只是一个字面量，并且不可改变的值。如果要对这个str执行一些操作，比如获取长度，那就需要将其转换成String对象。  
我们在平时的使用中并没有转换是因为js自动做了转换。  
同样的数值字面量上也是一样的，布尔字面量也是的。
null和undefined没有对应的构造形式，他们只有文字形式。  
相反，Date只有构造，没有文字形式。  
对于Object、Array、Function和RegExp来说无论是哪种形式，它们都是对象。  
Error对象一般是抛出异常的时候自动创建，也可以使用new。

## 内容

对象的内容是由一些储存在特定命名位置的值组成的，我们称之为属性。  
这些内容看起来存储在对象内部，但这只是它的表现形式。  
在引擎内部，这些值的存储方式是多种多样的，一般不会存储在对象容器内部，存储在对象内部的是这些属性的名称，它们就像指针一样，指向这些值真正的位置。  
访问的方式分为两种，使用``.``操作符或者``[]``。后者可以接受任意UTF-8/Unicode字符串作为属性名，例如["a-b-c!"]。  
在对象中，属性名永远都是字符串。  
数组例外，数组的下标使用的是数字，没有转换成字符串。

### 可计算属性名

如果需要通过表达式计算属性名，就需要使用[]。
例如：``obj[prifix+name]``。但是文字形式来声明对象时就不行。
es6增加了可计算属性名，可以在文字形式中使用

```js
var prefix ="666"
var obj ={
    [prefix+'foo']:'xiu',
    ...
}
obj['666foo']//xiu
```

### 属性与方法

如果访问你对象的属性是一个方法，在其他的语言中，属于对象（类）的函数通常被称为方法，因此把属性访问说成方法访问，是可以的。  
但是在js中，函数永远不会"属于"一个对象，所以这样叫不妥在js中。  
有些函数具有this的引用，有时候这些this确实会指向调用位置的对象引用。但是这种用法在本质上来说本没有把一个函数变成一个方法，因为this是在运行时根据调用位置动态绑定的，所以函数和对象的关系是间接的。
例如：

```js
function f(){
    console.log('f')
}
var a =f 
var b ={
    a:f
}
f//function f(){..}
a//function f(){..}
b.a//function f(){..}
```

它们只是对于同一个函数不同的引用，并不能说明这个函数式特别的或者属于某个对象。  
如果f内部有this的引用，那这的区别就是b.a的this会被隐式的绑定到一个对象。  
还有一种说法是，函数并不是在定义的时候成为方法的，而是在被调用的时候根据调用的位置的不同成为方法的。  
**最保险的说法可能是，“函数”和“方法”在JavaScript中时可以相互转换的。**

### 数组

数组也支持[]访问形式，不过数组有一套更加结构化的值存储机制。  
数组期望的是数值下标，也就是说值存储的位置是非负整数，通常称之为索引。  
数组也是对象，所以仍然可以给数组添加属性

```js
var arr =["f","a",6]
arr.bar = 'baz'
arr.length//3
arr.bar//baz
```

虽然添加了属性但是length并没有变化。如果此时使用push追加一个进去，它会排在6的后面bar的前面，length会+1。  
如果向数组添加一个属性的时候，属性名是非负整数的字符串的话，它会变成一个数值下标，因此会修改数组的内容而不是添加一个属性。

### 复制对象

因为对象是引用类型的，我们直接使用赋值操作其实只是复制了引用，这些引用还是指向了同一个对象。
死循环：

```js
function foo(){}
var object = {c:true}
var arr = []
var bigobj={
    a:2,
    b:object,//这只是一个引用不是副本
    c:arr,
    d:foo
}
arr.push(object,bigobj)
```

我们可以使用JSON来复制

```js
var newobj = JSON.parse(JSON.stringify(someobj))
```

这种方法赋值得开发者自己确定被复制的对象是安全的，没有死循环之类的问题。
相比较深复制，浅复制就简单且问题少得多，所以es6定义了Object.assign(..)方法来实现浅复制。第一个参数是目标对象，后面可以传一个或多个源对象，它会遍历源对象的所有课枚举的自有键并把他们复制到目标对象，最后返回目标对象。

### 属性描述符

es5之前js内有提供可以直接检测属性特性的方法，比如判断是否只读。es5开始，所有属性都具备了属性描述符。

```js
var obj = {
    a:1
}
Object.getOwnPropertyDescriptor(obj,"a")
//configurable: true//可配置
//enumerable: true//可枚举
//value: 1//值
//writable: true//可写
```

创建普通属性时属性描述符会使用默认值，也可以使用Object.definePrototype(..)来添加一个新的属性，或者修改已有属性并且对其特性进行设置。

```js
var obj = {
}
Object.defineProperty(obj,"a",{
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true
})
obj.a//1
```

### 不变性

如果希望属性或者对象时不可改变的，在es5中有很多种方法来实现。

#### 对象常量

结合``writable:false``和``configurable:false``就可以创建一个真正的常量属性。

#### 禁止扩展

如果需要禁止对象添加新的属性并且保留已有的属性，可以使用``Object.preventExtensions(..)``

```js
var obj = {
    a:2
}
Object.preventExtensions(obj)
obj.b=3
obj.b//undefined
```

#### 密封

``Object.seal(..)``会创建一个密封的对象，这个实际上会在一个现有对象上调用``Object.preventExtensions(..)``并把所有属性标记为``configurable:false``

#### 冻结

``Object.freeze(..)``会创建一个冻结对象，这个方法实际上会在一个现有对象上调用``Object.seal(..)``并把所有数据访问属性标记为``writable:false``。  
这个方法是可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其人已直接属性的修改，**不过这个对象引用其他对象是不受影响的**。

### [[Get]]

就是访问属性的操作。对象默认的内置[[Get]]操作首先在对象中查找是否有相同名称的属性，如果有就返回属性的值，没有会遍历原型链，去这上面找，如果最后还是没有找到就返回undefined。  
注意这个和访问变量时不一样，如果引用了一个当前词法作用域不存在的变量，会抛出referenceError异常。

### [[Put]]

有取值就有赋值操作。如果这个属性已存在，大致会检查下面这些内容：

- 属性是否是访问修饰符
  - 是并且存在setter就调用setter
- 属性的数据描述符writable是否是false
  - 是，在非严格模式下静默失败，否则抛出异常TypeError
- 如果都不是，将该值设置为属性的值
如果不存在，操作会更复杂（详细的在原型介绍--属性设置和屏蔽）。

### Getter和Setter

ES5中可以使用getter和setter部分改写默认操作（就是上面的两种），但是应用在单个属性上，无法应用在整个对象上。  
getter是一个隐藏函数会在获取属性值的时候调用。  
setter也是一个隐藏函数，会在设置属性值的时候调用。  
当给一个属性定义上面的方法时，这个属性会被定义为访问描述符（和前面讲的属性描述符相对）。  
对于访问描述符来说，js会忽略它们的value和writable特性，取而代之的是关心get、set（还有configurable和enumerable）特性。  
vue3之前的vue核心实现原理就靠这个。

### 存在性

属性访问的时候返回值可能是undefined，但是这个值可能是属性中存储的undefined，也可能是因为不存在。  
我们可以在不访问属性值的情况下判断对象中是否存在这个属性。

```js
var obj={
    a:1
};
("a" in obj);//true
("b" in obj);//false
obj.hasOwnProperty("a");//true
obj.hasOwnProperty("b");//false
```

``in``操作符会检查属性是否在对象以及其原型链中。相比之下``hasOwnProperty``只会检查属性是否在对象中，不会检查原型链。

#### 枚举

可枚举就相当于可以出现在对象属性的遍历中。  
``propertyIsEnumerable(..)``会检查给定的属性名是否直接存在于对象中并且满足enumerable:true。不会去原型链上面找。  
``Object.keys(..)``会返回一个数组，包含所有可枚举属性。``getOwnPropertyNames(..)``和它的却别在于无论是否可枚举都会返回。它们都不会去原型链上面找。

## 遍历

可以使用for..in（还有上面用到的方法）循环来遍历对象的可枚举类型。  
es5中增加了一些数组的辅助迭代器，包括forEach(..)、every(..)和some(..)。每种都可以接受一个回调函数并把它应用到数组的每个元素上，唯一的区别就是他们对于回调函数返回值的处理方式不同。  

- ``forEach(..)``
  - 会忽略返回值
- ``every(..)``
  - 会一直运行直到回调函数返回false
- ``some(..)``
  - 会一直运行直到回调函数返回true

es6新增了一种遍历数组的方法``for .. of``（其实也可以遍历其他的例如Map、Set、String、TypedArray，arguments 对象等等）。循环会首先像被访问的对象请求一个迭代器对象，然后通过迭代器对象的next()方法来遍历所有返回值。  
数组有内置的@@iterator(**本身并不是迭代器对象，而是一个返回迭代器的函数**)，因此``for .. of``可以直接应用在数组上。我们其实也可以使用@@iterator手动遍历。

```js
var arr = [0,1,2,3]
var it = arr[Symbol.iterator]()
it.next()//{value:0,done:false}
it.next()//{..1..}
it.next()//{..2..}
it.next()//{..3..}
it.next()//{done:true}
```

普通的对象没有内置@@iterator。但是可以手动设置一个  
或者直接在定义对象时进行声明一个

```js
var obj ={
    a:2,
    [Symbol.iterator]:function(){...}
}
```

## 小结

- js中对象有字面形式和构造形式。字面形式更常用，不过有时候构造形式可以提供更多选项。  
- for...in语句可以用来遍历可枚举的属性，包括原型链
- for...of遍历可迭代对象定义要迭代的数据
- 迭代器有一个next方法，会返回一个对象{value,done}；done为布尔值，表示迭代是否结束，value当前返回的值
- 迭代器是一种设计模式，可在容器对象 如 链表、数组上遍历，无需关心容器对象的内存分配的实现细节。简单的理解就是可以一个一个的依次拿到其中的数据，类似一个移动的指针，但是会告诉我们什么时候结束。这样我们可以拿到数据之后可以做一些我们需要做的事情。
