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
      hotelsPrices: [],
      imageHostUrl: '',
      totalAvailableHotels: 0
    }

    this.getPlaceList = this.getPlaceList.bind(this)
  }

  getPlaceList (destination, checkIn, checkOut) {
    // location is passed from BookAPlace component as data.trip.to.location
    // if(this.props.destination !== '') {
    //   destination = this.props.destination
    // }
    //
    // console.log(destination)

    axios.get('/api/v1/hotels/rooms', {
      params: {
        destination,
        checkIn,
        checkOut
      }
    }).then((res) => {
      window._htd = res.data
      let { agents, amenities, hotels } = res.data
      let imageHostUrl = res.data.image_host_url
      let totalAvailableHotels = res.data.total_available_hotels
      let hotelsPrices = res.data.hotels_prices

      console.log({agents, amenities, hotels, hotelsPrices, imageHostUrl, totalAvailableHotels})

      this.setState({agents, amenities, hotels, hotelsPrices, imageHostUrl, totalAvailableHotels})
    }).catch((err) => {
      console.err(err)
      throw new Error('Could not poll for rooms')
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
    // console.log(destination)
    this.getPlaceList(destination, checkIn, checkOut)
  }

  render () {
    // const iconSRC = 'hotel_icon.png'
    // const style = {
    //   img: {
    //     height: '140px'
    //   }
    // }

    const { hotels, amenities, hotelsPrices, imageHostUrl } = this.state

    return (
      (hotels.length === 0) ? <HotelLoader />
       : <HotelDetails
         hotels={hotels}
         amenities={amenities}
         hotelsPrices={hotelsPrices}
         imageHostUrl={imageHostUrl} />
    )
  }
}

module.exports = Hotel
