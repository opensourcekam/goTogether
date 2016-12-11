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
        console.log(err)
      })
    }
  }

  render () {
    let { trip } = this.state
    return (
      <div className='row'>
        <aside className='col-xs-12 col-sm-12 col-md-6'>
          <UserCard data={trip} />
        </aside>
        <section className='tripCards col-xs-12 col-sm-12 col-md-6'>
          <GetThere data={trip} />
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
