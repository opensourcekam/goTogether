const React = require('react')
const Flights = require('./GetFlights/Flights')
// import Geosuggest from 'react-geosuggest'
import axios from 'axios'
import moment from 'moment'

const style = {
  input: {
    'width': '100%'
  },
  form: {
    'margin': '0'
  }
}

class Plane extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      from: {
        location: '',
        skyscanner: {}
      },
      to: {
        location: null,
        skyscanner: {}
      },
      tripDate: '',
      tripEndDate: '',
      invitees: [],
      _id: '',
      alreadyPut: false
    }
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    // console.log('CDM', this.props)
    axios.get('http://ip-api.com/json').then((values) => {
      const { city, country } = values.data
      this.setStete({location: `${city}, ${country}`})
    }).catch((err) => {
      throw new Error(`Could not get location json ${err}`)
    })
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps', nextProps)
    // newtrip doesnt have an ID since its not exactly being pulled from DB and passed as a prop need to pass either the param or something
    if (nextProps.data.from) {
      this.setState({
        _id: nextProps.data._id,
        from: nextProps.data.from,
        to: nextProps.data.to,
        tripDate: moment(nextProps.data.tripDate).format('YYYY-MM-DD'),
        tripEndDate: moment(nextProps.data.tripEndDate).format('YYYY-MM-DD'),
        invitees: nextProps.data.meta.invitees,
        itineraries: nextProps.data.flights[0] || [],
        alreadyPut: true
      })
      return
    } else {
      this.setState({
        _id: nextProps.data._id,
        from: nextProps.data.from,
        to: nextProps.data.to,
        tripDate: moment(nextProps.data.tripDate).format('YYYY-MM-DD'),
        tripEndDate: moment(nextProps.data.tripEndDate).format('YYYY-MM-DD'),
        invitees: nextProps.data.meta.invitees,
        itineraries: nextProps.data.flights[0] || []
      })
      return
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    var data = {
      from: this.state.from,
      update: 'FROM'
    }

    if (data.from !== '') {
      axios.put(`/trips/${this.state._id}`, data).then((response) => {
        return this.setState({from: this.state.from, alreadyPut: true})
      }).catch((err) => {
        console.error(err)
        throw new Error(`Could not put from location ${err}`)
      })
    }
  }

  onChange (e) {
    let location = e.target.value
    axios.get(`/api/v1/flights/locationAutosuggest/${location}`).then((locationAutosuggest) => {
      let thatOBJ = {
        location: '',
        skyscanner: {}
      }

      thatOBJ.location = location
      thatOBJ.skyscanner = locationAutosuggest.data[0]
      return this.setState({from: thatOBJ})
    }).catch((error) => {
      console.error(error)
      throw new Error(`Could not locationAutosuggest for ${location}`)
    })
  }

  render () {
    const { userLocation } = this.props
    let locationString = (userLocation.city !== '' && userLocation.country !== '') ? `${userLocation.city}, ${userLocation.country}` : ''
    return (
      <div>
        {(this.state.from && this.state.alreadyPut)
          ? <div>
            <h2>{`Round trips from ${this.state.from.skyscanner.PlaceName}, ${this.state.from.skyscanner.CountryName} to ${this.state.to.skyscanner.PlaceName}, ${this.state.to.skyscanner.CountryName}`}</h2>
            {/* <label htmlFor='booked'>
              Booked
            </label>
            <input id='booked' type='checkbox'></input> */}
            <Flights
              from={this.state.from}
              to={this.state.to}
              tripDate={this.state.tripDate}
              tripEndDate={this.state.tripEndDate}
              invitees={this.state.invitees}
              _id={this.state._id}
              itineraries={this.state.itineraries} />
          </div>
          : <div>
            <h2>Where are you arriving from</h2>
            <hr />
            <div className='card'>
              <div className='card-block'>
                <form style={style.form} onSubmit={this.handleSubmit}>
                  <input placeholder={locationString} onChange={this.onChange} style={style.input} />
                </form>
              </div>
            </div>
          </div>}
      </div>
    )
  }
}

const { object } = React.PropTypes

Plane.propTypes = {
  userLocation: object.isRequired
}

module.exports = Plane
