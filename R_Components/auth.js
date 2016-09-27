/* global localStorage */

module.exports = {
  loggedIn () {
    return !!localStorage.token
  },

  logout (cb) {
    // console.log('logging out')
    delete localStorage.token
    if (cb) cb()
    this.onChange(false)
  },

  onChange () {}
}
