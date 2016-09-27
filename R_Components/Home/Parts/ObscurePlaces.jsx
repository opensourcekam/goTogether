const React = require('react')
const Masonry = require('react-masonry-component')

var masonryOptions = {
  transitionDuration: 70,
  fitWidth: true
}

var styles = {
  labels: {
    position: 'absolute',
    bottom: '0',
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: '100%'
  }
}

class ObscurePlaces extends React.Component {

  render () {
    var size = 12
    var places = this.props.elements
    var randSlice = Math.floor(Math.random() * places.length)

    var childElements = places.slice(randSlice, randSlice + size).map((element) => {
      return (
        <li className='image-element-class'>
          <div style={styles.labels}>
            <label>{element.name}</label>
          </div>
          <img src={element.src} />
        </li>
      )
    })

    return (
      <div className={'centerMasonry'}>
        <Masonry className={'my-gallery-class'} // default ''
          elementType={'ul'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if    disableImagesLoaded is false
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
