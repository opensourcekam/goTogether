const React = require('react')

class Plane extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  getPlanes () {
    console.log('get planes')
  }

  render () {
    const iconSRC = 'plane_icon.png'
    const style = {
      img: {
        height: '140px'
      }
    }

    return (
      <div className='card'>
        <div className='card-block'>Plane</div>
        <img onClick={this.getPlanes} className='card-img-bottom' style={style.img} src={`/images/trip/${iconSRC}`} alt='Card image' />
      </div>
    )
  }
}

module.exports = Plane
