const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const { Router, Route, hashHistory } = require('react-router')

const App = () => (
  <div>
    <Router history={hashHistory}>
      <Route path='/' component={Landing} />
    </Router>
  </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
