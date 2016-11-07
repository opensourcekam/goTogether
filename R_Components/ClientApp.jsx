const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const Layout = require('./Parts/Layout')
const DashBoard = require('./TripIdeas/DashBoard')
const PlanNewTripDash = require('./Trip/PlanNewTripDash')
const MyTrips = require('./MyTrips/MyTrips')

const {Router, Route, IndexRoute, hashHistory} = require('react-router')
import configureStore from '../redux/store/store'
import auth from './auth'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: auth.loggedIn()
    }
  }

  redirectIfLoggedOut (e) {
    if (!this.state.loggedIn) {
      hashHistory.push('/')
    }
  }

  updateAuth (loggedIn) {
    this.setState({loggedIn})
  }

  componentDidUpdate () {
    this.redirectIfLoggedOut()
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
            <Route
              path="tripIdeas"
              component={DashBoard}
              onEnter={this.redirectIfLoggedOut}
            />
            <Route path="newTrip" component={PlanNewTripDash} />
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
