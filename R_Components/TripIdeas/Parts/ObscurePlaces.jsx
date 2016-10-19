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
    position: 'absolute',
    bottom: '5',
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: '100%',
    height: '30%',
    padding: '20px'
  },
  masonry: {
  }
}

class ObscurePlaces extends React.Component {
  showDetails () {
    console.log(this)
  }

  render () {
    var childElements = this.props.elements.map((element, i) => {
      return (
        <li className='grid-item' key={i}>
          <div style={styles.labels}>
            <p>{element.subName}</p>
            <span>{element.name}</span>
          </div>

          <img src={element.src} />
        </li>
      )
    })

    return (
      <div className={'centerMasonry'}>
        <Masonry className={'my-gallery-class'}
          elementType={'ul'}
          options={masonryOptions}
          disableImagesLoaded={false}
          updateOnEachImageLoad={false}
          onImagesLoaded={this.handleImagesLoaded}
        >
          {childElements}
        </Masonry>
      </div>
    )
  }
}

const { array } = React.PropTypes

ObscurePlaces.propTypes = {
  elements: array.isRequired
}

module.exports = ObscurePlaces
