const React = require('react');
const Pickers = require('./HeadAndFootParts/Pickers');

class Footer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      locales: {}
    };
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <footer style={{'position': 'fixed', 'bottom': '0'}}>
        <nav className='navbar navbar-fixed-bottom navbar-dark bg-primary'>
          <a className='navbar-brand' href='#'>youme.🌎🌍🌏</a>
          <Pickers />
          {/* <LocalePicker axios={axios} />
          <CountryPicker axios={axios} /> */}
        </nav>
      </footer>
    );
  }
}

module.exports = Footer;
