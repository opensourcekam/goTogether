const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const Layout = require('./Parts/Layout')
const DashBoard = require('./Home/DashBoard')
const NewTrip = require('./Trip/NewTrip')
const {Router, Route, IndexRoute, hashHistory} = require('react-router')
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
            <Route path="home" component={DashBoard} />
            <Route path="newTrip" component={NewTrip} />
          </Route>
        </Router>
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('app'))
