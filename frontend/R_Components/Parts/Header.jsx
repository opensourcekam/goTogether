const React = require('react')
const FacebookLogin = require('../Auth/Login/FacebookLogin')
const GoogleLogin = require('../Auth/Login/GoogleLogin')
const Logout = require('../Auth/Login/Logout')
import auth from '../Auth/auth'

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
        <span ><a href='/' style={{color: 'black', fontSize: '2.3em', 'marginTop': '20px'}}>youme.🌎</a></span>
        <nav style={{display: 'inline-flex', float: 'right'}}>
          {this.state.loggedIn ? (
            <ul>
              <li>
                <a href='/#/newTrip'><button id='newTrip'>New Trip</button></a>
              </li>
              <li>
                <a href='/#/myTrips'><button id='myTrips'>My Trips</button></a>
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
