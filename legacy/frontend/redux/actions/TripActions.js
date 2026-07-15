export const RECEIVE_TRIP = 'RECEIVE_TRIP'
export const UPDATE_TRIP = 'UPDATE_TRIP'

export const receiveTrip = trip => ({
  type: RECEIVE_TRIP,
  trip
})

export const updateTrip = trip => ({
  type: UPDATE_TRIP,
  trip
})
