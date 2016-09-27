const React = require('react')
const FacebookLogin = require('../Login/FacebookLogin')
// const GoogleLogin = require('../Login/GoogleLogin')
const Logout = require('../Login/Logout')
import auth from '../auth'

class Header extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loggedIn: auth.loggedIn()
    }
  }

  updateAuth (loggedIn) {
    this.setState({
      loggedIn
    })
  }

  componentWillMount () {
  }

  render () {
    return (
      <header>
        <span ><a href="/" style={{color: 'white', fontSize: '2em'}}>LetsGo</a></span>
        <nav style={{display: 'inline-flex', float: 'right'}}>
        {console.log(this.state)}
        {this.state.loggedIn ? (
          <span>
            <a href="/#/home"><button id="dashboard">Dashboard</button></a>
            <Logout />
          </span>
          ) : (
          <span>
            <FacebookLogin />
            {/* <GoogleLogin /> */}
          </span>
        )}
        </nav>
      </header>
    )
  }
}

module.exports = Header
