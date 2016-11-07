import {
  REQUEST_USER,
  UPDATE_USER,
  LOGIN,
  LOGOUT,
  SIGNUP,
  receiveUser,
  login,
  logout,
  signup
} from '../actions/UserActions'

export default ({ getState, dispatch }) => next => action => {
  // callbacks
  const success = user => dispatch(receiveUser(user))
  const error = response => console.log(response)
  switch (action.type) {
    case LOGIN:
      login(action.user, success, error)
      return next(action)
    case LOGOUT:
      logout(() => next(action))
      break
    case SIGNUP:
      signup(action.user, success, error)
      break
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
