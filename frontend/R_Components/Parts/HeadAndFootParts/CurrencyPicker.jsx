const React = require('react')

class CurrencyPicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currencies: [],
      selected: {
        code: '',
        symbol: ''
      }
    }
  }

  componentDidMount () {
    const { axios } = this.props
    axios.get('/currencies').then((value) => {
      this.setState({currencies: value.data})
    }).catch((err) => {
      console.err(err)
      throw new Error('Could not get currencies')
    })
    // console.log('[curr]',this.state)
  }

  componentWillMount () {
  }

  render () {
    const { currencies } = this.state
    const childElement = currencies.map((guap) => {
      const { Code, Symbol } = guap
      return <option value={`${Code}${Symbol}`} key={Code}>{`${Code}: ${Symbol}`}</option>
    })
    return (
      <select className='dropdown'>
        Currencies
        {childElement}
      </select>
    )
  }
}

const { func } = React.PropTypes

CurrencyPicker.propTypes = {
  axios: func.isRequired
}

module.exports = CurrencyPicker
