const React = require('react')
const AboutBar = require('./LandingParts/AboutBar')
const Cta = require('./LandingParts/Cta')

class Landing extends React.Component {
  render () {
    // Change backgroundImage
    document.body.style.backgroundImage = 'url("../images/br2.jpg")'
    document.body.style.backgroundSize = '100% auto'
    document.body.style.backgroundRepeat = 'repeat'
    document.body.style.height = '100%'

    return (
      <div>
        <Cta />
        <AboutBar />
      </div>
    )
  }
}

module.exports = Landing
