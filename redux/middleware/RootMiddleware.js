import { applyMiddleware } from 'redux'
import UserMiddleware from './UserMiddleware'
import TripMiddleware from './TripMiddleware'
// etc...

export default applyMiddleware(
  UserMiddleware,
  TripMiddleware
)
