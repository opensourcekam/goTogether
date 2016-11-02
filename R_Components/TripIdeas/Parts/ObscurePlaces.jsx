const React = require('react')
const Masonry = require('react-masonry-component')

const masonryOptions = {
  transitionDuration: 100,
  fitWidth: true,
  gutter: 50,
  stagger: 100
}
const styles = {
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
  cardImg: {
    'width': '99%'
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
        <li className='card card-inverse' key={i}>
          <div className='card-img-overlay' style={styles.labels}>
            <span className='card-text' style={styles.subName}>{element.subName}, </span>
            <span className='card-text'>{element.name}</span>
          </div>
          <img className='card-img' style={styles.cardImg} src={element.src} />
        </li>
      )
    })

    return (
      <div className={'centerMasonry'}>
        <Masonry className={'my-gallery-class'}
          elementType={'ul'}
          options={masonryOptions}
          disableImagesLoaded={0}
          updateOnEachImageLoad={1}
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
