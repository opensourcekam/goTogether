const React = require('react')
const Invite = require('./Parts/invite')

class InvitedList extends React.Component {
  render () {
    return (
      <div>
        <Invite />
        <p>DisplayPhoto for each friend invited</p>
      </div>
    )
  }
}

// const { number } = React.PropTypes
//
// InvitedList.propTypes = {
//   saved: number.isRequired,
//   budget: number.isRequired
// }

module.exports = InvitedList
