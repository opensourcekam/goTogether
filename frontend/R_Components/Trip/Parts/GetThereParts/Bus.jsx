const React = require('react')

class Bus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getBuses () {
    console.log('Get buses')
  }

  render () {
    const iconSRC = 'bus_icon.png'

    const style = {
      img: {
        height: '140px'
      }
    }

    return (
      <div className='card'>
        <div className='card-block'>Bus</div>
        <img onClick={this.getBuses} className='card-img-bottom' style={style.img} src={`/images/trip/${iconSRC}`} alt='Card image' />
      </div>
    )
  }
}

module.exports = Bus
