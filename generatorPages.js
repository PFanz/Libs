// config.id  required
// config.divider
// config.total   required
function GeneratorPages (config) {
  this.dom = document.getElementById(config.id)
  this.divider = +config.divider || 10
  this.total = +config.total
  this.pages = Math.ceil((this.total / this.divider))
  this.currpage = 1   // 当前页
  if (!this.dom || this.pages < 2) {
    return
  }
  this.init()
}

GeneratorPages.prototype.init = function () {
  if (/[&|?]page=(\d*)&?/.test(location.href)) {
    this.currpage = +RegExp.$1
  } else {
    this.currpage = 1
  }
  this.generatorHtml()
  this.bindEvent()
  this.dom.style.display = 'block'
}

GeneratorPages.prototype.generatorHtml = function () {
  var preDots = false
  var nextDots = false
  var str = '<ul class="mod-pagination">'
  for (var i = 1; i <= this.pages; i++) {
    if (i === 1) {
      if (this.currpage !== 1) {
        str += '<li class="first_page"><a href="javascript:void(0);">首页</a></li>'
      }
      str += '<li' + (this.currpage === i ? ' class="selected"' : '') + '><a href="javascript:void(0)">' + i + '</a></li>'
    } else if (i === this.pages) {
      str += '<li' + (this.currpage === i ? ' class="selected"' : '') + '><a href="javascript:void(0)">' + i + '</a></li>'
      str += '<li class="next_page' + (this.currpage === this.pages ? ' disabled' : '') + '" id="next_page"><a href="javascript:void(0);">下一页</a></li>'
      str += '<li class="end_page' + (this.currpage === this.pages ? ' disabled' : '') + '"><a href="javascript:void(0);">末页</a></li>'
    } else if (i < this.currpage - 3) {
      console.log(i)
      if (!preDots) {
        str += '<li class="placeholder">...</li>'
        preDots = !preDots
      }
    } else if (i > this.currpage + 3) {
      console.log(i)
      if (!nextDots) {
        str += '<li class="placeholder">...</li>'
        nextDots = !nextDots
      }
    } else {
      str += '<li' + (this.currpage === i ? ' ="selected"' : '') + '><a href="javascript:void(0);">' + i + '</a></li>'
    }
  }
  str += '</ul>'
  this.dom.innerHTML = str
}

GeneratorPages.prototype.bindEvent = function () {
  var that = this
  $(this.dom).on('click', 'a', function () {
    var $this = $(this)
    if (isNaN(+$this.text()) || +$this.text() === this.currpage) {
      return
    }
    // 跳转到对应地址
    that.changePage(+$this.text())
  })

  $(this.dom).on('click', '.first_page', function () {
    that.changePage(1)
  })

  $(this.dom).on('click', '.next_page', function () {
    if (that.currpage === that.pages) {
      return
    }
    that.changePage(+that.currpage + 1)
  })

  $(this.dom).on('click', '.end_page', function () {
    if (that.currpage === that.pages) {
      return
    }
    that.changePage(that.pages)
  })
}

GeneratorPages.prototype.changePage = function (page) {
  if (typeof page !== 'number') {
    page = 1
  }
  var url = location.href
  if (/([&|?])page=(\d*)(&?)/.test(url)) {
    url = url.replace(/([&|?])page=(\d*)(&?)/, '$1page=' + page + '$3')
  } else if (location.search === '') {
    url = url + '?page=' + page
  } else {
    url = url + '&page=' + page
  }
  location.href = url
}
