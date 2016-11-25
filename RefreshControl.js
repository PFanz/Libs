// id: require
// height: 允许下拉高度，单位px
// getData: 回调函数，当下拉高度达到允许下拉2/3时执行

const Event = require('./Event.js')

const RefreshControl = function (config) {
  // 默认配置
  let defaultConifg = {
    // 单位px
    height: 50,
    getData: () => {}
  }
  // 合并配置
  config = {
    ...defaultConifg,
    ...config
  }
  // 配置项
  this.controlElem = document.getElementById(config.id)
  this.height = config.height
  this.getData = config.getData
  // 全局变量
  this.startY = 0
}

RefreshControl.prototype.touchStart = function (event) {
  this.controlElem.style.transition = 'none'
  this.controlElem.style.webkitTransition = 'none'
  this.startY = event.touches[0].clientY
}

RefreshControl.prototype.touchMoving = function (event) {
  let movingY = event.touches[0].clientY
  if (window.scrollY <= 5 && movingY > this.startY) {
    event.preventDefault()
    event.stopPropagation()
    if (movingY - this.startY < this.height) {
      this.controlElem.style.transform = `translateY(${movingY - this.startY}px)`
      this.controlElem.style.webkitTransform = `translateY(${movingY - this.startY}px)`
    }
  }
}

RefreshControl.prototype.touchEnd = function (event) {
  // 开启css过渡效果
  this.controlElem.style.transition = `all .2s ease-in .1s`
  this.controlElem.style.webkitTransition = `all .2s ease-in .1s`
  // 大于一定范围，发送请求
  if (event.changedTouches[0].clientY - this.startY > this.height * 2 / 3) {
    console.info('加载数据')
    this.getData()
    this.controlElem.style.transform = 'translateY(0)'
    this.controlElem.style.webkitTransform = 'translateY(0)'
  } else {
    this.controlElem.style.transform = 'translateY(0)'
    this.controlElem.style.webkitTransform = 'translateY(0)'
  }
}

RefreshControl.prototype.init = function () {
  Event.addEvent(this.controlElem, 'touchstart', this.touchStart.bind(this))
  Event.addEvent(this.controlElem, 'touchmove', this.touchMoving.bind(this))
  Event.addEvent(this.controlElem, 'touchend', this.touchEnd.bind(this))
}

module.exports = RefreshControl
