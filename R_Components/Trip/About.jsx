/*global userJSON sessionStorage*/
/*eslint no-undef: "error"*/

const React = require('react')
const DisplayPhoto = require('./Parts/DisplayPhoto')

class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <DisplayPhoto />
        <p>{userJSON.displayName} is planning a trip to {sessionStorage.location}</p>
      </div>
    )
  }
}

module.exports = About
