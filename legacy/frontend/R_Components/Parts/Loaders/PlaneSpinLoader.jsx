const React = require('react')

class PlaneSpinLoader extends React.Component {
  render () {
    return (
      <div>
        <div className='wings' />
        <div className='circle' />
        <div className='arc' />
        <div className='arc2' />
      </div>
    )
  }
}
module.exports = PlaneSpinLoader
