export const Event = {

  addEvent: (domElem, event, func) => {
    if (document.addEventListener) {
      return domElem.addEventListener(event, func)
    } else if (document.attachEvent) {
      return domElem.attachEvent(event, func)
    }
    domElem['on' + event] = func
  }
}

export default Event
