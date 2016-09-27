/* global userJSON */
const React = require('react')

const styles = {
  ctaText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '100',
    marginTop: '10%'
  },
  h2: {
    fontWeight: '100'
  }
}

class CTA extends React.Component {
  render () {
    return (
      <div className='ctaText' style={styles.ctaText}>
        {userJSON.displayName ? (<h2 style={styles.h2}>{userJSON.displayName} It's time to go to <i> Madrid, Spain.</i></h2>) : (<h2 style={styles.h2}>It's time to go to<i> Madrid, Spain.</i></h2>)}
      </div>
    )
  }
}

module.exports = CTA
