const React = require('react')

class Train extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getTrains () {
    console.log('Get Trains')
  }

  render () {
    const iconSRC = 'train_icon.png'
    const style = {
      img: {
        height: '140px'
      }
    }

    return (
      <div className='card'>
        <div className="card-block">Train</div>
        <img onClick={this.getTrains} className='card-img-bottom' style={style.img} src={`/images/trip/${iconSRC}`} alt='Card image' />
      </div>
    )
  }
}

module.exports = Train
