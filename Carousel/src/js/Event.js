const Event = {
  addEvent: (domElem, event, func) => {
    if (document.addEventListener) {
      return domElem.addEventListener(event, func)
    } else if (document.attachEvent) {
      return domElem.attachEvent('on' + event, func)
    }
    domElem['on' + event] = func
  },
  getTarget: (event) => {
    return event.target || event.srcElement
  }
}

export default Event
