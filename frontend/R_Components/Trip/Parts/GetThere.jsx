const React = require('react')
const Plane = require('./GetThereParts/Plane')
// const Train = require('./GetThereParts/Train')
// const Bus = require('./GetThereParts/Bus')

class GetThere extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <article className='tripCard'>
        {/* <h2>How are you arriving?</h2> */}
        <div className='card-deck' style={{display: 'block'}}>
          <Plane data={this.props.data} />
          {/* <Train />
          <Bus /> */}
        </div>
      </article>
    )
  }
}

const { object } = React.PropTypes

GetThere.propTypes = {
  data: object.isRequired
}

module.exports = GetThere
