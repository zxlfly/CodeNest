# class

es6中class除了语法更好看之外

- 不在引用扎乱的prototype
- 不需要手动的使用Object.create来替换prototype，也不需要设置__**proto__**或者Object.setPrototypeOf
- 可以使用super来实现相对多态
- 可以使用extends很自然的扩展对象
- 类的声明不会提升
- 默认处于严格模式  
  
**类的属性和方法，除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）**

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

**现在新的写法可以直接将实例属性写在class内部，不使用this也可以**

```js
class foo {
  bar = 'hello';
  baz = 'world';

  constructor() {
    // ...
  }
}
```

## 公有 可以被修改

- 公有实例方法
  - 可以在类的实例中调用，this指向实例本身，可以使用super访问超类
- 公有实例字段
  - 存在于每个类的实例中

## static 可以被修改

**父类的静态属性和静态方法，会被子类继承。直接通过类来调用。**

- 静态方法
  - 该方法不会被实例继承，而是直接通过类来调用
  - 如果静态方法包含this关键字，这个this指的是类，而不是实例
- 静态属性
  - 不会被实例继承，而是直接通过类来调用

## 私有

**私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。**
**实例对象也不能直接访问，可以通过其他方法间接访问。**

- 私有方法
  - 通过`#name(){}`句型声明
  - 静态的私有方法，只能在类里调用
  - 可以通过公有方法访问
- 私有字段
  - 通过`#name`句型声明
  - 不能在class外访问，只能在class内部访问，静态私有也一样
  - 实例对象也不能直接访问
    - 可以通过get方法间接访问

## 继承

- 在内部使用call方法
  - 可以继承构造函数的方法和属性，但是不能继承原型链上面的
- 直接将prototype指向需要继承的类实例
  - 可以解决上面的问题，但是不能给父类传参
- 结合上面两种方法就可以解决这些问题
  - 子函数内部call的形式调用夫函数，这样就可以就收参数了
  - 然后将子函数的prototype指向一个父函数的实例，new 父函数
  - 这样就完全继承了

```js
function Person(name,age){
    this.name=name
    this.age=age
    this.run=function(){
        alert(this.name+'睡觉')
    }
}
Person.prototype.sex="men"
Person.prototype.work=function(){
    alert(this.name+'work')
}
var p=new Person('李四',20);
p.run();

function child3(name,age){
    Person.call(this,name,age)
}
child3.prototype=new Person()
var w3 = new child3('lao6',22)
w3.run()
w3.work()
```

- extends关键字
  - class可以直接通过extends关键字实现继承
  - es6规定子类必须在constructor中调用super()
    - 因为子类this对象需要通过父类构造函数塑造，得到父类实例同样的属性和方法，然后再加工添加子类自己的属性和方法
  - **父类除了私有的属性和方法，其他的都会被子类继承**

## super

ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”。
ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”。这就是为什么 ES6 的继承必须先调用super()方法，因为这一步会生成一个继承父类的this对象，没有这一步就无法继承父类。
super和this不一样，不是动态绑定的，他会在静态声明的时候绑定
super作为函数调用时，代表父类的构造函数。
super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

## 静态块

允许在类的内部设置一个代码块，在类生成时运行且只运行一次，主要作用是对静态属性进行初始化。以后，新建类的实例时，这个块就不运行了。
静态块内部可以使用类名或this，指代当前类，不能有return语句。
除了静态属性的初始化，静态块还有一个作用，就是将私有属性与类的外部代码分享。

```js
let getX;

export class C {
  #x = 1;
  static {
    getX = obj => obj.#x;
  }
}

console.log(getX(new C())); // 1
```

## new.target 属性

如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

```js
class Person {
    constructor(){
        if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
    }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```
