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
    this.onBlurCalendarInput = this.onBlurCalendarInput.bind(this)
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

  onBlurCalendarInput () {
    this.setState({ displayCalendar: 1 })
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
      <div>
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
         ? <div onMouseOver={this.onMouseOverInput}>
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
                   Calendar : {
                    color : '#95a5a6'
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

// AIRBNB DATE PICKER!!!
// import React from 'react'
//
// import DateRangePicker from 'react-dates'
// import moment from 'moment'
// import { START_DATE } from 'react-dates/constants'
//
// class DateRangePickerWrapper extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       focusedInput: START_DATE,
//       startDate: null,
//       endDate: null
//     }
//
//     this.onDatesChange = this.onDatesChange.bind(this)
//     this.onFocusChange = this.onFocusChange.bind(this)
//   }
//
//   onDatesChange ({ startDate, endDate }) {
//     this.setState({ startDate, endDate })
//   }
//
//   onFocusChange (focusedInput) {
//     this.setState({ focusedInput })
//   }
//
//   render () {
//     const { focusedInput, startDate, endDate } = this.state
//     return (
//       <div>
//         <DateRangePicker
//           {...this.props}
//           onDatesChange={this.onDatesChange}
//           onFocusChange={this.onFocusChange}
//           focusedInput={focusedInput}
//           startDate={startDate.toString()}
//           endDate={endDate.toString()}
//         />
//       </div>
//     )
//   }
// }
//
// module.exports = DateRangePickerWrapper
