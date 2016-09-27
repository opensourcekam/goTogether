const React = require('react')

class SearchLocations extends React.Component {
  render () {
    return (
      <section>
        {/* <label>Where's next?</label> */}

        <form>
          <input placeholder="Where is the next place?">
          </input>
        </form>

      </section>
    )
  }
}

module.exports = SearchLocations
