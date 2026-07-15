/* global localStorage, userJSON */
const React = require('react')
const NewTripForm = require('./Parts/NewTripForm')
// const RangeAdvanced = require('./Parts/Calendar')
// const ObscurePlaces = require('./Parts/ObscurePlaces')

if (userJSON.id) {
  localStorage.setItem('token', userJSON.id)
}

class DashBoard extends React.Component {

  componentWillMount () {
  }

  render () {
    return (
      <section>
        <article>
          <NewTripForm
            currencySymbol='$' />
          {/* <RangeAdvanced /> */}
        </article>
      </section>
    )
  }
}

module.exports = DashBoard
