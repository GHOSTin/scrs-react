import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import StudentDialog from '../components/StudentDialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {yellow400, fullBlack, fullWhite, teal400} from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import {RolesCollection} from '../../api/roles/roles';
import {_} from 'lodash';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import {remove} from '../../api/students/methods';

const styles = {
  floatingActionButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  attach: {
    button: {
      height: 30,
      lineHeight: "30px",
    },
    label: {
      fontSize: "12px"
    }
  }
};

export default class UsersPage extends BaseComponent {

  state = {
    message: '',
    open: false,
    openMessage: false
  };

  constructor(props) {
    super(props);
    this.getRole = (role) => {return _.chain(RolesCollection).find({value: role}).get('text', '').value()};
    this.state = {...this.state,  editing: undefined };
  }

  getChildContext() {
    return {
      editing: this.state.editing,
      professions: this.props.professions,
      controllers: this.props.controllers,
      masters: this.props.masters,
      instructors: this.props.instructors,
    };
  }

  onEditingChange(student, editing) {
    this.setState({
      student: _.isEmpty(student) ? undefined : student,
      open: true,
      editing: editing
    });
  }

  static onClickRemove(student){
    if(confirm(i18n.__('pages.StudentsPage.confirmDelete'))){
      remove.call({ id: student._id });
    }
  }

  onHideModal = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { loading, listExists, students } = this.props;

    if (!listExists) {
      return <NotFoundPage />;
    }

    let Students;
    if (!students || !students.length) {
      Students = (
          <Message
              title={i18n.__('pages.StudentsPage.noStudents')}
              subtitle={i18n.__('pages.StudentsPage.addAbove')}
          />
      );
    } else {
      Students = (
        <div>
          <Toolbar>
            <ToolbarGroup firstChild={true} style={{marginLeft: 0, width: '100%'}}>
              <TextField
                  fullWidth={true}
                  name={'searchName'}
                  floatingLabelText={i18n.__('pages.StudentsPage.SearchName')}
                  value = {this.state.value}
                  onChange = {this.handleChange}
              />
              <RaisedButton label={i18n.__('pages.StudentsPage.Search')} onClick={this.onClickSearchButton}/>
            </ToolbarGroup>
          </Toolbar>
          <Table fixedHeader>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn style={{width: 300}}>ФИО</TableHeaderColumn>
                <TableHeaderColumn style={{width: 120}}>Специальность</TableHeaderColumn>
                <TableHeaderColumn style={{width: 120}}>Год выпуска</TableHeaderColumn>
                <TableHeaderColumn>Получаемая профессия</TableHeaderColumn>
                <TableHeaderColumn style={{width: 140}}>Мастер</TableHeaderColumn>
                <TableHeaderColumn style={{width: 240}}/>
                <TableHeaderColumn style={{width: 130}}/>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={true}>
              {students.map((student,index) => (
                <TableRow key={student._id}>
                  <TableRowColumn style={{width: 300}}>{student.name}</TableRowColumn>
                  <TableRowColumn style={{width: 120}}>{student.speciality}</TableRowColumn>
                  <TableRowColumn style={{width: 120}}>{student.year}</TableRowColumn>
                  <TableRowColumn>
                    {student.currentProfession ? student.currentProfession.name : null}
                    </TableRowColumn>
                  <TableRowColumn style={{width: 140}}>
                    {student.currentProfession && student.currentProfession.master ?
                        student.currentProfession.master.profile.name :
                        null
                    }
                    </TableRowColumn>
                  <TableRowColumn style={{width: 240}}>
                    <RaisedButton
                      label={i18n.__('pages.StudentsPage.attachButton')}
                      backgroundColor={teal400}
                      labelColor={fullWhite}
                      style={styles.attach.button}
                      labelStyle={styles.attach.label}
                      onClick={() => this.onEditingChange(student, false)}
                      disabled={!_.isNull(student.currentProfession._id)}
                    />
                  </TableRowColumn>
                  <TableRowColumn style={{overflow: 'visible', width: 130}}>
                    <IconButton
                        tooltip="Изменить"
                        tooltipPosition='top-center'
                        onClick={() => this.onEditingChange(student, true)}
                    >
                      <ContentCreate/>
                    </IconButton>
                    <IconButton
                        tooltip="Удалить"
                        tooltipPosition='top-center'
                        onClick={() => UsersPage.onClickRemove(student)}
                    >
                      <RemoveCircle/>
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
        <div className="page lists-show">
          <div className="content-scrollable list-items">
            {loading
              ? <Message title={i18n.__('pages.StudentsPage.loading')} />
              : Students}
          </div>
          <FloatingActionButton
            backgroundColor={yellow400}
            onClick={() => this.onEditingChange({}, false)}
            style={styles.floatingActionButton}
            iconStyle={{fill: fullBlack}}
          >
            <ContentAdd/>
          </FloatingActionButton>
          {!loading ?
          <StudentDialog
            open={this.state.open}
            onHide={this.onHideModal}
            student={this.state.student}
          /> : null}
          <Snackbar
              open={this.state.openMessage}
              message={this.state.message}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
          />
        </div>
    );
  }
}

UsersPage.propTypes = {
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
  students: React.PropTypes.array,
};

UsersPage.childContextTypes = {
  editing: React.PropTypes.bool,
  professions: React.PropTypes.array,
  controllers: React.PropTypes.array,
  masters: React.PropTypes.array,
  instructors: React.PropTypes.array,
};