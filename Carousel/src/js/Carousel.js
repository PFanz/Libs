if (typeof Array.prototype.forEach != "function") {
  Array.prototype.forEach = function(fn, context) {
    for (var k = 0, length = this.length; k < length; k++) {
      if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
        fn.call(context, this[k], k, this);
      }
    }
  };
}

if (!document.getElementsByClassName) {
  document.getElementsByClassName = function(className, element) {
    var children = (element || document).getElementsByTagName('*');
    var elements = new Array();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var classNames = child.className.split(' ');
      for (var j = 0; j < classNames.length; j++) {
        if (classNames[j] == className) {
          elements.push(child);
          break;
        }
      }
    }
    return elements;
  };
}

/**
 * String required id: 轮播图容器ID
 * String slidesConId: 包含所有项的容器ID 不设置时为轮播图容器下的ul标签
 * String slideClass: 每项类名 不设置时为slidesConId下的li标签
 * Number speed: 播放速度   默认1000  翻一页所需要的时间
 * Boolean auto: 自动播放   true
 * Number delay: 自动播放时延迟  默认3000ms
 * Number index: 起始位置   0
 * String dotConId: dots
 * String dotClass: 添加dot类名   dot
 * String preBtnId: 向前
 * String nextBtnId: 向后
 * Number width: 每一页距离 默认为第一页的宽度
 */
import Event from './Event.js'

const Carousel = function (config) {
  if (!config.id || !config.slideClass) {
    return
  }
  let defaultConfig = {
    auto: true,
    index: 0,
    speed: 1000,
    dotClass: 'dot',
    delay: 3000
  }
  this.config = {
    ...defaultConfig,
    ...config
  }

  this.carousel = document.getElementById(this.config.id)
  if (!this.carousel) {
    return
  }
  this.slidesCon = document.getElementById(this.config.slidesConId) || this.carousel.getElementsByTagName('ul')[0]
  if (!this.slidesCon) {
    return
  }
  // this.slides = $(this.slidesCon).find('.' + this.config.slideClass) || this.slidesCon.getElementsByTagName('li')
  // this.slides = this.slidesCon.getElementsByClassName(this.config.slideClass) || this.slidesCon.getElementsByTagName('li')
  this.slides = this.slidesCon.getElementsByTagName('li')
  if (!this.slides) {
    return
  }
  this.len = this.slides.length
  if (!this.len) {
    return
  }
  // this.distance = config.width ||
  //   window.getComputedStyle(this.slides[0]).width ||
  //   this.slides[0].currentStyle.width // 一页的距离
  if (config.width) {
    this.distance = config.width
  } else if (window.getComputedStyle) {
    this.distance = window.getComputedStyle(this.slides[0]).width
  } else {
    this.distance = this.slides[0].currentStyle.width // 一页的距离
  }
  if (!this.distance) {
    return
  }
  this.distance = parseFloat(this.distance)
  this.index = this.config.index

  if (this.config.dotConId) {
    this.dotCon = document.getElementById(this.config.dotConId)
  }

  // 只有一页
  if (this.len === 1) {
    return
  }

  this.init()
}

Carousel.prototype.init = function () {
  this.carousel.style.display = 'none'

  this.carousel.style.cssText = `width: ${this.distance}px; overflow: hidden;`
  this.slidesCon.style.cssText = `position: relative; width: ${this.distance}px;`

  Array.prototype.forEach.call(this.slides, (item, index) => {
    // $.each(this.slides, (item, index) => {
    item.style.cssText += `position: absolute; top: 0; width: ${this.distance}px;`
  })

  this.carousel.style.display = 'block'

  this.movingFlag = false
  if (document.body.style.transform !== undefined) {
    this.transformFlag = 'transform'
  } else if (document.body.style.webkitTransform !== undefined) {
    this.transformFlag = 'webkitTransform'
  } else {
    this.transformFlag = 'left'
  }
  let borderRadius
  if (window.getComputedStyle) {
    borderRadius = window.getComputedStyle(this.carousel, null).borderRadius
  } else {
    borderRadius = true
  }
  if (borderRadius && borderRadius !== '0px') {
    this.transformFlag = 'left'
  }

  this.setPos(0)
  this.dots = this.initDot()
  this.initBtn()

  if (this.config.auto) {
    this.autoFlag = this.autoPlay()
  }
}

Carousel.prototype.autoPlay = function () {
  let flag = setInterval(() => {
    this.play(1)
  }, this.config.delay)
  return flag
}

Carousel.prototype.setPos = function (index) {
  this.carousel.style.display = 'none'
    // 隐藏其他
  Array.prototype.forEach.call(this.slides, (item, index) => {
    // $.each(this.slides, (item, index) => {
    item.style.display = 'none'
  })

  index = this.getIndex(index)
  let pre = this.getIndex(index - 1)
  let next = this.getIndex(index + 1)

  this.slidesCon.style[this.transformFlag] = ''

  this.slides[index].style.display = 'block'
  this.slides[index].style.left = 0
  this.slides[pre].style.display = 'block'
  this.slides[pre].style.left = `-${this.distance}px`
  this.slides[next].style.display = 'block'
  this.slides[next].style.left = `${this.distance}px`

  this.carousel.style.display = 'block'

  this.index = index
}

