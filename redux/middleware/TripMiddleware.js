import {
  REQUEST_TRIP,
  UPDATE_TRIP
  // receiveTrip
} from '../actions/TripActions'

export default ({ getState, dispatch }) => next => action => {
  // callbacks
  // const success = trip => dispatch(receiveTrip(trip))
  // const error = messages => console.log(messages)
  switch (action.type) {
    case REQUEST_TRIP:
      // make AJAX GET request here using success/error callbacks
      return next(action)
    case UPDATE_TRIP:
      // make AJAX PATCH request here using success/error callbacks
      return next(action)
    default:
      return next(action)
  }
}
