const React = require('react')

class TripBudget extends React.Component {
  render () {
    return (
      <div className='budget'>
        <p style={{visibility: 'visible'}}>${this.props.saved} of ${this.props.budget} saved keep going!</p>
      </div>
    )
  }
}

const { number } = React.PropTypes

TripBudget.propTypes = {
  saved: number.isRequired,
  budget: number.isRequired
}

module.exports = TripBudget
