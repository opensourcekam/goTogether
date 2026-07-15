/* global userJSON */
/* eslint no-undef: "error" */
const React = require('react');
const style = {
  'figure': {
    'display': 'inline-flex',
    'width': '120px',
    'height': '120px',
    'position': 'relative',
    'overflow': 'hidden',
    'WebkitBorderRadius': '50%',
    'MozBorderRadius': '50%',
    'MsBorderRadius': '50%',
    'OBorderRadius': '50%',
    'borderRadius': '50%',
    'marginTop': '10px'
  },
  'img': {
    'display': 'inline',
    'margin': '0 auto',
    'height': '100%',
    'width': '100%'
  }
};

class DisplayPhoto extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div style={style.figure}>
        <img src={(userJSON.photos)
          ? userJSON.photos[0].value
          : ''} style={style.img} />
      </div>
    );
  }
}

module.exports = DisplayPhoto;
