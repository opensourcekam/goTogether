const React = require('react')

class Family extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  putFamily () {
    console.log('Put Family')
  }

  render () {
    const iconSRC = 'family_icon.png'
    const style = {
      img: {
        height: '140px'
      }
    }

    return (
      <div className='card'>
        <div className="card-block">Family</div>
        <img onClick={this.putFamily} className='card-img-bottom' style={style.img} src={`/images/trip/${iconSRC}`} alt='Card image' />
      </div>
    )
  }
}

module.exports = Family
