const React = require('react')

const style = {
  card: {
    height: '400px',
    color: '#000'
  },
  p: {
    fontSize: '2em'
  }
}

class Card extends React.Component {
  render () {
    return (
      <div className="card" style={style.card}>
        <div className="card-block">
          <h2 className="card-title">{this.props.action}</h2>
          <p style={style.p} className="card-text">{this.props.actionText}</p>
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.string.isRequired
}

module.exports = Card
