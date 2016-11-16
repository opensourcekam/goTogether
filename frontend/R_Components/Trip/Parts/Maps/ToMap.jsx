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

    this.props.activities.forEach((action) => {
      console.log(action.name)

      var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the ' +
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
            'south west of the nearest large town, Alice Springs; 450&#160;km ' +
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
            'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
            'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
            'Aboriginal people of the area. It has many springs, waterholes, ' +
            'rock caves and ancient paintings. Uluru is listed as a World ' +
            'Heritage Site.</p>' +
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
            '(last visited June 22, 2009).</p>' +
            '</div>' +
            '</div>'

      let infowindow = new google.maps.InfoWindow({
        content: contentString
      })

      let marker = new google.maps.Marker({
        map: map,
        position: action.geometry.location,
        animation: google.maps.Animation.DROP,
        title: action.name
      })

      marker.addListener('click', function () {
        infowindow.open(map, marker)
      })
    })

    this.setState({map: map})
  }

  render () {
    let style = {
      height: '350px'
    }
    return (
      <div className='map' style={style} />
    )
  }
}

const { number, object, array } = React.PropTypes

ToMap.propTypes = {
  initialZoom: number.isRequired,
  flyingTo: object.isRequired,
  activities: array
}

module.exports = ToMap
