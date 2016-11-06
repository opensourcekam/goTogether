const React = require('react')
const ProgressBar = require('../../../public/javascript/progressbar')
const _ = require('lodash')
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
  /*<CircleProgressBarWithImageCenter
            img='https://images.unsplash.com/photo-1465065600826-82807d7a83b2?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=5d14f5b77a64aea2934b9d9622075ae6'
            loadDelaySeconds='100'
            mountId='madrid'
            color='#aae444'
            loadTo='.5'
            strokeWidth='4'/>

          <CircleProgressBarWithImageCenter
            img='https://images.unsplash.com/photo-1443170412500-d04323a4eb57?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=3fe94c5c326278dbd3e8f3e4b4eb3685'
            loadDelaySeconds='100'
            mountId='tokyo'
            color='rgb(255, 53, 23)'
            loadTo='.9'
            strokeWidth='4'/>

                  <CircleProgressBarWithImageCenter
            img='https://images.unsplash.com/photo-1423655156442-ccc11daa4e99?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=460fc65c8079dc4bd4a2ee7fa1fd7946'
            loadDelaySeconds='100'
            mountId='newYork'
            color='rgb(25, 13, 233)'
            loadTo='.3'
            strokeWidth='4'/>*/

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
      const circle = new ProgressBar.Circle(`#${this.props.mountId}`, {
        strokeWidth: this.props.strokeWidth || 4,  // This means 4% of the container
        color:  this.props.color
      })

      this.setState({hovered:1})

      // Sample to display mockup of completeing trip planning
      circle.animate(_.sampleSize(['.1','.2','.3','.4','.5','.6','.7','.8','.9','1'], 1))
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
      <div className='wrapper' onMouseEnter={this.animateProgress}>
        <img src={this.props.img}/>
        <div id={this.props.mountId}></div>
        <div style={style.innerDivOverlay}>
            <h2 style={style.h2} id='planningTripBubbleH2'>Plan for {this.props.dest}</h2>
            <span>Avg. cost ${this.props.budget}</span>
            <span style={{'float':'right'}}>{this.props.tripDate}</span>
        </div>
      </div>
    )
  }
}

module.exports = CircleProgressBarWithImageCenter
