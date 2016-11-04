const React = require('react')

const style = {
  'img': {
    'width': '100%',
    // 'height': 'auto',
    'position': 'relative',
    'borderTop': '.5em red solid'
  },
  'planningTripBubble': {
    'position': 'relative',
    'display': 'block',
    'marginBottom': '3.75rem',
    'borderRedius': '50%',
    // 'border': '1px solid rgba(0, 0, 0, .125)',
    // 'width': '500px',
    // 'height': '500px'
  },
  'cardOverlay': {
    'position': 'absolute',
    'right': '20%',
    'bottom': '140px',
    'left': '10%',
    'padding': '1.25rem',
    'backgroundColor': 'rgba(115, 186, 255,.85)',
    'height': 'auto',

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
            <h2 style={style.h2} id="planningTripBubbleH2">{this.props.dest}</h2>
            <span>${this.props.budget}</span>
            <span style={{"float":"right"}}>{this.props.tripDate}</span>
        </div>
        <img className='img-circle img-responsive' src={this.props.placeImage || '/images/br1.jpg'} style={style.img}></img>
      </div>
    )
  }
}

module.exports = Trip

/*
    < li class = "card card-inverse" data - reactid = ".0.0.1.0.0.2.0.$1" style = "position: absolute left: 426px top: 0px" >
      <div class="card-img-overlay" style="background-color:rgba(0, 0, 0, 0.6)width:100%height:100%" data-reactid=".0.0.1.0.0.2.0.$1.0">
      <span class="card-text" style="padding:0pxmargin:0pxfont-size:2emfont-weight:500" data-reactid=".0.0.1.0.0.2.0.$1.0.0">
        <span data-reactid=".0.0.1.0.0.2.0.$1.0.0.0">Ağdam</span>
        <span data-reactid=".0.0.1.0.0.2.0.$1.0.0.1">,
        </span>
      </span>
      <span class="card-text" data-reactid=".0.0.1.0.0.2.0.$1.0.1">Akna, Azerbaijan</span>
    </div>
    < img class = "card-img" style = "width:99%" src = "http://assets.atlasobscura.com/media/W1siZiIsInVwbG9hZHMvcGxhY2VfaW1hZ2VzLzJkYWY4ZTk3YTc5MjgzYjFhMWNhYThhN2RkYTZjMjQyOWU3YjEzNzUuanBnIl0sWyJwIiwiY29udmVydCIsIi1xdWFsaXR5IDkxIC1hdXRvLW9yaWVudCJdLFsicCIsInRodW1iIiwiMzcyeDI0OCMiXV0/2daf8e97a79283b1a1caa8a7dda6c2429e7b1375.jpg" data - reactid = ".0.0.1.0.0.2.0.$1.1" >
    </li>
*/
