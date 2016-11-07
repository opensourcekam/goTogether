/* global google */
import React from 'react'
import ReactDOM from 'react-dom'
// https://gist.github.com/maedhr/8823168

class ToMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    let mapOptions = {
      center: this.props.flyingTo,
      zoom: this.props.initialZoom,
      panControl: true,
      zoomControl: false,
      scaleControl: false,
      disableDefaultUI: true,
      draggable: true
    }
    const google = window.google
    const map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions)

    this.setState({map: map})
  }

  render () {
    let style = {
      height: '350px'
    }
    return (
      <div className='map' style={style}></div>
    )
  }
}

const { number, object } = React.PropTypes

Map.propTypes = {
  initialZoom: number.isRequired,
  flyingTo: object.isRequired
}

module.exports = ToMap
