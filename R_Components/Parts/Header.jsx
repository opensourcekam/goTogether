const React = require('react')
const FacebookLogin = require('../Login/FacebookLogin')
const GoogleLogin = require('../Login/GoogleLogin')
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
      <header style={{height: '100px'}}>
        <span ><a href="/" style={{color: 'white', fontSize: '2em'}}>LetsGo</a></span>
        <nav style={{display: 'inline-flex', float: 'right'}}>
            {this.state.loggedIn ? (
              <ul>
                <li>
                  <a href="/#/home"><button id="dashboard">Next place</button></a>
                  <Logout />
                </li>
              </ul>
              ) : (
              <ul>
                <FacebookLogin />
                <GoogleLogin />
              </ul>
            )}
        </nav>
      </header>
    )
  }
}

module.exports = Header
