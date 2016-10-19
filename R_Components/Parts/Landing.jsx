const React = require('react')
const AboutBar = require('./LandingParts/AboutBar')
const Cta = require('./LandingParts/Cta')

class Landing extends React.Component {
  render () {
    document.body.className = 'cover'
    return (
      <div>
        <Cta />
        <AboutBar />
      </div>
      )
  }
}

module.exports = Landing
