const React = require('react')
const DisplayPhoto = require('./DisplayPhoto')
const TripBudget = require('./Budget/TripBudget')
const ToMap = require('./Maps/ToMap')

class UserCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      trip: {
        to: {
          location: '',
          geometry: {}
        },
        meta: {
          budget: 0,
          percantagePlanned: 0,
          saved: 0
        }
      }
    }
  }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    // console.log('CWRP', nextProps)
    this.setState({trip: nextProps.data})
  }

  render () {
    let styles = {
      userTripCard: {
        'marginBottom': '20px'
      }
    }
    console.log(JSON.stringify(this.props, null, 3))
    let {trip} = this.state
    // console.log(trip)
    return (
      <section className='userTripCard' style={styles.userTripCard}>
        {/* <pre><code>{JSON.stringify(this.props, null, 3)}</code></pre> */}
        <DisplayPhoto />
        <div>
          <p>{userJSON.displayName || ''} is planning a trip to {trip.to.location}</p>
        </div>
        <TripBudget
          budget={trip.meta.budget}
          saved={trip.meta.saved}
        />
        {trip.to.location && trip.to.geometry.lat
          ? <ToMap flyingTo={trip.to.geometry} initialZoom={12} />
          : <p>Loading map...</p>}
      </section>
    )
  }
}

module.exports = UserCard
