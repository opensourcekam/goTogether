const React = require('react')
const Flights = require('../GetFlights/Flights')
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
        location: null,
        skyscanner: {}
      },
      to: {
        location: null,
        skyscanner: {}
      },
      tripDate: '',
      invitees: [],
      _id: '',
      alreadyPut: false
    }
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    console.log('CDM', this.props)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', nextProps)
    // newtrip doesnt have an ID since its not exactly being pulled from DB and passed as a prop need to pass either the param or something
    if (nextProps.data.from) {
      this.setState({
        _id: nextProps.data._id,
        from: nextProps.data.from,
        to: nextProps.data.to,
        tripDate: moment(nextProps.data.tripDate).format('YYYY-MM-DD'),
        invitees: nextProps.data.meta.invitees,
        alreadyPut: true
      })
      return
    } else {
      this.setState({
        _id: nextProps.data._id,
        from: nextProps.data.from,
        to: nextProps.data.to,
        tripDate: moment(nextProps.data.tripDate).format('YYYY-MM-DD'),
        invitees: nextProps.data.meta.invitees
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
      }).catch((error) => {
        console.log(error)
        return
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

      this.setState({from: thatOBJ})
      console.log('onChange', this.state)
      return
    }).catch((error) => {
      console.log(error)
    })
  }

  render () {
    return (
      <div>
        {(this.state.from && this.state.alreadyPut)
          ? <div>
            <h2>{`Traveling from ${this.state.from.skyscanner.PlaceName}, ${this.state.from.skyscanner.CountryName}`}</h2>
            <Flights
              from={this.state.from}
              to={this.state.to}
              date={this.state.tripDate}
              invitees={this.state.invitees} />
          </div>
          : <div>
            <h2>Where are you arriving from</h2>
            <hr />
            <div className='card'>
              <div className='card-block'>
                <form style={style.form} onSubmit={this.handleSubmit}>
                  <input placeholder='' onChange={this.onChange} style={style.input} />
                </form>
              </div>
            </div>
          </div>}
      </div>
    )
  }
}

module.exports = Plane
