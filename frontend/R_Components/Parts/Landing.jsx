const React = require('react')
const AboutBar = require('./LandingParts/AboutBar')
const Cta = require('./LandingParts/Cta')

class Landing extends React.Component {
  componentDidMount () {
    document.body.className = 'cover'
  }

  componentWillUnmount () {
    document.body.className = ''
  }

  render () {
    return (
      <div>
        <Cta />
        <AboutBar />
      </div>
    )
  }
}

module.exports = Landing
