import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import Chip from 'material-ui/Chip';
import teal from '@material-ui/core/colors/teal';
import orange from '@material-ui/core/colors/orange';
import {withStyles} from "@material-ui/styles";
const teal400 = teal['400'];
const orange500 = orange['500'];

const styles = theme => ({
  active: {
    backgroundColor: `${teal400}!important`,
  },
  inactive: {
    backgroundColor: `${orange500}!important`,
  },
  label: {
    lineHeight: '25px'
  }
});
class Status extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {status, classes} = this.props;
    return (
        <Chip
            className={classes[status]}
            labelColor={'white'}
            labelStyle={{
              lineHeight: '25px'
            }}
        >
          {i18n.__(`components.Status.${status}`)}
        </Chip>
    );
  }
}

export default withStyles(styles)(Status);