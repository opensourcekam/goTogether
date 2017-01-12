import React from 'react'
import ObscurePlaces from './ObscurePlaces'
import AutoComplete from './AutoComplete'
import DateRangePickerWrapper from './DatePicker/DateRangePickerWrapper'
import elements from '../../../../placesData/atlasObscure/atlasObscurePlaces.json'
// import ToMap from '../../Trip/Parts/Maps/ToMap'

// https://github.com/ubilabs/react-geosuggest
import Geosuggest from 'react-geosuggest'
import axios from 'axios'
import moment from 'moment'

import _ from 'underscore'
import { hashHistory } from 'react-router'

const style = {
  h2: {
    'paddingBottom': '15px'
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
        geometry: {
          'lat': 51.8968917,
          'lng': -8.486315699999977
        },
        skyscanner: {}
      }
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
    // delete any value in input
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

    if (this.state.to) {
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
    this.setState({dates: e})
  }

  handleSubmit (e) {
    e.preventDefault()

    var data = {
      to: this.state.to,
      tripDate: this.state.dates.startDate._d,
      tripEndDate: this.state.dates.endDate._d
    }

    console.log(data)

    if (data.to !== '' && data.tripDate && data.tripEndDate) {
      axios.post('/newTrip', data).then((response) => {
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

          <div className='form-group' style={{'float': 'left'}}>

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
            <DateRangePickerWrapper
              onChange={this.onDatesSelected}
              preselectedDates={this.state.dates} />
          </div>

          <div className='form-group'>
            <h2 style={style.h2}>When you're ready!</h2>
            <button id='letsGo' type='submit'>Lets go!</button>
          </div>
        </form>

        <ObscurePlaces
          elements={this.state.locations}
          searched={this.state.searched} />

        {/* <ToMap
          initialZoom={12}
          flyingTo={this.state.to.geometry}
          width={'100%'}
          height={'71vh'} /> */}

      </section>
    )
  }
}

const {string} = React.PropTypes

NewTripForm.propTypes = {
  currencySymbol: string.isRequired
}

module.exports = NewTripForm
