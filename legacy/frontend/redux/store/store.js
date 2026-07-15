import { createStore } from 'redux'
import RootReducer from '../reducers/RootReducer'
import preloadedState from './preloadedState'
import RootMiddleware from '../middleware/RootMiddleware'

export default () => createStore(RootReducer, preloadedState, RootMiddleware)
