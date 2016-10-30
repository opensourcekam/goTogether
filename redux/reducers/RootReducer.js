import { combineReducers } from 'redux'
import UserReducer from './UserReducer'
import TripReducer from './TripReducer'

// essentially, this is what the store will look like
export default combineReducers({
  user: UserReducer,
  trip: TripReducer
})
