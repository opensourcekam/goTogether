const React = require('react')
import { Circle } from 'progressbar.js'
import { sampleSize } from 'lodash'
import moment from 'moment'

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
    this.state = {
      loadTo: '0',
      hovered: 0
    }
    this.animateProgress = this.animateProgress.bind(this)
  }

  componentDidMount () {
  }

  animateProgress () {
    // console.log(this)
    if (this.state.hovered === 0) {
      const circle = new Circle(`#${this.props.mountId}`, {
        strokeWidth: this.props.strokeWidth || 4, // This means 4% of the container
        color: this.props.color
      })

      this.setState({hovered: 1})

      // Sample to display mockup of completeing trip planning
      circle.animate(sampleSize(['0.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9', '1'], 1))
      // let progressPercent = (this.props.saved / this.props.budget).toFixed(2)
      // circle.animate(progressPercent)
    } else {
      // console.log('no re render ProgressBar')
      return
    }
    // How can I unbind an event from my component :O
    // delete this._reactInternalInstance._renderedComponent._currentElement.props.onMouseOver
  }

  render () {
    const { _id, img, mountId, dest, budget, tripDate, tripEndDate, tripHasPast } = this.props
    return (
      <div className='wrapper' data-trip-id={_id} onMouseEnter={this.animateProgress}>
        <img src={img} />
        <div id={mountId} />
        <div style={style.innerDivOverlay}>
          <h2 style={style.h2} id='planningTripBubbleH2'>{dest}</h2>
          <span>Budget ${budget}</span>
          <span style={{'display': 'none'}}>${tripHasPast}</span>
          <span style={{
            'float': 'left'
          }}>
            {moment(tripDate).format('MMM Do')} - {moment(tripEndDate).format('MMM Do, YYYY')}
          </span>
          {/* <span>Past: {tripHasPast}</span> */}
        </div>
      </div>
    )
  }
}

const {number, string} = React.PropTypes

CircleProgressBarWithImageCenter.propTypes = {
  _id: string,
  img: string,
  mountId: string,
  innerDivOverlay: string,
  dest: string,
  budget: number,
  tripDate: string,
  tripEndDate: string,
  tripHasPast: string,
  color: string,
  strokeWidth: string,
  saved: number
}

module.exports = CircleProgressBarWithImageCenter
