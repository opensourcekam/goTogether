const React = require('react')
const DisplayPhoto = require('./DisplayPhoto')
const InvitedList = require('./Friends/InvitedList')
// const TripBudget = require('./Budget/TripBudget')
const ToMap = require('./Maps/ToMap')
import moment from 'moment'

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
      },
      tripDetails: {
        'padding': '20px'
      }
    }
    let { trip, activities } = this.state
    // console.log(JSON.stringify(activities, null, 3))
    return (
      <section className='userTripCard' style={styles.userTripCard}>
        {/* <pre><code>{JSON.stringify(this.props, null, 3)}</code></pre> */}
        <div className='friends'>
          <InvitedList />
        </div>
        <DisplayPhoto />
        <div style={styles.tripDetails}>
          <h2>{trip.to.location}</h2>
          <h3>{moment(trip.tripDate).format('MMM Do')} - {moment(trip.tripEndDate).format('MMM Do, YYYY')}</h3>
        </div>
        {/* <TripBudget
          budget={trip.meta.budget}
          saved={trip.meta.saved}
          /> */}
        {trip.to.location && trip.to.geometry.lat
        ? <ToMap flyingTo={trip.to.geometry} activities={activities} initialZoom={12} height={'620px'} width={'auto'} />
        : <p>Loading map...</p>}
      </section>
    )
  }
}

module.exports = UserCard
