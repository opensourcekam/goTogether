const React = require('react')
const PlaneSpinLoader = require('../../../../Parts/Loaders/PlaneSpinLoader')
import axios from 'axios'

const style = {
  table: {
    'width': '100%',
    'marginTop': '20px'
  }
}

class Flights extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      itineraries: []
    }

    this.getFlights = this.getFlights.bind(this)
    this.setFlights = this.setFlights.bind(this)
  }

  setFlights (flights) {
    console.log('Set', flights)
    this.setState({itineraries: flights.itineraries})
  }

  getFlights () {
    console.log(`GETFLIGHTS to ${JSON.stringify(this.props.to, null, 3)}`)

    let formattedAdults = this.props.invitees.length + 1

    let data = {
      'originplace': this.props.from.skyscanner.CityId,
      'destinationplace': this.props.to.skyscanner.CityId,
      'outbounddate': this.props.tripDate,
      'inbounddate': this.props.tripEndDate,
      'adults': formattedAdults,
      '_id': this.props._id
    }

    console.log('GET PLANES', data)

    axios.post('/api/v1/flights/livePrices/poll', data)
          .then((response) => {
            console.log(JSON.stringify(response.data, null, 3))
            console.log(response)
            if (response.data) {
              this.setFlights(response.data)
            }
          })
          .catch((err) => {
            throw new Error('Could not get flights', err)
          })
  }

  componentDidMount () {
    console.log('FLIGHTS PROPS', this.props)
    if (this.props.itineraries.length) {
      this.setState({itineraries: this.props.itineraries})
    }
    this.getFlights()
  }

  /*

    {
       "Agents": [
          2043147
       ],
       "QuoteAgeInMinutes": 8,
       "Price": 1946.4,
       "DeeplinkUrl": "http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=jzj5DawL5zJyT%2bnfeP9GJWfImnVvZd7vh0AJSObmdOp8YP07VbGmhzc%2bVTc80nUp&url=http%3a%2f%2fwww.apideeplink.com%2ftransport_deeplink%2f4.0%2fUK%2fen-gb%2fGBP%2fbfuk%2f1%2f13870.17216.2016-12-13%2fair%2ftrava%2fflights%3fitinerary%3dflight%7c-32317%7c3184%7c13870%7c2016-12-13T10%3a20%7c12126%7c2016-12-13T15%3a30%3bflight%7c-32317%7c917%7c12126%7c2016-12-13T17%3a00%7c17216%7c2016-12-13T18%3a00%26carriers%3d-32317%26passengers%3d1%26channel%3ddataapi%26cabin_class%3deconomy%26facilitated%3dfalse%26ticket_price%3d1946.40%26is_npt%3dfalse%26is_multipart%3dfalse%26client_id%3dskyscanner_b2b%26request_id%3d064ddbe7-98ac-4855-8864-9c1df449beca%26deeplink_ids%3deu-central-1.prod_ce8f22bb480f3c88bf10422734d9ceb5%26commercial_filters%3dfalse%26q_datetime_utc%3d2016-11-16T12%3a15%3a17"
    }
  ],
  "BookingDetailsLink": {
    "Uri": "/apiservices/pricing/v1.0/f8111a5becb943a8a1fa327c701961b9_ecilpojl_0D2E4F1AFF9D20EB417EB4286675BE78/booking",
    "Body": "OutboundLegId=13870-1612131020--32317-1-17216-1612131800&InboundLegId=",
    "Method": "PUT"
  }

  */

  render () {
    // console.log(this.state.itineraries.map((flight) => flight.PricingOptions[0].Price))
    let childElements = this.state.itineraries.map((flight, i) => {
      return (
        <tr key={i}>
          <td style={style.td}>€ {flight.PricingOptions[0].Price.toFixed(2)}</td>
          {/* <td>{flight.PricingOptions[0].Agents[0]}</td> */}
          <td style={style.td}>
            <a href={flight.PricingOptions[0].DeeplinkUrl}>Book now</a>
          </td>
        </tr>
      )
    })
    return (
      (this.state.itineraries.length)
      ? <div className='table-container'>
        <table className='table' style={style.table}>
          <tbody>
            <tr>
              <th>Price</th>
              {/* <th>Agent</th> */}
              <th>Link</th>
            </tr>
            {childElements}
          </tbody>
        </table>
      </div>
        : <PlaneSpinLoader />
    )
  }
}

const { string, object, array } = React.PropTypes

Flights.propTypes = {
  from: object.isRequired,
  to: object.isRequired,
  invitees: array.isRequired,
  _id: string.isRequired,
  itineraries: array.isRequired,
  tripDate: string.isRequired,
  tripEndDate: string.isRequired
}

module.exports = Flights
