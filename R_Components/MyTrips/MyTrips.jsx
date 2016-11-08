/*global userJSON*/
const React = require('react')
const CircleProgressBarWithImageCenter = require('./Parts/CircleProgressBarWithImageCenter')
import axios from 'axios'

class MyTrips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      trips: []
    }
  }

  // Get each trip for currently loggedin user
  // pass props to DisplayTrip component
  // Dispaly each trip make clickable
  // Each trip will feed its props into a the PlanNewTrip Dashboard component

  componentWillMount () {
  }

  componentDidMount () {
    console.log(userJSON.id)
    axios.get(`/user/trips/${userJSON.id}`).then((res) => {
      return this.setState({ trips: res.data })
    }).catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className='container-fluid'>
        {console.log(this.state.trips)}
        {this.state.trips.map((trip, i) => {
          return (
            <div key={i} className='col-xs-12 col-sm-12 col-md-4'>
              <CircleProgressBarWithImageCenter
                img='/images/tempLocations/Tokyo.jpeg'
                _id={trip._id}
                mountId={trip.to.replace(/[\s,]/g, '')}
                dest={trip.to}
                budget={trip.budget}
                tripDate={trip.tripDate}
                color='#aae444'
                strokeWidth='4' />
            </div>
          )
        })}
      </div>
    )
  }
}

module.exports = MyTrips
