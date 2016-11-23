import React, {Component} from 'react'
import {DateRange} from 'react-date-range'
import moment from 'moment'

class DateRangePickerWrapper extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      'linked': {
        startDate: moment(),
        endDate: moment().add(+7, 'days')
      },
      'displayCalendar': 0
    }
    this.handleChange = this.handleChange.bind(this, 'linked')
    this.onFocusCalendarInput = this.onFocusCalendarInput.bind(this)
    this.onBlurCalendarInput = this.onBlurCalendarInput.bind(this)
  }

  // Handle changes of input to calender component
  handleChange (linked, payload) { this.setState({ [linked]: payload }) }

  // Input focus
  onFocusCalendarInput () { this.setState({ displayCalendar: 1 }) }
  onBlurCalendarInput () { this.setState({ displayCalendar: 0 }) }

  // Pass props to linked
  componentWillReceiveProps (nextProps) { this.setState({ linked: nextProps }) }

  render () {
    const { linked } = this.state
    const format = 'ddd, MMM D'
    const preselectedDates = `${linked['startDate'] && linked['startDate'].format(format).toString()} - ${linked['endDate'] && linked['endDate'].format(format).toString()}`

    return (
      <div>
        <div>
          <input
            type='text'
            readOnly
            onFocus={this.onFocusCalendarInput}
            onBlur={this.onBlurCalendarInput}
            placeholder={preselectedDates}
            value={preselectedDates}
            />
        </div>
        {(this.state.displayCalendar === 1)
         ? <div onMouseOver={this.onMouseOverInput}>
             <DateRange
                 linkedCalendars
                 firstDayOfWeek={1}
                 onInit={this.handleChange}
                 onChange={this.props.onChange}
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
