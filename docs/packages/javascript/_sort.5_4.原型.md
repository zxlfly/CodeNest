# 原型

## 原型链和原型对象

JavaScript中的对象有一个特殊的``[[prototype]]``内置属性，其实就是对于其他对象的引用，这个对象就是**原型对象**。  
[[prototype]]机制就是存在于对象中的一个内部链接，会引用其他对象。作用是：如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在[[prototype]]链关联的对象上进行查找，以此类推，这就是**原型链**。  
几乎所有对象在创建时[[prototype]]都会被赋值一个非空值。Object.create就会创建一个拥有空原型链的对象。所有普通的[[prototype]]链最终都会指向Object.prototype

```js
var obj ={
    a:2
}
obj.a//2
```

对于默认的[[Get]]操作来说，第一步是在对象本身查找是否有这个属性，如果有就使用它。如果没有就需要使用对象的[[prototype]]链了。  

```js
var another = {
    a:2
}
var obj = Object.create(another)
obj.a//2
```

它会创建一个对象并且把这个对象的[[prototype]]关联到指定的对象。  
``for..in``遍历对象时原理和查找[[prototype]]链类似，任何可以通过原型链访问到的可枚举属性都会被枚举。使用``in``操作符的时候同样会查找原型链，区别在于它不管是否可枚举。

### Object.prototype

所有普通的[[prototype]]链最终都会指向内置的``Object.prototype``。

### __proto__和constructor

``__proto__``和``constructor``属性是对象独有的，``prototype``属性是函数独有的。函数本身也是对象！

- ``prototype``对于函数而言就是保存共有成员
- ``constructor``对于对象来说就是指向构造函数
- ``__proto__``属性指向了内部的``[[prototype]]``对象，对于对象来说就是操作原型的
- 原型链就是由多级父对象继承形成的链式结构  

#### prototype

函数在创建的时候，会默认创建该函数的``prototype``，这个``prototype``会有一个``constructor``属性默认指向这个函数。

- 只是一个属性，默认指向原型对象，可以修改
- ``prototype``的``constructor``属性只是在函数声明时的默认属性，如果修改了``prototype``属性，默认的``constructor``就没了，不会自动关联

#### proto

这个属性在es6之前并不在标准中，作为``Object.prototype``上的一个存储器，主要用来设置或者获取某个对象的``[[prototype]]``

## 属性设置和屏蔽

```js
obj.foo="666"
```

如果obj上面有名为foo的普通数据访问属性，这条赋值语句只会修改已有的属性值。  
如果没有，就会去原型链上找，遍历原型链，类似[[Get]]操作。  
如果原型链上面找不到，foo就会被直接添加到obj上。  
如果原型链上面有呢？  

- 如果在原型链上面存在名为foo的普通数据访问属性并且没有被标记为只读，那就会直接在obj中添加一个。后面就访问不到原型链上面的foo了，自己有了就会屏蔽掉上层的。
- 如果在原型链上面存在名为foo的普通数据访问属性但是他被标记为只读，那么无法修改已有属性或者在obj上创建屏蔽属性。
  - 如果是严格模式下会抛出错误，否则被忽略
- 如果在原型链上面存在名为foo并且它是一个setter，那就一定会调用这个setter。foo不会添加到obj本身，也不会重新定义这个setter。

关于上面说的第二种情况，主要是为了模拟类的继承。可以把原型链上层的foo看作是父类中的属性，它会被obj继承（复制），这样一来obj中的foo属性也是只读的。所以无法创建。实际上并不会发生类似的继承复制（是引用）。这个限制只存在于赋值操作中，使用Object.defineProperty(..)并不会收到影响。  

```JS
var another ={a:2}
var obj = Object.create(another)
another.a//2
obj.a//2
another.hasOwnProperty('a')//true
obj.hasOwnProperty('a')//false
obj.a++
another.a//2
obj.a//3
obj.hasOwnProperty('a')//true
```

尽管看起来这个++操作应该查找并增加another.a属性，但是实际上是obj.a=obj.a+1因此++操作首次会想通过原型链查找属性a并从another.a获取当前属性值2，然后给这个值+1，接着用[[Put]]将值3赋值给obj中新建的屏蔽属性a！！！  
修改委托属性时一定要注意这一点。不能直接这样修改，只能是another.a++。

### 小结

对对象普通属性访问赋值时，如果存在可以直接赋值。如果不存在就会去原型链上面查找。

- 如果原型链上存在，且没有设置只读，那么会在该对象上添加该属性，后续就访问不到原型链上面的属性了
- 如果原型链上存在，且被标记为只读，那么无法修改，且不会在该对象上创建属性
  - 如果是严格模式会报错，否则会忽略
- 如果原型链上存在，且是一个setter，那么一定会调用这个setter。并且不会在该对象上创建属性，也不会修改setter
