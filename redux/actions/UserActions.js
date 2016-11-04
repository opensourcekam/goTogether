// avoid no-error-message errors in the reducers and middleware
// by using constants instead of plain strings
export const RECEIVE_USER = 'RECEIVE_USER'
export const REQUEST_USER = 'REQUEST_USER'
export const UPDATE_USER = 'UPDATE_USER'

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
})

export const requestUser = id => ({
  type: REQUEST_USER,
  id
})

export const updateUser = user => ({
  type: UPDATE_USER,
  user
})
