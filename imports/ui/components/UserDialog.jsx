import React from "react";
import {_} from 'lodash';
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import Button from '@material-ui/core/Button';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import grey from '@material-ui/core/colors/grey';
const grey50 = grey['50'];
import ImageCameraAlt from '@material-ui/icons/CameraAlt';
import AutoComplete from 'material-ui/AutoComplete';
import Avatar from 'material-ui/Avatar';
import Toggle from 'material-ui/Toggle';
import {AvatarCropper, FileUpload} from './ImageUploader.jsx';
import {RolesCollection} from "../../api/roles/roles";

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
    "position": "relative",
    "width": 60,
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
    "fontSize": 24,
  },
  avatar: {boxShadow: "0 0 1px 6px #e8e8e8"},
  dialogTitle: {
    height: 30,
    margin: "15px 80px"
  }
};

export default class UserDialog extends BaseComponent {
  state = {
    user: {
      username: "",
      profile: {
        name: "",
        status: "inactive"
      },
      createdAt: null,
      avatar: "/default-userAvatar.png",
      roles:[],
    },
    cropperOpen: false,
    img: null,
    verified: true,
    password: null,
    passwordConfirm: null
  };

  constructor(props) {
    super(props);
    this.state = {...this.state,
      user: props.user,
      role: props.user.roles ? props.user.roles[0] : "",
      status: props.user.profile.status,
      name: props.user.profile.name,
    };
    this.getRole = (role) => {
      return _.chain(RolesCollection).find({value: role}).get('text', '').value()
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      user: props.user,
      role: props.user.roles ? props.user.roles[0] : "",
      status: props.user.profile.status,
      name: props.user.profile.name,
    })
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

  changeRole = (chosenRequest)=>{
    let user = this.state.user;
    user.roles = [chosenRequest.value];
    this.setState({
      user: user,
      role: chosenRequest.value
    })
  };

  toggleStatus = (event, isInputChecked) => {
    this.setState({
      status: isInputChecked ? 'active' : 'inactive'
    })
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
      <Button
        color={"default"}
        disableFocusRipple={true}
        onClick={this.props.onHide}
      >Отмена</Button>,
      <Button
        color={"primary"}
        disableFocusRipple={true}
        onClick={this.handleSave}
      >Сохранить</Button>,
    ];

    let {user} = this.state;

    const UserDialogTitle = (<div>
      <div className="avatar-photo"
           style={styles.avatarPhoto}
      >
        <FileUpload
            handleFileChange={this.handleFileChange}
        />
        <div className="avatar-edit" style={styles.avatarOverlay}>
          <ImageCameraAlt
              style={styles.avatarOverlayIcon}
              color={"action"}
          />
        </div>
        <Avatar size={60} src={user.avatar} style={styles.avatar}/>
      </div>
      <div style={styles.dialogTitle}>
        {this.context.editing ? "Изменить пользователя" : "Новый пользователь"}
        <span style={styles.status}>
          <Toggle
              defaultToggled={user.profile.status && user.profile.status === 'active'}
              style={styles.toggle}
              onToggle={this.toggleStatus}
          />
        </span>
      </div>
      {this.state.cropperOpen &&
      <AvatarCropper
          onRequestHide={this.handleRequestHide.bind(this)}
          cropperOpen={this.state.cropperOpen}
          onCrop={this.handleCrop.bind(this)}
          image={this.state.img}
          width={300}
          height={300}
      />
      }
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
            <h2 className="m-t">Общая информация</h2>
            <Row>
              <Col xs={12} md={12}>
                <TextField
                    name="name"
                    fullWidth={true}
                    floatingLabelText="ФИО"
                    value={this.state.name}
                    ref={(e) => {
                      this.name = e
                    }}
                    onChange={this.changeHandler.bind(this, null, 'name')}
                />
                <TextField
                    name="username"
                    fullWidth={true}
                    floatingLabelText="Логин"
                    value={user.username}
                    ref={(e) => {
                      this.username = e
                    }}
                    onChange={this.changeHandler.bind(this, 'user', 'username')}
                />
                <AutoComplete
                  floatingLabelText="Роль"
                  searchText={this.getRole(this.state.role)}
                  filter={AutoComplete.noFilter}
                  openOnFocus={true}
                  fullWidth={true}
                  dataSource={RolesCollection}
                  onUpdateInput={(searchText)=>{this.setState({role: searchText})}}
                  onNewRequest={this.changeRole}
                />
                <TextField
                    name="password"
                    fullWidth={true}
                    floatingLabelText="Пароль"
                    type='password'
                    ref={(e) => {
                      this.password = e
                    }}
                    onChange={this.changeHandler.bind(this, null, 'password')}
                />
                <TextField
                    name="passwordConfirm"
                    fullWidth={true}
                    floatingLabelText="Повтор пароля"
                    type='password'
                    ref={(e) => {
                      this.passwordConfirm = e
                    }}
                    onChange={this.changeHandler.bind(this, null, 'passwordConfirm')}
                />
              </Col>
              <Divider/>
            </Row>
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

UserDialog.defaultProps = {
  user: {
    username: "",
    profile: {
      name: "",
      status: "inactive"
    },
    createdAt: null,
    avatar: "/default-userAvatar.png",
    roles:[]
  },
  password: null,
  passwordConfirm: null
};

UserDialog.contextTypes  = {
  editing: React.PropTypes.bool
};