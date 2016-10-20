/*global userJSON sessionStorage*/
/*eslint no-undef: 'error'*/

const React = require('react')
import axios from 'axios'
const DisplayPhoto = require('./Parts/DisplayPhoto')
const TripBudget = require('./Parts/Budget/TripBudget')
const Map = require('./Parts/Maps/ToFromMap')
const currentPosition = {}
const flyingTo = {}

class UserTripCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPosition: {
        lat: 0,
        lng: 0
      },
      flyingTo: {
        lat: 0,
        lng: 0
      }

    }

    this.getCurrentPosition = this.getCurrentPosition.bind(this)
    this.getCurrentPositionErr = this.getCurrentPositionErr.bind(this)
  }

  componentDidMount () {
    let getFuturePosition = () => {
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + sessionStorage.location + '&key=AIzaSyC-GOgmWRmDOS6Ir9pNoBpdE_W-uAiHlTM').then((response) => {
        // console.log(response)
        flyingTo.lat = response.data.results[0].geometry.location.lat
        flyingTo.lng = response.data.results[0].geometry.location.lng
      }).catch((error) => {
        console.log(error)
      })
      this.setState({flyingTo})
    }
    getFuturePosition()
  }

  getCurrentPosition (position) {
    // console.log('position.coords')
    currentPosition.lat = position.coords.latitude
    currentPosition.lng = position.coords.longitude
    return this.setState({ currentPosition })
  }

  getCurrentPositionErr (err) {
    console.log(err)
  }

  render () {
    let styles = {
      userTripCard: {
        'marginBottom': '20px'
      }
    }
    navigator.geolocation.getCurrentPosition(this.getCurrentPosition, this.getCurrentPositionErr, {timeout: 10000})
    return (
      <section className='userTripCard' style={styles.userTripCard}>
        <DisplayPhoto />
        <div>
          <p>{userJSON.displayName || ''} is planning a trip to</p>
          <span>{sessionStorage.location || ''}</span>
        </div>
        <TripBudget /> {this.state.currentPosition.lat && this.state.flyingTo.lat
          ? <Map currentPosition={this.state.currentPosition} flyingTo={this.state.flyingTo} initialZoom={5} />
          : <p>Loading map...</p>}
      </section>
    )
  }
}

module.exports = UserTripCard
