const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Parts/Landing')
const { Router, Route, hashHistory } = require('react-router')

const App = () => (
  <main>
    <Router history={hashHistory}>
      <Route path='/' component={Landing} />
    </Router>
  </main>
)

ReactDOM.render(<App />, document.getElementById('app'))
