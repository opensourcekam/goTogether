/* global localStorage */

module.exports = {
  loggedIn () {
    return !!localStorage.token
  },

  logout (cb) {
    delete localStorage.token
  },

  onChange () {}
}
