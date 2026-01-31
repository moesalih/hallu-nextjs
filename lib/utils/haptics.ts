export function haptics() {
  if (navigator.vibrate) {
    navigator.vibrate(50)
  } else {
    /*
    iOS fallback: WebKit browsers do not support the Vibration API.
    However, you can trigger a light haptic feedback by associating
    a label to an invisible switch input and toggling it programmatically. 
    */
    let el = document.createElement('div')
    let id = Math.random().toString(36).slice(2)
    el.innerHTML = `<input type="checkbox" id="` + id + `" switch /><label for="` + id + `"></label>`
    el.setAttribute('style', 'display:none !important;opacity:0 !important;visibility:hidden !important;')
    document.querySelector('body')?.appendChild(el)
    el.querySelector('label')?.click()
    setTimeout(function () {
      el.remove()
    }, 1500)
  }
}
