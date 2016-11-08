const React = require('react')
import { Circle, animate } from 'progressbar.js'
import { sampleSize } from 'lodash'

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
    'width': '80%',
    'zIndex': '999',
    'backgroundColor': 'rgba(28, 255, 5, 0.87)',
    'padding': '20px',
    'transform': 'translate(-50%, -50%)'
  }
}

class CircleProgressBarWithImageCenter extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loadTo: '0', hovered: 0 }
    this.animateProgress = this.animateProgress.bind(this)
  }

  componentDidMount(){
    // const circle = new ProgressBar.Circle(`#${this.props.mountId}`, {
    //   strokeWidth: this.props.strokeWidth || 4,  // This means 4% of the container
    //   color:  this.props.color
    // })
    //
    // this.animateProgress.bind(circle)
    //
    // setTimeout(() => {
    //     circle.animate('.40')
    //
    // }, 5000);
  }

  animateProgress () {
    console.log(this)
    if(this.state.hovered === 0){
      const circle = new Circle(`#${this.props.mountId}`, {
        strokeWidth: this.props.strokeWidth || 4,  // This means 4% of the container
        color:  this.props.color
      })

      this.setState({hovered:1})

      // Sample to display mockup of completeing trip planning
      circle.animate(sampleSize([
                                  '.1',
                                  '.2',
                                  '.3',
                                  '.4',
                                  '.5',
                                  '.6',
                                  '.7',
                                  '.8',
                                  '.9',
                                  '1'
                                ], 1))
    } else {
      console.log('no re render ProgressBar')
      return
    }
    // How can I unbind an event from my component :O
    //delete this._reactInternalInstance._renderedComponent._currentElement.props.onMouseOver
  }

  dismountProgressBar () {}
  render() {
    return (
      <div className='wrapper' data-trip-id={this.props._id} onMouseEnter={this.animateProgress}>
        <img src={this.props.img}/>
        <div id={this.props.mountId}></div>
        <div style={style.innerDivOverlay}>
            <h2 style={style.h2} id='planningTripBubbleH2'>{this.props.dest}</h2>
            <span>Avg. cost ${this.props.budget}</span>
            <span style={{'float':'right'}}>{this.props.tripDate}</span>
        </div>
      </div>
    )
  }
}

module.exports = CircleProgressBarWithImageCenter
