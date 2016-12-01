const React = require('react')

class AutoComplete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    var options = this.props.autoFillPlaces.map((place, i) => {
      return (
        <option value={place} key={i} />
      )
    })

    return (
      <datalist id='places'>
        {options}
      </datalist>
    )
  }
}

const { array } = React.PropTypes

AutoComplete.propTypes = {
  autoFillPlaces: array.isRequired
}

module.exports = AutoComplete
