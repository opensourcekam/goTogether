/*global userJSON*/
/*eslint no-undef: "error"*/
const React = require('react')

class DisplayPhoto extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <figure>
        <img src={userJSON.photos[0].value} />
      </figure>
    )
  }
}

module.exports = DisplayPhoto
