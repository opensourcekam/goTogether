const React = require('react')
const CurrencyPicker = require('./HeadAndFootParts/CurrencyPicker')

class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      locales: {}
    }
  }

  componentDidMount () {
    const { axios } = this.props
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
        <nav className='navbar navbar-fixed-bottom navbar-dark bg-primary'>
          <a className='navbar-brand' href='#'>youme.🌎🌍🌏</a>
          <CurrencyPicker axios={this.props.axios} />
        </nav>
      </footer>
    )
  }
}

const { func } = React.PropTypes

Footer.propTypes = {
  axios: func.isRequired
}

module.exports = Footer
