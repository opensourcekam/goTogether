const React = require('react')
const Card = require('./Card')

const style = {
  position: 'absolute',
  bottom: '30px',
  left: '0',
  backgroundColor: 'rgba(157, 141, 141, 0.72)',
  padding: '40px'
}

const AboutBar = () => (
  <div className='card-group' style={style}>
    <div className='card-deck'>
      <Card action='Centralize.' actionText="Imagine all of your travel plans in one place. Adventurous vacations start with simple ideas." />
      <Card action='Plan.' actionText="Youme.🌏, the smart travel assistant. Designs the perfect trip for you and your friends." />
      <Card action='Go!' actionText="It's just about that time! Are you all ready yet? Don't worry! We have the perfect trip for you. Let's Go!" />
    </div>
  </div>
)

module.exports = AboutBar
