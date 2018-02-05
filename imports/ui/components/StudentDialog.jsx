import React from "react";
import {_} from 'lodash';
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {grey50, teal500} from 'material-ui/styles/colors';
import ActionFace from 'material-ui/svg-icons/action/face';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Avatar from 'material-ui/Avatar';
import SuperSelectField from 'material-ui-superselectfield'

import {Row, Col} from 'react-flexbox-grid';

import {insert, update} from '/imports/api/users/methods'
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
  state = {
    student: {
      name: "",
      speciality: "",
      year: "",
      professions: [],
      currentProfession: {
        _id: null,
        gild: null,
        sector: null
      }
    },
    cropperOpen: false,
    img: null,
    verified: true,
  };

  constructor(props) {
    super(props);
    this.state = {...this.state,
      student: {...this.state.student, ...props.student},
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      student: props.student
    });
  }

  changeHandlerVal(key, attr, value) {
    let state = {};
    if (key !== null) {
      state[key] = this.state[key] || {};
      state[key][attr] = value;
    } else {
      state[attr] = value;
    }
    state.lastChange = new Date().now; // ms
    this.setState(state);
  };

  changeHandler = function (key, attr, event) {
    if (event.currentTarget.name === 'password' || event.currentTarget.name === 'passwordConfirm') {
      if (this.password.getValue() !== this.passwordConfirm.getValue()) {
        this.setState({verified: false});
      } else {
        this.setState({verified: true});
      }
    }
    this.changeHandlerVal(key, attr, event.currentTarget.value);
  };

  handleSave(e) {
    e.preventDefault();
    const username = this.username.getValue();
    const name = this.name.getValue();
    const status = this.state.status;
    const password = this.password.getValue();
    const confirm = this.passwordConfirm.getValue();
    const avatar = this.state.user.avatar?this.state.user.avatar:"/default-userAvatar.png";
    const role = this.state.role;
    const doc = {
      username,
      profile: {
        name,
        status
      },
      password: password === confirm ? password : "",
      avatar,
      role
    };
    if (!this.state.verified) {
      return false;
    }
    if (this.context.editing) {
      update.call({id: this.state.user._id, doc}, displayError);
    } else {
      insert.call({doc}, displayError);
    }
    this.props.onHide()
  };

  handleFileChange(dataURI) {
    this.changeHandlerVal(null, "img", dataURI);
    this.changeHandlerVal(null, "cropperOpen", true);
    this.changeHandlerVal("user", "avatar", this.state.user.avatar);
  };

  handleCrop(dataURI) {
    this.changeHandlerVal(null, "img", null);
    this.changeHandlerVal(null, "cropperOpen", false);
    this.changeHandlerVal("user", "avatar", dataURI);
  };

  handleRequestHide() {
    this.setState({
      cropperOpen: false
    });
  };

  render() {
    const actions = [
      <FlatButton
          label="Отмена"
          primary={false}
          keyboardFocused={false}
          onClick={this.props.onHide}
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
        {this.context.editing ? "Редактирование студента" : _.isEmpty(this.props.student) ? "Новый студент" : "Прикрепление профессии"}
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
          name="profession"
          floatingLabel={"Получаемая профессия"}
          underlineFocusStyle={{ borderColor: teal500 }}
          style={{ marginTop: 40, outline: "none" }}
          dropDownIcon={<ArrowDown />}
          showAutocompleteThreshold={'always'}
          hintTextAutocomplete={"Поиск профессии"}
          hintText={""}
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
            onChange={this.changeHandler.bind(this, 'currentProfession', 'gild', 'student')}
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
            onChange={this.changeHandler.bind(this, 'currentProfession', 'sector', 'student')}
          />
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="controller"
            floatingLabel={"Наставник"}
            underlineFocusStyle={{ borderColor: teal500 }}
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
          >
            {dataSourceControllers}
          </SuperSelectField>
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="master"
            floatingLabel={"Мастер"}
            underlineFocusStyle={{ borderColor: teal500 }}
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
          >
            {dataSourceMasters}
          </SuperSelectField>
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="instructor"
            floatingLabel={"Инструктор"}
            underlineFocusStyle={{ borderColor: teal500 }}
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
            {(this.context.editing) || (!this.context.editing && _.isEmpty(student)) ? generalInfo : null}
            {(this.context.editing && student.currentProfession._id) ||
            (!this.context.editing && !_.isEmpty(student)) ? attachmentInfo : null}
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
    name: "",
    speciality: "",
    year: "",
    professions: [],
    currentProfession: {
      _id: null,
      gild: null,
      sector: null
    }
  },
};

StudentDialog.contextTypes  = {
  editing: React.PropTypes.bool,
  professions: React.PropTypes.array,
  controllers: React.PropTypes.array,
  masters: React.PropTypes.array,
  instructors: React.PropTypes.array,
};