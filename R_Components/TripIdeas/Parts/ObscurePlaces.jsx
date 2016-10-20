const React = require('react')
const Masonry = require('react-masonry-component')

var masonryOptions = {
  transitionDuration: 100,
  fitWidth: true,
  gutter: 20,
  stagger: 50
}

var styles = {
  labels: {
    'backgroundColor': 'rgba(0, 0, 0, 0.6)',
    'width': '100%',
    'height': '100%'
  },
  subName: {
    'padding': '0',
    'margin': '0',
    'fontSize': '2em',
    'fontWeight': '500'
  },
  name: {
    'color': 'white'
  },
  masonry: {}
}

class ObscurePlaces extends React.Component {
  showDetails () {
    console.log(this)
  }

  render () {
    var childElements = this.props.elements.map((element, i) => {
      return (
        <div className='card card-inverse' key={i}>
          <div>
              <div className='card-img-overlay' style={styles.labels}>
                <span className='card-text' style={styles.subName}>{element.subName}, </span>
                <span className='card-text'>{element.name}</span>
              </div>
          </div>
          <img className='card-img' src={element.src} />
        </div>
      )
    })

    return (
      <div className={'centerMasonry'}>
        <Masonry className={'my-gallery-class'}
          elementType={'div'}
          options={masonryOptions}
          disableImagesLoaded={false}
          updateOnEachImageLoad={false}
          onImagesLoaded={this.handleImagesLoaded}>
        {childElements}
        </Masonry>
      </div>
    )
  }
}

const {array} = React.PropTypes

ObscurePlaces.propTypes = {
  elements: array.isRequired
}

module.exports = ObscurePlaces
