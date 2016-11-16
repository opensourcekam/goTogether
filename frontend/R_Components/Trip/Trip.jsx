const React = require('react')
const UserCard = require('./Parts/UserCard')
const GetThere = require('./Parts/GetThere')
// const BookAPlace = require('./Parts/BookAPlace')
// const ThingsToDo = require('./Parts/ThingsToDo')

import axios from 'axios'

class Trip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      trip: {}
    }
  }

  componentWillMount () {
    const tripId = this.props.routeParams.tripId
    console.log(tripId)
    if (tripId) {
      axios.get(`/api/v1/trips/${tripId}`).then((trip) => {
        console.log('Set trip state')
        console.log(trip)
        return this.setState({trip: trip.data})
      }).catch((err) => {
        throw new Error('Could not get trip', err)
      })
    }
  }

  render () {
    return (
      <div className='row'>
        <aside className='col-xs-12 col-sm-12 col-md-6'>
          <UserCard data={this.state.trip} />
        </aside>
        <section className='tripCards col-xs-12 col-sm-12 col-md-6'>
          <GetThere data={this.state.trip} />
          {/* <BookAPlace />
          <ThingsToDo /> */}
        </section>
        {/* <section>
          <p>Average price a day for {this.getAverage(this.state.trip.to.location)}</p>
        </section> */}
      </div>
    )
  }
}

const { object, string } = React.PropTypes

Trip.propTypes = {
  routeParams: object.isRequired,
  tripId: string.isRequired
}

module.exports = Trip
