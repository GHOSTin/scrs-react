import React from 'react';
import { Link } from 'react-router';
import BaseComponent from './BaseComponent.jsx';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Group from '@material-ui/icons/Group';
import School from '@material-ui/icons/School';
import Report from '@material-ui/icons/Description';
import Class from "./MainMenu";

export default class UserMenu extends BaseComponent {
  constructor(props){
    super(props);
  }

  render() {
    return (
        <div>
          {/*<Divider/>*/}
          {/*<Link*/}
              {/*to={`/reports/`}*/}
              {/*title="Конструктор отчетов"*/}
              {/*className="reports"*/}
              {/*activeClassName="active"*/}
          {/*>*/}
            {/*<MenuItem leftIcon={<Report color={"action"}/>}>Конструктор отчетов</MenuItem>*/}
          {/*</Link>*/}
          <Divider/>
          <Link
              to={`/professions/`}
              title="Список профессий"
              className="professions"
              activeClassName="active"
          >
            <MenuItem leftIcon={<School color={"action"}/>}>Список профессий</MenuItem>
          </Link>
          <Link
              to={`/users/`}
              title="Список пользователей"
              className="users"
              activeClassName="active"
          >
            <MenuItem leftIcon={<Group color={"action"}/>}>Список пользователей</MenuItem>
          </Link>
        </div>
    )
  }
}