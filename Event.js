const Event = {
  addEvent: (domElem, event, func) => {
    if (document.addEventListener) {
      return domElem.addEventListener(event, func)
    } else if (document.attachEvent) {
      return domElem.attachEvent(event, func)
    }
    domElem['on' + event] = func
  },
  removeEvent: (domElem, event, func) => {
    if (document.removeEventListener) {
      return domElem.removeEventListener(event, func)
    } else if (document.detachEvent) {
      return domElem.datachEvent(event, func)
    }
    domElem['on' + event] = ''
  },
  getEvent: (event) => {
    return event ? event : window.event
  },
  getTarget: (event) => {
    return event.target || event.srcElement
  },
  preventDefault: (event) => {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  stopPropagation: (event) => {
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  }
}

module.exports = Event
