const React = require('react')
const Hotel = require('./BookAPlaceParts/Hotel')
// const Hostel = require('./BookAPlaceParts/Hostel')
// const Family = require('./BookAPlaceParts/Family')

class BookAPlace extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      destination: '',
      checkIn: '',
      checkOut: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log('BAP', nextProps)
    if (nextProps) {
      const trip = nextProps.data
      this.setState({
        destination: trip.to.location,
        checkIn: trip.tripDate,
        checkOut: trip.tripEndDate
      })
    }
  }

  render () {
    const { destination, checkIn, checkOut } = this.state
    return (
      <article className='tripCard' style={{height: '600px'}}>
        {/* <h2>Where are you staying in {destination}?</h2> */}
        <div className='card-deck' style={{display: 'block'}}>
          <Hotel
            destination={destination}
            checkIn={checkIn}
            checkOut={checkOut} />
        </div>
      </article>
    )
  }
}

module.exports = BookAPlace
