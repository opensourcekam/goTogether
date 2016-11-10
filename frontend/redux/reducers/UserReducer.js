import { RECIEVE_USER } from '../actions/UserActions'

export default (state = null, action) => {
  // ensure state does not get overridden by accident
  Object.freeze(state)

  // Object.assign() only produces shallow copies
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  const nextState = Object.assign({}, state)
  switch (action.type) {
    case RECIEVE_USER:
      Object.assign(nextState, action.user)
      return nextState
    default:
      return state
  }
}
