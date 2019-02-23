import React from 'react';
import { Link } from 'react-router';
import BaseComponent from './BaseComponent.jsx';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import ContentCopy from '@material-ui/icons/FileCopy';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Class from '@material-ui/icons/Class';
import grey from '@material-ui/core/colors/grey';

const grey600 = grey[600];

export default class MainMenu extends BaseComponent {
  constructor(props){
    super(props);
  }

  render() {
    return (
        <React.Fragment>
          <Link
              to={`/`}
              title="Суммарный итог"
              className="result"
              activeClassName="active"
          >
            <MenuItem leftIcon={<Class color={grey600}/>}>Суммарный итог</MenuItem>
          </Link>
          <Divider/>
          <Link
              to={`/journal/`}
              title="Журнал"
              className="journal"
              activeClassName="active"
          >
              <MenuItem leftIcon={<ContentCopy color={grey600}/>}>Журнал</MenuItem>
            </Link>
          <Link
              to={`/students/`}
              title="Список студентов"
              className="students"
              activeClassName="active"
          >
            <MenuItem leftIcon={<PersonAdd color={grey600}/>}>Список студентов</MenuItem>
          </Link>
        </React.Fragment>
    )
  }
}