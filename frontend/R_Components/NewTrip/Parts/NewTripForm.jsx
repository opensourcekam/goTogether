/* global sessionStorage */
const React = require('react')
const ObscurePlaces = require('./ObscurePlaces')
const AutoComplete = require('./AutoComplete')
const elements = require('../../../../placesData/atlasObscure/atlasObscurePlaces.json')

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
      location: ''
    }

    this.data = []
    this.placesArr = []

    // Bind this to event functions
    this.renderPlaces = this.renderPlaces.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.changeDate = this.changeDate.bind(this)
    this.setBudget = this.setBudget.bind(this)
  } // constructor

  componentDidMount () {
    // let autocomplete = new google.maps.places.Autocomplete()
    // let place = autocomplete.getPlace()
    // console.log(place)
  }

  renderPlaces (e) {
    if (e.target.value.trim() !== '') {
      axios.get('/searchPlace', {
        params: {
          location: e.target.value,
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

    this.setState({locations: this.data, location: e.target.value, autoFillPlaces: this.placesArr, searched: true})

    return this.renderDataList
  }

  setBudget (e) {
    return this.setState({budget: e.target.value})
  }

  changeDate (e) {
    return this.setState({date: e.target.value})
  }

/*
var data = {
  location: this.state.location,
  _creator: '581a242b0916180d86032f30',
  to: this.state.location,
  tripDate: 'Dec 29, 2017',
  budget: 5000
}

$.ajax({type: 'POST', url: '/trip/newTrip', data: data}).done((data) => {
  sessionStorage.setItem('location', data.location)
  // window.location = data.redirect
  hashHistory.push('newTrip')
  // e.preventDefault()
}).fail((jqXhr) => {
  console.log('Request failed')
})
}
*/

  handleSubmit (e) {
    var data = {
      location: this.state.location,
      budget: this.state.budget,
      tripDate: this.state.date
    }

    if (data.location !== '' && data.tripDate !== '') {
      axios.post('/tripDash', data).then((response) => {
        console.log('post to tripDash')
        console.log(response)
        sessionStorage.setItem('location', data.location)
      // window.location = data.redirect
        hashHistory.push('tripDash')
      // e.preventDefault()
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
            <input value={`${this.state.budget}`} onChange={this.setBudget} placeholder={`What are we spending? ${this.props.currencySymbol}500`} type='text' />
          </div>

          <div className='form-group'>
            <input onChange={this.renderPlaces} value={this.state.location} placeholder='Where are we going?' type='text' list='places' />
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
