const React = require('react')

class Card extends React.Component {
  render () {
    return (
      <section className='card'>
        <h1>{this.props.action}</h1>
        <p>{this.props.actionText}</p>
      </section>
    )
  }
}

Card.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.string.isRequired
}

module.exports = Card
