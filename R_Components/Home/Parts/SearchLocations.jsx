/* global sessionStorage */
const React = require('react')
const ObscurePlaces = require('./ObscurePlaces')
const AutoComplete = require('./AutoComplete')
const elements = require('../../../data/places/atlasObscurePlaces.json')
const $ = require('../../../node_modules/jquery/dist/jquery.min.js')
const _ = require('underscore')

class SearchLocations extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      locations: _.sample(elements, 12),
      text: '',
      searched: false,
      autoFillPlaces: _.sample(_.uniq(_.pluck(elements, 'name')), 10)
    }
    this.data = []
    this.placesArr = []

    // Bind this to event functions
    this.renderPlaces = this.renderPlaces.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  renderPlaces (e) {
    if (e.target.value.trim() !== '') {
      $.getJSON('/searchPlace', {
        loc: e.target.value,
        format: 'jsonp'
      }, (data) => {
        this.placesArr = _.sample(_.uniq(_.pluck(data, 'name')), 10)
        this.data = _.sample(data, 12)
      })
    }

    this.setState({
      locations: this.data,
      location: e.target.value,
      autoFillPlaces: this.placesArr,
      searched: true
    })

    this.renderDataList

    return
  }

  handleSubmit (e) {
    e.preventDefault()
    var data = {
      location: this.state.location
    }

    $.ajax({type: 'POST', url: '/newTrip', data: data}).done((data) => {
      if (typeof data.redirect === 'string') {
        sessionStorage.setItem('location', data.location)
        window.location = data.redirect
      }
    }).fail((jqXhr) => {
      console.log('failed to register')
    })
  }

  render () {
    return (
      <section>
        <AutoComplete autoFillPlaces={this.state.autoFillPlaces} />
        <form action="" onSubmit={this.handleSubmit}>
          <input onChange={this.renderPlaces} value={this.state.location} placeholder="Where is the next place?" type="text" list='places'>
          </input>
        </form>
        <ObscurePlaces elements={this.state.locations} searched={this.state.searched} />
      </section>
    )
  }
}

module.exports = SearchLocations
