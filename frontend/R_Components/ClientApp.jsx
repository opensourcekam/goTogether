const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const Layout = require('./Parts/Layout')
const NewTrip = require('./NewTrip/NewTrip')
const Trip = require('./Trip/Trip')
const MyTrips = require('./MyTrips/MyTrips')

const {Router, Route, IndexRoute, hashHistory} = require('react-router')
import configureStore from '../redux/store/store'
import auth from './Auth/auth'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: auth.loggedIn()
    }
  }

  updateAuth (loggedIn) {
    this.setState({loggedIn})
  }

  componentWillMount () {
    auth.onChange = this.updateAuth(this.state.loggedIn)
  }

  render () {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path='/' component={Layout}>
            <IndexRoute component={Landing} />
            {/* Contains new trip form */}
            <Route path="newTrip" component={NewTrip} />
            {/* Contains the map */}
            <Route path="tripDash" component={Trip} />
            <Route path="/tripDash/:tripId" component={Trip} />
            {/* <Route path="/tripDash/:tripIdt" onEnter={handleAddPost}/> */}
            {/* Contains all trips currently planning */}
            <Route path="myTrips" component={MyTrips} />
          </Route>
        </Router>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore()
  window.store = store
  ReactDOM.render(<App store={store} />, document.getElementById('app'))
})
