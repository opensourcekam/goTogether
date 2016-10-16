const React = require('react')
import auth from '../auth'

const Logout = () => (
  <a href="/logout" onClick={auth.logout()}>
    <button id='logout'>Logout</button>
  </a>
)
module.exports = Logout
