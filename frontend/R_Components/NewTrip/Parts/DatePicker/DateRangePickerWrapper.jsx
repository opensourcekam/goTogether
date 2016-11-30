import React, {Component} from 'react'
import {DateRange} from 'react-date-range'
import moment from 'moment'

class DateRangePickerWrapper extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      preselectedDates: {
        startDate: null,
        endDate: null
      },
      'displayCalendar': 0
    }
    this.onFocusCalendarInput = this.onFocusCalendarInput.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.mouseOut = this.mouseOut.bind(this)
  }

  // Handle changes of input to calender component
  // Input focus
  onFocusCalendarInput () {
    // // next on calendar 1 is hidden
    // document.querySelectorAll('.rdr-MonthAndYear-button.next')[0].style.visibility = 'hidden'
    // // previous on calendar 2 is hidden
    // document.querySelectorAll('.rdr-MonthAndYear-button.prev')[1].style.visibility = 'hidden'
    this.setState({ displayCalendar: 1 })
  }

  mouseLeave (e) {
    console.log(e)
    this.setState({ displayCalendar: 0 })
  }
  mouseOut (e) {
    console.log(e)
    this.setState({ displayCalendar: 0 })
  }

  // Pass props to linked
  componentWillReceiveProps (nextProps) {
    this.setState({ preselectedDates: nextProps })
  }

  render () {
    const { displayCalendar } = this.state
    const { onChange, preselectedDates } = this.props
    const format = 'ddd, MMM D'
    const placeholder = `${preselectedDates.startDate && preselectedDates.startDate.format(format).toString()} - ${preselectedDates.endDate && preselectedDates.endDate.format(format).toString()}`

    return (
      <div onMouseLeave={this.mouseLeave}>
        <div>
          <input
            type='text'
            readOnly
            onFocus={this.onFocusCalendarInput}
            onBlur={this.onBlurCalendarInput}
            placeholder={placeholder}
            value={placeholder}
            />
        </div>
        {(displayCalendar === 1)
         ? <div>
           <DateRange
             startDate={preselectedDates.startDate}
             endDate={preselectedDates.endDate}
             linkedCalendars
             firstDayOfWeek={1}
             onInit={this.handleInit}
             onChange={onChange}
             theme={{
               PredefinedRanges: {
                 marginLeft: 10,
                 marginTop: 10
               },
               DayHover: {
                 background: '#ffffff',
                 color: '#7f8c8d',
                 transform: 'scale(1.1) translateY(-10%)',
                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
               },
               Calendar: {
                 color: '#95a5a6'
               }
             }}
                />
         </div>
          : null}
      </div>
    )
  }
}

const { func } = React.PropTypes

DateRangePickerWrapper.propTypes = {
  onChange: func.isRequired
}

module.exports = DateRangePickerWrapper
