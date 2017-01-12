const React = require('react')

class Hostel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getHotels () {
    // console.log('Get Hostel')
  }

  render () {
    const iconSRC = 'hostel_icon.png'
    const style = {
      img: {
        height: '140px'
      }
    }

    return (
      <div className='card'>
        <div className='card-block'>Hostel</div>
        <img onClick={this.getHostel} className='card-img-bottom' style={style.img} src={`/images/trip/${iconSRC}`} alt='Card image' />
      </div>
    )
  }
}

module.exports = Hostel
