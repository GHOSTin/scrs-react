import React from "react";
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import { grey50 } from 'material-ui/styles/colors';
import ImageCameraAlt from 'material-ui/svg-icons/image/camera-alt';
import Avatar from 'material-ui/Avatar';
import {AvatarCropper, FileUpload} from './ImageUploader.jsx';

import {Row, Col} from 'react-flexbox-grid';

import { update } from '/imports/api/users/methods'
import { displayError } from '../helpers/errors.js';

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
        },
        cropperOpen: false,
        img: null,
        verified: true,
        password: null,
        passwordConfirm: null
    };

    constructor(props) {
        super(props);
        this.state = Object.assign(this.state, {
            editing: props.editing,
            user: props.user
        });
        this.handleSave = this.handleSave.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            editing: props.editing,
            user: props.user
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

    changeHandler = function(key, attr, event) {
      if(event.currentTarget.name === 'password' || event.currentTarget.name === 'passwordConfirm') {
        if(this.password.getValue() !== this.passwordConfirm.getValue()){
          this.setState({verified: false});
        } else {
          this.setState({verified: true});
        }
      }
      this.changeHandlerVal(key, attr, event.currentTarget.value);
    };

    changeEmail(e, value){
      e.preventDefault();
      let emails = [{address: value}];
      let user = this.state.user;
      user.emails = emails;
      this.setState({
        user: user
      });
    }

    handleSave(e){
        e.preventDefault();
        const username = this.username.getValue();
        const name = this.name.getValue();
        const password = this.password.getValue();
        const confirm = this.passwordConfirm.getValue();
        const avatar = this.state.user.avatar;
        console.log(this.state.user);
        if(!this.state.verified){
          return false;
        }
        if(this.state.editing){
          const doc = {
            username: username,
            profile: {
              name: name
            },
            password: password === confirm ? password : "",
            avatar: avatar
          };
          update.call({id: this.state.user._id, doc: doc}, displayError)
        } else {
          Accounts.createUser({
            username,
            profile: {
              name: name
            },
            password,
            avatar
          }, (err) => {
            if (err) {
              this.setState({
                errors: { none: err.reason },
              });
            }
          });
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
                  color={"rgba(255,255,255,.8)"}
                />
              </div>
              <Avatar size={60} src={user.avatar} style={styles.avatar}/>
            </div>
            <div style={styles.dialogTitle}>
              {this.state.editing?"Изменить пользователя":"Новый пользователь"}
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
                                name="username"
                                fullWidth={true}
                                floatingLabelText="ФИО"
                                value={user.username}
                                ref = {(e)=>{this.username = e}}
                                onChange={this.changeHandler.bind(this, 'user', 'username')}
                            />
                            <TextField
                                name="login"
                                fullWidth={true}
                                floatingLabelText="Логин"
                                value={user.profile.name}
                                ref = {(e)=>{this.name = e}}
                                onChange={this.changeHandler.bind(this, 'user', 'login')}
                            />
                            <TextField
                                name="password"
                                fullWidth={true}
                                floatingLabelText="Пароль"
                                type='password'
                                ref = {(e)=>{this.password = e}}
                                onChange={this.changeHandler.bind(this, null, 'password')}
                            />
                            <TextField
                              name="passwordConfirm"
                              fullWidth={true}
                              floatingLabelText="Повтор пароля"
                              type='password'
                              ref = {(e)=>{this.passwordConfirm = e}}
                              onChange={this.changeHandler.bind(this, null, 'passwordConfirm')}
                            />
                        </Col>
                        <Divider />
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
  },
  password: null,
  passwordConfirm: null
};