import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import Chip from 'material-ui/Chip';
import {teal400, orange500} from 'material-ui/styles/colors';

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