const React = require('react')

class GetThere extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='sideBox'>
        <p>How are you arriving?</p>
      </div>
    )
  }
}

module.exports = GetThere
