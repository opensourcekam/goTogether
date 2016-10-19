const React = require('react')
const Hotel = require('./Parts/BookAPlaceParts/Hotel')
const Hostel = require('./Parts/BookAPlaceParts/Hostel')
const Family = require('./Parts/BookAPlaceParts/Family')

class BookAPlace extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <article className='tripCard'>
        <h2>Where are you staying?</h2>
        <div className='card-deck'>
          <Hotel />
          <Hostel />
          <Family />
        </div>
      </article>
    )
  }
}

module.exports = BookAPlace
