const React = require('react')
const UserCard = require('./Parts/UserCard')
const GetThere = require('./Parts/GetThere')
const BookAPlace = require('./Parts/BookAPlace')
// const ThingsToDo = require('./Parts/ThingsToDo')

import axios from 'axios'

class Trip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      trip: {},
      currentLocation: {
        city: '',
        country: ''
      }
    }
  }

  componentWillMount () {
    const tripId = this.props.routeParams.tripId
    // console.log(tripId)
    if (tripId) {
      axios.get(`/api/v1/trips/${tripId}`).then((trip) => {
        // console.log('Set trip state')
        // console.log(trip)
        return this.setState({trip: trip.data})
      }).catch((err) => {
        console.err(err)
        throw new Error('Could not retrieve trip for ${tripId}')
      })

      axios.get('/currentLocation').then((value) => {
        return this.setState({currentLocation: value.data})
      }).catch((err) => {
        console.err(err)
        throw new Error('Could not fetch users current location')
      })
    }
  }

  render () {
    let { trip, currentLocation } = this.state
    return (
      <div className='row'>
        <aside className='col-xs-12 col-sm-12 col-md-6'>
          <UserCard data={trip} />
        </aside>
        <section className='tripCards col-xs-12 col-sm-12 col-md-6'>
          <GetThere data={trip} userLocation={currentLocation} />
          <BookAPlace data={trip} />
          {/* <ThingsToDo /> */}
        </section>
        {/* <section>
          <p>Average price a day for {this.getAverage(this.state.trip.to.location)}</p>
        </section> */}
      </div>
    )
  }
}

const { object } = React.PropTypes

Trip.propTypes = {
  routeParams: object.isRequired
}

module.exports = Trip
