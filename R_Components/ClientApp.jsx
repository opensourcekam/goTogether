const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const Layout = require('./Parts/Layout')
const DashBoard = require('./TripIdeas/DashBoard')
const PlanNewTripDash = require('./Trip/PlanNewTripDash')
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
            <Route path="tripIdeas" component={DashBoard} />
            <Route path="newTrip" component={PlanNewTripDash} />
          </Route>
        </Router>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore()
  ReactDOM.render(<App store={store}/>, document.getElementById('app'))
})
