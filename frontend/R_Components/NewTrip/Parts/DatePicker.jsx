const React = require('react')

class DatePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: ''
    }

    this.changeDate = this.changeDate.bind(this)
  }

  changeDate (e) {
    return this.setState({
      date: e.target.value
    })
  }

  render () {
    return (
      <div>
        <input
          value={`${this.state.date}`}
          onChange={this.changeDate}
          placeholder={`When are we going? ${new Date().toLocaleDateString()}`}
          type='text' />
      </div>
    )
  }
}

module.exports = DatePicker
