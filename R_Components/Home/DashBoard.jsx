/* global localStorage, userJSON */
const React = require('react')
const SearchLocations = require('./Parts/SearchLocations')
const ObscurePlaces = require('./Parts/ObscurePlaces')
const elements = require('../../data/places/atlasobscuraPlaces.json')

if (userJSON.id) {
  localStorage.setItem('token', userJSON.id)
}

class DashBoard extends React.Component {
  render () {
    return (
      <section>
        <article>
          <SearchLocations />
          <ObscurePlaces elements={elements} />
        </article>
      </section>
    )
  }
}

module.exports = DashBoard
