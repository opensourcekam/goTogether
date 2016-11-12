/* global sessionStorage */
const React = require('react')
const ObscurePlaces = require('./ObscurePlaces')
const AutoComplete = require('./AutoComplete')
const elements = require('../../../../placesData/atlasObscure/atlasObscurePlaces.json')
// https://github.com/ubilabs/react-geosuggest
import Geosuggest from 'react-geosuggest'

import axios from 'axios'
const _ = require('underscore')
const {hashHistory} = require('react-router')

class NewTripForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      locations: _.sample(elements, 12),
      searched: false,
      autoFillPlaces: _.sample(_.uniq(_.pluck(elements, 'name')), 10),
      date: '',
      budget: '',
      to: {
        location: '',
        geometry: {}
      }
    }

    this.data = []
    this.placesArr = []

    // Bind this to event functions
    // this.renderPlaces = this.renderPlaces.bind(this)
    this.onSuggestSelect = this.onSuggestSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.changeDate = this.changeDate.bind(this)
    this.setBudget = this.setBudget.bind(this)
  } // constructor

  componentDidMount () {
    // let autocomplete = new google.maps.places.Autocomplete()
    // let place = autocomplete.getPlace()
    // console.log(place)
  }

  onFocus (e) {
    console.log(e)
  }

  onBlur (e) {
    console.log(e)
  }

  onSuggestSelect (e) {
    console.log(e)
    this.setState({
      to: {
        location: e.label,
        geometry: e.location
      }
    })
    console.log(this.state)
  }

  onSuggestNoResults (e) {
    console.log(e)
  }

  onChange (e) {
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

  setBudget (e) {
    return this.setState({budget: e.target.value})
  }

  changeDate (e) {
    return this.setState({date: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()

    var data = {
      to: this.state.to,
      meta: {
        budget: this.state.budget
      },
      tripDate: this.state.date
    }

    if (data.to !== '' && data.tripDate !== '') {
      axios.post('/newTrip', data).then((response) => {
        // sessionStorage.setItem('data', JSON.stringify(this.state.to, null, ''))
        console.log(response)
        if(response.statusText === 'OK' && response.data){
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

        <AutoComplete autoFillPlaces={this.state.autoFillPlaces} />

        <form onSubmit={this.handleSubmit} className='form-inline'>

          <div className='form-group'>
            <input value={`${this.state.date}`} onChange={this.changeDate} placeholder={`When are we going? ${new Date().toLocaleDateString()}`} type='text' />
          </div>

          <div className='form-group'>
            <input value={`${this.state.budget}`} onChange={this.setBudget} placeholder={`What are we saving? ${this.props.currencySymbol}500`} type='text' />
          </div>

          <div className='form-group'>
            {/* <input onChange={this.renderPlaces} value={this.state.location} placeholder='Where are we going?' type='text' list='places' /> */}
            <Geosuggest types={['(cities)']} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} onSuggestSelect={this.onSuggestSelect} onSuggestNoResults={this.onSuggestNoResults} value={this.state.location} placeholder='Where are we going?' />
          </div>

          <button id='letsGo' type='submit'>Lets go!</button>
        </form>

        <ObscurePlaces elements={this.state.locations} searched={this.state.searched} />

      </section>
    )
  }
}

const {string} = React.PropTypes

NewTripForm.propTypes = {
  currencySymbol: string.isRequired
}

module.exports = NewTripForm
