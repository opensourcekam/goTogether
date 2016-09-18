const React = require('react')
const FacebookLogin = require('../Login/FacebookLogin')
const GoogleLogin = require('../Login/GoogleLogin');

const Header = () => (
  <header>
      <span style={{color: "white", fontSize:"2em"}}>LetsGo</span>
      <nav style={{display:"inline-flex", float: "right"}}>
        <FacebookLogin />
        <GoogleLogin />
      </nav>
  </header>
)

module.exports = Header
