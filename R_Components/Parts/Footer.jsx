const React = require('react')
const axios = require('axios')

class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      locales: {}
    }
  }

  componentDidMount () {
    this.serverRequest =
      axios
        .get('/api/v1/locales')
        .then((res) => {
          this.setState({
            locales: res.data.Locales
          })
        })
  }

  componentWillUnmount () {
    this.serverRequest.abort()
  }

  render () {
    return (
      <footer>
        <nav className="navbar navbar-fixed-bottom navbar-dark bg-primary">
          <a className="navbar-brand" href="#">Fixed bottom</a>
        </nav>
      </footer>
    )
  }
}

module.exports = Footer
