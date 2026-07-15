const React = require('react');
const style = {
  'button': {
    'padding': '10px',
    'borderRadius': '100%',
    'height': '50px',
    'width': '50px',
    'fontSize': '1.6em',
    'lineHeight': 'initial'
  },
  'buttonWrapper': {
    'position': 'absolute',
    'top': '0',
    'padding': '10px'
  }
};
class Invite extends React.Component {
  render () {
    return (
      <div style={style.buttonWrapper}>
        <button style={style.button}>+</button>
      </div>
    );
  }
}

// const { number } = React.PropTypes
//
// InvitedList.propTypes = {
//   saved: number.isRequired,
//   budget: number.isRequired
// }

module.exports = Invite;
