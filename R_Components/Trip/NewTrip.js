const React = require('react')
const UserTripCard = require('./UserTripCard')
const GetThere = require('./GetThere')
const BookAPlace = require('./BookAPlace')
const ThingsToDo = require('./ThingsToDo')

class NewTrip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lat: 0,
      lon: 0
    }
    this.getLocation = this.getLocation.bind(this)
  }

  componentDidMount () {
    this.getLocation
  }

  getLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({lat: position.coords.latitude, lon: position.coords.longitude})
      })
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }

  render () {
    // console.log(userJSON)
    return (
      <div onLoad={this.getLocation}>
        <aside>
          <UserTripCard />
        </aside>
        <section className='tripCards'>
          <GetThere />
          <BookAPlace />
          <ThingsToDo />
        </section>
      </div>
    )
  }
}

module.exports = NewTrip
