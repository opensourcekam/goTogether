const React = require('react')
import auth from '../auth'

const Logout = () => (
  <section id='logout'>
    <a href="/logout" onClick={auth.logout()}>
      <button id='logout'>Logout</button>
    </a>
  </section>
)
module.exports = Logout
