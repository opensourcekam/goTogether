const React = require('react');

class LocalePicker extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      locales: [],
      selected: {
        code: '',
        symbol: ''
      }
    };
  }

  componentDidMount () {
    const { axios } = this.props;
    axios.get('/locales').then((value) => {
      this.setState({locales: value.data});
    }).catch((err) => {
      console.err(err);
      throw new Error('Could not get locales');
    });
    // console.log('[curr]',this.state)
  }

  componentWillMount () {
  }

  render () {
    const { locales } = this.state;
    const childElement = locales.map((loc) => {
      const { Code, Symbol } = loc;
      return <option value={`${Code}${Symbol}`} key={Code}>{`${Code}: ${Symbol}`}</option>;
    });
    return (
      <select className='dropdown'>
        locales
        {childElement}
      </select>
    );
  }
}

const { func } = React.PropTypes;

LocalePicker.propTypes = {
  axios: func.isRequired
};

module.exports = LocalePicker;
