import { applyMiddleware } from 'redux'
import UserMiddleware from './UserMiddleware'
import TripMiddleware from './RootMiddleware'
// etc...

export default applyMiddleware(
  UserMiddleware,
  TripMiddleware
)
