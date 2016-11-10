import { RECEIVE_TRIP } from '../actions/TripActions'

export default (state = null, action) => {
  // ensure state does not get overridden by accident
  Object.freeze(state)

  // Object.assign() only produces shallow copies
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  const nextState = Object.assign({}, state)
  switch (action.type) {
    case RECEIVE_TRIP:
      Object.assign(nextState, action.trip)
      return nextState
    default:
      return state
  }
}
