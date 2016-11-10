const React = require('react')

class Hotel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getHotels () {
    console.log('Get hotels')
  }

  render () {
    const iconSRC = 'hotel_icon.png'
    const style = {
      img: {
        height: '140px'
      }
    }

    return (
      <div className='card'>
        <div className="card-block">Hotel</div>
        <img onClick={this.getHotels} className='card-img-bottom' style={style.img} src={`/images/trip/${iconSRC}`} alt='Card image' />
      </div>
    )
  }
}

module.exports = Hotel
