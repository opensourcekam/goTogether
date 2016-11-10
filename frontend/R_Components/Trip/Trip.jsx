const React = require('react')
const UserCard = require('./Parts/UserCard')
const GetThere = require('./Parts/GetThere')
const BookAPlace = require('./Parts/BookAPlace')
const ThingsToDo = require('./Parts/ThingsToDo')
// const Datepicker = require('./Parts/Dates/Datepicker')

class Trip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lat: 0,
      lon: 0
    }
    // this.getLocation = this.getLocation.bind(this)
  }

  componentWillMount () {
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC-GOgmWRmDOS6Ir9pNoBpdE_W-uAiHlTM'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }

  componentDidMount () {
    // this.getLocation
  }

  // getLocation () {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.setState({lat: position.coords.latitude, lon: position.coords.longitude})
  //     })
  //   } else {
  //     console.log('Geolocation is not supported by this browser.')
  //   }
  // }

  render () {
    // console.log(userJSON)
    // <div className='row' onLoad={this.getLocation}>
    return (
      <div className='row'>
        <aside className='col-xs-12 col-sm-12 col-md-6'>
          <UserCard />
        </aside>
        <section className='tripCards col-xs-12 col-sm-12 col-md-6'>
          {/* <Datepicker /> */}
          <GetThere />
          <BookAPlace />
          <ThingsToDo />
        </section>
      </div>
    )
  }
}

module.exports = Trip
