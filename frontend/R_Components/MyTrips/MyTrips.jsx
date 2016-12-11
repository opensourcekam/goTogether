/* global userJSON */
const React = require('react')
const CircleProgressBarWithImageCenter = require('./Parts/CircleProgressBarWithImageCenter')
const PlaneSpinLoader = require('../Parts/Loaders/PlaneSpinLoader')
import axios from 'axios'
import { Link } from 'react-router'

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
    axios.get(`/api/v1/trips/all/${userJSON.id}`).then((res) => {
      console.log(res.data)
      return this.setState({ trips: res.data })
    }).catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount () {
  }

  render () {
    const { trips } = this.state
    let childElements

    if (trips.length) {
      childElements = trips.map((trip, i) => {
        // If past is false show the trip bubble otherwise show these in a past trips section
        if (trip.meta.past !== true) {
          return (
            <div key={i} className='col-xs-12 col-sm-12 col-md-6 col-lg-4'>
              <Link to={`/tripDash/${trip._id}`}>
                <CircleProgressBarWithImageCenter
                  img={`//maps.googleapis.com/maps/api/staticmap?center=${trip.to.geometry.lat},${trip.to.geometry.lng}&zoom=13&size=400x450&satellite=roadmap&key=AIzaSyDa8ZRyg_iOyMDRf7nM8sWp_6vLgy7mYLE`}
                  _id={trip._id}
                  mountId={`${trip.to.location.replace(/[\s,]/g, '')}_${trip._id}`}
                  dest={trip.to.location}
                  budget={trip.meta.budget}
                  saved={trip.meta.saved}
                  tripDate={trip.tripDate}
                  tripEndDate={trip.tripEndDate}
                  tripHasPast={trip.meta.past.toString()}
                  color='#aae444'
                  strokeWidth='4' />
              </Link>
            </div>
          )
        } else { // meta else
          return (
            null // return null until I have a way to clearly show a user their trip has passed
          )
        }
      })
    } else {
      childElements = <PlaneSpinLoader />
    }

    return (
      <div>
        <h3>Plan for</h3>
        <hr />
        <div className='container-fluid' id='progress-circle-container'>
          {childElements}
        </div>
      </div>
    )
  }
}

module.exports = MyTrips
