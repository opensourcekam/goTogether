const React = require('react')
const Plane = require('./Parts/GetThereParts/Plane')
const Train = require('./Parts/GetThereParts/Train')
const Bus = require('./Parts/GetThereParts/Bus')

class GetThere extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <article className='tripCard'>
        <h2>How are you arriving?</h2>
        <div className='card-deck'>
          <Plane />
          <Train />
          <Bus />
        </div>
      </article>
    )
  }
}

module.exports = GetThere
