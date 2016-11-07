// Need jquery for this to work
const $ = {} // make the linter shutup
export const login = (user, success, error) => {
  $.ajax({
    method: 'POST',
    url: '???',
    data: user,
    success,
    error
  })
}

export const signup = (user, success, error) => {
  $.ajax({
    method: 'POST',
    url: '???',
    data: user,
    success,
    error
  })
}

export const logout = (success, error) => {
  $.ajax({
    method: 'DELETE',
    url: '???',
    success,
    error
  })
}
