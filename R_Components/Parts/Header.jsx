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

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  updateAuth (loggedIn) {
    this.setState({
      loggedIn
    })
  }

  render () {
    return (
      <header style={{height: '100px'}}>

        <nav style={{display: 'inline-flex', float: 'right'}}>
          <span ><a href="/" style={{color: 'white', fontSize: '2.3em'}}>youme.🌎</a></span>
          {this.state.loggedIn ? (
            <ul>
              <li>
                <a href="/#/tripideas"><button id="tripideas">Trip Ideas</button></a>
              </li>
              <li>
                <a href="/#/myTrips"><button id="myTrips">My Trips</button></a>
              </li>
              <li>
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
