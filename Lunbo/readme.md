# 轮播图
### 目录
- [使用方法]()
- [参数]()
- [生成代码]()
- [高级应用]()

0. 使用方法
-----------
html结构请包含ul>li，每个li代表一页。

Eg.
```html
<div id="lunbo">
  <ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</div>
```

1. 参数
---------
参数为js对象，至少包含属性contentElem，值为轮播图容器Dom对象或jQuery对象。  

Eg.
```javascript
new Lunbo({
      id: 'lunbo'
    }).init();
```
其他参数及默认值：
```javascript
var defaultConfig = {
      auto: true,       // 自动播放
      step: 1,          // 自动播放页数
      delay: 3,         // 自动播放延迟时间
      hasDot: true,     // 是否创建dot
      hasArrow: true,   // 是否创建arrow
      touch: true       // 是否支持滑动
    };
```

2. 生成代码
-----------
Arrows:
```html
<div class="focus-arrows-content">
  <a href="javascript:void(0);" class="focus-arrow-pre"></a>
  <a href="javascript:void(0);" class="focus-arrow-next"></a>
</div>
```
Dots:(根据图片个数自动生成)
```html
<div class="focus-dots-content">
  <a href="javascript:void(0);" class="dot active"></a>
  <a href="javascript:void(0);" class="dot"></a>
</div>
```
根据dot和arrow类名自定义样式

3. 高级应用
---------------
自定义dot、arrow，只需要在调用init()方法之前，添加createDots()方法，或createArrows()方法。  

Eg.
```javascript
var mainLunbo = new Lunbo({ contentElem: document.querySelector('.mod-focus') });
mainLunbo.createDots = function () {
  var imgElems = mainLunbo.contentElem.querySelectorAll('img');
  // 最好使用createElement创建的Dom节点像页面添加元素
  var dotContentElem = document.createElement('div');
  dotContentElem.setAttribute('class', 'focus-dots-content');
  var str = '';
  for (var i = 0; i < mainLunbo.len; i++) {
    str += '<a href="javascript:void(0);" class="dot"><img src=' + imgElems[i].src + ' alt=' + imgElems[i].alt + ' /></a>';
  }
  str += '</div>';
  dotContentElem.innerHTML = str;

  var content = document.querySelector('.mod-focus');
  content = content.parentNode;
  content.appendChild(dotContentElem);

  var dotElems = dotContentElem.querySelectorAll('.dot');
  dotElems[0].classList.add('active');
};
mainLunbo.init();
```
