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
    this.setState({itineraries: flights.itineraries})
  }

  getFlights () {
    let formattedAdults = this.props.invitees.length + 1

    let data = {
      'originplace': this.props.from.skyscanner.CityId,
      'destinationplace': this.props.to.skyscanner.CityId,
      'outbounddate': this.props.tripDate,
      'inbounddate': this.props.tripEndDate,
      'adults': formattedAdults,
      '_id': this.props._id
    }

    axios.post('/api/v1/flights/livePrices/poll', data)
          .then((response) => {
            if (response.data) {
              this.setFlights(response.data)
            }
          })
          .catch((err) => {
            throw new Error('Could not get flights', err)
          })
  }

  componentDidMount () {
    if (this.props.itineraries.length) {
      this.setState({itineraries: this.props.itineraries})
    } else {
      this.getFlights()
    }
  }

  render () {
    let childElements = this.state.itineraries.map((flight, i) => {
      return (
        <tr key={i}>
          <td style={style.td}>€ {flight.PricingOptions[0].Price.toFixed(2)}</td>
          {/* <td>{flight.PricingOptions[0].Agents[0]}</td> */}
          <td style={style.td}>
            <a target='_blank' href={flight.PricingOptions[0].DeeplinkUrl}>Book now</a>
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
