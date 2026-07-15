var logger = (() => {
  var oldConsoleLog = null
  var oldConsoleError = null
  var pub = {}

  pub.enableLogger = function enableLogger () {
    if (oldConsoleLog == null) {
      return
    }

    window['console']['log'] = oldConsoleLog
    window['console']['error'] = oldConsoleError
  }

  pub.disableLogger = function disableLogger () {
    oldConsoleLog = console.log
    oldConsoleError = console.error

    window['console']['log'] = function () {}
    window['console']['error'] = function () {}
  }

  return pub
})()

// logger.disableLogger()
