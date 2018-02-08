import React from "react";
import {_} from 'lodash';
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {grey50, cyan500} from 'material-ui/styles/colors';
import ActionFace from 'material-ui/svg-icons/action/face';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Avatar from 'material-ui/Avatar';
import SuperSelectField from 'material-ui-superselectfield'

import {Row, Col} from 'react-flexbox-grid';

import {insert, update} from '/imports/api/students/methods'
import {displayError} from '../helpers/errors.js';

let DateTimeFormat;

const IntlPolyfill = require('intl');
DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/ru-RU');

const styles = {
  titleStyle: {
    background: grey50
  },
  avatarPhoto: {
    position: "relative",
    width: 60,
    float: "left",
  },
  avatarOverlay: {
    width: 50,
    height: 50,
    top: 5,
    left: 5,
    lineHeight: "60px"
  },
  avatarOverlayIcon: {
    fontSize: 24,
  },
  avatar: {boxShadow: "0 0 1px 6px #e8e8e8"},
  dialogTitle: {
    height: 30,
    margin: "15px 80px"
  }
};

export default class StudentDialog extends BaseComponent {
  baseState = {
    student: {
      name: "",
      speciality: "",
      year: "",
      professions: [],
      currentProfession: {
        _id: null,
        gild: "",
        sector: ""
      }
    },
    verified: true,
  };
  state = this.baseState;

