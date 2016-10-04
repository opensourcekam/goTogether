const React = require('react')
const About = require('./About')
const GetThere = require('./GetThere')
const BookAPlace = require('./BookAPlace')
const ThingsToDo = require('./ThingsToDo')

class NewTrip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.getLocation
  }

  getLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }

  showPosition (position) {
    console.log(position.coords.latitude, position.coords.longitude)
  }

  render () {
    // console.log(userJSON)
    return (
      <div>
        <aside>
          <About />
        </aside>
        <div>
          <GetThere className="trip-card" />
          <BookAPlace className="trip-card" />
          <ThingsToDo className="trip-card" />
        </div>
      </div>
    )
  }
}

module.exports = NewTrip
