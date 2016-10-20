/* global google */
import React from 'react'
import ReactDOM from 'react-dom'
// https://gist.github.com/maedhr/8823168

var geodesicPoly, marker1, marker2

class Map extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.draw = this.draw.bind(this)
  }

  componentDidMount () {
    let mapOptions = {
      center: this.props.currentPosition,
      zoom: this.props.initialZoom,
      panControl: true,
      zoomControl: false,
      scaleControl: false,
      disableDefaultUI: true,
      draggable: true
    }
    
    const google = window.google
    const map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions)

    marker1 = new google.maps.Marker({
      map: map,
      draggable: true,
      visible: false,
      position: this.props.currentPosition
    })

    marker2 = new google.maps.Marker({
      map: map,
      draggable: true,
      visible: false,
      position: this.props.flyingTo
    })

    var bounds = new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition())
    map.fitBounds(bounds)
    geodesicPoly = new google.maps.Polyline({strokeColor: '#CC0099', strokeOpacity: 1.0, strokeWeight: 3, geodesic: true, map: map})
    this.draw()

    this.setState({map: map})
  }

  draw () {
    console.log('drawing')
    var path = [marker1.getPosition(), marker2.getPosition()]
    geodesicPoly.setPath(path)
  }

  mapCenterLatLng () {
    var props = this.props
    return new google.maps.LatLng(props.currentPosition.lat, props.currentPosition.lng)
  }

  componentDidUpdate () {
    let map = this.state.map
    map.panTo(this.mapCenterLatLng())
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

const { number } = React.PropTypes

Map.propTypes = {
  initialZoom: number.isRequired,
  currentPosition: number.isRequired,
  flyingTo: number.isRequired
}

module.exports = Map