  constructor(props) {
    super(props);
    this.state = {...this.state,
      student: props.student,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      student: props.student
    });
  }

  componentWillUnmount(){
    this.setState(this.baseState);
  }

  changeHandlerVal(key, attr, value) {
    let state = {};
    if (key !== null) {
      state[key] = this.state[key] || {};
      if(typeof value === "object"){
        state[key][attr] = {...state[key][attr], value}
      } else {
        state[key][attr] = value;
      }
    } else {
      state[attr] = value;
    }
    state.lastChange = new Date().now; // ms
    this.setState(state);
  };

  changeHandler = (key, attr, event) => {
    if (attr === 'gild' || attr === 'sector'){
      let state = {...this.state.student};
      state[key] = {...state[key], [attr]:event.currentTarget.value};
      this.setState({
        student: state
      });
    } else {
      this.changeHandlerVal(key, attr, event.currentTarget.value);
    }
  };

  handleSelectionProfession = (values, name) => {
    let state = {...this.state.student};
    state['currentProfession'] = {...state.currentProfession, _id: values.value, name: values.label}
    this.setState({
      student: state
    });
  };

  handleSelectionTutor = (values, name) => {
    let state = {...this.state.student};
    let user = {
      _id: values.value,
      profile: {
        name: values.label
      }
    };
    state['currentProfession'] = {...state.currentProfession, [name]: user};
    this.setState({
      student: state
    });
  };

  handleSave = (e) => {
    e.preventDefault();
    const { professions, _id, ...student } = this.state.student;
    if (this.context.type === "edit" || this.context.type === "attach") {
      update.call({id: _id, student}, displayError);
    } else {
      insert.call({student}, displayError);
    }
    this.setState({
      ...this.baseState
    });
    this.props.onHide()
  };

  onHide = (e) => {
    e.preventDefault();
    this.setState({
        ...this.baseState
    });
    this.props.onHide();
  };

  render() {
    const actions = [
      <FlatButton
          label="Отмена"
          primary={false}
          keyboardFocused={false}
          onClick={this.onHide}
      />,
      <FlatButton
          label="Сохранить"
          primary={true}
          keyboardFocused={false}
          onClick={this.handleSave}
      />,
    ];

    let {student} = this.state;

    const UserDialogTitle = (<div>
      <div className="avatar-photo"
           style={styles.avatarPhoto}
      >
        <Avatar size={60} icon={<ActionFace />} style={styles.avatar}/>
      </div>
      <div style={styles.dialogTitle}>
        {this.context.editing ? "Редактирование студента" : _.isNull(student._id) ? "Новый студент" : "Прикрепление профессии"}
      </div>
    </div>);

    const dataSourceProfessions = this.context.professions.map(({ _id, name }) => (
        <div key={_id} value={_id} label={name}>
          {name}
        </div>
    ));
    const dataSourceControllers = this.context.controllers.map(({ _id, profile }) => (
        <div key={_id} value={_id} label={profile.name}>
          {profile.name}
        </div>
    ));
    const dataSourceMasters = this.context.masters.map(({ _id, profile }) => (
        <div key={_id} value={_id} label={profile.name}>
          {profile.name}
        </div>
    ));
    const dataSourceInstructors = this.context.instructors.map(({ _id, profile }) => (
        <div key={_id} value={_id} label={profile.name}>
          {profile.name}
        </div>
    ));

    const attachmentInfo = (
    <div>
    <h2 className="m-t">Данные о профессии</h2>
    <Row>
      <Col xs={12} md={12}>
        <SuperSelectField
          name="currentProfession"
          floatingLabel={"Получаемая профессия"}
          underlineFocusStyle={{ borderColor: cyan500 }}
          style={{ marginTop: 40, outline: "none" }}
          dropDownIcon={<ArrowDown />}
          showAutocompleteThreshold={'always'}
          hintTextAutocomplete={"Поиск профессии"}
          hintText={""}
          onChange={this.handleSelectionProfession}
          value={student.currentProfession ?
            {
              value: student.currentProfession._id,
              label:student.currentProfession.name
            } : null
        }
        >
          {dataSourceProfessions}
        </SuperSelectField>
        </Col>
        <Col xs={12} md={6}>
          <TextField
            name="gild"
            fullWidth={true}
            floatingLabelText="№ цеха"
            value={student.currentProfession.gild}
            ref={(e) => {
              this.gild = e
            }}
            onChange={this.changeHandler.bind(this, 'currentProfession', 'gild')}
          />
        </Col>
        <Col xs={12} md={6}>
          <TextField
            name="sector"
            fullWidth={true}
            floatingLabelText="Участок"
            value={student.currentProfession.sector}
            ref={(e) => {
              this.sector = e
            }}
            onChange={this.changeHandler.bind(this, 'currentProfession', 'sector')}
          />
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="controller"
            floatingLabel={"Наставник"}
            underlineFocusStyle={{ borderColor: cyan500 }}
            style={{ marginTop: 40, outline: "none" }}
            dropDownIcon={<ArrowDown />}
            showAutocompleteThreshold={'always'}
            hintTextAutocomplete={"Поиск"}
            hintText={""}
            value={student.currentProfession && student.currentProfession.controller ?
              {
                value: student.currentProfession.controller._id,
                label:student.currentProfession.controller.profile.name
              } : null
            }
            onChange={this.handleSelectionTutor}
          >
            {dataSourceControllers}
          </SuperSelectField>
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="master"
            floatingLabel={"Мастер"}
            underlineFocusStyle={{ borderColor: cyan500 }}
            style={{ marginTop: 40, outline: "none" }}
            dropDownIcon={<ArrowDown />}
            showAutocompleteThreshold={'always'}
            hintTextAutocomplete={"Поиск"}
            hintText={""}
            value={student.currentProfession && student.currentProfession.master ?
              {
                value: student.currentProfession.master._id,
                label:student.currentProfession.master.profile.name
              } : null
            }
            onChange={this.handleSelectionTutor}
          >
            {dataSourceMasters}
          </SuperSelectField>
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="instructor"
            floatingLabel={"Инструктор"}
            underlineFocusStyle={{ borderColor: cyan500 }}
            style={{ marginTop: 40, outline: "none" }}
            dropDownIcon={<ArrowDown />}
            showAutocompleteThreshold={'always'}
            hintTextAutocomplete={"Поиск"}
            hintText={""}
            value={student.currentProfession && student.currentProfession.instructor ?
              {
                value: student.currentProfession.instructor._id,
                label:student.currentProfession.instructor.profile.name
              } : null
            }
            onChange={this.handleSelectionTutor}
          >
            {dataSourceInstructors}
          </SuperSelectField>
        </Col>
        <Divider/>
      </Row>
    </div>);

    const generalInfo = (
    <div>
      <h2 className="m-t">Общая информация</h2>
      <Row>
        <Col xs={12} md={12}>
          <TextField
            name="name"
            fullWidth={true}
            floatingLabelText="ФИО"
            value={student.name}
            ref={(e) => {
              this.name = e
            }}
            onChange={this.changeHandler.bind(this, 'student', 'name')}
          />
          <TextField
            name="speciality"
            fullWidth={true}
            floatingLabelText="Специальность"
            value={student.speciality}
            ref={(e) => {
              this.speciality = e
            }}
            onChange={this.changeHandler.bind(this, 'student', 'speciality')}
          />
          <TextField
            name="year"
            fullWidth={true}
            floatingLabelText="Год поступления"
            value={student.year}
            ref={(e) => {
              this.year = e
            }}
            onChange={this.changeHandler.bind(this, 'student', 'year')}
          />
        </Col>
        <Divider/>
      </Row>
    </div>);

    return (
        <div>
          <Dialog
              title={
                UserDialogTitle
              }
              titleStyle={styles.titleStyle}
              actions={actions}
              modal={true}
              open={this.props.open}
              onRequestClose={this.props.onHide}
              autoScrollBodyContent={true}
          >
            {(this.context.type === "create" || this.context.type === "edit") ? generalInfo : null}
            {(this.context.type === "attach") ||
            (this.context.type === "edit" && !_.isNull(student.currentProfession._id)) ? attachmentInfo : null}
          </Dialog>
        </div>
    )
  }
}

/*InternDialog.propTypes = {
    open: React.PropTypes.bool,
    onHide: React.PropTypes.func.isRequired,
    intern:  React.PropTypes.objectOf(React.PropTypes.shape({
        firstname: React.PropTypes.any,
        lastname: React.PropTypes.any,
        middlename: React.PropTypes.any,
        direction: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
        department: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
        group: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    }))
};*/

StudentDialog.defaultProps = {
  student: {
    _id: null,
    name: "",
    speciality: "",
    year: "",
    professions: [],
    currentProfession: {
      _id: null,
      gild: "",
      sector: ""
    }
  },
};

StudentDialog.contextTypes  = {
  editing: React.PropTypes.bool,
  type: React.PropTypes.string,
  professions: React.PropTypes.array,
  controllers: React.PropTypes.array,
  masters: React.PropTypes.array,
  instructors: React.PropTypes.array,
};