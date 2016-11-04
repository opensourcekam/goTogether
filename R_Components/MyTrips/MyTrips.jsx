const React = require('react')
const Trip = require('./Parts/Trip')

class MyTrips extends React.Component {
  constructor (props) {
    super(props)
    this.trips = []
  }

  // Get each trip for currently loggedin user
  // pass props to DisplayTrip component
  // Dispaly each trip make clickable
  // Each trip will feed its props into a the PlanNewTrip Dashboard component

  componentWillMount () {
  }

  componentDidMount () {

  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='col-xs-12 col-sm-12 col-md-4'>
          <Trip dest='Tokyo' budget='1500' tripDate='12/29/2016' placeImage='/images/tempLocations/Tokyo.jpeg'/>
          <Trip dest='Madrid' budget='1000' tripDate='12/29/2016' placeImage='/images/tempLocations/Madrid.jpeg'/>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-4'>
          <Trip dest='Amsterdam' budget='2000' tripDate='12/29/2016' placeImage='/images/tempLocations/Amsterdam.jpeg'/>
          <Trip dest='London' budget='1000' tripDate='12/29/2016' placeImage='/images/tempLocations/London.jpeg'/>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-4'>
          <Trip dest='Cassis' budget='1800' tripDate='12/29/2016' placeImage='/images/tempLocations/Cassis.jpeg'/>
          <Trip dest='Los Angeles' budget='1900' tripDate='12/29/2016' placeImage='/images/tempLocations/LosAngeles.jpeg'/>
        </div>
      </div>
    )
  }
}

module.exports = MyTrips
