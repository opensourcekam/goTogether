const React = require('react')

class BookAPlace extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <article className='tripCard'>
        <h2>Where are you staying?</h2>
        <div className='tripTile getThereTile'>
        </div>
        <div className='tripTile getThereTile'>
        </div>
        <div className='tripTile getThereTile'>
        </div>
      </article>
    )
  }
}

module.exports = BookAPlace
