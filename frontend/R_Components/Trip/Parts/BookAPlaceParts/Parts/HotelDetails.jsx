const React = require('react')

class HotelDetails extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {}

  render () {
    const { hotels, amenities, hotels_prices, image_host_url } = this.props

    // const hotelPricesSortedLowToHigh = hotels_prices.sort((a, b) => {
    //   return parseFloat(a.agent_prices[0].price_total) - parseFloat(b.agent_prices[0].price_total)
    // })

    // console.log('L-t-H', hotelPricesSortedLowToHigh)

    const childElements = hotels.map((h, i) => { // on each map of this each map inside runs n times
      let images = Object.keys(h.images).splice(0, 2).map((imgBase, j) => {
        if (j <= 1) {
          return (
            <img src={`http://${image_host_url}${imgBase}mc.jpg`} key={imgBase} />
          )
        } else {
          return
        }
      })

      const hotelPrices = hotels_prices.map((hp) => {
        if (hp.id === hotels[i].hotel_id) {
          const { booking_deeplink, price_per_room_night, price_total } = hp.agent_prices[0]
          return (
            <div key={`hotelPrices-${hotels[i].hotel_id}`} data-price={price_total} className='large-8 text-right'>
              <div className='hotel-detail-top'>{price_total} €</div>
              <div className='hotel-detail-bottom'><a target='_blank' href={booking_deeplink}>Book</a></div>
            </div>
          ) // returns the cheapest agent price
        } else {
          return null
        }
      })

      // const hotelPrices = (h) => {
      //   // h is curr hotel from .map
      //   let idToBeMatched = h.id
      //   hotels_prices.filter((value) => value.id === idToBeMatched)
      //   console.log()
      //
      // }

      let hotelNameAndAddress = (h) => {
        console.log(h)
        return (
          <div className='large-12'>
            <div className='hotel-detail-top'>
              {h.name} <span className='fa' data-stars={h.star_rating} />
            </div>
            <div className='hotel-detail-bottom'>{h.address.split(';')[0]}</div>
          </div>
        )
      }

      let hotelDistance = () => {
        return (
          <div className='large-4'>
            <div className='hotel-detail-top'>500m</div>
            <div className='hotel-detail-bottom'>Distance from Point of Interest</div>
          </div>
        )
      }

      return (
        <div className='hotel-detail' key={`${h.name}_${h.hotel_id}`}>
          {images}
          <div className='hotel-grid hotel-collapse'>
            {hotelNameAndAddress(h)}
            {hotelPrices}
            {hotelDistance}
          </div>
        </div>
      )
    }) // childElements

    window._ce = childElements

    return (
      <div className='hotel-sidebar'>
        {childElements}
      </div>
    )
  }
}

const { array, string } = React.PropTypes

HotelDetails.propTypes = {
  amenities: array.isRequired,
  hotels: array.isRequired,
  hotels_prices: array.isRequired,
  image_host_url: string.isRequired
}

module.exports = HotelDetails
