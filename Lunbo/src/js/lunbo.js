const Event = require('./Event.js')

const Lunbo = function (config) {
  // 默认配置
  let defaultConfig = {
    auto: true,
    step: 1,
    delay: 3,
    hasDot: true,
    hasArrow: true
  }
  // 合并配置
  config = {
    ...defaultConfig,
    ...config
  }

  // 用到的配置项
  this.contentElem = document.getElementById(config.id)
  this.auto = config.auto
  this.step = config.step
  this.delay = config.delay
  this.hasDot = config.hasDot
  this.hasArrow = config.hasArrow

  // 一些使用到的变量
  // DOM相关
  this.listContainer = this.contentElem.querySelector('ul')
  this.len = this.contentElem.querySelectorAll('li').length
  this.oneWidth = this.contentElem.clientWidth
  this.oneHeight = this.contentElem.clientHeight
  this.dotContainer = null
  this.arrowContainer = null
  this.dotNodes = null

  // 位置相关
  this._n = 0
  this.movingFlag = null
  this.playingFlag = null
}

Lunbo.prototype.createDots = function (parentElem) {
  // 使用createElement创建的Dom节点,可以避免修改DOM对事件的影响
  this.dotContainer = document.createElement('div')
  this.dotContainer.setAttribute('class', 'focus-dots-content')
  let str = '<a href="javascript:void(0);" class="dot active"></a>'
  for (let i = 1; i < this.len; i++) {
    str += '<a href="javascript:void(0);" class="dot"></a>'
  }
  this.dotContainer.innerHTML = str
  parentElem.appendChild(this.dotContainer)
  // 为dot添加事件
  let dotNodes = this.dotContainer.querySelectorAll('.dot')
  let targetIndex = 0
  Event.addEvent(this.dotContainer, 'click', (event) => {
    let target = event.target || event.srcElement
    if (target.className.indexOf('dot') !== -1) {
      // 阻止点击多次
      if (target.className.indexOf('active') !== -1) {
        return
      }
      for (let i = 0; i < this.len; i++) {
        if (dotNodes[i] === target) {
          targetIndex = i
          break
        }
      }
      this.play(targetIndex - this._n)
    }
  })
}

Lunbo.prototype.createArrows = function (parentElem) {
  this.arrowContainer = document.createElement('div')
  this.arrowContainer.setAttribute('class', 'focus-arrows-content')
  let str = '<a href="javascript:void(0);" class="focus-arrow-pre"></a>' +
        '<a href="javascript:void(0);" class="focus-arrow-next"></a>'
  this.arrowContainer.innerHTML = str
  parentElem.appendChild(this.arrowContainer)
  // 为arrows添加事件
  Event.addEvent(this.arrowContainer, 'click', (event) => {
    let target = event.target || event.srcElement
    if (target.className.indexOf('focus-arrow-pre') !== -1) {
      this.play(-1)
    } else if (target.className.indexOf('focus-arrow-next') !== -1) {
      this.play(1)
    }
  })
}

Lunbo.prototype.setStyle = function () {
  // 样式初始化
  this.contentElem.style.position = 'relative'
  this.contentElem.style.overflow = 'hidden'

  // this.listContainer.style.padding = 0
  this.listContainer.style.width = this.len * this.oneWidth + 'px'
  this.listContainer.style.position = 'relative'
  this.listContainer.style.left = 0 + 'px'

  let listNodes = this.contentElem.querySelectorAll('li')
  for (let i = 0, len = listNodes.length; i < len; i++) {
    listNodes[i].style.listStyle = 'none'
    listNodes[i].style.float = 'left'
    listNodes[i].style.width = this.oneWidth + 'px'
    // listNodes[i].style.height = this.oneHeight + 'px'
    // listNodes[i].querySelector('img').style.width = '100%'
    // listNodes[i].querySelector('img').style.height = '100%'
  }
}

Lunbo.prototype.autoPlay = function () {
  if (this.playingFlag === null) {
    this.playingFlag = setInterval(
      () => {
        this.play(1)
      }, this.delay * 1000)
  }
  return this.playingFlag
}

Lunbo.prototype.play = function (n) {
  // 目的地
  let pos = this._n + n
  if (pos < 0) {
    pos = pos + this.len
  } else if (pos >= this.len) {
    pos = pos - this.len
  }
  // 如果正在滚动，停止滚动，并重新开始
  if (this.movingFlag !== null) {
    clearInterval(this.movingFlag)
    this.movingFlag = null
  }

  // 滚动到该目的地
  // 坐标轴 左为正，又为负
  let nextLeft = -pos * this.oneWidth
  let currLeft = parseFloat(this.listContainer.style.left)
  // 每次移动距离
  let move = (nextLeft - currLeft) / (this.step * 1000) * 24

  // 滚动动画
  this.movingFlag = setInterval(() => {
    // 每次要移动到的位置
    let targetLeft = parseFloat(this.listContainer.style.left) + move

    // 向前移动
    if (move < 0) {
      // 移动到的位置在目标位置的右边
      if (targetLeft <= nextLeft) {
        targetLeft = nextLeft
        clearInterval(this.movingFlag)
        this.movingFlag = null
      }
    } else if (move > 0) {
      // 移动到的位置再目标位置的左边
      if (targetLeft >= nextLeft) {
        targetLeft = nextLeft
        clearInterval(this.movingFlag)
        this.movingFlag = null
      }
    }

    this.listContainer.style.left = targetLeft + 'px'
  }, 8)

  this._n = pos

  // 修改dot active
  if (this.hasDot) {
    this.dotNodes = this.dotContainer.querySelectorAll('.dot')
    for (let i = 0; i < this.len; i++) {
      this.dotNodes[i].className = 'dot'
    }
    this.dotNodes[this._n].className = 'dot active'
  }
}

Lunbo.prototype.autoPause = function (domElem) {
  Event.addEvent(domElem, 'mouseenter', () => {
    clearInterval(this.playingFlag)
    this.playingFlag = null
  })
  Event.addEvent(domElem, 'mouseleave', () => {
    this.autoPlay()
  })
  return this.playingFlag
}

Lunbo.prototype.pause = function () {
  clearInterval(this.playingFlag)
  this.playingFlag = null
}

Lunbo.prototype.init = function () {
  this.setStyle()
  this.hasDot && this.createDots(this.contentElem)
  this.hasArrow && this.createArrows(this.contentElem)
  this.auto && this.autoPlay() && this.autoPause(this.contentElem) &&
    this.hasDot && this.autoPause(this.dotContainer)
}

module.exports = Lunbo
