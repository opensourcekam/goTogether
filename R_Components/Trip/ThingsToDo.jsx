const React = require('react')

class ThingsToDo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <article className='tripCard'>
        <h2>What are you doing there?</h2>
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

module.exports = ThingsToDo
