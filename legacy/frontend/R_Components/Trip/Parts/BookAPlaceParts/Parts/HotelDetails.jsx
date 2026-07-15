/* global google */
const React = require('react')

class HotelDetails extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.locations = [] // push({ id: '', name: '', latitude: 0, longitude: 0 })
    this.panToLocation = this.panToLocation
    this.zoomOutFromLocation = this.zoomOutFromLocation.bind(this)
  }

  componentDidMount () {}

  panToLocation (location) {
    // console.log(location)
    window.__tripMap__.setCenter(location)
    window.__tripMap__.setZoom(18)
  }

  zoomOutFromLocation () {
    console.log('Should I zoom out?')
    // window.__tripMap__.setZoom(12)
  }

  addHotelToSummary (e) {
    // socket.on('selectedHotel', (e) => {
    //
    // })
  }

  render () {
    const {hotels, amenities, hotelsPrices, imageHostUrl} = this.props
    console.log(amenities, imageHostUrl)
    // const panToLocation = (e) => {
    //   console.log(this)
    //   console.log(e)
    //   console.log(e.currentTarget)
    //   console.log(e.nativeEvent)
    // }

    // const hotelPricesSortedLowToHigh = hotelsPrices.sort((a, b) => {
    //   return parseFloat(a.agent_prices[0].priceTotal) - parseFloat(b.agent_prices[0].priceTotal)
    // })

    // console.log('L-t-H', hotelPricesSortedLowToHigh)

    const childElements = hotels.map((h, i) => { // on each map of this each map inside runs n times
      let markerObj = {
        id: h.hotel_id,
        name: h.name,
        position: {
          lat: h.latitude,
          lng: h.longitude
        }
      }

      this.locations.push(markerObj)

      let marker = new google.maps.Marker({position: markerObj.position, map: window.__tripMap__, title: markerObj.name, animation: google.maps.Animation.DROP})

      // let infowindow =  new google.maps.InfoWindow({
      // 	content: markerObj.name
      // })
      //
      // marker.addListener(marker, 'mouseover', function () {
      // 	infowindow.open(map, this)
      // })
      //
      // marker.addListener(marker, 'mouseout', function () {
      //   infowindow.close()
      // })

      marker.metadata = {
        id: markerObj.id
      }

      let images = Object.keys(h.images).splice(0, 2).map((imgBase, j) => {
        if (j <= 1) {
          return (<img src={`http://${imageHostUrl}${imgBase}mc.jpg`} key={imgBase} />)
        } else {
          return
        }
      })

      const hotelPricesObject = hotelsPrices.map((hp) => {
        if (hp.id === hotels[i].hotel_id) {
          let bookingDeeplink = hp.agent_prices[0].booking_deeplink
          let pricePerRoomNight = hp.agent_prices[0].price_per_room_night
          let priceTotal = hp.agent_prices[0].price_total
          console.log(hp.agent_prices)
          return (
            <div key={`hotelPrices-${hotels[i].hotel_id}`} data-price={priceTotal} className='large-4 text-right'>
              <div className='hotel-detail-top'>{priceTotal}
                <span style={{
                  'display': 'none'
                }}>{pricePerRoomNight}</span>
              </div>
              <div className='hotel-detail-bottom'>
                <a target='_blank' href={bookingDeeplink}>Book</a>
              </div>
            </div>
          ) // returns the cheapest agent price
        } else {
          return null
        }
      })

      // const hotelPrices = (h) => {
      //   // h is curr hotel from .map
      //   let idToBeMatched = h.id
      //   hotelsPrices.filter((value) => value.id === idToBeMatched)
      //   console.log()
      //
      // }

      let hotelNameAndAddress = (h) => {
        // console.log(h)
        return (
          <div className='large-12'>
            <div className='hotel-detail-top'>
              {h.name}
              <span className='fa' data-stars={h.star_rating} />
            </div>
            <div className='hotel-detail-bottom'>{h.address.split(';')[0]}</div>
          </div>
        )
      }

      let hotelDistance = (h) => {
        return (
          <div className='large-8'>
            <div className='hotel-detail-top'>Location</div>
            <div className='hotel-detail-bottom'>LAT: {h.latitude}, LON: {h.longitude}</div>
          </div>
        )
      }
      let panToWithMarkerBinded = this.panToLocation.bind(null, markerObj.position)
      return (
        <div className='hotel-detail' onMouseOver={panToWithMarkerBinded} data-position={JSON.stringify(markerObj.position)} key={`${h.name}_${h.hotel_id}`}>
          {images}
          <div className='hotel-grid hotel-collapse'>
            {hotelNameAndAddress(h)}
            {hotelPricesObject}
            {hotelDistance(h)}
          </div>
        </div>
      )
    }) // childElements

    window._ce = childElements

    return (
      <div className='hotel-sidebar' onMouseOut={this.zoomOutFromLocation}>
        {childElements}
      </div>
    )
  }
}

const {array, string} = React.PropTypes

HotelDetails.propTypes = {
  amenities: array.isRequired,
  hotels: array.isRequired,
  hotelsPrices: array.isRequired,
  imageHostUrl: string.isRequired
}

module.exports = HotelDetails
