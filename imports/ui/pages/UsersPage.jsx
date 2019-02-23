import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import UserDialog from '../components/UserDialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from '@material-ui/icons/Add';
import yellow from '@material-ui/core/colors/yellow';
import common from '@material-ui/core/colors/common';
const yellow400 = yellow['400'];
const fullBlack = common.fullBlack;
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import ContentCreate from '@material-ui/icons/Create';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Status from '../components/Status';
import {RolesCollection} from '../../api/roles/roles';
import {_} from 'lodash';

import {remove} from '../../api/users/methods';

const styles = {
  floatingActionButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }
};

export default class UsersPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.getRole = (role) => {return _.chain(RolesCollection).find({value: role}).get('text', '').value()};
    this.state = {...this.state,  editing: undefined, open: false };
  }

  getChildContext() {
    return {editing: this.state.editing};
  }

  onEditingChange(user, editing) {
    this.setState({
      user: editing ? user : undefined,
      open: true,
      editing: editing
    });
  }

  static onClickRemove(user){
    if(confirm(i18n.__('pages.UsersPage.confirmDelete'))){
      remove.call({ id: user._id });
    }
  }

  onHideModal = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { loading, listExists, users } = this.props;

    if (!listExists || !Roles.userIsInRole(Meteor.user(), 'admin')) {
      return <NotFoundPage />;
    }

    let Users;
    if (!users || !users.length) {
      Users = (
          <Message
              title={i18n.__('pages.InternsPage.noInterns')}
              subtitle={i18n.__('pages.InternsPage.addAbove')}
          />
      );
    } else {
      Users = (
        <Table fixedHeader>
          <TableHeader
            displaySelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn style={{width: 68}}/>
              <TableHeaderColumn>ФИО</TableHeaderColumn>
              <TableHeaderColumn>Login</TableHeaderColumn>
              <TableHeaderColumn>Роль</TableHeaderColumn>
              <TableHeaderColumn style={{width: 150}}/>
              <TableHeaderColumn style={{width: 130}}/>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} displayRowCheckbox={false}>
            {users.map((user,index) => (
              <TableRow key={user._id}>
                <TableRowColumn style={{width: 68}}><Avatar src={user.avatar}/></TableRowColumn>
                <TableRowColumn>{user.profile?user.profile.name:null}</TableRowColumn>
                <TableRowColumn>{user.username}</TableRowColumn>
                <TableRowColumn>{this.getRole(user.roles[0])}</TableRowColumn>
                <TableRowColumn style={{width: 150}}><Status status={user.profile?user.profile.status:null} /></TableRowColumn>
                <TableRowColumn style={{overflow: 'visible', width: 130}}>
                  <IconButton
                      tooltip="Изменить"
                      tooltipPosition='top-center'
                      onClick={() => this.onEditingChange(user, true)}
                  >
                    <ContentCreate/>
                  </IconButton>
                  <IconButton
                      tooltip="Удалить"
                      tooltipPosition='top-center'
                      onClick={() => UsersPage.onClickRemove(user)}
                  >
                    <RemoveCircle/>
                  </IconButton>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return (
        <div className="page lists-show">
          <div className="content-scrollable list-items">
            {loading
              ? <Message title={i18n.__('pages.UsersPage.loading')} />
              : Users}
          </div>
          <FloatingActionButton
            backgroundColor={yellow400}
            onClick={() => this.onEditingChange({}, false)}
            style={styles.floatingActionButton}
            iconStyle={{fill: common.black}}
          >
            <ContentAdd/>
          </FloatingActionButton>
          {!loading ?
          <UserDialog
            open={this.state.open}
            onHide={this.onHideModal}
            user={this.state.user}
          /> : null}
        </div>
    );
  }
}

UsersPage.propTypes = {
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
  users: React.PropTypes.array,
};

UsersPage.childContextTypes = {
  editing: React.PropTypes.bool
};