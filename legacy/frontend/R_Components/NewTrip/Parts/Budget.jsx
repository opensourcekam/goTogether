const React = require('react')

class Budget extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      budget: ''
    }

    this.setBudget = this.setBudget.bind(this)
  }

  setBudget (e) {
    return this.setState({
      budget: e.target.value
    })
  }

  render () {
    return (
      <div>
        <input value={`${this.state.budget}`} onChange={this.setBudget} placeholder={`What are we spending? ${this.props.currencySymbol}500`} type='text' />
      </div>
    )
  }
}

const {string} = React.PropTypes

Budget.propTypes = {
  currencySymbol: string.isRequired
}

module.exports = Budget
