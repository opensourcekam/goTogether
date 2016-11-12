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
    // let script = document.createElement('script')
    // script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC-GOgmWRmDOS6Ir9pNoBpdE_W-uAiHlTM&libraries=places'
    // script.async = true
    // script.defer = true
    // document.head.appendChild(script)
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
