import {
  REQUEST_USER,
  UPDATE_USER
  // receiveUser
} from '../actions/UserActions'

export default ({ getState, dispatch }) => next => action => {
  // callbacks
  // const success = user => dispatch(receiveUser(user))
  // const error = messages => console.log(messages)
  switch (action.type) {
    case REQUEST_USER:
      // make AJAX GET request here using success/error callbacks
      return next(action)
    case UPDATE_USER:
      // make AJAX PATCH request here using success/error callbacks
      return next(action)
    default:
      return next(action)
  }
}
