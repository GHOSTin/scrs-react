import React from 'react';
import { Link } from 'react-router';
import BaseComponent from './BaseComponent.jsx';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Class from 'material-ui/svg-icons/action/class';

export default class MainMenu extends BaseComponent {
  constructor(props){
    super(props);
  }

  render() {
    return (
        <div>
          <Link
              to={`/`}
              title="Суммарный итог"
              className="result"
              activeClassName="active"
          >
            <MenuItem leftIcon={<Class/>}>Суммарный итог</MenuItem>
          </Link>
          <Divider/>
          <Link
              to={`/journal/`}
              title="Журнал"
              className="journal"
              activeClassName="active"
          >
              <MenuItem leftIcon={<ContentCopy/>}>Журнал</MenuItem>
            </Link>
          <Link
              to={`/students/`}
              title="Список студентов"
              className="students"
              activeClassName="active"
          >
            <MenuItem leftIcon={<PersonAdd/>}>Список студентов</MenuItem>
          </Link>
        </div>
    )
  }
}