Carousel.prototype.play = function (n) {
  // 这里滚动效果
  // let next = this.index + 1
  // next = this.getIndex(next)
  // let target = n * this.distance
  if (this.movingFlag) {
    return
  }
  this.movingFlag = true

  if (this.dotCon) {
    this.setDot(n)
  }

  let left = 0

  var move = () => {
    if (n > 0) {
      left -= this.distance / (this.config.speed / 60) // 每次要移动的距离
    } else if (n < 0) {
      left += this.distance / (this.config.speed / 60) // 每次要移动的距离
    }
    if (this.transformFlag === 'left') {
      this.slidesCon.style[this.transformFlag] = left + 'px'
    } else {
      this.slidesCon.style[this.transformFlag] = `translate3d(${left}px, 0, 0)`
    }
  }

  var animateMove = () => {
    // 添加requestAnimationFrame动画形式
    if (window.requestAnimationFrame) {
      requestAnimationFrame(() => {
        move()
        if (Math.abs(left) < this.distance) {
          animateMove()
        } else {
          n > 0 ? this.setPos(this.index + 1) : this.setPos(this.index - 1)
          this.movingFlag = false
          if (n > 1) {
            this.play(n - 1)
          } else if (n < -1) {
            this.play(n + 1)
          }
        }
      })
    } else {
      setTimeout(() => {
        move()
        if (Math.abs(left) < this.distance) {
          animateMove()
        } else {
          n > 0 ? this.setPos(this.index + 1) : this.setPos(this.index - 1)
          this.movingFlag = false
          if (n > 1) {
            this.play(n - 1)
          } else if (n < -1) {
            this.play(n + 1)
          }
        }
      }, 1000 / 60)
    }
  }
  animateMove()
}

Carousel.prototype.getIndex = function (index) {
  if (index > this.len - 1) {
    index = index - this.len
  } else if (index < 0) {
    index = index + this.len
  }
  return index
}

Carousel.prototype.initDot = function () {
  if (!this.dotCon) {
    return
  }
  let dotsStr = `<a href="javascript: void(0);" class="${this.config.dotClass} active"></a>`
  for (let i = 1; i < this.len; i++) {
    dotsStr += `<a href="javascript: void(0);" class="${this.config.dotClass}"></a>`
  }
  this.dotCon.innerHTML += dotsStr

  // let dots = this.dotCon.getElementsByClassName(this.config.dotClass)
  let dots = this.dotCon.getElementsByTagName('a')
  // let dots = $(this.dotCon).find('.' + this.config.dotClass)

  Event.addEvent(this.dotCon, 'click', event => {
    // console.log('click')
    event = event || window.event
    let target = Event.getTarget(event)
    if (target.className.indexOf(this.config.dotClass) >= 0 &&
      target.className.indexOf('active') < 0) {
      // 暂停播放
      this.config.auto && clearInterval(this.autoFlag)

      Array.prototype.forEach.call(this.dots, (item, index) => {
        // $.each(this.dots, (item, index) => {
        if (item === target) {
          this.play(index - this.index)
            // 开启自动播放
          if (this.config.auto) {
            this.autoFlag = this.autoPlay()
          }
          return
        }
      })
    }
  })

  return dots
}

Carousel.prototype.setDot = function (n) {
  // this.dots.removeClass('active')
  Array.prototype.forEach.call(this.dots, item => {
    item.className = item.className.replace(' active', '')
  })
    // let className = this.dots[this.getIndex(this.index + n)].className
  this.dots[this.getIndex(this.index + n)].className += ' active'
    // this.dots.eq(this.getIndex(this.index + n)).addClass('active')
}

Carousel.prototype.initBtn = function () {
  if (this.config.preBtnId) {
    let preBtn = document.getElementById(this.config.preBtnId)
    try {
      Event.addEvent(preBtn, 'click', () => {
        // console.log('click')
        // 暂停自动播放
        this.config.auto && clearInterval(this.autoFlag)
        this.play(-1)
          // 开启
        if (this.config.auto) {
          this.autoFlag = this.autoPlay()
        }
      })
      preBtn.style.visibility = 'visible'
    } catch (err) {
      // console.error(err)
    }
  }
  if (this.config.nextBtnId) {
    let nextBtn = document.getElementById(this.config.nextBtnId)
    try {
      Event.addEvent(nextBtn, 'click', () => {
        // console.log('click')
        // 暂停自动播放
        this.config.auto && clearInterval(this.autoFlag)
        this.play(1)
          // 开启
        if (this.config.auto) {
          this.autoFlag = this.autoPlay()
        }
      })
      nextBtn.style.visibility = 'visible'
    } catch (err) {
      // console.error(err)
    }
  }
}

export default Carousel
