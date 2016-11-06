const React = require('react')
const Trip = require('./Parts/Trip')
const CircleProgressBarWithImageCenter = require('./Parts/CircleProgressBarWithImageCenter')
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
          <CircleProgressBarWithImageCenter
            img='/images/tempLocations/LosAngeles.jpeg'
            mountId='LosAngeles'
            color='#aae444'
            strokeWidth='4'
            dest='Los Angeles'
            budget='1200'
            tripDate='1/18/2017'/>
          <CircleProgressBarWithImageCenter
            img='/images/tempLocations/Amsterdam.jpeg'
            mountId='Amsterdam'
            color='#aae444'
            strokeWidth='4'
            dest='Amsterdam'
            budget='800'
            tripDate='1/1/2119'/>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-4'>
          <CircleProgressBarWithImageCenter
            img='/images/tempLocations/Cassis.jpeg'
            mountId='Cassis'
            color='#aae444'
            strokeWidth='4'
            dest='Cassis'
            budget='1100'
            tripDate='10/9/2018'/>
          <CircleProgressBarWithImageCenter
            img='/images/tempLocations/London.jpeg'
            mountId='London'
            color='#aae444'
            strokeWidth='4'
            dest='London'
            budget='500'
            tripDate='8/9/2098'/>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-4'>
          <CircleProgressBarWithImageCenter
            img='/images/tempLocations/Tokyo.jpeg'
            mountId='Tokyo'
            color='#aae444'
            strokeWidth='4'
            dest='Tokyo'
            budget='1100'
            tripDate='12/29/2018'/>
          <CircleProgressBarWithImageCenter
            img='/images/tempLocations/Madrid.jpeg'
            mountId='Madrid'
            color='#aae444'
            strokeWidth='4'
            dest='Madrid'
            budget='3000'
            tripDate='1/29/3018'/>
        </div>
      </div>
    )
  }
}

module.exports = MyTrips
