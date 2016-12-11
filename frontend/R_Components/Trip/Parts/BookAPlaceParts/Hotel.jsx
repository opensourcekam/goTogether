const React = require('react')
const HotelDetails = require('./Parts/HotelDetails')
const HotelLoader = require('../../../Parts/Loaders/HotelLoader')
import axios from 'axios'
// import moment from 'moment'

// Component will essintally search for rooms in its corrosponding city this is where the structure of length of stay would come in handy, for both this and flights.

// Allows users to see well rated rooms to rent

class Hotel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      agents: [],
      amenities: [],
      hotels: [],
      hotels_prices: [],
      image_host_url: '',
      total_available_hotels: 0

    }

    this.getPlaceList = this.getPlaceList.bind(this)
    this.getHotels = this.getHotels.bind(this)
  }

  getHotels (e) {
    console.log(e)
    console.log(this)
  }

  getPlaceList (destination, checkIn, checkOut) {
    // location is passed from BookAPlace component as data.trip.to.location
    // if(this.props.destination !== '') {
    //   destination = this.props.destination
    // }
    //
    console.log(destination)

    axios.get('/api/v1/hotels/rooms', {
      params: {
        destination,
        checkIn,
        checkOut
      }
    }).then((res) => {
      window._htd = res.data
      let { agents, amenities, hotels, hotels_prices, image_host_url, total_available_hotels } = res.data
      console.log({agents, amenities, hotels, hotels_prices, image_host_url, total_available_hotels})

      this.setState({agents, amenities, hotels, hotels_prices, image_host_url, total_available_hotels})
    }).catch((err) => {
      console.log(err)
    })

    // axios.get(`/api/v1/hotels/rooms?destination=${destination}\&checkIn=${checkIn}\&checkOut=${checkOut}`).then((res) => {
    //   this.setState({autosuggest: res.data})
    // }).catch((err) => {
    //   console.log(err)
    // })
  }

  componentWillReceiveProps (nextProps) {
    // console.log('NP', nextProps)

    const destination = nextProps.destination
    const { checkIn, checkOut } = nextProps
    console.log(destination)
    this.getPlaceList(destination, checkIn, checkOut)
  }

  render () {
    const iconSRC = 'hotel_icon.png'
    const style = {
      img: {
        height: '140px'
      }
    }

    const { hotels, amenities, hotels_prices, image_host_url } = this.state

    return (
      (hotels.length === 0) ?
        <HotelLoader />
       : <HotelDetails
           hotels={hotels}
           amenities={amenities}
           hotels_prices={hotels_prices}
           image_host_url={image_host_url} />
    )
  }
}

module.exports = Hotel
