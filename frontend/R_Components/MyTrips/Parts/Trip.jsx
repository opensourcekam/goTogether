const React = require('react')

const style = {
  'img': {
    'width': '100%',
    'position': 'relative',
    'borderTop': '.5em red solid'
  },
  'planningTripBubble': {
    'position': 'relative',
    'display': 'block',
    'marginBottom': '3.75rem',
    'borderRedius': '50%'
  },
  'cardOverlay': {
    'position': 'absolute',
    'right': '20%',
    'bottom': '140px',
    'left': '10%',
    'padding': '1.25rem',
    'backgroundColor': 'rgba(115, 186, 255,.85)',
    'height': 'auto'

  },
  'innerDivOverlay': {
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'width': '100%',
    'zIndex': '999',
    'backgroundColor': 'rgba(28, 255, 5, 0.87)',
    'padding': '20px',
    'transform': 'translate(-50%, -50%)'
  }
}

class Trip extends React.Component {
  render () {
    return (
      <div className='planningTripBubble' style={style.planningTripBubble}>
        <div style={style.innerDivOverlay}>
            <h2 style={style.h2} id='planningTripBubbleH2'>{this.props.dest}</h2>
            <span>${this.props.budget}</span>
            <span style={{'float': 'right'}}>{this.props.tripDate}</span>
        </div>
        <img className='img-circle img-responsive' src={this.props.placeImage || '/images/br1.jpg'} style={style.img} />
      </div>
    )
  }
}

module.exports = Trip
