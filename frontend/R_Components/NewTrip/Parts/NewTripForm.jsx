/* global */
const React = require('react')
const ObscurePlaces = require('./ObscurePlaces')
const AutoComplete = require('./AutoComplete')
// const DateRangePickerWrapper = require('./DatePicker/DateRangePickerWrapper')
const AirBnbDatePicker = require('./DatePicker/DateRangePickerWrapper_new')
const elements = require('../../../../placesData/atlasObscure/atlasObscurePlaces.json')
// https://github.com/ubilabs/react-geosuggest
import Geosuggest from 'react-geosuggest'
import axios from 'axios'
import moment from 'moment'

const _ = require('underscore')
const {hashHistory} = require('react-router')

const style = {
  h2: {
    'padding': '20px'
  }
}

class NewTripForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      locations: _.sample(elements, 12),
      searched: false,
      autoFillPlaces: _.sample(_.uniq(_.pluck(elements, 'name')), 10),
      dates: {
        startDate: moment(),
        endDate: moment().add(+7, 'days')
      },
      // budget: '',
      to: {
        location: '',
        geometry: {},
        skyscanner: {}
      },
    }

    this.data = []
    this.placesArr = []

    // Bind this to event functions
    // this.renderPlaces = this.renderPlaces.bind(this)
    this.onSuggestSelect = this.onSuggestSelect.bind(this)
    this.getObscureCards = this.getObscureCards.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.changeDate = this.changeDate.bind(this)
    this.onDatesSelected = this.onDatesSelected.bind(this)
    // this.setBudget = this.setBudget.bind(this)
  } // constructor

  componentDidMount () {
    // let autocomplete = new google.maps.places.Autocomplete()
    // let place = autocomplete.getPlace()
    // console.log(place)
  }

  onFocus (e) {
    console.log(e)
    document.querySelectorAll('.geosuggest__suggests-wrapper')[0].style.display = 'block'
  }

  onBlur (e) {
    console.log(e)
  }

  onSuggestSelect (e) {
    console.log(e.label)
    let place = e.label
    // split place so you just get the first word from the e.label result ex. Austin, Texas, United States -> Austin will be processed
    let locationSuggestPromise = axios.get(`/api/v1/flights/locationAutosuggest/${place.split(',')[0]}`)

    locationSuggestPromise.then((locationAutosuggest) => {
      // console.log(locationAutosuggest.data)
      this.setState({
        to: {
          location: e.label,
          geometry: e.location,
          skyscanner: locationAutosuggest.data[0] || undefined
        }
      })
      console.log(`onSuggestSelect state: ${JSON.stringify(this.state, null, 3)}`)
    })

    locationSuggestPromise.catch((error) => {
      console.log(error)
    })

    if(this.state.to) {
      document.querySelectorAll('.geosuggest__suggests-wrapper')[0].style.display = 'none'
    }

  } // onSuggestSelect

  onSuggestNoResults (e) {
    console.log(e)
  }

  getObscureCards (e) {
    console.log(e)
    if (e.trim() !== '') {
      axios.get('/searchPlace', {
        params: {
          location: e,
          format: 'jsonp'
        }
      }).then((json) => {
        console.log(json.data)

        if (json.statusText === 'OK') {
          this.placesArr = _.sample(_.uniq(_.pluck(json.data, 'name')), 10)
          this.data = _.sample(json.data, 12)
        }
      }).catch((error) => {
        console.log(error)
      })
    }

    this.setState({locations: this.data, autoFillPlaces: this.placesArr, searched: true})

    return this.renderDataList
  }

  // setBudget (e) {
  //   return this.setState({budget: e.target.value})
  // }

  changeDate (e) {
    return this.setState({dates: e.target.value})
  }

  onDatesSelected (e) {
    console.log(e)
    this.setState({dates: e})
  }

  handleSubmit (e) {
    e.preventDefault()

    var data = {
      to: this.state.to,
      tripDate: this.state.dates.startDate._d,
      tripEndDate: this.state.dates.endDate._d
    }

    if (data.to !== '' && data.tripDate && data.tripEndDate) {
      axios.post('/newTrip', data).then((response) => {
        // sessionStorage.setItem('data', JSON.stringify(this.state.to, null, ''))
        console.log(response)
        if (response.statusText === 'OK' && response.data) {
          hashHistory.push(`tripDash/${response.data._id}`)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  render () {
    return (
      <section>

        <AutoComplete
          autoFillPlaces={this.state.autoFillPlaces} />

        <form onSubmit={this.handleSubmit} className='form-inline'>

          {/* <div className='form-group'>
            <input value={`${this.state.budget}`} onChange={this.setBudget} placeholder={`What are we saving? ${this.props.currencySymbol}500`} type='text' />
          </div> */}

          <div className='form-group' style={{'float': 'left'}}>
            {/* <input onChange={this.renderPlaces} value={this.state.location} placeholder='Where are we going?' type='text' list='places' /> */}
            <h2 style={style.h2}>Where are we going?</h2>
            <Geosuggest
              types={['(cities)']}
              onChange={this.getObscureCards}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onSuggestSelect={this.onSuggestSelect}
              onSuggestNoResults={this.onSuggestNoResults}
              value={this.state.location}
              placeholder='Marsille, France' />
          </div>

          <div className='form-group'>
            <h2 style={style.h2}>When are we going?</h2>
            {/* <input value={`${this.state.date}`} onChange={this.changeDate} placeholder={`When are we going? ${new Date().toLocaleDateString()}`} type='text' /> */}
            {/*  REACT-DATES AIRBNB DATE PICKER */}
            <AirBnbDatePicker />
            {/* react-date-range picker trying to replace!
            <DateRangePickerWrapper
              onChange={this.onDatesSelected}
              startDate={this.state.dates.startDate}
              endDate={this.state.dates.endDate} />  */}
          </div>

          <button id='letsGo' type='submit'>Lets go!</button>
        </form>

        <ObscurePlaces
          elements={this.state.locations}
          searched={this.state.searched} />

      </section>
    )
  }
}

const {string} = React.PropTypes

NewTripForm.propTypes = {
  currencySymbol: string.isRequired
}

module.exports = NewTripForm
