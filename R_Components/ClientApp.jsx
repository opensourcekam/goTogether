const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const Layout = require('./Parts/Layout')
const DashBoard = require('./Home/DashBoard')
const {Router, Route, IndexRoute, hashHistory} = require('react-router')

class App extends React.Component {

  render () {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path='/' component={Layout}>
            <IndexRoute component={Landing} />
            <Route path="home" component={DashBoard} />
          </Route>
        </Router>
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('app'))
