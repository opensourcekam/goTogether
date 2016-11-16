/* global userJSON */
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
      },
      activities: []
    }
  }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    // console.log('UserCard CWRP', nextProps)
    this.setState({trip: nextProps.data, activities: nextProps.data.meta.activities})
  }

  render () {
    let styles = {
      userTripCard: {
        'marginBottom': '20px'
      }
    }
    let { trip, activities } = this.state
    // console.log(JSON.stringify(activities, null, 3))
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
          ? <ToMap flyingTo={trip.to.geometry} activities={activities} initialZoom={12} />
          : <p>Loading map...</p>}
      </section>
    )
  }
}

module.exports = UserCard
