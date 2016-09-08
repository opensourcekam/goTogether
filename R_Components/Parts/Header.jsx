const React = require('react')
const FacebookLogin = require('../Login/FacebookLogin')

const Header = () => (
  <header>
    <div>
      <nav>
        <FacebookLogin />
      </nav>
    </div>
  </header>
)

module.exports = Header
