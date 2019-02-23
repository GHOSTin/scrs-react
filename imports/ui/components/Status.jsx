import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import Chip from 'material-ui/Chip';
import teal from '@material-ui/core/colors/teal';
import orange from '@material-ui/core/colors/orange';
const teal400 = teal['400'];
const orange500 = orange['500'];

let style = {
  active: {
    backgroundColor: teal400,
  },
  inactive: {
    backgroundColor: orange500,
  },
  label: {
    lineHeight: '25px'
  }
};
class Status extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let {status} = this.props;
    return (
        <Chip
            style={style[status]}
            labelColor={'white'}
            labelStyle={style.label}
        >
          {i18n.__(`components.Status.${status}`)}
        </Chip>
    );
  }
}

export default Status;