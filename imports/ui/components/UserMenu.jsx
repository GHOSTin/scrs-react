import React from 'react';
import { Link } from 'react-router';
import BaseComponent from './BaseComponent.jsx';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Group from 'material-ui/svg-icons/social/group';
import School from 'material-ui/svg-icons/social/school';
import Report from 'material-ui/svg-icons/action/description';

export default class UserMenu extends BaseComponent {
  constructor(props){
    super(props);
  }

  render() {
    return (
        <div>
          <Divider/>
          <Link
              to={`/reports/`}
              title="Конструктор отчетов"
              className="reports"
              activeClassName="active"
          >
            <MenuItem leftIcon={<Report/>}>Конструктор отчетов</MenuItem>
          </Link>
          <Divider/>
          <Link
              to={`/professions/`}
              title="Список профессий"
              className="professions"
              activeClassName="active"
          >
            <MenuItem leftIcon={<School/>}>Список профессий</MenuItem>
          </Link>
          <Link
              to={`/users/`}
              title="Список пользователей"
              className="users"
              activeClassName="active"
          >
            <MenuItem leftIcon={<Group/>}>Список пользователей</MenuItem>
          </Link>
        </div>
    )
  }
}