/*global userJSON sessionStorage*/
/*eslint no-undef: 'error'*/

const React = require('react')
import axios from 'axios'
// import { find as _find } from 'lodash'
import _ from 'lodash'
const DisplayPhoto = require('./Parts/DisplayPhoto')
const TripBudget = require('./Parts/Budget/TripBudget')
// const Map = require('./Parts/Maps/ToFromMap')
const ToMap = require('./Parts/Maps/ToMap')

const currentPosition = {}
const flyingTo = {}

class UserTripCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // currentPosition: {
      //   lat: 0,
      //   lng: 0
      // },
      flyingTo: {
        lat: 0,
        lng: 0
      }

    }

    // this.getCurrentPosition = this.getCurrentPosition.bind(this)
    // this.getCurrentPositionErr = this.getCurrentPositionErr.bind(this)
  }

  componentDidMount () {
    let getFuturePosition = () => {
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + sessionStorage.location + '&key=AIzaSyC-GOgmWRmDOS6Ir9pNoBpdE_W-uAiHlTM').then((response) => {
        console.log(response)

        console.log(response.data.results[0].formatted_address)
        console.log(response.data.results[0].geometry.location)

        // flyingTo.lat = response.data.results[0].geometry.location.lat
        // flyingTo.lng = response.data.results[0].geometry.location.lng
        this.setState({flyingTo: response.data.results[0].geometry.location})
      }).catch((error) => {
        console.log(error)
      })
    }
    getFuturePosition()
  }

  // getCurrentPosition (position) {
  //   // console.log('position.coords')
  //   currentPosition.lat = position.coords.latitude
  //   currentPosition.lng = position.coords.longitude
  //   return this.setState({ currentPosition })
  // }
  //
  // getCurrentPositionErr (err) {
  //   console.log(err)
  // }

  render () {
    let styles = {
      userTripCard: {
        'marginBottom': '20px'
      }
    }
    //navigator.geolocation.getCurrentPosition(this.getCurrentPosition, this.getCurrentPositionErr, {timeout: 10000})
    return (
      <section className='userTripCard' style={styles.userTripCard}>
        <DisplayPhoto />
        <div>
          <p>{userJSON.displayName || ''} is planning a trip to</p>
          <span>{sessionStorage.location || ''}</span>
        </div>
        <TripBudget /> {this.state.flyingTo.lat
          ? <ToMap flyingTo={this.state.flyingTo} initialZoom={8} />
          : <p>Loading map...</p>}
      </section>
    )
  }
}

module.exports = UserTripCard
