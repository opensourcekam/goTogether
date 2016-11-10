const React = require('react')
const Plane = require('./GetThereParts/Plane')
const Train = require('./GetThereParts/Train')
const Bus = require('./GetThereParts/Bus')

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
