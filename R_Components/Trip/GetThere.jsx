const React = require('react')

class GetThere extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <article className='tripCard'>
        <h2>How are you arriving?</h2>
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

module.exports = GetThere
